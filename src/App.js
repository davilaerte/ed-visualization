import React, { Component } from 'react';
import MyCodeMirror from './MyCodeMirror';
import * as d3 from 'd3'
import './app.css';
import request from "./config.js"

class App extends Component {
  constructor(props) {
    super(props);
    
    this.colors = d3.scaleOrdinal(d3.schemeCategory10);
    this.force = null;
    this.path = null;
    this.circle = null;
    this.initGraph = this.initGraph.bind(this);

    this.state = {
      id: null,
      insertNumber: '',
      nodes: [],
      links: [],
      code: "public class LinkedList implements ILinkedList {\n  \tprivate Node head;\n  \t\n\tpublic void insert(Integer element) {\n\t\tif (this.head == null) {\n          this.head = new Node(element, null);\n\t\t} else {\n          \tNode node = this.head;\n        \twhile(node.next != null) {\n            \tnode = node.next;\n            }\n          \tnode.next = new Node(element, null);\n        }\n\t}\n  \t\n  \tpublic Node getHead() {\n\t\treturn this.head;\n\t}\n}"
    };
  }

  componentDidMount() {
    this.initGraph();
  }

  initGraph = () => {
    const width = 1100;
    const height = 700;

    const svg = d3.select('#visualization')
      .append('svg')
      .on('contextmenu', () => { d3.event.preventDefault(); })
      .attr('width', width)
      .attr('height', height);

    this.force = d3.forceSimulation()
      .force('link', d3.forceLink().id((d) => d.id).distance(150))
      .force("center", d3.forceCenter(width / 2, height / 2))
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
      .classed('reflexive', (d) => d.reflexive)
      .call(this.drag(this.force));

    g.append('svg:text')
      .attr('x', 0)
      .attr('y', 4)
      .attr('class', 'id')
      .text((d) => d.name);

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

  drag = simulation => {
    function dragstarted(d) {
      if (!d3.event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }
    
    function dragged(d) {
      d.fx = d3.event.x;
      d.fy = d3.event.y;
    }
    
    function dragended(d) {
      if (!d3.event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }
    
    return d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended);
  }

  click = () => {
    request('/visualization?id=' + this.state.id, 'PUT', this.state.insertNumber, {
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
    })
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
    this.setState({nodes: [], links: []}, () => this.restart());
  }

  render() {
    return (
      <div className="container">
        <div className="text-center">
          <h1>Visualização de Estuturas de Dados - Linked List</h1>
        </div>
        <div className="java-editor">
          <MyCodeMirror code={this.state.code} updateCode={this.updateCode.bind(this)} />
        </div>
        <div className="text-right btn-run">
          <button type="button" className="btn btn-success btn-lg" data-toggle="modal" data-target="#exampleModalCenter" data-backdrop="static" data-keyboard="false" onClick={this.sendCode.bind(this)}>Run >></button>
        </div>

        {/* modal */}
        <div className="modal fade" id="exampleModalCenter" tabindex="-1" role="dialog" aria-hidden="true">
          <div className="modal-dialog modal-xl modal-visualization" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title text-center">Visualização</h4>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={this.closeModal.bind(this)}>
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body" id="visualization">
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

export default App;
