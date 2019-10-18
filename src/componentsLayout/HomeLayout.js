import React, { Component } from 'react';

class HomeLayout extends Component {
  render() {
    return (
      <div>
        <h1 className="font-weight-lighter">VisuED</h1>
        <h2 className="font-weight-lighter">Implemente e visualize estruturas de dados</h2>
        <div className="row">
          <div className="card text-white bg-dark border-info ml-3 mt-5 ds-card">
            <div className="card-body">
              <h5 className="card-title">Linked List</h5>
              <p className="card-text">Lista composta por nodes que contém uma referência que aponta para o próximo elemento.</p>
            </div>
            <div className="card-footer">
              <button className="btn btn-primary" onClick={this.props.changePath.bind(this, "/linkedList")}>Implementar e Visualizar</button>
            </div>
          </div>
          <div className="card text-white bg-dark border-danger ml-3 mt-5 ds-card">
            <div className="card-body">
              <h5 className="card-title">Double Linked List</h5>
              <p className="card-text">Lista composta por nodes que contém duas referências, uma que aponta para o próximo elemento e outra referência que aponta para o elemento anterior.</p>
            </div>
            <div className="card-footer">
              <button className="btn btn-primary" onClick={this.props.changePath.bind(this, "/doubleLinkedList")}>Implementar e Visualizar</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default HomeLayout;