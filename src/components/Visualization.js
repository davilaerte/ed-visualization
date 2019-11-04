import React, { Component } from 'react';
import * as d3 from 'd3'
import '../styles/d3.css';

class Visualization extends Component {
  constructor(props) {
    super(props);
    
    this.colors = d3.scaleOrdinal(d3.schemeCategory10);
    this.force = null;
    this.path = null;
    this.circle = null;
    this.initGraph = this.initGraph.bind(this);

    this.nodes = [];

    this.nodeInitX = 55;
    this.nodeInitY = 70;
    this.stepX = 140;
    this.stepY = 110;
    this.nodesPerLine = 8;
    this.nodeFinalX = this.nodeInitX + ((this.nodesPerLine - 1) * this.stepX);
  }

  componentDidMount() {
    this.initGraph();
  }

  initGraph = () => {
    const width = 1100;
    const height = 600;

    const svg = d3.select('#visualization')
      .append('svg')
      .on('contextmenu', () => { d3.event.preventDefault(); })
      .attr('width', width)
      .attr('height', height);

    this.force = d3.forceSimulation()
      .force('link', d3.forceLink().id((d) => d.id).distance(150))
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
    this.labels = svg.append('svg:g').selectAll('text');
    this.labelsNodes = svg.append('svg:g').selectAll('text');

    this.restart();
  }

  restart = () => {
    this.path = this.path.data(this.props.links, (d) => `${d.source.id}-${d.target.id}-${d.label}`);

    this.path.style('marker-start', (d) => d.left ? 'url(#start-arrow)' : '')
      .style('marker-end', (d) => d.right ? 'url(#end-arrow)' : '');

    this.path.exit().remove();

    const p = this.path.enter().append('svg:path')
      .attr('class', 'link')
      .style('marker-start', (d) => d.left ? 'url(#start-arrow)' : '')
      .style('marker-end', (d) => d.right ? 'url(#end-arrow)' : '')

    p.append("title")
      .text((d) => d.label);

    this.path = p.merge(this.path);
    
    this.nodes = this.getNodesWithPosition();

    this.circle = this.circle.data(this.nodes, (d) => `${d.id}-${d.name}`);
    
    this.circle.exit().remove();

    const g = this.circle.enter().append('svg:g');

    g.append('svg:circle')
      .attr('class', 'node')
      .attr('r', 15)
      .style('fill', (d) => this.colors(d.id))
      .style('stroke', (d) => d3.rgb(this.colors(d.id)).darker().toString());

    g.append('svg:text')
      .attr('x', 0)
      .attr('y', 4)
      .attr('class', 'id')
      .text((d) => d.name);
    
    g.call(this.drag());

    this.circle = g.merge(this.circle);

    this.labels = this.labels.data(this.props.links, (d) => `${d.source.id}-${d.target.id}-${d.label}`);

    this.labels.exit().remove();

    this.labels = this.labels.enter().append('svg:text')
       .attr('class', (d) => d.label === 'next'? 'label-next':'label-prev')
       .text((d) => d.label)
       .merge(this.labels);
    
    this.nodesWithLabels = this.nodes.filter((node) => node.label != null);

    this.labelsNodes = this.labelsNodes.data(this.nodesWithLabels, (d) => `${d.id}-${d.label}`);

    this.labelsNodes.exit().remove();

    this.labelsNodes = this.labelsNodes.enter().append('svg:text')
       .attr('class', 'label-node')
       .text((d) => d.label)
       .merge(this.labelsNodes);

    this.force
      .nodes(this.nodes)
      .force('link').links(this.props.links);

    this.force.alphaTarget(0.3).restart();
  }

  tick = () => {
    this.path.attr('d', (d) => {
      if (d.source.id === d.target.id) {
        const cpOneX = d.source.x - 100;
        const cpOneY = d.source.y;
        const cpTwoX = d.source.x;
        const cpTwoY = d.source.y - 100;
        const targetYWithPadding = d.target.y - 18;

        return `M${d.source.x},${d.source.y}C${cpOneX},${cpOneY},${cpTwoX},${cpTwoY},${d.target.x},${targetYWithPadding}`;
      } else {
        const deltaX = d.target.x - d.source.x;
        const deltaY = d.target.y - d.source.y;
        const dist = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        const normX = deltaX / dist;
        const normY = deltaY / dist;
        const sourcePadding = d.left ? 18 : 13;
        const targetPadding = d.right ? 18 : 13;
        const sourceX = d.source.x + (sourcePadding * normX);
        const sourceY = d.source.y + (sourcePadding * normY);
        const targetX = d.target.x - (targetPadding * normX);
        const targetY = d.target.y - (targetPadding * normY);

        const cpX = (sourceX + ((targetY - sourceY) * 0.3));
        const cpY = (sourceY + ((sourceX - targetX) * 0.3));

        return `M${sourceX},${sourceY}Q${cpX},${cpY},${targetX},${targetY}`;
      }
    });

    this.circle.attr('transform', (d) =>  {
      return `translate(${d.x},${d.y})`
    });

    this.labels.attr('x', (d) => {      
      if (d.source.id === d.target.id) {
        const marginX = d.label === "prev" ? 25:50;
        
        return d.source.x - marginX;
      } else {
        const cpX = (d.source.x + ((d.target.y - d.source.y) * 0.36));
        const middleX = (d.source.x + d.target.x)/2;
        const marginX = d.label === "prev" ? -25:0;
        
        return (middleX + cpX)/2 + marginX;
      }
    });

    this.labels.attr('y', (d) => {
      if (d.source.id === d.target.id) {
        const marginY = 55;

        return d.source.y - marginY; 
      } else {
        const cpY = (d.source.y + ((d.source.x - d.target.x) * 0.36));
        const middleY = (d.source.y + d.target.y)/2;

        return (middleY + cpY)/2;
      }
    });

    this.labelsNodes.attr('x', (d) => {
      const marginX = 12;

      return d.x - marginX;
    });

    this.labelsNodes.attr('y', (d) => {
      const marginY = 35;

      return d.y + marginY;
    });
  }

drag = () => {
  function dragged(d) {
    d.fx = d3.event.x;
    d.fy = d3.event.y;
    d3.select(this).attr('transform', `translate(${d3.event.x},${d3.event.y})`);
  }

  return d3.drag()
      .on("drag", dragged);
}

  getNodesWithPosition = () => {
    let copyNodes = JSON.parse(JSON.stringify(this.props.nodes));

    return copyNodes.sort((a,b) => a.id - b.id).map((elem, index) => {
      const levelY = Math.floor(index/this.nodesPerLine);
      const deltaX = (this.stepX * (index%this.nodesPerLine));
      
      elem.fx = levelY%2 === 0 ? this.nodeInitX + deltaX:this.nodeFinalX - deltaX;
      elem.fy = this.nodeInitY + (levelY * this.stepY);
      return elem;
    });
  }

  render() {
    return (
      <div id="visualization">
      </div>
    );
  }
}

export default Visualization;