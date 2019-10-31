import React, { Component } from 'react';
import CodeEditor from '../components/CodeEditor.js';
import CodeShow from '../components/CodeShow.js';
import '../styles/d3.css';
import request from "../config.js"
import Visualization from '../components/Visualization.js';
import $ from 'jquery';

class LinkedListLayout extends Component {
  constructor(props) {
    super(props);
    this.visualization = React.createRef();
    this.codeEditor = React.createRef();

    this.defaultMethods = {insert: "\t\tif (this.head == null) {\n\t\t\tthis.head = new LinkedListNode(element, null);\n\t\t} else {\n\t\t\tLinkedListNode node = this.head;\n\t\t\twhile(node.next != null) {\n\t\t\t\tnode = node.next;\n\t\t\t}\n\t\t\tnode.next = new LinkedListNode(element, null);\n\t\t}", remove: "\t\t/*E*/"};

    this.state = {
      codeNode: "public class LinkedListNode {\n\n\tpublic Integer data;\n\tpublic LinkedListNode next;\n\n\tpublic LinkedListNode() {\n\t}\n\n\tpublic LinkedListNode(Integer data, LinkedListNode next) {\n\t\tthis.data = data;\n\t\tthis.next = next;\n\t}\n}",
      runLoading: false,
      loading: false,
      nodeInfo: false,
      errorData: {message: ""},
      selectAction: 'DEFAULT',
      inputElement: '',
      dsActions: {DEFAULT: {name: "Ação..."}, INSERT: {name: "Inserir elemento", hasElement: true}, REMOVE: {name: "Remover elemento", hasElement: true}},
      nodes: [{id: 1, name: "5", label: "HEAD"}, {id: 2, name: "8"}, {id: 3, name: "7", label: "TAIL"}],
      links: [{source: 1, target: 2, left: false, right: true, label: "next"}, {source: 1, target: 2, left: false, right: true, label: "prev"}, {source: 3, target: 1, left: false, right: true, label: "next"}, {source: 2, target: 1, left: false, right: true, label: "prev"}, {source: 2, target: 1, left: false, right: true, label: "next"}, {source: 1, target: 1, left: false, right: true, label: "next"}, {source: 1, target: 1, left: false, right: true, label: "prev"}],
      lineMethods: {insert: 5, remove: 9},
      codeMethods: {insert: "\t\t/*Escreva seu código aqui*/", remove: "\t\t/*Escreva seu código aqui*/"},
      codeOptions: [{code:"public class LinkedList implements ILinkedList {\n  \tprivate LinkedListNode head;", isEdit: false, nLines: 2}, {code:"\n\tpublic void insert(Integer element) {", isEdit: false, nLines: 2}, {isEdit: true, method: "insert", nLines: 1}, {code:"\t}\n\n\tpublic void remove(Integer element) {", isEdit: false, nLines: 3}, {isEdit: true, method: "remove", nLines: 1}, {code:"\t}\n\n\tpublic LinkedListNode getHead() {\n\t\treturn this.head;\n\t}\n}", isEdit: false, nLines: 6}]
    };
  }

  sendCode = () => {
    this.setState({loading: true}, () => {
      request('/datas-structure-impl', 'POST', {implOptions: {tipo: "LINKED_LIST"}, implMethods: this.state.codeMethods}, {
        "Content-Type": "application/json"
      }).then(response => {
        this.setState({loading: false}, () => {
          if (response.ok) {
            $('#modalVisualization').modal({backdrop: "static", keyboard: false, show: true});
            response.json().then(data => this.setState({id: data.id}));
          } else {
            $('#modalError').modal({backdrop: "static", keyboard: false, show: true});
            response.json().then(data => this.setState({errorData: data}));
          }
        });
      })
    });
  }

  updateCode = (method, newCode, lineMethodsUpdate, isDefaultCode) => {    
    let lineMethods = {...this.state.lineMethods};
    let methodLine;
    for (methodLine in lineMethodsUpdate) {
      lineMethods[methodLine] = lineMethodsUpdate[methodLine];
    }

    if (isDefaultCode) {
      this.setState({codeMethods: this.defaultMethods, lineMethods: lineMethods});
    } else {
      let codeMethods = {...this.state.codeMethods};
      codeMethods[method] = newCode;
      
      this.setState({codeMethods: codeMethods, lineMethods: lineMethods});
    }
  }

  updateSelectAction = (event) => {
    this.setState({selectAction: event.target.value});
  }

  updateInputElement = (event) => {
    this.setState({inputElement: event.target.value});
  }

  runMethod = (event) => {
    event.preventDefault();
    let inputElement = this.state.inputElement;

    this.setState({runLoading: true, inputElement: ''}, () => {
      request('/datas-structure-impl', 'PUT', {options: {tipo: "LINKED_LIST", id: this.state.id}, nameMethod: this.state.selectAction, element: inputElement}, {
        "Content-Type": "application/json"
      }).then(response => {
        this.setState({runLoading: false}, () => {
          if (response.ok) {
            response.json().then(data => {
              this.setState({nodes: data.nodes, links: data.links}, () => this.visualization.current.restart());
            });
          } else {
            $('#modalError').modal({backdrop: "static", keyboard: false, show: true});
            response.json().then(data => this.setState({errorData: data}, () => console.log(this)));
          }
        });
      })
    });
  }

