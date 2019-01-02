import { useState } from "react";
import * as React from "react";
import { PGNInput } from "./pgn-input";
import { PGNSelector } from "./pgn-selector";

export default function App() {
  const [fullPgn, setFullPgn] = useState("");
  const [selectedPgn, setSelectedPgn] = useState("");
  const [showPgnSelector, setShowSelector] = useState(false);

  const setPgn = (fullPgn: string, selectedPgn: string) => {
    setFullPgn(fullPgn);
    setSelectedPgn(selectedPgn);
  }

  return (
    <>
      <h1><img src="public/logo.svg" alt="Gfychess"/></h1>
      <PGNInput setPgn={setPgn} />
      <div id="container">
        <div className="left">
          <PGNSelector fullPgn={fullPgn} setSelectedPgn={setSelectedPgn} />
        </div>
        <div id="right">
          <img className="example" src="public/example.gif" alt="example gif" />
          Right-click to save or copy your GIF!
        </div>

      </div>
    </>
  );
}
