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
      insertNumber: '',
      nodes: [{id: 1, name: "5"}, {id: 2, name: "8"}],
      links: [{source: 1, target: 2, left: false, right: true}],
      code: "public class LinkedList implements ILinkedList {\n  \tprivate LinkedListNode head;"
    };
  }

  click = () => {
    const nodes = [...this.state.nodes];
    const links = [...this.state.links];
    nodes.push({id: ++this.idCounter, name: this.state.insertNumber});
    links.push({source: this.idCounter - 1, target: this.idCounter, left: false, right: true});
    this.setState({nodes: nodes, links: links}, () => this.visualization.current.restart());
    this.setState({insertNumber: ''});
    /*request('/visualization?id=' + this.state.id, 'PUT', this.state.insertNumber, {
      "Content-Type": "application/json"
    }).then(response => {
      if (response.ok) {
        response.json().then(data => {
          const nodes = [...this.state.nodes];
          const links = [...this.state.links];
          data.nodes.forEach( node => {
            if (!this.containsObject(nodes, node)) {
              nodes.push(node);
            }
          });
          data.links.forEach( link => {
            if (!this.containsObject(links, link)) {
              links.push(link);
            }
          });
          this.setState({nodes: nodes, links: links}, () => this.restart());
          this.setState({insertNumber: ''});
        });
      }
    })*/
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
    request('/visualization', 'POST', this.state.code, {
      "Content-Type": "application/json"
    }).then(response => {
      if (response.ok) {
        response.text().then(data => {this.setState({id: data})});
      }
    })
  }

  updateCode = (newCode) => {
    this.setState({
		  code: newCode,
		});
  }

  updateInsertNumber = (event) => {
    const value = event.target.value;

    this.setState({
		  insertNumber: value,
		});
  }

  closeModal = () => {
    this.setState({nodes: [], links: []}, () => this.visualization.current.restart());
  }

  render() {
    return (
      <div>
        <div className="java-editor">
          <CodeEditor code={this.state.code} updateCode={this.updateCode.bind(this)} />
        </div>
        <div className="text-right btn-run">
          <button type="button" className="btn btn-success btn-lg" data-toggle="modal" data-target="#exampleModalCenter" data-backdrop="static" data-keyboard="false" onClick={this.sendCode.bind(this)}>Run >></button>
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
                <div className="input-group mb-3">
                  <input type="text" className="form-control" value={this.state.insertNumber} onChange={this.updateInsertNumber.bind(this)} />
                  <div className="input-group-append">
                    <button className="btn btn-outline-secondary" type="button" onClick={this.click.bind(this)}>Insert Element</button>
                  </div>
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