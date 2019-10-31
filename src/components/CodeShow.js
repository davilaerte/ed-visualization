import React, { Component } from 'react';
import CodeMirror from 'react-codemirror';
import 'codemirror/lib/codemirror.css'
import 'codemirror/addon/hint/show-hint.css'
import 'codemirror/mode/clike/clike.js'
import 'codemirror/addon/edit/matchbrackets.js'
import 'codemirror/addon/hint/show-hint.js'

class CodeShow extends Component {
  constructor(props) {
    super(props);

    this.state = {
      options: {
        lineNumbers: true, 
        readOnly: "nocursor", 
        matchBrackets: true,
        viewportMargin: Infinity,
        mode: "text/x-java"
      }
    };
  }
  
  render() {
    return (
      <div>
          <CodeMirror value={this.props.code} options={this.state.options}/>
      </div>
    );
  }
}

export default CodeShow;