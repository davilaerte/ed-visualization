import React, { Component } from 'react';
import CodeMirror from 'react-codemirror';
import 'codemirror/lib/codemirror.css'
import 'codemirror/addon/hint/show-hint.css'
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
    let indexMethods = {};

    this.props.codeOptions.reduce((accLines, opt, index) => {
      lines["line_" + index] = accLines;
      lines["base_line_" + index] = accLines;

      if (opt.isEdit) {
        this["codeMirror_" + index] = React.createRef();
        indexMethods[opt.method] = index;
      }

      return accLines + opt.nLines;
    }, 1);

    this.setState(lines);
    this.setState({indexMethods});
  }

  updateLineAndCode = (line, method, isDefaultCode, newCode) => {
    let lines = {};

    for (let i = line + 1; i < this.props.codeOptions.length; i++) {
      lines["line_" + i] = this.state["base_line_" + i] + this.getNumberLinesAdd(i);
    }

    this.setState(lines, () => {
      this.props.updateCode(method, newCode, isDefaultCode);
    });
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

  setMethodValues = (methodValues) => {
    let method;
    for (method in methodValues) {
      let indexMethod = this.state.indexMethods[method];
      this["codeMirror_" + indexMethod].current.getCodeMirror().doc.setValue(methodValues[method]);
    }

    let minIndexMethod = Math.min(...Object.values(this.state.indexMethods));
    this.updateLineAndCode(minIndexMethod, null, true, null);
  }
  
  render() {
    return (
      <div>
        {this.props.codeOptions.map((elem, index) =>
          elem.isEdit ? <CodeMirror key={index} ref={this["codeMirror_" + index]} value={this.props.codeMethods[elem.method]} onChange={this.updateLineAndCode.bind(this, index, elem.method, false)} options={this.getOptionsLine(index, elem.isEdit)}/>:<CodeMirror key={index} value={elem.code} options={this.getOptionsLine(index, elem.isEdit)}/>
        )}
      </div>
    );
  }
}

export default CodeEditor;