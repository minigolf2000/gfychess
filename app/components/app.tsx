import { useState } from "react";
import * as React from "react";
import { parseMoves } from "../lib/parse_moves"
import { PGNTextarea } from "./pgn-textarea";
import { MoveSelector } from "./move-selector";
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

  const toggleFlipboard = () => {
    setFlipBoard(!flipBoard)
  }

  return (
    <>
      <h1><img src="public/logo.svg" alt="Gfychess"/></h1>
      <h2>Create and share chess animated GIFs!</h2>
      <PGNTextarea
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
            <button className={`download-link ${classVisibleWhenPgnFilled}`} onClick={download}>↓ Download</button>
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
            <div id="option-form">
              <input
                type="checkbox"
                id="flip-board"
                checked={flipBoard}
                onChange={toggleFlipboard}
              />
              <label htmlFor="flip-board">Flip board</label>
            </div>
          </div>
          )}
        </div>

      </div>
    </>
  );
}
