import { useState } from "react";
import * as React from "react";
import { PGNInput } from "./pgn-input";
import { PGNSelector } from "./pgn-selector";
import { Gif } from "./gif";

export default function App() {
  const [fullPgn, setPgn] = useState("");
  const [start, setStart] = useState(-1);
  const [end, setEnd] = useState(-1);

  const setPgnAndReset = (pgn: string) => {
    setPgn(pgn);
    setStart(0);
    setEnd(4);
  }

  return (
    <>
      <h1><img src="public/logo.svg" alt="Gfychess"/></h1>
      <PGNInput
        pgn={fullPgn}
        setPgn={setPgnAndReset}
      />
      <div id="container">
        <div className="left">
          <PGNSelector
            fullPgn={fullPgn}
            start={start}
            end={end}
            setStart={setStart}
            setEnd={setEnd}
          />
        </div>
        <div id="right">
          <Gif
            fullPgn={fullPgn}
            start={start}
            end={end}
          />
          Right-click to save or copy your GIF!

        </div>

      </div>
    </>
  );
}
