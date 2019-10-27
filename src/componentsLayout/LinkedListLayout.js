import React, { Component } from 'react';
import CodeEditor from '../components/CodeEditor.js';
import '../styles/d3.css';
import request from "../config.js"
import Visualization from '../components/Visualization.js';

class LinkedListLayout extends Component {
  constructor(props) {
    super(props);
    this.visualization = React.createRef();
    this.idCounter = 2;

    this.state = {
      id: null,
      selectAction: 'DEFAULT',
      inputElement: '',
      dsActions: {DEFAULT: {name: "Ação..."}, INSERT: {name: "Inserir elemento", hasElement: true}, REMOVE: {name: "Remover elemento", hasElement: true}},
      nodes: [{id: 1, name: "5"}, {id: 2, name: "8"}, {id: 3, name: "7"}],
      links: [{source: 1, target: 2, left: false, right: true}, {source: 3, target: 1, left: false, right: true}, {source: 2, target: 1, left: false, right: true}],
      codeMethods: {insert: "\t\t/*Escreva seu código aqui*/", remove: "\t\t/*Escreva seu código aqui*/"},
      codeOptions: [{code:"public class LinkedList implements ILinkedList {\n  \tprivate LinkedListNode head;", isEdit: false, nLines: 2}, {code:"\n\tpublic void insert(Integer element) {", isEdit: false, nLines: 2}, {isEdit: true, method: "insert", nLines: 1}, {code:"\t}\n\n\tpublic void remove(Integer element) {", isEdit: false, nLines: 3}, {isEdit: true, method: "remove", nLines: 1}, {code:"\t}\n\n\tpublic LinkedListNode getHead() {\n\t\treturn this.head;\n\t}\n}", isEdit: false, nLines: 6}]
    };
  }

  containsObject = (list, obj) => {
    for(let i = 0; i < list.length; i++) {
      let keysObj = Object.keys(obj);
      let found = true;
      for(let j = 0; j < keysObj.length; j++) {
        if (list[i][keysObj[j]] !== obj[keysObj[j]]) {
          found = false;
        }
      }
      if (found)
        return true;
    }
  }

  sendCode = () => {
    request('/datas-structure-impl', 'POST', {implOptions: {tipo: "LINKED_LIST"}, implMethods: this.state.codeMethods}, {
      "Content-Type": "application/json"
    }).then(response => {
      if (response.ok) {
        response.json().then(data => this.setState({id: data.id}));
      } else {
        response.json().then(data => console.log(data));
      }
    })
  }

  updateCode = (method, newCode) => {
    let codeMethods = {...this.state.codeMethods};
    codeMethods[method] = newCode;
    this.setState({codeMethods: codeMethods});
  }

  updateSelectAction = (event) => {
    this.setState({selectAction: event.target.value});
  }

  updateInputElement = (event) => {
    this.setState({inputElement: event.target.value});
  }

  runMethod = (event) => {
    event.preventDefault();

    request('/datas-structure-impl', 'PUT', {options: {tipo: "LINKED_LIST", id: this.state.id}, nameMethod: this.state.selectAction, element: this.state.inputElement}, {
      "Content-Type": "application/json"
    }).then(response => {
      if (response.ok) {
        response.json().then(data => {
          this.setState({nodes: data.nodes, links: data.links}, () => this.visualization.current.restart());
          this.setState({inputElement: ''});
        });
      } else {
        response.json().then(data => console.log(data));
      }
    })
  }

  closeModal = () => {
    this.setState({selectAction: "DEFAULT", inputElement: ''});
    this.setState({nodes: [], links: []}, () => this.visualization.current.restart());
  }

  render() {
    return (
      <div>
        <div className="java-editor">
          <CodeEditor codeOptions={this.state.codeOptions} codeMethods={this.state.codeMethods} updateCode={this.updateCode.bind(this)} />
        </div>
        <div className="text-right btn-run">
          <button type="button" className="btn btn-success btn-lg" data-toggle="modal" data-target="#exampleModalCenter" data-backdrop="static" data-keyboard="false" onClick={this.sendCode.bind(this)}>Visualizar implementação</button>
        </div>

        {/* modal */}
        <div className="modal fade" id="exampleModalCenter" tabIndex="-1" role="dialog" aria-hidden="true">
          <div className="modal-dialog modal-xl modal-visualization" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title text-center">Visualização</h4>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={this.closeModal.bind(this)}>
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <Visualization ref={this.visualization} nodes={this.state.nodes} links={this.state.links}/>
              </div>
              <div className="modal-footer">
                <div className="container-fluid">
                  <form onSubmit={this.runMethod.bind(this)}>
                    <div className="form-row mt-2">
                      <div className="col-1"></div>
                      <label className="col-form-label col-2">Escolha uma ação:</label>
                      <div className="col-6">
                        <select className="custom-select" value={this.state.selectAction} onChange={this.updateSelectAction.bind(this)}>
                          {Object.keys(this.state.dsActions).map( (action, index) => <option key={index} value={action}>{this.state.dsActions[action].name}</option> )}
                        </select>
                      </div>
                      <div className="col-4"></div>
                    </div>
                    {this.state.selectAction !== 'DEFAULT' ? 
                      <div className="form-row mt-4">
                        <div className="col-3"></div>
                        {this.state.dsActions[this.state.selectAction].hasElement ? 
                          <div className="col-4">
                            <input value={this.state.inputElement} onChange={this.updateInputElement.bind(this)} type="number" className="form-control" placeholder="Elemento..."></input>
                          </div> : undefined
                        }
                        <div className={this.state.dsActions[this.state.selectAction].hasElement ? "col-2": "col-6"}>
                          <button type="submit" className="btn btn-dark btn-block" disabled={this.state.inputElement === ''}>{this.state.dsActions[this.state.selectAction].name}</button>
                        </div>
                      </div> : undefined}
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default LinkedListLayout;