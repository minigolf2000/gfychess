import { useState, useEffect } from "react";
import * as React from "react";

interface Props {
  moves: string[];
  range: number[];
  setRange(range: number[]): void;
  setHovering(value: boolean): void;
}

let dragPaneImageRef: HTMLDivElement = null
let cachedDragOverBounds: ClientRect = null

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

    if (i == min) {
      className.push("start");
    }
    if (i == max) {
      className.push("end");
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

  const [reorderingIndex, setReorderingIndex] = useState(-1)
  const [dragOverIndex, setDragOverIndex] = useState(-1)
  const [isDraggingBefore, setIsDraggingBefore] = useState(false)


  const onDragStart = (i: number, e: React.DragEvent<HTMLSpanElement>) => {
    // This removes the default visual copy of the element and the copy cursor
    // note:  setData is needed for Firefox to recognize drag events
    // as any is needed because some tslint is not happy with the definition of setDragImage
    let event = e as any
    // event.dataTransfer.setData('text', nodeId)
    event.dataTransfer.dropEffect = 'none'
    // event.dataTransfer.dropEffect = 'move'
    event.dataTransfer.effectAllowed = 'move'
    if (dragPaneImageRef) {
      event.dataTransfer.setDragImage(dragPaneImageRef, 10, 10)
    }
    console.log(i)
    setReorderingIndex(i);
    setDragOverIndex(-1);
  }



  const onDragOver = (i: number, e: React.MouseEvent<HTMLSpanElement>) => {
    e.preventDefault();

    const htmlElem = e.target as HTMLSpanElement
    if (dragOverIndex !== i) {
      cachedDragOverBounds = htmlElem.getBoundingClientRect()
    }

    let offsetX = e.clientX - cachedDragOverBounds.left
    if (reorderingIndex > -1) {
      if (i !== reorderingIndex) {
        setDragOverIndex(i)
        setIsDraggingBefore(offsetX < (cachedDragOverBounds.width / 2))
      }
      e.preventDefault()
      e.stopPropagation()
    }
  }

  const onDragLeave = (i: number, e: React.MouseEvent<HTMLSpanElement>) => {
    if (dragOverIndex === i) {
      setDragOverIndex(-1);
    }
    e.stopPropagation()
  }

  const onDragDrop = (i: number, e: React.MouseEvent<HTMLSpanElement>) => {
    console.log(reorderingIndex)
    if (reorderingIndex > -1) {
      if (isDraggingBefore) {
        console.log("yes")
      } else {
        console.log("no");
      }
      setReorderingIndex(-1);
      setDragOverIndex(-1);
      e.preventDefault()
      e.stopPropagation()
    }
  }

  return (
    <div id="move-selector">
      <h3>Moves to include</h3>
      <ol onMouseLeave={commit}>
        {columns(moves).map((column: string[], rowNum: number) => (
          <li key={rowNum}>
          {
            [0, 1].map((offset: number) => {
              const i = rowNum * 2 + offset
              if (!column[offset]) {
                return <span key={offset} className="move disabled">&nbsp;</span>
              } else {
                return (
                  <React.Fragment key={offset}>
                    {className(i).includes("start") && (
                      <span className="drag-handle" draggable onDragStart={(e) => onDragStart(i, e)}></span>
                    )}

                    <span
                      onDragOver={(e) => onDragOver(i, e)}
                      onDragLeave={(e) => onDragLeave(i, e)}
                      onDrop={(e) => onDragDrop(i, e)}
                      onMouseEnter={(e: any) => { onMouseEnter(i)}}
                      onMouseDown={() => setMouseDownIndex(i)}
                      onMouseUp={commit}
                      className={"move " + className(i)}
                    >
                      <span className="flex">{column[offset]}</span>
                    </span>

                    {className(i).includes("end") && (
                      <span className="drag-handle" draggable onDragStart={(e) => onDragStart(i, e)}></span>
                    )}

                  </React.Fragment>
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