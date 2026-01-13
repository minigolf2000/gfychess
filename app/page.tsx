"use client";
import { useState } from "react";
import { parseMoves } from "@/app/lib/parse_moves";
import { PGNTextarea } from "./pgn-textarea";
import { MoveSelector } from "./move-selector";
import { Gif } from "./gif";
import Image from "next/image";

export default function Home() {
  const [pgn, setPgn] = useState("");
  const [range, setRange] = useState([-1, -1]);
  const [url, setUrl] = useState("");
  const [hovering, setHovering] = useState(false);
  const [flipBoard, setFlipBoard] = useState(false);

  let moves = parseMoves(pgn);
  if (pgn == "") {
    moves = ["e4", "e5", "Bc4", "Nc6", "Qh5", "Nf6??", "Qxf7#"];
  }

  const classVisibleWhenMovesAvailable =
    pgn === "" || moves.length === 0 ? "hidden" : "visible";

  const download = () => {
    const link = document.createElement("a");
    link.download = "gfychess-" + url + ".gif";
    link.href = url;

    // https://stackoverflow.com/a/48367757
    link.dispatchEvent(
      new MouseEvent(`click`, { bubbles: true, cancelable: true, view: window })
    );
  };

  const toggleFlipboard = () => {
    setFlipBoard(!flipBoard);
  };

  return (
    <div className="max-w-240 mx-auto p-2">
      <h1>
        <Image width={279} height={68} src="/logo.svg" alt="Gfychess" />
      </h1>
      <h2>Create and share chess animated GIFs!</h2>
      <PGNTextarea pgn={pgn} setPgn={setPgn} />
      <div id="container">
        <div className={`left ${classVisibleWhenMovesAvailable}`}>
          <MoveSelector
            key={JSON.stringify(moves)}
            moves={moves}
            range={range}
            renderAnimatedGIF={setRange}
            setHovering={setHovering}
          />
        </div>
        <div id="right" className={hovering ? "frozen" : ""}>
          <div className="download-container">
            <button
              className={`download-link ${classVisibleWhenMovesAvailable}`}
              onClick={download}
            >
              ↓ Download
            </button>
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
    </div>
  );
}
