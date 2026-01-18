import exampleGames from "@/app/lib/examples";
import { lichessRegex } from "@/app/lib/parse_moves";
import { CopyToClipboard } from "@/app/copy-to-clipboard";
import Image from "next/image";

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

    const resp = await fetch(
      `https://lichess.org/game/export/${isLichess[3]}?tags=false&clocks=false&evals=false&opening=false`
    );
    const text = await resp.text();
    props.setPgn(text.trim());
  }

  const loadingLichessUrl = props.pgn.match(lichessRegex) != null;
  return (
    <>
      {loadingLichessUrl && <div className="absolute mt-5 left-1/2 size-7 animate-spin border-4 border-blue-500 border-r-transparent rounded-full" />}

      <textarea
        id="pgnText"
        className="w-[calc(100%-20px)] h-15 text-neutral-700 shadow-inner leading-tight p-2.5 transition-all duration-200 ease-in tracking-wide text-xs font-inherit border border-neutral-700 disabled:bg-neutral-200 placeholder:text-base placeholder:leading-snug placeholder:truncate"
        placeholder='Paste PGN e.g. "1. e4 e5 2. Nf3 ..." or Lichess URL "lichess.org/xxxx" here'
        value={props.pgn}
        disabled={loadingLichessUrl}
        onFocus={(e) => {
          e.target.select();
        }}
        onChange={(e) => {
          onMoveChange(e.target.value);
        }}
        spellCheck={false}
      />

      <div className="flex items-center mt-2.5 mb-4 flex-wrap h-9 overflow-hidden">
        <h3 className="text-xs tracking-tight text-neutral-700 my-2.5 mr-1">PGN examples</h3>
        {exampleGames.map((game) => (
          <CopyToClipboard key={game.name} text={() => game.pgn}>
            <button className="inline-flex items-center rounded-sm m-1 px-1 border border-neutral-300 bg-inherit hover:bg-neutral-100 active:bg-neutral-100">
              <Image
                className="size-4 mr-1.5 opacity-60"
                height={16}
                width={12}
                src="/clipboard.svg"
                alt="clipboard"
              />
              Copy {game.name}
            </button>
          </CopyToClipboard>
        ))}
      </div>
    </>
  );
}
