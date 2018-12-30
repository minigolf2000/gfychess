import struct
import time
import PIL.Image # for reading sprite table, can be replaced by inlined bitmap
from array import array
from copy import copy

pieces = []
SQUARE_SIZE = 48
BOARD_SIZE = SQUARE_SIZE * 8

color_offset = {
    'b': 0,
    'w': 6,
}
piece_offset = {
    'B': 0,
    'K': 1,
    'N': 2,
    'P': 3,
    'Q': 4,
    'R': 5,
}
palette = {
    (244, 217, 176): 0,
    (189, 134, 92): 1,
    (0, 0, 0): 2,
    (255, 255, 255): 3,
    (236, 236, 236): 4,
    (128, 128, 128): 5,
    (223, 223, 223): 6,
    (96, 96, 96): 7,
    (177, 177, 177): 8,
    (64, 64, 64): 9,
    (59, 59, 59): 10,
    (213, 190, 154): 11,
    (159, 159, 159): 12,
    (89, 89, 89): 13,
    (32, 32, 32): 14,
    (16, 16, 16): 15,
}

def print_board(board):
    for row in board:
        print('+--+--+--+--+--+--+--+--+')
        r = ''
        for c in row:
            r += '|'
            if c == ' ':
                r += '  '
            else:
                r += c
        r += '|'
        print(r)
    print('+--+--+--+--+--+--+--+--+')

def header(width, height):
    ret = b'GIF89a'
    return ret + struct.pack('<hh', width, height)

def color_table(colors):
    n_colors = len(colors)
    c_bits = (n_colors-1).bit_length()
    black = struct.pack('BBB', 0, 0, 0)
    ret = b''
    for i in range(2**c_bits):
        if i >= n_colors:
            ret += black
        else:
            ret += struct.pack('BBB', *(colors[i]))
    return ret

def global_table(colors):
    flags = 0b11110000
    c_bits = (len(colors)-1).bit_length() - 1
    flags += c_bits
    ret = struct.pack('BBB', flags, 0, 0)
    return ret + color_table(colors)

def image_descriptor(x, y, w, h, colors=None):
    ret = b','
    ret += struct.pack('<hh', x, y)
    ret += struct.pack('<hh', w, h)
    flags = 0
    if colors is not None:
        c_bits = (len(colors)-1).bit_length()
        flags = 0b10100000 + c_bits
    ret += struct.pack('B', flags)
    if colors is not None:
        ret += color_table(colors)
    return ret

def flush(register, data):
    ret = b''

    while register > 0:
        data.append(register & 255)
        register //= 256

    for i in range(0, len(data), 255):
        block_size = 255
        if i + 255 > len(data):
            block_size = len(data) - i
        ret += struct.pack('B', block_size)
        ret += struct.pack('B'*block_size, *(data[i:i+255]))

    data.clear()
    return ret

def start_image(n_colors):
    c_bits = (n_colors-1).bit_length()
    if c_bits == 1:
        c_bits = 2
    return struct.pack('B', c_bits)

def finish_image(n_colors):
    c_bits = (n_colors-1).bit_length()
    if c_bits == 1:
        c_bits = 2
    clear_code = 2**c_bits
    eoi = clear_code + 1
    return flush(eoi, []) + struct.pack('B', 0)

def lzw(sequence, n_colors):
    c_bits = (n_colors-1).bit_length()
    if c_bits == 1:
        c_bits = 2

    mult = 1
    register = 0
    code_bits = c_bits + 1
    clear_code = 2**c_bits
    code_idx = clear_code + 2
    code_words = array('H', [0]) * 128000
    data = []
    prefix = -clear_code
    idx = 0
    bit_count = 0
    max_code = 2**12

    while True:
        while idx < len(sequence) and (prefix < 0 or code_words[prefix + sequence[idx]] > 0):
            prev_key = prefix + sequence[idx]
            if prefix < 0:
                prefix = sequence[idx] * clear_code
            else:
                prefix = code_words[prev_key] * clear_code
            idx += 1

        if prev_key < 0:
            val = sequence[idx-1]
        else:
            val = code_words[prev_key]

        if val > 6000:
            print(val)
        register += val*mult
        bit_count += code_bits
        mult *= (2**code_bits)
        while register > 255:
            data.append(register & 255)
            register //= 256
            mult //= 256

        if idx < len(sequence):
            next_val = sequence[idx]
            if code_idx < max_code:
                code_words[prefix + next_val] = code_idx

        if code_idx >= 2**code_bits and code_bits < 12:
            code_bits += 1
        code_idx += 1

        if idx >= len(sequence):
            while True:
                register += clear_code*mult
                bit_count += code_bits
                mult *= (2**code_bits)
                code_bits = c_bits + 1
                if bit_count % 8 == 0:
                    break
            break

        prev_key = -1
        prefix = next_val * clear_code
        idx += 1

    return flush(register, data)

