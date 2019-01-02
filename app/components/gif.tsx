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

  public async componentDidUpdate(prevProps: Props) {
    if (prevProps.fullPgn != this.props.fullPgn ||
        prevProps.start != this.props.start ||
        prevProps.end != this.props.end) {
      const chessGif = new ChessGif();
      const moves = parseMoves(this.props.fullPgn);

      if (moves.length > 0) {
        const begin = Date.now();
        chessGif.loadMoves(moves);
        const gif = await chessGif.createGif();
        const end = Date.now();

        const blob = new Blob([new Uint8Array(gif)]);
        const url = URL.createObjectURL(blob);
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