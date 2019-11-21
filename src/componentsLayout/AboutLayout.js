import React, { Component } from 'react';

class AboutLayout extends Component {
  render() {
    return (
      <div>
        <div className="container">
          <h1 className="font-weight-lighter">VisuED</h1>
          <h2 className="font-weight-lighter">Implemente e visualize estruturas de dados</h2>
          <p>
            O VisuED é uma ferramenta online que permite a implementação e visualização de listas ligadas de forma dinâmica, para assim possibilitar ao usuário um maior entendimento prático sobre as manipulações de referências das listas ligadas. A ferramenta foi criada por <a href="https://github.com/davilaerte" target="_blank" rel="noopener noreferrer">Davi Laerte</a>, aluno do curso de Ciência da Computação na UFCG.
          </p>
          <h6 class="text-center"><a href="https://github.com/davilaerte/ed-visualization"  target="_blank" rel="noopener noreferrer">Link Para Repositório Do Site.</a></h6>
        </div>
      </div>
    );
  }
}

export default AboutLayout;