def gce(delay_time):
    return struct.pack('<BBBBhBB', 0x21, 0xF9, 4, 4, delay_time, 0, 0)

def trailer():
    return struct.pack('B', 0x3B)

def parse_moves(move_str):
    raw_moves = move_str.split('.')[1:]
    moves = []
    for move in raw_moves:
        tokens = move.strip().split(' ')
        extracted = 0
        for token in tokens:
            if token != '':
                moves.append(token)
                extracted += 1
                if extracted == 2:
                    break
    return moves

rows = [
        ([0]*SQUARE_SIZE + [1]*SQUARE_SIZE)*4*SQUARE_SIZE,
        ([1]*SQUARE_SIZE + [0]*SQUARE_SIZE)*4*SQUARE_SIZE,
        ]

files = {
        'a': 0,
        'b': 1,
        'c': 2,
        'd': 3,
        'e': 4,
        'f': 5,
        'g': 6,
        'h': 7,
        }

def draw_square(sequence, i, j, piece):
    global piece_offset, color_offset, pieces, rows

    bg = (i + j) % 2
    x_off = bg * SQUARE_SIZE

    if piece == ' ':
        for y in range(SQUARE_SIZE):
            seq_y = (i*SQUARE_SIZE + y)*BOARD_SIZE
            for x in range(SQUARE_SIZE):
                sequence[seq_y + x + j*SQUARE_SIZE] = bg
        return

    c = piece[0]
    pt = piece[1]
    y_off = (color_offset[c] + piece_offset[pt]) * SQUARE_SIZE
    for y in range(SQUARE_SIZE):
        src_y = y_off + y
        seq_y = (i*SQUARE_SIZE + y)*BOARD_SIZE
        for x in range(SQUARE_SIZE):
            src_x = x_off + x
            sequence[seq_y + x + j*SQUARE_SIZE] = pieces[src_x, src_y][0]

def draw_board(board):
    global rows

    board_raster = array('B', rows[0] + rows[1]) * 4
    for i, row in enumerate(board):
        for j, piece in enumerate(row):
            if piece == ' ':
                continue
            draw_square(board_raster, i, j, piece)

    return board_raster

def draw_region(board, min_y, max_y, min_x, max_x):
    min_y *= SQUARE_SIZE
    max_y *= SQUARE_SIZE
    min_x *= SQUARE_SIZE
    max_x *= SQUARE_SIZE

    space = (max_y - min_y) * (max_x - min_x)
    sequence = array('B', [0]) * space
    idx = 0
    for y in range(min_y, max_y):
        for x in range(min_x, max_x):
            sequence[idx] = board[y*BOARD_SIZE + x]
            idx += 1
    return sequence

