import { useState, useEffect } from "react";
import { parseMoves } from "../lib/parse_moves"
import * as React from "react";

interface Props {
  fullPgn: string;
  start: number;
  end: number;
  setStart(start: number): void;
  setEnd(end: number): void;
}

export function PGNSelector(props: Props) {
  const { fullPgn, start, end, setStart, setEnd } = props;
  const parsedMoves = parseMoves(fullPgn);

  const className = (i: number) => {
    let className = [];
    if (i == start) {
      className.push("start");
    }
    if (i == end) {
      className.push("end");
    }
    if (start <= i && i <= end) {
      className.push("between");
    }
    return className.join(" ");
  }

  const onClick = (i: number) => {
    if (i >= start) {
      setEnd(i);
    } else {
      setStart(i);
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
      {end - start} out of {parsedMoves.length} moves
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

const columns = (pgn: string) => {
  const rawMoves = pgn.split(".").slice(1)

  let columns: String[][] = []
  rawMoves.forEach((move: string) => {
    let tokens = move.trim().split(' ');
    columns.push(tokens);
  });

  return columns;
}