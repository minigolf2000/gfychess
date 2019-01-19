import { useState } from "react";
import * as React from "react";
import { PGNInput } from "./pgn-input";
import { MoveSelector } from "./move-selector";
import { OptionForm } from "./option-form";
import { Gif } from "./gif";

export default function App() {
  const [fullPgn, setPgn] = useState("");
  const [start, setStart] = useState(-1);
  const [end, setEnd] = useState(-1);
  const [hoveredMoveIndex, setHoveredMoveIndex] = useState(-1);
  const [flipBoard, setFlipBoard] = useState(false);

  const setPgnAndReset = (pgn: string) => {
    setPgn(pgn);
    setStart(0);
    setEnd(4);
  }

  let pgn = fullPgn;
  let s = start;
  let e = end;
  if (fullPgn == "") {
    pgn = "1.e4 e5 2.Bc4 Nc6 3.Qh5 Nf6?? 4.Qxf7#";
    s = 0;
    e = 6;
  }

  const classVisibleWhenPgnFilled = " " + (fullPgn == "" ? "hidden" : "visible")
  const classVisibleWhenPgnEmpty = " " + (fullPgn != "" ? "hidden" : "visible")

  return (
    <>
      <h1><img src="public/logo.svg" alt="Gfychess"/></h1>
      <h2>Create and share chess animated GIFs!</h2>
      <PGNInput
        pgn={fullPgn}
        setPgn={setPgnAndReset}
      />
      <div id="container">
        <div className={"left" + classVisibleWhenPgnFilled}>
          <MoveSelector
            fullPgn={pgn}
            start={s}
            end={e}
            setStart={setStart}
            setEnd={setEnd}
            onHover={setHoveredMoveIndex}
          />
        </div>
        <div id="right">
          <p className={"description " + classVisibleWhenPgnFilled}>Right-click to save or copy your GIF!</p>
          <Gif
            pgn={pgn}
            start={s}
            end={e}
            hoveredMoveIndex={hoveredMoveIndex}
            flipBoard={flipBoard}
          />
          <p className={"description example-footer " + (classVisibleWhenPgnEmpty)}>Example</p>

          <div className={classVisibleWhenPgnFilled}>
            <OptionForm
              flipBoard={flipBoard}
              setFlipBoard={setFlipBoard}
            />
          </div>
        </div>

      </div>
    </>
  );
}