def apply_move(moves, idx, board):
    side = 'w'
    offset = 1
    if idx % 2 == 1:
        side = 'b'
        offset = -1

    move = moves[idx]
    move = ''.join([x for x in move if x not in ('+', 'x', '?', '#')])

    target = None
    piece = None
    rank_constraint = None
    file_constraint = None
    candidates = []
    if len(move) == 2:
        f = files[move[0]]
        r = int(move[1])
        target = [8-r, f]
        candidates = [[8-r+offset, f], [8-r+offset*2, f]]
        piece = side + 'P'
    elif move == 'O-O':
        r = 0
        if side == 'w':
            r = 7
        king = side + 'K'
        rook = side + 'R'
        board[r][7] = ' '
        board[r][4] = ' '
        board[r][6] = king
        board[r][5] = rook
        return [[r, x] for x in range(4,8)]
    elif move == 'O-O-O':
        r = 0
        if side == 'w':
            r = 7
        king = side + 'K'
        rook = side + 'R'
        board[r][0] = ' '
        board[r][4] = ' '
        board[r][2] = king
        board[r][3] = rook
        return [[r, 0], [r, 2], [r, 3], [r, 4]]
    elif len(move) == 4 and move[2] == '=': # promotion
        piece = side + move[3]
        target = [8-int(move[1]), files[move[0]]]
        board[target[0]][target[1]] = piece
        return [target]
    elif len(move) == 3 or len(move) == 4:
        piece = move[0]
        if piece < 'A': # this is probably something like a result tag
            return []
        if len(move) == 4:
            if move[1] < '9':
                rank_constraint = int(move[1])
            else:
                file_constraint = files[move[1]]
            move = move[1:]

        f = files[move[1]]
        r = int(move[2])
        target = [8-r, f]
        directions = []
        if piece == 'N':
            candidates = [
                [8-r-2, f-1],
                [8-r-2, f+1],
                [8-r-1, f-2],
                [8-r-1, f+2],
                [8-r+1, f-2],
                [8-r+1, f+2],
                [8-r+2, f-1],
                [8-r+2, f+1],
            ]
        elif piece == 'Q':
            directions = [(-1, -1), (-1, 0), (-1, 1), (0, -1), (0, 1), (1, -1), (1, 0), (1, 1)]
        elif piece == 'R':
            directions = [(-1, 0), (0, -1), (0, 1), (1, 0)]
        elif piece == 'K':
            candidates = [
                [8-r-1, f-1],
                [8-r-1, f],
                [8-r-1, f+1],
                [8-r, f-1],
                [8-r, f+1],
                [8-r+1, f-1],
                [8-r+1, f],
                [8-r+1, f+1],
            ]
        elif piece == 'B':
            directions = [(-1, -1), (-1, 1), (1, -1), (1, 1)]
        else:
            candidates = [[8-r+offset, files[piece]]]
            piece = 'P'

        piece = side + piece

        for d in directions:
            for x in range(1, 8):
                dr = x*d[0]
                df = x*d[1]
                if 8-r+dr > 7 or 8-r+dr < 0 or f+df > 7 or f+df < 0:
                    break
                if board[8-r+dr][f+df] == piece:
                    candidates.append([8-r+dr, f+df])
                    break
                if board[8-r+dr][f+df] != ' ':
                    break
    elif len(move) == 5:
        piece = side + move[0]
        target = [8-int(move[4]), files[move[3]]]
        candidates = [[8-int(move[2]), files[move[1]]]]
    else:
        return []

    # print_board(board)
    for y, x in candidates:
        if y < 8 and y >= 0 and x < 8 and x >= 0 and board[y][x] == piece:
            if rank_constraint is not None and rank_constraint != y:
                continue
            if file_constraint is not None and file_constraint != x:
                continue

            board[target[0]][target[1]] = piece
            board[y][x] = ' '
            return [[y, x], target]

def create_gif(moves):
    global palette, pieces

    moves = parse_moves(moves)
    move_idx = 0
    draw_time = 0
    compress_time = 0

    colors = [None] * len(palette)
    for color, i in palette.items():
        colors[i] = color

    board = [
        ['bR', 'bN', 'bB', 'bQ', 'bK', 'bB', 'bN', 'bR'],
        ['bP'] * 8,
        [' '] * 8,
        [' '] * 8,
        [' '] * 8,
        [' '] * 8,
        ['wP'] * 8,
        ['wR', 'wN', 'wB', 'wQ', 'wK', 'wB', 'wN', 'wR'],
    ]

    start = time.time()
    board_raster = draw_board(board)
    end = time.time()
    draw_time += (end - start)
    region_cache = {}

    gif = header(BOARD_SIZE, BOARD_SIZE)
    gif += global_table(colors)
    min_y, max_y, min_x, max_x = 0, 8, 0, 8

    while True:
        if min_x != 8: # this check is to weed out invalid moves, which will leave min_x unaltered
            gif += gce(100 if move_idx < len(moves) else 200)
            gif += image_descriptor(min_x*SQUARE_SIZE, min_y*SQUARE_SIZE, (max_x-min_x)*SQUARE_SIZE, (max_y-min_y)*SQUARE_SIZE)
            gif += start_image(16)

            start = time.time()
            for i in range(min_y, max_y):
                key = ''.join(board[i][min_x:max_x]) + str((i + min_x)%2)
                if key not in region_cache:
                    sequence = draw_region(board_raster, i, i+1, min_x, max_x)
                    region_cache[key] = lzw(sequence, 16)
                gif += region_cache[key]
            end = time.time()
            compress_time += (end - start)
            gif += finish_image(16)

        if move_idx >= len(moves):
            break

        start = time.time()
        min_y, max_y, min_x, max_x = 8, 0, 8, 0
        for y, x in apply_move(moves, move_idx, board):
            draw_square(board_raster, y, x, board[y][x])
            if y+1 > max_y:
                max_y = y+1
            if y < min_y:
                min_y = y
            if x+1 > max_x:
                max_x = x+1
            if x < min_x:
                min_x = x
        end = time.time()
        draw_time += (end - start)

        move_idx += 1

    gif += trailer()

    print("Compress time: {}".format(compress_time))
    print("Draw time: {}".format(draw_time))

    with open('test2.gif', 'wb') as f:
        f.write(gif)

