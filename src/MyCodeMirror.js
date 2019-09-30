import React, { Component } from 'react';
import CodeMirror from 'react-codemirror';
import 'codemirror/lib/codemirror.css'
import 'codemirror/addon/hint/show-hint.css'
import 'codemirror/theme/eclipse.css'
import 'codemirror/mode/clike/clike.js'
import 'codemirror/addon/edit/matchbrackets.js'
import 'codemirror/addon/hint/show-hint.js'

class MyCodeMirror extends Component {
  render() {
    var options = {
		  lineNumbers: true,
      matchBrackets: true,
      extraKeys: {'Ctrl-Space': "autocomplete"},
			mode: "text/x-java"
		};

    return (
      <CodeMirror ref="editor" value={this.props.code} onChange={this.props.updateCode} options={options}/>
    );
  }
}

export default MyCodeMirror;