import React, { Component } from 'react';
import CodeEditor from '../components/CodeEditor.js';
import CodeShow from '../components/CodeShow.js';
import request from "../config.js"
import Visualization from '../components/Visualization.js';
import DsAlert from '../components/DsAlert.js';
import ModalVisualization from '../components/ModalVisualization.js';
import ModalError from '../components/ModalError.js';
import $ from 'jquery';
import ModalWarning from '../components/ModalWarning.js';

class DsLayout extends Component {
  constructor(props) {
    super(props);
    this.visualization = React.createRef();
    this.codeEditor = React.createRef();

    this.getCodeMethods = this.getCodeMethods.bind(this);
    this.modalVisualizationId = "modalVisualization";
    this.modalErrorId = "modalError";
    this.modalWarningId = "modalWarning";
    this.maxSizeNodes = 40;
    this.maxSizeNodesMessage = "Não é possivel inserir mais nós, o tamanho maximo permitido de nós é " + this.maxSizeNodes;

    this.state = {
      id: null,
      runLoading: false,
      loading: false,
      nodeInfo: false,
      errorData: {message: ""},
      selectAction: 'DEFAULT',
      inputElement: '',
      nodes: [],
      links: [],
      codeMethods: this.getCodeMethods()
    };
  }

  getCodeMethods = () => {
    let codeMethods = {};
    this.props.methods.forEach(method => {
      codeMethods[method] = "\t\t/*Escreva seu código aqui*/";
    });
    return codeMethods;
  }

  sendCode = () => {
    if (!this.state.loading) {
      this.setState({loading: true}, () => {
        request('/datas-structure-impl', 'POST', {implOptions: {tipo: this.props.tipo, id: this.state.id}, implMethods: this.state.codeMethods}, {
          "Content-Type": "application/json"
        }).then(response => {
          this.setState({loading: false}, () => {
            if (response.ok) {
              $(`#${this.modalVisualizationId}`).modal({backdrop: "static", keyboard: false, show: true});
              response.json().then(data => this.setState({id: data.id}));
            } else {
              $(`#${this.modalErrorId}`).modal({backdrop: "static", keyboard: false, show: true});
              response.json().then(data => this.setState({errorData: data}));
            }
          });
        })
      });
    }
  }

  updateCode = (method, newCode, isDefaultCode) => {    
    if (isDefaultCode) {
      this.setState({codeMethods: this.props.defaultMethods});
    } else {
      let codeMethods = {...this.state.codeMethods};
      codeMethods[method] = newCode;
      
      this.setState({codeMethods: codeMethods});
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
    
    if (!this.state.runLoading) {
      if (!this.canInsert()) {
        $(`#${this.modalWarningId}`).modal({backdrop: "static", keyboard: false, show: true});
      } else {
        let inputElement = this.state.inputElement;

        this.setState({runLoading: true, inputElement: ''}, () => {
          request('/datas-structure-impl', 'PUT', {options: {tipo: this.props.tipo, id: this.state.id}, nameMethod: this.state.selectAction, element: inputElement}, {
            "Content-Type": "application/json"
          }).then(response => {
            this.setState({runLoading: false}, () => {
              if (response.ok) {
                response.json().then(data => {
                  this.setState({nodes: data.nodes, links: data.links}, () => this.visualization.current.restart());
                });
              } else {
                $(`#${this.modalErrorId}`).modal({backdrop: "static", keyboard: false, show: true});
                response.json().then(data => this.setState({errorData: data}));
              }
            });
          })
        });
      }
    }
  }

  closeModal = () => {
    if (!this.state.runLoading) {
      request('/datas-structure-impl', 'DELETE', {tipo: this.props.tipo, id: this.state.id}, {
        "Content-Type": "application/json"
      }).then(response => {
        console.log(response.status);
        $(`#${this.modalVisualizationId}`).modal("hide");
        this.setState({selectAction: "DEFAULT", inputElement: '', nodes: [], links: []}, () => this.visualization.current.restart());
      })
    }
  }

  openNodeInfo = () => {
    let nodeInfo = this.state.nodeInfo;
    this.setState({nodeInfo: !nodeInfo});
  }

  openDefaultMethods = () => {
    this.codeEditor.current.setMethodValues(this.props.defaultMethods);
  }

  canInsert = () => {
    return !(["INSERT", "INSERT_FIRST"].includes(this.state.selectAction) && this.state.nodes.length >= this.maxSizeNodes);
  }

  render() {
    return (
      <div>
        <DsAlert dsName={this.props.dsName} dsNodeName={this.props.dsNodeName} />
        {this.state.nodeInfo ? 
          <div className="java-code">
            <CodeShow code={this.props.codeNode} />
          </div>:undefined}
        <div className="java-editor">
          <CodeEditor ref={this.codeEditor} codeOptions={this.props.codeOptions} codeMethods={this.state.codeMethods} updateCode={this.updateCode.bind(this)} />
        </div>
        <div className="row mb-5">
          <div className="col-4 text-left">
            <button type="button" className="btn btn-info btn-lg btn-node" onClick={this.openNodeInfo.bind(this)}>
              <span className="ml-5"></span>
              {`${this.state.nodeInfo ? 'Ocultar':'Ver'} ${this.props.dsNodeName}`}
              <span className="mr-5"></span>
            </button>
          </div>
          <div className="col-4 text-center">
            <button type="button" className="btn btn-secondary btn-lg" onClick={this.openDefaultMethods.bind(this)}>
                <span className="ml-5"></span>
                Gerar implementação padrão
                <span className="mr-5"></span>
              </button>
          </div>
          <div className="col-4 text-right">
            <button type="button" className="btn btn-success btn-lg btn-run" onClick={this.sendCode.bind(this)} disabled={this.state.loading}>
              {this.state.loading ? <span className="spinner-border spinner-border-sm mr-4" role="status" aria-hidden="true"></span>:<span className="ml-5"></span>}
              Visualizar implementação
              <span className="mr-5"></span>
            </button>
          </div>
        </div>

        <ModalVisualization id={this.modalVisualizationId} dsActions={this.props.dsActions} inputElement={this.state.inputElement} runLoading={this.state.runLoading} selectAction={this.state.selectAction} dsName={this.props.dsName} updateInputElement={this.updateInputElement.bind(this)} closeModal={this.closeModal.bind(this)} runMethod={this.runMethod.bind(this)} updateSelectAction={this.updateSelectAction.bind(this)}>
          <Visualization ref={this.visualization} nodes={this.state.nodes} links={this.state.links}/>
        </ModalVisualization>
        <ModalWarning id={this.modalWarningId} message={this.maxSizeNodesMessage} />
        <ModalError id={this.modalErrorId} errorData={this.state.errorData} />
      </div>
    );
  }
}

export default DsLayout;