def clean_moves(moves):
    moves = moves.replace("\n", ' ')
    ret = ''
    in_comment = False
    in_tag = False
    for c in moves:
        if c == '{':
            in_comment = True
        elif c == '[':
            in_tag = True
        if not in_comment and not in_tag:
            ret += c
        if c == '}':
            in_comment = False
        elif c == ']':
            in_tag = False
    return ret

if __name__ == '__main__':
    image = PIL.Image.open('piece_set.png')
    pieces = image.load()

    for x in range(image.width):
        for y in range(image.height):
            p = palette[pieces[x, y][:3]]
            pieces[x, y] = (p, p, p, 255)

    # moves = "1.e4 e5 2.Bc4 Nc6 3.Qh5 Nf6?? 4.Qxf7#"

    moves = """1. e4 e5 2. Nf3 Nc6 3. Bb5 a6 {This opening is called the Ruy Lopez}
    4. Ba4 Nf6 5. O-O Be7 6. Re1 b5 7. Bb3 d6 8. c3 O-O 9. h3 Nb8 10. d4 Nbd7
    11. c4 c6 12. cxb5 axb5 13. Nc3 Bb7 14. Bg5 b4 15. Nb1 h6 16. Bh4 c5 17. dxe5
    Nxe4 18. Bxe7 Qxe7 19. exd6 Qf6 20. Nbd2 Nxd6 21. Nc4 Nxc4 22. Bxc4 Nb6
    23. Ne5 Rae8 24. Bxf7+ Rxf7 25. Nxf7 Rxe1+ 26. Qxe1 Kxf7 27. Qe3 Qg5 28. Qxg5
    hxg5 29. b3 Ke6 30. a3 Kd6 31. axb4 cxb4 32. Ra5 Nd5 33. f3 Bc8 34. Kf2 Bf5
    35. Ra7 g6 36. Ra6+ Kc5 37. Ke1 Nf4 38. g3 Nxh3 39. Kd2 Kb5 40. Rd6 Kc5 41. Ra6
    Nf2 42. g4 Bd3 43. Re6 1/2-1/2"""
    # moves = "1.e4 {[%clk 0:02:59]} e5 {[%clk 0:02:59]} 2.Nf3 {[%clk 0:02:58]} Nc6 {[%clk 0:02:59]} 3.Bb5 {[%clk 0:02:58]} Nf6 {[%clk 0:02:59]} 4.d3 {[%clk 0:02:57]} Bc5 {[%clk 0:02:57]} 5.c3 {[%clk 0:02:57]} O-O {[%clk 0:02:56]} 6.O-O {[%clk 0:02:56]} Re8 {[%clk 0:02:56]} 7.h3 {[%clk 0:02:54]} a6 {[%clk 0:02:55]} 8.Ba4 {[%clk 0:02:53]} d5 {[%clk 0:02:54]} 9.Nbd2 {[%clk 0:02:51]} h6 {[%clk 0:02:53]} 10.Re1 {[%clk 0:02:50]} b5 {[%clk 0:02:51]} 11.Bb3 {[%clk 0:02:48]} d4 {[%clk 0:02:51]} 12.Nf1 {[%clk 0:02:43]} Be6 {[%clk 0:02:49]} 13.Ng3 {[%clk 0:02:38]} Bxb3 {[%clk 0:02:43]} 14.axb3 {[%clk 0:02:38]} Qd7 {[%clk 0:02:40]} 15.b4 {[%clk 0:02:24]} Bf8 {[%clk 0:02:37]} 16.Qe2 {[%clk 0:02:22]} dxc3 {[%clk 0:02:22]} 17.bxc3 {[%clk 0:02:20]} a5 {[%clk 0:02:20]} 18.bxa5 {[%clk 0:02:16]} Nxa5 {[%clk 0:02:20]} 19.Be3 {[%clk 0:02:11]} c5 {[%clk 0:02:17]} 20.Red1 {[%clk 0:02:06]} Qc6 {[%clk 0:02:08]} 21.Qc2 {[%clk 0:01:45]} b4 {[%clk 0:02:02]} 22.Nxe5 {[%clk 0:01:30]} b3 {[%clk 0:01:53]} 23.Qxb3 {[%clk 0:01:03]} Nxb3 {[%clk 0:01:49]}  0-1"
    moves = clean_moves(moves)
    create_gif(moves)
