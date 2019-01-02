import * as React from "react";
import exampleGames from "../lib/examples";
import * as CopyToClipboard from "react-copy-to-clipboard";

interface Props {
  setPgn(fullPgn: string, selectedPgn: string): void;
}

interface State {
  text: string;
  selected: string;
}

export class PGNInput extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      text: "1.e4 e5 2.Bc4 Nc6 3.Qh5 Nf6?? 4.Qxf7#",
      selected: "",
    };
  }

  public render() {
    const { text, selected } = this.state;

    return (
      <div>
        <textarea
          ref='myTextarea'
          value = {text}
          onSelect = {() => {
            let textVal = this.refs.myTextarea;
            let cursorStart = (textVal as any).selectionStart;
            let cursorEnd = (textVal as any).selectionEnd;
            this.setState({
              selected: this.state.text.substring(cursorStart, cursorEnd)
            });
            this.props.setPgn(this.state.text, this.state.text.substring(cursorStart,cursorEnd))
          }}
          onChange={(e) => {
            this.props.setPgn(this.state.text, this.state.text)
            this.setState({text: e.target.value});
          }}
          >
        </textarea>

        <div id="examples">
          <h3>PGN Examples</h3>
          {exampleGames.map((game) => (
            <CopyToClipboard
              key={game.name}
              text={game.pgn}
              onCopy={(e) => console.log(e)}
            >
              <button>
                <img src="public/clipboard.svg" />
                Copy {game.name}
              </button>
            </CopyToClipboard>
          ))}
        </div>
      </div>
    );

  }
}
