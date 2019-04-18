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
  const [url, setUrl] = useState("");
  const [hovering, setHovering] = useState(false);
  const [flipBoard, setFlipBoard] = useState(false);

  let moves = parseMoves(pgn);
  if (pgn == "") {
    moves = ["e4", "e5", "Bc4", "Nc6", "Qh5", "Nf6??", "Qxf7#"];
  }

  const classVisibleWhenPgnFilled = pgn == "" ? "hidden" : "visible"

  const download = () => {
    const link = document.createElement("a");
    link.download = "gfychess-" + url + ".gif";
    link.href = url;
    link.click();
  }

  return (
    <>
      <h1><img src="public/logo.svg" alt="Gfychess"/></h1>
      <h2>Create and share chess animated GIFs!</h2>
      <PGNInput
        pgn={pgn}
        setPgn={setPgn}
      />
      <div id="container">
        <div className={`left ${classVisibleWhenPgnFilled}`}>
          <MoveSelector
            moves={moves}
            range={range}
            renderAnimatedGIF={setRange}
            setHovering={setHovering}
          />
        </div>
        <div id="right" className={hovering ? "frozen" : ""}>
          <div className="download-container">
            <button className={`download-link ${classVisibleWhenPgnFilled}`} onClick={download}>⇩ Download</button>
          </div>
          <Gif
            moves={moves}
            range={range}
            url={url}
            setUrl={setUrl}
            flipBoard={flipBoard}
          />
          {pgn == "" ? (
            <p className="description example-footer">example</p>
          ) : (
          <div>
            <OptionForm
              flipBoard={flipBoard}
              setFlipBoard={setFlipBoard}
            />
          </div>
          )}
        </div>

      </div>
    </>
  );
}
