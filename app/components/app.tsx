import { useState, useEffect } from "react";
import * as React from "react";
import { parseMoves } from "../lib/parse_moves"
import { PGNInput } from "./pgn-input";
import { MoveSelector } from "./move-selector";
import { OptionForm } from "./option-form";
import { Gif } from "./gif";

export default function App() {
  const [pgn, setPgn] = useState("");
  const [range, setRange] = useState([-1, -1]);
  const [hovering, setHovering] = useState(false);
  const [flipBoard, setFlipBoard] = useState(false);

  let moves = parseMoves(pgn);
  if (pgn == "") {
    moves = ["e4", "e5", "Bc4", "Nc6", "Qh5", "Nf6??", "Qxf7#"];
  }

  const classVisibleWhenPgnFilled = " " + (pgn == "" ? "hidden" : "visible")
  const classVisibleWhenPgnEmpty = " " + (pgn != "" ? "hidden" : "visible")

  return (
    <>
      <h1><img src="public/logo.svg" alt="Gfychess"/></h1>
      <h2>Create and share chess animated GIFs!</h2>
      <PGNInput
        pgn={pgn}
        setPgn={setPgn}
      />
      <div id="container">
        <div className={"left" + classVisibleWhenPgnFilled}>
          <MoveSelector
            moves={moves}
            range={range}
            setRange={setRange}
            setHovering={setHovering}
          />
        </div>
        <div id="right" className={hovering ? "frozen" : ""}>
          <p className={"description " + classVisibleWhenPgnFilled}>Right-click to save or copy your GIF!</p>
          <Gif
            moves={moves}
            range={range}
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
