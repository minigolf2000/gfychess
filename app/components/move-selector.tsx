import { useState, useEffect } from "react";
import * as React from "react";

interface Props {
  moves: string[];
  range: number[];
  setRange(range: number[]): void;
  setHovering(value: boolean): void;
}

export function MoveSelector(props: Props) {
  const { moves, range, setRange, setHovering } = props;

  useEffect(() => {
    setRange([0, moves.length - 1])
    setGifStart(0)
    setGifEnd(moves.length - 1)
  }, [JSON.stringify(moves)])

  const [gifStart, setGifStart] = useState(range[0])
  const [gifEnd, setGifEnd] = useState(range[1])

  const [currentHoveredIndex, setCurrentHoveredIndex] = useState(-1);
  const [mouseDownIndex, setMouseDownIndex] = useState(-1);

  const className = (i: number) => {
    let className = [];
    let min = gifStart;
    let max = gifEnd;
    if (mouseDownIndex > -1) {
      min = Math.min(currentHoveredIndex, mouseDownIndex)
      max = Math.max(currentHoveredIndex, mouseDownIndex)
    }

    if (min <= i && i <= max) {
      className.push("selected");
    }
    if (i == currentHoveredIndex) {
      className.push("hovered");
    }
    return className.join(" ");
  }

  const onMouseEnter = (i: number) => {
    setRange([i, i])
    setHovering(true);
    setCurrentHoveredIndex(i);
  }

  useEffect(() => {
    if (!document.body.onmouseup) {
      document.body.onmouseup = () => {
        setHovering(false);
      }
    }
  })

  const commit = () => {
    if (mouseDownIndex > -1) {
      setHovering(false);
      const min = Math.min(mouseDownIndex, currentHoveredIndex)
      const max = Math.max(mouseDownIndex, currentHoveredIndex)
      setRange([min, max]);
      setGifStart(min);
      setGifEnd(max);
      setMouseDownIndex(-1);
    } else {
      // user aborted selection. rollback
      setRange([gifStart, gifEnd])
      setHovering(false);
      setMouseDownIndex(-1);
    }
  }

  return (
    <div id="move-selector">
      <h3>Moves to include</h3>
      <ol onMouseLeave={commit}>
        {columns(moves).map((column: string[], rowNum: number) => (
          <li key={rowNum}>
          {
            [0, 1].map((i: number) => {

              if (!column[i]) {
                return <span key={i} className="move disabled">&nbsp;</span>
              } else {
                return (
                  <span
                    onMouseEnter={(e: any) => { onMouseEnter(rowNum * 2 + i)}}
                    onMouseDown={() => setMouseDownIndex(rowNum * 2 + i)}
                    onMouseUp={commit}
                    className={"move " + className(rowNum * 2 + i)}
                    key={i}
                  >
                    <span className="flex">{column[i]}</span>
                  </span>
                );
              }
            })
          }
          </li>
        ))}
      </ol>
      <p>{gifEnd - gifStart + 1} out of {moves.length} moves</p>
    </div>
  );
}

const columns = (moves: string[]) => {
  let columns: String[][] = []
  for (let i = 0; i < moves.length; i += 2) {
    columns.push([moves[i], moves[i+1]])
  }
  return columns;
}