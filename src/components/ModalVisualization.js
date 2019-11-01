import React, { Component } from 'react';

class ModalVisualization extends Component {
  render() {
    return (
      <div className="modal fade" id={this.props.id} tabIndex="-1" role="dialog" aria-hidden="true">
        <div className="modal-dialog modal-xl" role="document">
          <div className="modal-content modal-visualization">
            <div className="modal-header">
              <h3 className="font-weight-light modal-title">Visualizar Implementação - {this.props.dsName}</h3>
              <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={this.props.closeModal.bind(this)}>
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              {this.props.children}
            </div>
            <div className="modal-footer">
              <div className="container-fluid">
                <form onSubmit={this.props.runMethod.bind(this)}>
                  <div className="form-row mt-2">
                    <div className="col-1"></div>
                    <label className="col-form-label col-2">Escolha uma ação:</label>
                    <div className="col-6">
                      <select className="custom-select" value={this.props.selectAction} onChange={this.props.updateSelectAction.bind(this)}>
                        {Object.keys(this.props.dsActions).map( (action, index) => <option key={index} value={action}>{this.props.dsActions[action].name}</option> )}
                        </select>
                    </div>
                    <div className="col-4"></div>
                  </div>
                  {this.props.selectAction !== 'DEFAULT' ? 
                    <div className="form-row mt-4">
                      <div className="col-3"></div>
                      {this.props.dsActions[this.props.selectAction].hasElement ? 
                        <div className="col-4">
                          <input value={this.props.inputElement} onChange={this.props.updateInputElement.bind(this)} type="number" className="form-control" placeholder="Elemento..."></input>
                        </div> : undefined
                      }
                      <div className={this.props.dsActions[this.props.selectAction].hasElement ? "col-2": "col-6"}>
                        <button type="submit" className="btn btn-dark btn-block" disabled={this.props.inputElement === ''}>{this.props.dsActions[this.props.selectAction].name}</button>
                      </div>
                      <div className="col-2"></div>
                      <div className="col-1">
                        {this.props.runLoading ? 
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
    );
  }
}

export default ModalVisualization;