  closeModal = () => {
    this.setState({selectAction: "DEFAULT", inputElement: ''});
    this.setState({nodes: [], links: []}, () => this.visualization.current.restart());
  }

  openNodeInfo = () => {
    let nodeInfo = this.state.nodeInfo;
    this.setState({nodeInfo: !nodeInfo});
  }

  openDefaultMethods = () => {
    this.codeEditor.current.setMethodValues(this.defaultMethods);
  }

  render() {
    return (
      <div>
        <div className="alert alert-warning info-ds" role="alert">
          <h4 className="alert-heading">
            Implemente sua LinkedList!
            <button type="button" className="close" data-dismiss="alert" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </h4>
          <p>Implemente as operações de sua LinkedList usando o nó <strong>LinkedListNode</strong></p>
          <br/>
          <h5>Como usar: </h5>
          <hr/>
          <p>Escreva os métodos de sua LinkedList no editor abaixo, após isso clique no botão <strong>Visualizar implementação</strong> para visualizar dinamicamente como as referências e nós de sua estrutura se comportam após alguma operação</p>
          <hr/>
          <p>Clique no botão <strong>Ver LinkedListNode</strong> para visualizar a implementação do nó usado na LinkedList</p>
          <hr/>
          <p className="mb-0">Clique no botão <strong>Gerar implementação</strong> para gerar a implementação default para os métodos da sua LinkedList</p>
        </div>
        {this.state.nodeInfo ? 
          <div className="java-code">
            <CodeShow code={this.state.codeNode} />
          </div>:undefined}
        <div className="java-editor">
          <CodeEditor ref={this.codeEditor} codeOptions={this.state.codeOptions} codeMethods={this.state.codeMethods} updateCode={this.updateCode.bind(this)} />
        </div>
        <div className="row mb-5">
          <div className="col-4 text-left">
            <button type="button" className="btn btn-info btn-lg btn-node" onClick={this.openNodeInfo.bind(this)}>
              <span className="ml-5"></span>
              {`${this.state.nodeInfo ? 'Ocultar':'Ver'} LinkedListNode`}
              <span className="mr-5"></span>
            </button>
          </div>
          <div className="col-4 text-center">
            <button type="button" className="btn btn-secondary btn-lg" onClick={this.openDefaultMethods.bind(this)}>
                <span className="ml-5"></span>
                Gerar implementação
                <span className="mr-5"></span>
              </button>
          </div>
          <div className="col-4 text-right">
            <button type="button" className="btn btn-success btn-lg btn-run" onClick={this.sendCode.bind(this)}>
              {this.state.loading ? <span className="spinner-border spinner-border-sm mr-4" role="status" aria-hidden="true"></span>:<span className="ml-5"></span>}
              Visualizar implementação
              <span className="mr-5"></span>
            </button>
          </div>
        </div>

        {/* Modal Visualization */}
        <div className="modal fade" id="modalVisualization" tabIndex="-1" role="dialog" aria-hidden="true">
          <div className="modal-dialog modal-xl" role="document">
            <div className="modal-content modal-visualization">
              <div className="modal-header">
                <h3 className="font-weight-light modal-title">Visualizar Implementação - Linked List</h3>
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
                        <div className="col-2"></div>
                        <div className="col-1">
                          {this.state.runLoading ? 
                            <div className="spinner-border text-dark" role="status">
                              <span className="sr-only">Loading...</span>
                            </div>:undefined}
                        </div>
                      </div> : undefined}
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/*Modal Error*/}
        <div className="modal fade" id="modalError" role="dialog" aria-hidden="true">
          <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
            <div className="modal-content modal-error">
              <div className="modal-header">
                <h4 className="modal-title modal-error-title">{`Falha ao tentar ${this.state.errorData.errorType === "COMPILATION" ? "compilar":"executar"} o código!`}</h4>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <div className="wrap-error">
                  <h5><p>Os seguintes erros foram encontrados: </p></h5>
                  <p className="font-italic text-error" style={{width: (this.state.errorData.message.length * 0.2) + "rem"}}>
                    {this.state.errorData.message}
                  </p>

                  {this.state.errorData.stackTrace != null ? 
                  <div>
                    <br/>
                    <h5><p>Informações sobre o erro: </p></h5>
                    <p className="font-italic text-error">
                      {`Método: ${this.state.errorData.stackTrace.methodName}`}<br/>
                      {`Line: ${(this.state.lineMethods[this.state.errorData.stackTrace.methodName] - 1) + this.state.errorData.stackTrace.lineNumber}`}
                    </p>
                  </div>:undefined}
                </div>

              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-danger" data-dismiss="modal">Close</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default LinkedListLayout;