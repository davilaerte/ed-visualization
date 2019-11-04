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
        <p className="mb-0">Implemente as operações de sua {this.props.dsName} usando o nó <strong>{this.props.dsNodeName}</strong></p>
        <br/>
        <h5>Como usar: </h5>
        <hr/>
        <p>Escreva os métodos de sua {this.props.dsName} no editor abaixo usando a liguagem de programação <strong>Java</strong>, após isso clique no botão <strong>Visualizar implementação</strong> para visualizar dinamicamente como as referências e nós de sua estrutura se comportam após alguma operação</p>
        <hr/>
        <p>Clique no botão <strong>Ver {this.props.dsNodeName}</strong> para visualizar a implementação do nó usado na {this.props.dsName}</p>
        <hr/>
        <p className="mb-0">Clique no botão <strong>Gerar implementação padrão</strong> para gerar a implementação padrão para os métodos da {this.props.dsName}</p>
        <br/>
        <h5>Observações: </h5>
        <hr/>
        <p>Somente é possivel editar o código dentro dos métodos da {this.props.dsName}</p>
        <hr/>
        <p className="mb-0">É possivel mover os nós dentro da visualização e assim reestruturar sua forma</p>
      </div>
    );
  }
}

export default DsAlert;