import * as React from "react";
import exampleGames from "../lib/examples";
import * as CopyToClipboard from "react-copy-to-clipboard";

interface Props {
  pgn: string;
  setPgn(pgn: string): void;
}

export function PGNInput(props: Props) {
  return (
    <>
      <textarea
        placeholder='Paste in chess PGN here e.g. "1. e4 e5 2. Nf3 Nc6 3. Bb5 ..."'
        value={props.pgn}
        onFocus={(e) => { e.target.select(); }}
        onChange={(e) => { props.setPgn(e.target.value); }}
        spellCheck={false}
      />

      <div id="examples">
        <h3>PGN Examples</h3>
        {exampleGames.map((game) => (
          <CopyToClipboard key={game.name} text={game.pgn}>
            <button>
              <img src="public/clipboard.svg" />
              Copy {game.name}
            </button>
          </CopyToClipboard>
        ))}
      </div>
    </>
  );
}
