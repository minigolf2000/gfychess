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
      <h2 className="font-normal text-2xl tracking-tight text-neutral-700 mt-2.5 mb-5">Create and share chess animated GIFs!</h2>
      <PGNTextarea pgn={pgn} setPgn={setPgn} />
      <div className="flex justify-center max-sm:flex-col-reverse max-sm:items-center">
        <div className={`flex-[1_200px] ${classVisibleWhenMovesAvailable}`}>
          <MoveSelector
            key={JSON.stringify(moves)}
            moves={moves}
            range={range}
            renderAnimatedGIF={setRange}
            setHovering={setHovering}
          />
        </div>
        <div className={`flex-0 sticky self-start top-5 max-sm:static max-sm:self-auto max-sm:top-auto ${hovering ? "frozen" : ""}`}>
          <div className="h-14 flex items-center justify-center">
            <button
              className={`bg-blue-500 text-white text-xs font-bold border border-blue-600 py-1 px-4 hover:bg-blue-600 ${classVisibleWhenMovesAvailable}`}
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
            <p className="text-neutral-400 text-xs tracking-widest text-center mb-0">example</p>
          ) : (
            <div>
              <div className="flex justify-end items-center mr-1 select-none text-xs tracking-tight text-neutral-700 my-2.5">
                <input
                  type="checkbox"
                  id="flip-board"
                  className="mr-1.5"
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
