import { useState } from "react";
import * as React from "react";
import { PGNInput } from "./pgn-input";
import { MoveSelector } from "./move-selector";
import { Gif } from "./gif";

export default function App() {
  const [fullPgn, setPgn] = useState("");
  const [start, setStart] = useState(-1);
  const [end, setEnd] = useState(-1);
  const [hoveredMoveIndex, setHoveredMoveIndex] = useState(-1);

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

  return (
    <>
      <h1><img src="public/logo.svg" alt="Gfychess"/></h1>
      <h2>Create and share chess animated GIFs!</h2>
      <PGNInput
        pgn={fullPgn}
        setPgn={setPgnAndReset}
      />
      <div id="container">
        <div className={"left " + (fullPgn == "" ? "hidden" : "")}>
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
          <p className={"description " + (fullPgn.length == 0 ? "hidden" : "")}>Right-click to save or copy your GIF!</p>
          <Gif
            fullPgn={pgn}
            start={s}
            end={e}
            hoveredMoveIndex={hoveredMoveIndex}
          />
          {fullPgn == "" && <p className="description example-footer">Example</p>}
        </div>

      </div>
    </>
  );
}
