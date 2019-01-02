function cleanMoves(moves: string): string {
  moves = moves.replace(new RegExp("\n", 'g'), " ");
  let ret = '';
  let inComment = false;
  let inTag = false;

  for (const c of moves) {
    if (!inTag && c === '{') inComment = true;
    if (!inComment && c === '[') inTag = true;

    if (!inComment && !inTag) ret += c;
    if (c === '}') inComment = false;
    if (c === ']') inTag = false;
  }

  return ret;
}

export function parseMoves(moveStr: string): string[] {
  const rawMoves = cleanMoves(moveStr).split('.');
  rawMoves.shift();
  const moves: string[] = [];

  for (const move of rawMoves) {
    const tokens = move.trim().split(' ');
    let extracted = 0;
    for (const token of tokens) {
      if (token != '') {
        moves.push(token);
        extracted++;
        if (extracted === 2) break;
      }
    }
  }

  return moves;
}
