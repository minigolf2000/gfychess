import { useState, useEffect } from "react";
import * as React from "react";

interface Props {
  fullPgn: string;
  setSelectedPgn(selectedPgn: string): void;
}

export function PGNSelector(props: Props) {
  let { fullPgn, setSelectedPgn } = props;

  const parsedMoves = parseMoves(fullPgn);

  const [startIndex, setStartIndex] = useState(0);
  const [endIndex, setEndIndex] = useState(parsedMoves.length - 1);

  const className = (i: number) => {
    let className = [];
    if (i == startIndex) {
      className.push("start");
    }
    if (i == endIndex) {
      className.push("end");
    }
    if (startIndex <= i && i <= endIndex) {
      className.push("between");
    }
    return className.join(" ");
  }

  const onClick = (i: number) => {
    if (i >= startIndex) {
      setEndIndex(i);
    } else {
      setStartIndex(i);
    }
  }

  return (
    <div id="pgn-selector">
    <h3>Moves to include</h3>
      <ol>
        {columns(fullPgn).map((column: string[], rowNum: number) => (
          <li key={rowNum}>
            <span className="index">{rowNum + 1}</span>
            {move({san: column[0], className: className(rowNum * 2), onClick, i: rowNum * 2})}
            {move({san: column[1], className: className(rowNum * 2 + 1), onClick, i: rowNum * 2 + 1})}
          </li>
        ))}
      </ol>
      {endIndex - startIndex} out of {parsedMoves.length} moves
    </div>
  );
}

interface MoveProps {
  san: string; // e.g. "e4", "kd6", "0-0"
  className: string;
  onClick: (i: number) => void;
  i: number;
}

function move(props: MoveProps) {
  return (
    <span
      onClick={() => props.onClick(props.i)}
      className={"move " + props.className}>
        <span className="flex">{props.san}</span>
    </span>
  );
}

const parseMoves = (pgn: string) => {
  const rawMoves = pgn.split(".").slice(1)

  let moves: String[] = []
  rawMoves.forEach((move: string) => {
    let tokens = move.trim().split(' ');
    let numExtracted = 0;
    tokens.forEach((token: string) => {
      if (token != "" && numExtracted < 2) {
        moves.push(token);
        numExtracted += 1;
      }
    });
  });

  return moves;
}

const columns = (pgn: string) => {
  const rawMoves = pgn.split(".").slice(1)

  let columns: String[][] = []
  rawMoves.forEach((move: string) => {
    let tokens = move.trim().split(' ');
    columns.push(tokens);
  });

  return columns;
}