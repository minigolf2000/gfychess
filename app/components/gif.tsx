import { useState, useEffect } from "react";
import * as React from "react";
import { parseMoves } from "../lib/parse_moves"
import { ChessGif } from "../lib/chessgif"

interface Props {
  fullPgn: string;
  start: number;
  end: number;
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
        prevProps.end != this.props.end) {
      const moves = parseMoves(this.props.fullPgn);

      if (moves.length > 0) {
        this.chessGif.loadMoves(moves);
        const gif = await this.chessGif.createGif();
        const url = this.chessGif.asBase64Gif();
        console.log(url);
        this.setState({url})
      }
    }
  }

  public render() {
    return (
      <>
        <img className="example" src={this.state.url} alt="" />
      </>
    );
  }
}
