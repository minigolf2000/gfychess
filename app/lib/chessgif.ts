import fetch from 'node-fetch';
// import * as fs from 'fs';
import { parseMoves } from './parse_moves';

const SQUARE_SIZE = 80;
const BOARD_SIZE = SQUARE_SIZE * 8;
const COLOR_OFFSET: {[side: string]: number} = {
  b: 0,
  w: 6,
}
const PIECE_OFFSET: {[piece: string]: number} = {
  B: 0,
  K: 1,
  N: 2,
  P: 3,
  Q: 4,
  R: 5,
}
let PALETTE = new Uint8Array(1);
const FILES: {[file: string]: number} = {
  a: 0,
  b: 1,
  c: 2,
  d: 3,
  e: 4,
  f: 5,
  g: 6,
  h: 7,
}
const ROWS = [new Uint8Array(BOARD_SIZE * SQUARE_SIZE), new Uint8Array(BOARD_SIZE * SQUARE_SIZE)];
let NUM_COLORS = 0;
let COLOR_BITS = 0;

const PIECE_URL = "public/piece_set.dat";
let PIECE_DATA: Uint8Array = null;

function malloc(buffer: ResizableBuffer, toAdd: number) {
  if (buffer.idx + toAdd > buffer.data.length) {
    const newBuffer = new Uint8Array(buffer.data.length * 2);
    newBuffer.set(buffer.data);
    buffer.data = newBuffer;
  }
}

interface ResizableBuffer {
  data: Uint8Array;
  idx: number;
}

export class ChessGif {
  gif: ResizableBuffer;
  moves: string[];
  moveIdx: number;
  board: string[][];
  initPromise: Promise<void>;
  boardRaster: Uint8Array;
  dirtySquares: Set<number[]>;
  dirtyBoard: boolean;
  boardCache: {[key: string]: Uint8Array};
  sequence: Uint8Array;

  constructor() {
    this.gif = {
      data: new Uint8Array(1024),
      idx: 0,
    };
    this.moves = [];
    this.moveIdx = 0;
    this.boardRaster = new Uint8Array(BOARD_SIZE * BOARD_SIZE);
    this.sequence = new Uint8Array(BOARD_SIZE * SQUARE_SIZE);
    this.boardCache = {};
    this.initPromise = this.init();
  }

