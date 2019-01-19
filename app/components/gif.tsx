import { useState, useEffect } from "react";
import * as React from "react";
import { parseMoves } from "../lib/parse_moves"
import { ChessGif } from "../lib/chessgif"

interface Props {
  pgn: string;
  start: number;
  end: number;
  hoveredMoveIndex: number;
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
    const moves = parseMoves(this.props.pgn);
    this.updateAnimatedGif(moves)
  }

  public componentDidUpdate(prevProps: Props) {
    if (prevProps.pgn != this.props.pgn ||
        prevProps.start != this.props.start ||
        prevProps.end != this.props.end ||
        prevProps.hoveredMoveIndex != this.props.hoveredMoveIndex) {

      const moves = parseMoves(this.props.pgn);
      if (moves.length > 0 && this.props.hoveredMoveIndex == -1) {
        this.updateAnimatedGif(moves)
      } else if (this.props.hoveredMoveIndex >= 0) {
        this.updateFreezeFrameGif()
      }
    }
  }

  private async updateAnimatedGif(moves: string[]) {
    this.chessGif.loadMoves(moves);
    await this.chessGif.createGif(this.props.start, this.props.end);

    const url = this.chessGif.asBase64Gif();
    this.setState({url})
  }

  private async updateFreezeFrameGif() {
    this.chessGif.reset();
    let i = 0;
    while (i <= this.props.hoveredMoveIndex) {
      this.chessGif.step();
      i++;
    }
    await this.chessGif.render();

    const url = this.chessGif.asBase64Gif();
    this.setState({url})
  }

  public render() {
    return (
      <img
        id="animated-gif"
        className={(this.props.hoveredMoveIndex >= 0 ? "frozen" : "")}
        src={this.state.url}
        alt=""
      />
    )
  }
}
