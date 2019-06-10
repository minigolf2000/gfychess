import { useState, useEffect, useRef } from "react";
import * as React from "react";

interface Props {
  moves: string[];
  range: number[];
  renderAnimatedGIF(range: number[]): void;
  setHovering(value: boolean): void;
}

const ROW_HEIGHT = 32
const ROW_WIDTH = 70
const DRAGGABLE_HANDLE_WIDTH = 8

export function MoveSelector(props: Props) {
  const { moves, range, renderAnimatedGIF, setHovering } = props;

  // If move list ever changes, reset to selecting all moves
  useEffect(() => {
    renderAnimatedGIF([0, moves.length - 1])
    setGifStart(0)
    setGifEnd(moves.length - 1)
  }, [JSON.stringify(moves)])

  const [gifStart, setGifStart] = useState(range[0])
  const [gifEnd, setGifEnd] = useState(range[1])

  const [currentHoveredIndex, setCurrentHoveredIndex] = useState(-1);
  const [mouseDownIndex, setMouseDownIndex] = useState(-1);

  const currentHoveringRange = () => {
    let min = gifStart;
    let max = gifEnd;
    if (mouseDownIndex > -1) {
      min = Math.min(currentHoveredIndex, mouseDownIndex)
      max = Math.max(currentHoveredIndex, mouseDownIndex)
    }
    return [min, max]
  }

  const className = (i: number) => {
    let className = [];
    let [min, max] = currentHoveringRange()

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
    renderAnimatedGIF([i, i])
    setHovering(true);
    if (!isDraggingStartHandle && !isDraggingEndHandle) {
      setCurrentHoveredIndex(i);
    }
  }

  const commit = () => {
    if (mouseDownIndex > -1) {
      const min = Math.min(mouseDownIndex, currentHoveredIndex)
      const max = Math.max(mouseDownIndex, currentHoveredIndex)
      renderAnimatedGIF([min, max]);
      setGifStart(min);
      setGifEnd(max);
    } else {
      // user hovered over things, but never made a selection.
      // rollback the GIF to what we had before
      renderAnimatedGIF([gifStart, gifEnd])
    }

    setHovering(false);
    setMouseDownIndex(-1);
    setIsDraggingStartHandle(false)
    setIsDraggingEndHandle(false)
  }

  const [isDraggingStartHandle, setIsDraggingStartHandle] = useState(false);
  const onStartHandleMouseDown = ( e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    if (!isDraggingStartHandle) {
      setIsDraggingStartHandle(true)
      setMouseDownIndex(gifEnd)
    }
  }

  const [isDraggingEndHandle, setIsDraggingEndHandle] = useState(false);
  const onEndHandleMouseDown = ( e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    if (!isDraggingEndHandle) {
      setIsDraggingEndHandle(true)
      setMouseDownIndex(gifStart)
    }
  }

  const tableEl = useRef(null);

  const onMouseMove = (e: any) => {
    if (isDraggingStartHandle || isDraggingEndHandle) {
      const rect = (tableEl.current as HTMLDivElement).getBoundingClientRect()

      let topOffset = Math.floor((e.clientY - rect.top) * 2 / ROW_HEIGHT)
      if (topOffset % 2 == 1) topOffset -= 1

      const leftOffsetPixels = e.clientX - rect.left - 30
      const leftOffset = leftOffsetPixels < ROW_WIDTH ? 0 : 1

      let nextHoveredIndex = topOffset + leftOffset
      nextHoveredIndex = Math.min(Math.max(0, nextHoveredIndex), moves.length - 1)
      if (currentHoveredIndex != nextHoveredIndex) {
        setCurrentHoveredIndex(nextHoveredIndex);
      }
    }
  }

  useEffect(() =>  {
    document.addEventListener("mousemove", onMouseMove)
    return () => {
      document.removeEventListener("mousemove", onMouseMove)
    }
  })

  useEffect(() => {
    if (!document.body.onmouseup) {
      document.body.onmouseup = () => {
        setHovering(false);
      }
    }
  })

  useEffect(() =>  {
    document.addEventListener("mouseup", commit)
    return () => {
      document.removeEventListener("mouseup", commit)
    }
  })

  const [startHandleIndex, endHandleIndex] = currentHoveringRange()
  const startHandleStyle: React.CSSProperties = {top: Math.floor(startHandleIndex / 2) * ROW_HEIGHT + 1, left: startHandleIndex % 2 * ROW_WIDTH - DRAGGABLE_HANDLE_WIDTH + 35}
  const endHandleStyle: React.CSSProperties = {top: Math.floor(endHandleIndex / 2) * ROW_HEIGHT + 1, left: (endHandleIndex % 2 + 1) * ROW_WIDTH - DRAGGABLE_HANDLE_WIDTH + 35}
  return (
    <div id="move-selector">
      <p className="description">Moves to include</p>
      <div className="table" onMouseLeave={() => !isDraggingStartHandle && !isDraggingEndHandle && commit()} ref={tableEl}>
        <span className="drag-handle start" style={startHandleStyle} onMouseDown={onStartHandleMouseDown}></span>
        <span className="drag-handle end" style={endHandleStyle} onMouseDown={onEndHandleMouseDown}></span>
        {columns(moves).map((column: string[], rowNum: number) => (
          <div className="row" key={rowNum}>
            <div className="rowNum">{rowNum}.</div>
            {
              [0, 1].map((offset: number) => {
                const i = rowNum * 2 + offset
                if (!column[offset]) {
                  return <span key={i} className="move disabled">&nbsp;</span>
                } else {
                  return (
                    <span
                      key={i}
                      onMouseEnter={(e: any) => { onMouseEnter(i)}}
                      onMouseDown={() => setMouseDownIndex(i)}
                      className={"move " + className(i)}
                    >
                      <span className="flex">{column[offset]}</span>
                    </span>
                  );
                }
              })
            }
          </div>
        ))}
      </div>
      <p className="description">{endHandleIndex - startHandleIndex + 1} out of {moves.length} moves</p>
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