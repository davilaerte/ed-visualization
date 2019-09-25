import React, { Component } from 'react';
import MyCodeMirror from './MyCodeMirror';
import * as d3 from 'd3'
import './app.css';

class App extends Component {
  componentDidMount() {
        const width = 960;
    const height = 500;
    const colors = d3.scaleOrdinal(d3.schemeCategory10);

    const svg = d3.select('#visualization')
      .append('svg')
      .on('contextmenu', () => { d3.event.preventDefault(); })
      .attr('width', width)
      .attr('height', height);

    console.log("AQUIII!!!");
    console.log(svg);
    
    const nodes = [
      { id: 0, reflexive: false , x: 1 , y: 4},
      { id: 1, reflexive: true , x: 1 , y: 4},
      { id: 2, reflexive: false , x: 1 , y: 4}
    ];
    let lastNodeId = 2;
    const links = [
      { source: nodes[0], target: nodes[1], left: false, right: true },
      { source: nodes[1], target: nodes[2], left: false, right: true }
    ];

    const force = d3.forceSimulation()
                    .force('link', d3.forceLink().id((d) => d.id).distance(150))
                    .force('charge', d3.forceManyBody().strength(-500))
                    .force('x', d3.forceX(width / 2))
                    .force('y', d3.forceY(height / 2))
                    .on('tick', tick);
    
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

    const dragLine = svg.append('svg:path')
      .attr('class', 'link dragline hidden')
      .attr('d', 'M0,0L0,0');
    
    let path = svg.append('svg:g').selectAll('path');
    let circle = svg.append('svg:g').selectAll('g');

    // mouse event vars
    let selectedNode = null;
    let selectedLink = null;
    let mousedownLink = null;
    let mousedownNode = null;
    let mouseupNode = null;

    function resetMouseVars() {
      mousedownNode = null;
      mouseupNode = null;
      mousedownLink = null;
    }

    // update force layout (called automatically each iteration)
    function tick() {
      // draw directed edges with proper padding from node centers
      path.attr('d', (d) => {
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

      circle.attr('transform', (d) => `translate(${d.x},${d.y})`);
    }

    // update graph (called when needed)
    function restart() {
      // path (link) group
      path = path.data(links);

      // update existing links
      path.classed('selected', (d) => d === selectedLink)
        .style('marker-start', (d) => d.left ? 'url(#start-arrow)' : '')
        .style('marker-end', (d) => d.right ? 'url(#end-arrow)' : '');

      // remove old links
      path.exit().remove();

      // add new links
      path = path.enter().append('svg:path')
        .attr('class', 'link')
        .classed('selected', (d) => d === selectedLink)
        .style('marker-start', (d) => d.left ? 'url(#start-arrow)' : '')
        .style('marker-end', (d) => d.right ? 'url(#end-arrow)' : '')
        .on('mousedown', (d) => {
          if (d3.event.ctrlKey) return;

          // select link
          mousedownLink = d;
          selectedLink = (mousedownLink === selectedLink) ? null : mousedownLink;
          selectedNode = null;
          restart();
        })
        .merge(path);

      // circle (node) group
      // NB: the function arg is crucial here! nodes are known by id, not by index!
      circle = circle.data(nodes, (d) => d.id);

      // update existing nodes (reflexive & selected visual states)
      circle.selectAll('circle')
        .style('fill', (d) => (d === selectedNode) ? d3.rgb(colors(d.id)).brighter().toString() : colors(d.id))
        .classed('reflexive', (d) => d.reflexive);

      // remove old nodes
      circle.exit().remove();

      // add new nodes
      const g = circle.enter().append('svg:g');

      g.append('svg:circle')
        .attr('class', 'node')
        .attr('r', 12)
        .style('fill', (d) => (d === selectedNode) ? d3.rgb(colors(d.id)).brighter().toString() : colors(d.id))
        .style('stroke', (d) => d3.rgb(colors(d.id)).darker().toString())
        .classed('reflexive', (d) => d.reflexive)
        .on('mouseover', function (d) {
          if (!mousedownNode || d === mousedownNode) return;
          // enlarge target node
          d3.select(this).attr('transform', 'scale(1.1)');
        })
        .on('mouseout', function (d) {
          if (!mousedownNode || d === mousedownNode) return;
          // unenlarge target node
          d3.select(this).attr('transform', '');
        })
        .on('mousedown', (d) => {
          if (d3.event.ctrlKey) return;

          // select node
          mousedownNode = d;
          selectedNode = (mousedownNode === selectedNode) ? null : mousedownNode;
          selectedLink = null;

          // reposition drag line
          dragLine
            .style('marker-end', 'url(#end-arrow)')
            .classed('hidden', false)
            .attr('d', `M${mousedownNode.x},${mousedownNode.y}L${mousedownNode.x},${mousedownNode.y}`);

          restart();
        })
        .on('mouseup', function (d) {
          if (!mousedownNode) return;

          // needed by FF
          dragLine
            .classed('hidden', true)
            .style('marker-end', '');

          // check for drag-to-self
          mouseupNode = d;
          if (mouseupNode === mousedownNode) {
            resetMouseVars();
            return;
          }

          // unenlarge target node
          d3.select(this).attr('transform', '');

          // add link to graph (update if exists)
          // NB: links are strictly source < target; arrows separately specified by booleans
          const isRight = mousedownNode.id < mouseupNode.id;
          const source = isRight ? mousedownNode : mouseupNode;
          const target = isRight ? mouseupNode : mousedownNode;

          const link = links.filter((l) => l.source === source && l.target === target)[0];
          if (link) {
            link[isRight ? 'right' : 'left'] = true;
          } else {
            links.push({ source, target, left: !isRight, right: isRight });
          }

          // select new link
          selectedLink = link;
          selectedNode = null;
          restart();
        });

      // show node IDs
      g.append('svg:text')
        .attr('x', 0)
        .attr('y', 4)
        .attr('class', 'id')
        .text((d) => d.id);

      circle = g.merge(circle);

      // set the graph in motion
      force
        .nodes(nodes)
        .force('link').links(links);

      force.alphaTarget(0.3).restart();
    }

    function mousedown() {
      // because :active only works in WebKit?
      svg.classed('active', true);

      if (d3.event.ctrlKey || mousedownNode || mousedownLink) return;

      // insert new node at point
      const point = d3.mouse(this);
      const node = { id: ++lastNodeId, reflexive: false, x: point[0], y: point[1] };
      nodes.push(node);

      restart();
    }

    function mousemove() {
      if (!mousedownNode) return;

      // update drag line
      dragLine.attr('d', `M${mousedownNode.x},${mousedownNode.y}L${d3.mouse(this)[0]},${d3.mouse(this)[1]}`);
    }

    function mouseup() {
      if (mousedownNode) {
        // hide drag line
        dragLine
          .classed('hidden', true)
          .style('marker-end', '');
      }

      // because :active only works in WebKit?
      svg.classed('active', false);

      // clear mouse event vars
      resetMouseVars();
    }

    // app starts here
    svg.on('mousedown', mousedown)
      .on('mousemove', mousemove)
      .on('mouseup', mouseup);
    restart();
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
                <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                <button type="button" className="btn btn-primary">Save changes</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
