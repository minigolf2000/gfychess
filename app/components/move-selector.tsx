import { useState, useEffect } from "react";
import { parseMoves } from "../lib/parse_moves"
import * as React from "react";

interface Props {
  fullPgn: string;
  start: number;
  end: number;
  setStart(start: number): void;
  setEnd(end: number): void;
  onHover(i: number): void;
}

export function MoveSelector(props: Props) {
  const { fullPgn, start, end, setStart, setEnd, onHover } = props;
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

  const [startSelected, setStartSelected] = useState(false);

  const onClick = (i: number) => {
    if (i < start || !startSelected) {
      setStart(i);
      if (i > end) {
        setEnd(i);
      }
      setStartSelected(true);
    } else {
      setEnd(i);
      setStartSelected(false);
    }
  }

  useEffect(() => {
    if (!document.body.onmouseover) {
      document.body.onmouseover = () => {
        props.onHover(-1);
      }
    }
  })

  return (
    <div id="pgn-selector">
    <h3>Moves to include</h3>
      <ol
        onMouseOver={() => onHover(-1)}
        onMouseOut={() => onHover(-1)}
      >
        {columns(parsedMoves).map((column: string[], rowNum: number) => (
          <li key={rowNum}>
            {move({san: column[0], className: className(rowNum * 2), onClick, onHover, i: rowNum * 2})}
            {move({san: column[1], className: className(rowNum * 2 + 1), onClick, onHover, i: rowNum * 2 + 1})}
          </li>
        ))}
      </ol>
      {end - start + 1} out of {parsedMoves.length} moves
    </div>
  );
}

interface MoveProps {
  san: string; // e.g. "e4", "kd6", "0-0"
  className: string;
  onClick: (i: number) => void;
  onHover: (i: number) => void;
  i: number;
}

function move(props: MoveProps) {
  if (!props.san) {
    return <span className="move disabled">&nbsp;</span>
  }

  return (
    <span
      onClick={() => props.onClick(props.i)}
      onMouseOver={(e) => {e.stopPropagation(); props.onHover(props.i)}}
      onMouseOut={(e) => {e.stopPropagation()}}
      className={"move " + props.className}>
        <span className="flex">{props.san}</span>
    </span>
  );
}

const columns = (moves: string[]) => {
  let columns: String[][] = []
  for (let i = 0; i < moves.length; i += 2) {
    columns.push([moves[i], moves[i+1]])
  }
  return columns;
}