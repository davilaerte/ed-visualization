import React, { Component } from 'react';
import CodeMirror from 'react-codemirror';
import 'codemirror/lib/codemirror.css'
import 'codemirror/addon/hint/show-hint.css'
import 'codemirror/theme/eclipse.css'
import 'codemirror/mode/clike/clike.js'
import 'codemirror/addon/edit/matchbrackets.js'
import 'codemirror/addon/hint/show-hint.js'

class CodeEditor extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidMount() {
    this.startLines();
  }

  startLines = () => {
    let lines = {};

    this.props.codeOptions.reduce((accLines, opt, index) => {
      lines["line_" + index] = accLines;
      lines["base_line_" + index] = accLines;

      if (opt.isEdit) {
        this["codeMirror_" + index] = React.createRef();
      }

      return accLines + opt.nLines;
    }, 1);

    this.setState(lines);
  }

  updateLine = (line) => {
    let lines = {};

    for (let i = line + 1; i < this.props.codeOptions.length; i++) {
      lines["line_" + i] = this.state["base_line_" + i] + this.getNumberLinesAdd(i);
    }

    this.setState(lines);
  }

  getNumberLinesAdd = (line) => {
    let nLinesAdd = 0;

    for (let i = 0; i < line; i++) {
      if (this.props.codeOptions[i].isEdit) {
        nLinesAdd += this["codeMirror_" + i].current.getCodeMirror().doc.lineCount() - 1;
      }
    }

    return nLinesAdd;
  }

  getOptionsLine = (line, isEdit) => {
    let options = {
      lineNumbers: true, 
      readOnly: "nocursor", 
      viewportMargin: Infinity,
      firstLineNumber: this.state["line_" + line],
      mode: "text/x-java"
    }

    if (isEdit) {
      options.matchBrackets = true;
      options.readOnly = false;
      options.smartIndent = false;
      options.extraKeys = {'Ctrl-Space': "autocomplete"};
    }

    return options;
  }
  
  render() {
    return (
      <div>
        {this.props.codeOptions.map((elem, index) =>
          elem.isEdit ? <CodeMirror key={index} ref={this["codeMirror_" + index]} value={elem.code} onChange={this.updateLine.bind(this, index)} options={this.getOptionsLine(index, elem.isEdit)}/>:<CodeMirror key={index} value={elem.code} options={this.getOptionsLine(index, elem.isEdit)}/>
        )}
      </div>
    );
  }
}

export default CodeEditor;