  public reset() {
    this.gif.idx = 0;
    this.moveIdx = 0;
    this.dirtyBoard = true;
    this.dirtySquares = new Set();
    this.board = [
      ['bR', 'bN', 'bB', 'bQ', 'bK', 'bB', 'bN', 'bR'],
      ['bP', 'bP', 'bP', 'bP', 'bP', 'bP', 'bP', 'bP'],
      [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
      [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
      [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
      [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
      ['wP', 'wP', 'wP', 'wP', 'wP', 'wP', 'wP', 'wP'],
      ['wR', 'wN', 'wB', 'wQ', 'wK', 'wB', 'wN', 'wR'],
    ];
  }

  asArrayGif(): Uint8Array {
    return this.gif.data.subarray(0, this.gif.idx);
  }

  async init() {
    const ones = new Uint8Array(SQUARE_SIZE);
    for (let i=0; i<SQUARE_SIZE; i++) ones[i] = 1;
    for (let i=0; i<8*SQUARE_SIZE; i++) ROWS[1 - (i&1)].set(ones, i*SQUARE_SIZE);

    let body: ArrayBuffer = null;
    try {
      const resp = await window.fetch(PIECE_URL);
      body = await resp.arrayBuffer();
    } catch {
      const resp = await fetch(PIECE_URL);
      body = await resp.arrayBuffer();
    }

    PIECE_DATA = new Uint8Array(body);
    const paletteSize = PIECE_DATA[0];
    PALETTE = PIECE_DATA.subarray(1, paletteSize * 3 + 1);
    PIECE_DATA = PIECE_DATA.subarray(paletteSize * 3 + 1);
    NUM_COLORS = PALETTE.length > 16 ? 256 :
      PALETTE.length > 4 ? 16 :
      PALETTE.length > 2 ? 4 : 2;
    COLOR_BITS = Math.log2(NUM_COLORS);
  }

  public loadMoves(moves: string[]) {
    this.moves = moves;
    this.reset();
  }

  public async createGif(start: number, end: number): Promise<Uint8Array> {
    if (start == 0) {
      await this.render();
    }

    while (this.moveIdx < this.moves.length && this.moveIdx <= end) {
      this.step();
      if (this.moveIdx > start) {
        await this.render();
      }
    }

    return this.asArrayGif();
  }

  public asBase64Gif(): string {
    try {
      return "data:image/gif;base64, " + Buffer.from(this.gif.data.subarray(0, this.gif.idx)).toString('base64');
    } catch {
      return window.URL.createObjectURL(new Blob([this.asArrayGif()], {type: 'image/gif'}));
    }
  }

  public async render() {
    await this.initPromise;

    let yMin = 8;
    let yMax = 0;
    let xMin = 8;
    let xMax = 0;

    if (this.gif.idx === 0) {
      // if gif.idx is 0 we haven't started a gif yet, do that
      this.header(BOARD_SIZE, BOARD_SIZE);
      this.globalColorTable();
    }
    if (this.dirtyBoard) {
      this.drawBoard();
      yMin = 0;
      yMax = 8;
      xMin = 0;
      xMax = 8;
    } else {
      for (const affected of this.dirtySquares) {
        const y = affected[0];
        const x = affected[1];
        this.drawSquare(y, x);

        if (y+1 > yMax) yMax = y+1;
        if (y < yMin) yMin = y;
        if (x+1 > xMax) xMax = x+1;
        if (x < xMin) xMin = x;
      }
      this.dirtySquares.clear();
    }

    if (xMin === 8) return;

    const width = (xMax - xMin) * SQUARE_SIZE;
    const height = (yMax - yMin) * SQUARE_SIZE;
    const delay = this.moveIdx === this.moves.length ? 200 : 100;
    this.startImage(xMin * SQUARE_SIZE, yMin * SQUARE_SIZE, width, height, delay);

    for (let i=yMin; i<yMax; i++) {
      const skew = (i + xMin) & 1;
      const key = this.board[i].slice(xMin, xMax).join('') + skew.toString();
      if (this.boardCache[key] === undefined) {
        const region = this.drawRegion(i, xMin, xMax);
        this.boardCache[key] = this.lzw(region);
      } else {
        malloc(this.gif, this.boardCache[key].length);
        this.gif.data.set(this.boardCache[key], this.gif.idx);
        this.gif.idx += this.boardCache[key].length;
      }
    }

    this.finishImage();
  }

  public step() {
    if (this.moveIdx >= this.moves.length) return;

    let side = 'w';
    let offset = 1;
    if ((this.moveIdx & 1) === 1) {
      side = 'b';
      offset = -1;
    }

    let move = this.moves[this.moveIdx];
    this.moveIdx++;

    move = move.replace(new RegExp(/[#!\?\+x]/, 'g'), '');
    let target: number[] = null;
    let piece: string = null;
    let rankConstraint: number = null;
    let fileConstraint: number = null;
    let candidates: number[][] = [];

    if (move.length === 2) {
      target = [8 - parseInt(move[1]), FILES[move[0]]];
      candidates = [[target[0] + offset, target[1]], [target[0] + offset*2, target[1]]];
      piece = side + 'P';
    } else if (move === 'O-O' || move === 'O-O-O' || move === '0-0' || move === '0-0-0') {
      const files = {
        'O-O': [7, 4, 6, 5],
        'O-O-O': [0, 4, 2, 3],
        '0-0': [7, 4, 6, 5],
        '0-0-0': [0, 4, 2, 3],
      }[move];
      let rank = 0;
      if (side === 'w') rank = 7;
      const king = side + 'K';
      const rook = side + 'R';
      this.board[rank][files[0]] = ' ';
      this.board[rank][files[1]] = ' ';
      this.board[rank][files[2]] = king;
      this.board[rank][files[3]] = rook;
      for (const file of files) this.dirtySquares.add([rank, file]);
    } else if (move.length === 4 && move[2] === '=') {
      // pawn promotion
      piece = side + move[3];
      target = [8 - parseInt(move[1]), FILES[move[0]]];
      this.board[target[0]][target[1]] = piece;
      this.dirtySquares.add(target);
    } else if (move.length === 3 || move.length === 4) {
      piece = move[0];
      if (piece < 'A') return; // things like results
      if (move.length === 4) {
        if (move[1] < '9') rankConstraint = parseInt(move[1]);
        else fileConstraint = FILES[move[1]];
        move = move.substring(1);
      }

      const r = 8 - parseInt(move[2]);
      const f = FILES[move[1]];
      target = [r, f];
      let directions: number[][] = [];
      if (piece === 'N') {
        candidates = [[r-2, f-1],[r-2,f+1],[r-1,f-2],[r-1,f+2],[r+1,f-2],[r+1,f+2],[r+2,f-1],[r+2,f+1]];
      } else if (piece === 'Q') {
        directions = [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]];
      } else if (piece === 'R') {
        directions = [[-1, 0],[0,-1],[0,1],[1,0]];
      } else if (piece === 'B') {
        directions = [[-1,-1],[-1,1],[1,-1],[1,1]];
      } else if (piece === 'K') {
        candidates = [[r-1,f-1],[r-1,f],[r-1,f+1],[r,f-1],[r,f+1],[r+1,f-1],[r+1,f],[r+1,f+1]];
      } else { // this is a pawn so the ${piece} variable actually refers to a file
        candidates = [[r+offset,FILES[piece]]];
        piece = 'P';
      }

      piece = side + piece; // hehe side piece
      for (const d of directions) {
        for (let i=1; i<8; i++) {
          const r2 = r + i*d[0];
          const f2 = f + i*d[1];
          if (r2 > 7 || r2 < 0 || f2 > 7 || f2 < 0) break;
          if (this.board[r2][f2] === piece) {
            candidates.push([r2, f2]);
            break;
          }
          if (this.board[r2][f2] != ' ') break;
        }
      }
    } else if (move.length === 5) {
      piece = side + move[0];
      target = [8 - parseInt(move[4]), FILES[move[3]]];
      candidates = [[8 - parseInt(move[2]), FILES[move[1]]]];
    } else return; // unknown move

    for (const c of candidates) {
      const y = c[0];
      const x = c[1];

      if (y < 8 && y >= 0 && x < 8 && x >= 0 && this.board[y][x] === piece) {
        if (rankConstraint != null && rankConstraint != y) continue;
        if (fileConstraint != null && fileConstraint != x) continue;

        this.board[target[0]][target[1]] = piece;
        this.board[y][x] = ' ';
        this.dirtySquares.add([y, x]);
        this.dirtySquares.add(target);
      }
    }
  }

  header(width: number, height: number) {
    malloc(this.gif, 10);

    this.gif.data.set([71, 73, 70, 56, 57, 97, // GIF89a
      width & 255, width >> 8,
      height & 255, height >> 8,
    ], this.gif.idx);
    this.gif.idx += 10;
  }

  globalColorTable() {
    const tableSize = NUM_COLORS*3 + 3;
    malloc(this.gif, tableSize);

    const table = this.gif.data;
    const baseIdx = this.gif.idx;
    table[baseIdx] = 240 + COLOR_BITS - 1;
    table.set(PALETTE, baseIdx + 3);
    this.gif.idx += tableSize;
  }

  startImage(x: number, y: number, w: number, h: number, delay: number) {
    malloc(this.gif, 19);
    const colorBits = COLOR_BITS === 1 ? 2 : COLOR_BITS;

    this.gif.data.set([0x21, 0xf9, 4, 4, delay & 255, delay >> 8, 0, 0, // graphics control extention
      44, // "," -> start of image descriptor
      x & 255, x >> 8,
      y & 255, y >> 8,
      w & 255, w >> 8,
      h & 255, h >> 8,
      0, colorBits,
    ], this.gif.idx);
    this.gif.idx += 19;
  }

  lzw(sequence: Uint8Array): Uint8Array {
    const colorBits = COLOR_BITS === 1 ? 2 : COLOR_BITS;
    const clearCode = 1 << colorBits;
    const maxCode = 1 << 12;
    const codeWords: {[key: number]: number} = {};
    const originalIdx = this.gif.idx;

    let bitCount = 0;
    let register = 0;
    let mult = 1;
    let idx = 0;
    let codeBits = colorBits + 1;
    let codeIdx = clearCode + 2;
    let prefix = -clearCode;

    malloc(this.gif, 256);
    let written = 1;
    let data = this.gif.data.subarray(this.gif.idx);

    const flush = (threshold: number) => {
      while (register > threshold) {
        data[written] = register & 255;
        written++;

        if (written === 256) {
          data[0] = 255;
          this.gif.idx += 256;
          written = 1;
          malloc(this.gif, 256);
          data = this.gif.data.subarray(this.gif.idx);
        }

        register >>= 8;
        mult >>= 8;
      }
    };

    while (true) {
      let prevKey = -1;
      while (idx < sequence.length && (prefix < 0 || codeWords[prefix + sequence[idx]] !== undefined)) {
        prevKey = prefix + sequence[idx];
        if (prefix < 0) prefix = sequence[idx] * clearCode;
        else prefix = codeWords[prevKey] * clearCode;
        idx++;
      }

      let val = sequence[idx-1];
      if (prevKey >= 0) val = codeWords[prevKey];

      const codeLen = (1<<codeBits);
      register += val * mult;
      bitCount += codeBits;
      mult *= codeLen;
      while (mult > 255) {
        data[written] = register & 255;
        written++;

        if (written === 256) {
          data[0] = 255;
          this.gif.idx += 256;
          written = 1;
          malloc(this.gif, 256);
          data = this.gif.data.subarray(this.gif.idx);
        }

        register >>= 8;
        mult >>= 8;
      }

      const nextVal = sequence[idx];
      if (codeIdx < maxCode) codeWords[prefix + nextVal] = codeIdx;
      if (codeIdx >= codeLen && codeBits < 12) codeBits++;
      codeIdx++;

      if (idx >= sequence.length) {
        while (true) {
          register += clearCode * mult;
          bitCount += codeBits;
          mult <<= codeBits;
          flush(255);
          codeBits = colorBits + 1;
          if (bitCount % 8 === 0) break;
        }
        break;
      }

      prefix = nextVal * clearCode;
      idx++;
    }

    flush(0);

    if (written > 1) {
      data[0] = written - 1;
      this.gif.idx += written;
    }

    return this.gif.data.slice(originalIdx, this.gif.idx);
  }

  finishImage() {
    const colorBits = COLOR_BITS === 1 ? 2 : COLOR_BITS;
    const clearCode = 1 << colorBits;
    const eoi = clearCode + 1;

    malloc(this.gif, 3);
    this.gif.data.set([1, eoi, 0], this.gif.idx);
    this.gif.idx += 3;
  }

  trailer() {
    malloc(this.gif, 1);
    this.gif.data[this.gif.idx] = 0x3b;
    this.gif.idx++;
  }

  drawSquare(y: number, x: number) {
    const piece = this.board[y][x];
    const bg = (y + x) % 2;
    const xOff = bg * SQUARE_SIZE;

    if (piece === ' ') {
      for (let i=0; i<SQUARE_SIZE; i++) {
        const boardY = (y*SQUARE_SIZE + i) * BOARD_SIZE;
        for (let j=0; j<SQUARE_SIZE; j++) {
          this.boardRaster[boardY + j + x*SQUARE_SIZE] = bg;
        }
      }
    } else {
      const color = piece[0];
      const pType = piece[1];

      const yOff = (COLOR_OFFSET[color] + PIECE_OFFSET[pType]) * SQUARE_SIZE;
      for (let i=0; i<SQUARE_SIZE; i++) {
        const srcY = (yOff + i) * SQUARE_SIZE * 4;
        const boardY = (y*SQUARE_SIZE + i) * BOARD_SIZE;
        for (let j=0; j<SQUARE_SIZE; j++) {
          this.boardRaster[boardY + j + x*SQUARE_SIZE] = PIECE_DATA[srcY + xOff + j];
        }
      }
    }
  }

  drawRegion(y: number, xMin: number, xMax: number): Uint8Array {
    y *= SQUARE_SIZE;
    xMin *= SQUARE_SIZE;
    xMax *= SQUARE_SIZE;

    const space = SQUARE_SIZE * (xMax - xMin);
    let idx = 0;
    for (let i=y; i<y+SQUARE_SIZE; i++) {
      for (let j=xMin; j<xMax; j++) {
        this.sequence[idx] = this.boardRaster[i*BOARD_SIZE + j];
        idx++;
      }
    }

    return this.sequence.subarray(0, space);
  }

  drawBoard() {
    for (let i=0; i<8; i++) {
      this.boardRaster.set(ROWS[i&1], i * BOARD_SIZE * SQUARE_SIZE);
      for (let j=0; j<8; j++) {
        this.drawSquare(i, j);
      }
    }
    this.dirtyBoard = false;
  }
}
