import React, { Component } from 'react';
import CodeEditor from '../components/CodeEditor.js';

class DoubleLinkedListLayout extends Component {
  constructor(props) {
    super(props);

    this.state = {
      codeMethods: {insert: "\t\t/*Escreva seu código aqui*/", remove: "\t\t/*Escreva seu código aqui*/", insertFirst: "\t\t/*Escreva seu código aqui*/", removeFirst: "\t\t/*Escreva seu código aqui*/", removeLast: "\t\t/*Escreva seu código aqui*/"},
      codeOptions: [{code:"public class DoubleLinkedList implements IDoubleLinkedList {\n  \tprivate DoubleLinkedListNode head;", isEdit: false, nLines: 2}, {code:"\n\tpublic void insert(Integer element) {", isEdit: false, nLines: 2}, {isEdit: true, method: "insert", nLines: 1}, {code:"\t}\n\n\tpublic void remove(Integer element) {", isEdit: false, nLines: 3}, {isEdit: true, method: "remove", nLines: 1}, {code:"\t}\n\n\tpublic void insertFirst(Integer element) {", isEdit: false, nLines: 3}, {isEdit: true, method: "insertFirst", nLines: 1}, {code:"\t}\n\n\tpublic void removeFirst() {", isEdit: false, nLines: 3}, {isEdit: true, method: "removeFirst", nLines: 1}, {code:"\t}\n\n\tpublic void removeLast() {", isEdit: false, nLines: 3}, {isEdit: true, method: "removeLast", nLines: 1}, {code:"\t}\n\n\tpublic DoubleLinkedListNode getHead() {\n\t\treturn this.head;\n\t}\n}", isEdit: false, nLines: 6}]
    };
  }

  updateCode = (method, newCode) => {
    let codeMethods = {...this.state.codeMethods};
    codeMethods[method] = newCode;
    this.setState({codeMethods: codeMethods});
  }

  render() {
    return (
      <div>
        <div className="java-editor">
          <CodeEditor codeOptions={this.state.codeOptions} codeMethods={this.state.codeMethods} updateCode={this.updateCode.bind(this)} />
        </div>
        <div className="text-right btn-run">
          <button type="button" className="btn btn-success btn-lg" data-toggle="modal" data-target="#exampleModalCenter" data-backdrop="static" data-keyboard="false">Run >></button>
        </div>
      </div>
    );
  }
}

export default DoubleLinkedListLayout;