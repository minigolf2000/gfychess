import { useState, useEffect } from "react";
import * as React from "react";
import { parseMoves } from "../lib/parse_moves"
import { ChessGif } from "../lib/chessgif"

interface Props {
  fullPgn: string;
  start: number;
  end: number;
  hoveredMoveIndex: number;
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

  public async componentDidUpdate(prevProps: Props) {
    if (prevProps.fullPgn != this.props.fullPgn ||
        prevProps.start != this.props.start ||
        prevProps.end != this.props.end ||
        prevProps.hoveredMoveIndex != this.props.hoveredMoveIndex) {
      const moves = parseMoves(this.props.fullPgn);

      if (moves.length > 0 && this.props.hoveredMoveIndex == -1) {
        this.chessGif.loadMoves(moves);
        await this.chessGif.createGif(this.props.start, this.props.end);

        const url = this.chessGif.asBase64Gif();
        this.setState({url})
      } else if (this.props.hoveredMoveIndex >= 0) {
        this.chessGif.reset();
        // await this.chessGif.render();
        let i = 0;
        while (i <= this.props.hoveredMoveIndex) {
          this.chessGif.step();
          i++;
        }
        await this.chessGif.render();

        const url = this.chessGif.asBase64Gif();
        this.setState({url})
      }
    }
  }

  public render() {
    if (this.props.fullPgn == "") {
      return null;
    } else {
      return (
        <img id="animated-gif" className={(this.props.hoveredMoveIndex >= 0 ? "frozen" : "")} src={this.state.url} alt="" />
      )
    }
  }
}
