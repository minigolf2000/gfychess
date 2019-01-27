import * as React from "react";

interface Props {
  flipBoard: boolean;
  setFlipBoard(flipBoard: boolean): void;
}

export function OptionForm(props: Props) {
  const { flipBoard, setFlipBoard } = props;

  return (
    <div id="option-form">
      <input
        type="checkbox"
        id="flip-board"
        checked={flipBoard}
        onChange={() => setFlipBoard(!flipBoard)}
      />
      <label htmlFor="flip-board">Flip board</label>
    </div>
  );
}
