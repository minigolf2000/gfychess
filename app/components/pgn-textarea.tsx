import * as React from "react";
import exampleGames from "../lib/examples";
import * as CopyToClipboard from "react-copy-to-clipboard";
import { lichessRegex } from "../lib/parse_moves";

interface Props {
  pgn: string;
  setPgn(pgn: string): void;
}

export function PGNTextarea(props: Props) {
  async function onMoveChange(moves: string) {
    const isLichess = moves.match(lichessRegex);

    props.setPgn(moves);
    if (!isLichess) {
      return;
    }

    const resp = await fetch(`https://lichess.org/game/export/${isLichess[3]}?tags=false&clocks=false&evals=false&opening=false`);
    const text = await resp.text();
    props.setPgn(text.trim());
  }

  const loadingLichessUrl = props.pgn.match(lichessRegex) != null
  return (
    <>
      {loadingLichessUrl && <div className="lichess-spinner" />}

      <textarea
        id='pgnText'
        placeholder='Paste PGN e.g. "1. e4 e5 2. Nf3 ..." or Lichess URL "lichess.org/xxxx" here'
        value={props.pgn}
        disabled={loadingLichessUrl}
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
