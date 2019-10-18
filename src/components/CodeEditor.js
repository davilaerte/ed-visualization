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
    this.codeMirrorOne = React.createRef();
    this.codeMirrorTwo = React.createRef();

    this.state = {
      line_4: 6,
      line_5: 9,
      line_6: 10
    }; 
  }
  updateLine = (line) => {
    if (line === 3) {
      this.setState({
        line_4: 5 + this.codeMirrorOne.current.getCodeMirror().doc.lineCount(),
        line_5: 8 + this.codeMirrorOne.current.getCodeMirror().doc.lineCount(),
        line_6: 9 + this.codeMirrorOne.current.getCodeMirror().doc.lineCount(),
      });
    } else {
      this.setState({
        line_6: 9 + this.codeMirrorTwo.current.getCodeMirror().doc.lineCount(),
      });
    }
  }
  
  render() {
    var options = {
		  lineNumbers: true,
      readOnly: "nocursor",
      viewportMargin: Infinity,
			mode: "text/x-java"
		};

    var optionsTwo = {
		  lineNumbers: true,
      readOnly: "nocursor",
      viewportMargin: Infinity,
      firstLineNumber: 3,
			mode: "text/x-java"
		};

    var optionsThree = {
		  lineNumbers: true,
      matchBrackets: true,
      readOnly: false,
      viewportMargin: Infinity,
      firstLineNumber: 5,
      smartIndent: false,
      extraKeys: {'Ctrl-Space': "autocomplete"},
			mode: "text/x-java"
		};

    var optionsFour = {
		  lineNumbers: true,
      readOnly: "nocursor",
      viewportMargin: Infinity,
      firstLineNumber: this.state.line_4,
      mode: "text/x-java"
		};

    var optionsFive = {
		  lineNumbers: true,
      matchBrackets: true,
      readOnly: false,
      viewportMargin: Infinity,
      firstLineNumber: this.state.line_5,
      smartIndent: false,
      extraKeys: {'Ctrl-Space': "autocomplete"},
			mode: "text/x-java"
		};

    var optionsSix = {
		  lineNumbers: true,
      readOnly: "nocursor",
      viewportMargin: Infinity,
      firstLineNumber: this.state.line_6,
      mode: "text/x-java"
		};

    return (
      <div>
        <CodeMirror ref="editor" value={"public class LinkedList implements ILinkedList {\n  \tprivate LinkedListNode head;"} options={options}/>
        <CodeMirror ref="editor" value={"\n\tpublic void insert(Integer element) {"} options={optionsTwo}/>
        <CodeMirror ref={this.codeMirrorOne} value={"\t\t/*Escreva seu código aqui*/"} onChange={this.updateLine.bind(this, 3)} options={optionsThree}/>
        <CodeMirror ref="editor" value={"\t}\n\n\tpublic void remove(Integer element) {"} options={optionsFour}/>
        <CodeMirror ref={this.codeMirrorTwo} value={"\t\t/*Escreva seu código aqui*/"} onChange={this.updateLine.bind(this, 5)} options={optionsFive}/>
        <CodeMirror ref="editor" value={"\t}\n\n\tpublic LinkedListNode getHead() {\n\t\treturn this.head;\n\t}\n}"} options={optionsSix}/>
      </div>
    );
  }
}

export default CodeEditor;