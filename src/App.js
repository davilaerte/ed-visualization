import React, { Component } from 'react';
import MyCodeMirror from './MyCodeMirror';
import * as d3 from 'd3'
import './app.css';

class App extends Component {
  constructor(props) {
    super(props);
    
    this.colors = d3.scaleOrdinal(d3.schemeCategory10);
    this.force = null;
    this.path = null;
    this.circle = null;
    this.lastNodeId = 2;
    this.initGraph = this.initGraph.bind(this);

    this.state = {
      nodes: [
        { id: 0, name: "d", reflexive: false , x: 1 , y: 4},
        { id: 1, name: "b", reflexive: true , x: 1 , y: 4},
        { id: 2, name: "v", reflexive: false , x: 1 , y: 4}
      ],
      links: [
        { source: 0, target: 1, left: false, right: true }
      ]
    };
  }

  componentDidMount() {
    this.initGraph();
  }

  initGraph = () => {
    const width = 960;
    const height = 500;

    const svg = d3.select('#visualization')
      .append('svg')
      .on('contextmenu', () => { d3.event.preventDefault(); })
      .attr('width', width)
      .attr('height', height);

    this.force = d3.forceSimulation()
      .force('link', d3.forceLink().id((d) => d.id).distance(150))
      .force('charge', d3.forceManyBody().strength(-500))
      .force('x', d3.forceX(width / 2))
      .force('y', d3.forceY(height / 2))
      .on('tick', this.tick);
    
    svg.append('svg:defs').append('svg:marker')
      .attr('id', 'end-arrow')
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 6)
      .attr('markerWidth', 3)
      .attr('markerHeight', 3)
      .attr('orient', 'auto')
    .append('svg:path')
      .attr('d', 'M0,-5L10,0L0,5')
      .attr('fill', '#000');

    svg.append('svg:defs').append('svg:marker')
      .attr('id', 'start-arrow')
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 4)
      .attr('markerWidth', 3)
      .attr('markerHeight', 3)
      .attr('orient', 'auto')
    .append('svg:path')
      .attr('d', 'M10,-5L0,0L10,5')
      .attr('fill', '#000');
    
    this.path = svg.append('svg:g').selectAll('path');
    this.circle = svg.append('svg:g').selectAll('g');

    this.restart();
  }

  restart = () => {
    this.path = this.path.data(this.state.links);

    this.path.style('marker-start', (d) => d.left ? 'url(#start-arrow)' : '')
      .style('marker-end', (d) => d.right ? 'url(#end-arrow)' : '');

    this.path.exit().remove();

    this.path = this.path.enter().append('svg:path')
      .attr('class', 'link')
      .style('marker-start', (d) => d.left ? 'url(#start-arrow)' : '')
      .style('marker-end', (d) => d.right ? 'url(#end-arrow)' : '')
      .merge(this.path);
    console.log("QQUII");
    console.log(this.state.nodes)
    this.circle = this.circle.data(this.state.nodes, (d) => d.id);

    this.circle.selectAll('circle')
      .style('fill', (d) => this.colors(d.id))
      .classed('reflexive', (d) => d.reflexive);

    this.circle.exit().remove();

    const g = this.circle.enter().append('svg:g');

    g.append('svg:circle')
      .attr('class', 'node')
      .attr('r', 12)
      .style('fill', (d) => this.colors(d.id))
      .style('stroke', (d) => d3.rgb(this.colors(d.id)).darker().toString())
      .classed('reflexive', (d) => d.reflexive);

    g.append('svg:text')
      .attr('x', 0)
      .attr('y', 4)
      .attr('class', 'id')
      .text((d) => d.id);

    this.circle = g.merge(this.circle);

    this.force
      .nodes(this.state.nodes)
      .force('link').links(this.state.links);

    this.force.alphaTarget(0.3).restart();
  }

  tick = () => {
    this.path.attr('d', (d) => {
      const deltaX = d.target.x - d.source.x;
      const deltaY = d.target.y - d.source.y;
      const dist = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      const normX = deltaX / dist;
      const normY = deltaY / dist;
      const sourcePadding = d.left ? 17 : 12;
      const targetPadding = d.right ? 17 : 12;
      const sourceX = d.source.x + (sourcePadding * normX);
      const sourceY = d.source.y + (sourcePadding * normY);
      const targetX = d.target.x - (targetPadding * normX);
      const targetY = d.target.y - (targetPadding * normY);

      return `M${sourceX},${sourceY}L${targetX},${targetY}`;
    });

    this.circle.attr('transform', (d) => `translate(${d.x},${d.y})`);
  }

  click = () => {
    const link = {source: this.lastNodeId, target: ++this.lastNodeId, left: false, right: true };
    const node = { id: this.lastNodeId, reflexive: false, x: 1, y: 4 };
    const links = [...this.state.links];
    const nodes = [...this.state.nodes]; 
    links.push(link);
    nodes.push(node);
    this.setState({nodes: nodes, links: links}, () => this.restart());
  }

  render() {
    return (
      <div className="container">
        <div className="text-center">
          <h1>Visualização de Estuturas de Dados</h1>
        </div>
        <div className="java-editor">
          <MyCodeMirror />
        </div>
        <div className="text-right btn-run">
          <button type="button" className="btn btn-success btn-lg" data-toggle="modal" data-target="#exampleModalCenter">Run >></button>
        </div>

        {/* modal */}
        <div className="modal fade" id="exampleModalCenter" tabindex="-1" role="dialog" aria-hidden="true">
          <div className="modal-dialog modal-xl modal-visualization" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title text-center">Visualização</h4>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body" id="visualization">
              </div>
              <div className="modal-footer">
                <div className="input-group mb-3">
                  <input type="text" className="form-control" placeholder="Recipient's username" aria-label="Recipient's username" aria-describedby="basic-addon2" />
                  <div className="input-group-append">
                    <button className="btn btn-outline-secondary" type="button" onClick={this.click.bind(this)}>Button</button>
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

export default App;
