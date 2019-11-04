import React, { Component } from 'react';

class ModalError extends Component {
  render() {
    return (
      <div className="modal fade" id={this.props.id} role="dialog" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
          <div className="modal-content modal-error">
            <div className="modal-header">
              <h4 className="modal-title modal-error-title">{`Falha ao tentar ${this.props.errorData.errorType === "COMPILATION" ? "compilar":"executar"} o código!`}</h4>
              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <div className="wrap-error">
                <h5><p>Os seguintes erros foram encontrados: </p></h5>
                <p className="font-italic text-error" style={{width: (this.props.errorData.message.length * 0.2) + "rem"}}>
                  {this.props.errorData.message}
                </p>

                {this.props.errorData.stackTrace != null || this.props.errorData.methodName !=null ? 
                <div>
                  <br/>
                  <h5><p>Informações sobre o erro: </p></h5>
                  <p className="font-italic text-error">
                    {`Método: ${this.props.errorData.methodName || this.props.errorData.stackTrace.methodName}`}<br/>
                    {this.props.errorData.methodName != null ? '':`Linha: ${this.props.errorData.stackTrace.lineNumber}`}
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
    );
  }
}

export default ModalError;