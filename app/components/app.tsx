import { useState } from "react";
import * as React from "react";
import exampleGames from "../lib/examples";
import { Textarea } from "./textarea";
import * as CopyToClipboard from "react-copy-to-clipboard";

export default function App() {
  const [fullPgn, setFullPgn] = useState("");
  const [selectedPgn, setSelectedPgn] = useState("");

  const setPgn = (fullPgn: string, selectedPgn: string) => {
    setFullPgn(fullPgn);
    setSelectedPgn(selectedPgn);
  }

  return (
    <>
      <h1><img src="public/logo.svg" alt="Gfychess"/></h1>

      <div id="container">
        <div className="left">
          <Textarea setPgn={setPgn}/>

          <div id="examples">
            <h2>PGN Examples</h2>
            <ul>
              {exampleGames.map((game) => (
                <li key={game.name}>
                  <input type="text" value={game.pgn} readOnly />
                  <CopyToClipboard text={game.pgn}
                    onCopy={() => null}>
                    <button><img src="public/clipboard.svg" />{game.name}</button>
                  </CopyToClipboard>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div id="middle">
          <img
            src="public/description.svg"
            alt="convert this chess PGN into this animated GIF"
          />
        </div>
        <div id="right">
          <div id="gif">
            <p>Insert animated GIF here</p>
            <div>
              Full PGN:
              <div className="pgn">{fullPgn}</div>
            </div>

            <div>
              Selected PGN:
              <div className="pgn">{selectedPgn}</div>
            </div>
          </div>
          Right click to save or copy this GIF!
        </div>

      </div>
    </>
  );
}
