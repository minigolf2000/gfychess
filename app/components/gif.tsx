import * as React from "react";
import { ChessGif } from "../lib/chessgif"

interface Props {
  moves: string[];
  range: number[];
  flipBoard: boolean;
}

interface State {
  url: string;
}

export class Gif extends React.Component<Props, State> {
  public constructor(props: Props) {
    super(props);
    this.state = {url: ""}
  }

  chessGif = new ChessGif();

  public componentDidMount() {
    this.updateAnimatedGif()
  }

  public async componentDidUpdate(prevProps: Props) {
    if (JSON.stringify(prevProps.moves) != JSON.stringify(this.props.moves)) {
      this.chessGif.resetCache();
    }

    if (JSON.stringify(prevProps.moves) != JSON.stringify(this.props.moves) ||
        prevProps.range[0] != this.props.range[0] ||
        prevProps.range[1] != this.props.range[1] ||
        prevProps.flipBoard != this.props.flipBoard) {
      this.updateAnimatedGif()
    }
  }

  public async updateAnimatedGif() {
    if (this.props.moves.length > 0) {
      this.chessGif.loadMoves(this.props.moves);
      await this.chessGif.createGif(this.props.range[0], this.props.range[1], this.props.flipBoard);

      const url = this.chessGif.asBase64Gif();
      this.setState({url})
    }
  }

  public render() {
    return <img id="animated-gif" src={this.state.url} alt="" />
  }
}
