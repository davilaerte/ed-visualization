import React, { Component } from 'react';

class DsAlert extends Component {
  render() {
    return (
      <div className="alert alert-warning info-ds" role="alert">
        <h4 className="alert-heading">
            {`Implemente sua ${this.props.dsName}!`}
          <button type="button" className="close" data-dismiss="alert" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </h4>
        <p>Implemente as operações de sua {this.props.dsName} usando o nó <strong>{this.props.dsNodeName}</strong></p>
        <br/>
        <h5>Como usar: </h5>
        <hr/>
        <p>Escreva os métodos de sua {this.props.dsName} no editor abaixo, após isso clique no botão <strong>Visualizar implementação</strong> para visualizar dinamicamente como as referências e nós de sua estrutura se comportam após alguma operação</p>
        <hr/>
        <p>Clique no botão <strong>Ver {this.props.dsNodeName}</strong> para visualizar a implementação do nó usado na {this.props.dsName}</p>
        <hr/>
        <p className="mb-0">Clique no botão <strong>Gerar implementação</strong> para gerar a implementação default para os métodos da sua {this.props.dsName}</p>
      </div>
    );
  }
}

export default DsAlert;