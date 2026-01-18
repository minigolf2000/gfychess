import * as React from "react";
import { ChessGif } from "@/app/lib/chessgif";

interface Props {
  moves: string[];
  range: number[];
  flipBoard: boolean;
  url: string;
  setUrl: (url: string) => void;
}

export class Gif extends React.Component<Props, {}> {
  chessGif = new ChessGif();

  public componentDidMount() {
    this.updateAnimatedGif();
  }

  public async componentDidUpdate(prevProps: Props) {
    if (JSON.stringify(prevProps.moves) != JSON.stringify(this.props.moves)) {
      this.chessGif.resetCache();
    }

    if (
      JSON.stringify(prevProps.moves) != JSON.stringify(this.props.moves) ||
      prevProps.range[0] != this.props.range[0] ||
      prevProps.range[1] != this.props.range[1] ||
      prevProps.flipBoard != this.props.flipBoard
    ) {
      this.updateAnimatedGif();
    }
  }

  public async updateAnimatedGif() {
    if (this.props.moves.length > 0) {
      this.chessGif.loadMoves(this.props.moves);
      await this.chessGif.createGif(
        this.props.range[0],
        this.props.range[1],
        this.props.flipBoard,
      );

      const url = this.chessGif.asBase64Gif();
      this.props.setUrl(url);
    }
  }

  public render() {
    if (!this.props.url) {
      return null;
    }
    return (
      <img
        id="animated-gif"
        className="border-4 border-white max-h-96 max-w-96"
        src={this.props.url}
        alt=""
      />
    );
  }
}
