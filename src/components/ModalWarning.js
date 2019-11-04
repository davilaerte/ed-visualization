import React, { Component } from 'react';

class ModalWarning extends Component {
  render() {
    return (
      <div className="modal fade" id={this.props.id} role="dialog" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
          <div className="modal-content modal-warning">
            <div className="modal-header">
              <h4 className="modal-title modal-warning-title">{`Atenção!`}</h4>
              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <p className="font-italic">{this.props.message}</p>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-success" data-dismiss="modal">Ok</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ModalWarning;