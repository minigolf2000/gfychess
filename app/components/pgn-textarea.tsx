import * as React from "react";
import exampleGames from "../lib/examples";
import * as CopyToClipboard from "react-copy-to-clipboard";

interface Props {
  pgn: string;
  setPgn(pgn: string): void;
}

const lichessRe = /^\s*(http:\/\/|https:\/\/)?(www\.)?lichess\.org\/(\w{8})\/*\s*$/

export function PGNTextarea(props: Props) {
  async function onMoveChange(moves: string) {
    const isLichess = moves.match(lichessRe);

    props.setPgn(moves);
    if (!isLichess) {
      return;
    }

    const resp = await fetch(`https://lichess.org/game/export/${isLichess[3]}?tags=false&clocks=false&evals=false&opening=false`);
    const text = await resp.text();
    props.setPgn(text.trim());
  }

  return (
    <>
      <textarea
        id='pgnText'
        placeholder='Paste in chess PGN here e.g. "1. e4 e5 2. Nf3 Nc6 3. Bb5 ..."'
        value={props.pgn}
        disabled={props.pgn.match(lichessRe) != null}
        onFocus={(e) => { e.target.select(); }}
        onChange={(e) => { onMoveChange(e.target.value); }}
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
