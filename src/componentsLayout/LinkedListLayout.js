import React, { Component } from 'react';
import DsLayout from './DsLayout.js';

class LinkedListLayout extends Component {
  constructor(props) {
    super(props);

    this.tipo = "LINKED_LIST";
    this.methods = ["insert", "remove"];
    this.dsName = "LinkedList";
    this.dsNodeName = "LinkedListNode";
    this.codeNode = "public class LinkedListNode {\n\n\tpublic Integer data;\n\tpublic LinkedListNode next;\n\n\tpublic LinkedListNode() {\n\t}\n\n\tpublic LinkedListNode(Integer data, LinkedListNode next) {\n\t\tthis.data = data;\n\t\tthis.next = next;\n\t}\n}";
    this.dsActions = {DEFAULT: {name: "Ação..."}, INSERT: {name: "Inserir elemento", hasElement: true}, REMOVE: {name: "Remover elemento", hasElement: true}};
    this.defaultMethods = {insert: "\t\tif (this.head == null) {\n\t\t\tthis.head = new LinkedListNode(element, null);\n\t\t} else {\n\t\t\tLinkedListNode node = this.head;\n\t\t\twhile(node.next != null) {\n\t\t\t\tnode = node.next;\n\t\t\t}\n\t\t\tnode.next = new LinkedListNode(element, null);\n\t\t}", remove: "\t\tif (this.head != null) {\n\t\t\tif (this.head.data.equals(element)) {\n\t\t\t\tthis.head = this.head.next;\n\t\t\t} else {\n\t\t\t\tLinkedListNode nodePrev = this.head;\n\t\t\t\tLinkedListNode node = this.head.next;\n\t\t\t\twhile(node != null && !node.data.equals(element)) {\n\t\t\t\t\tnodePrev = node;\n\t\t\t\t\tnode = node.next;\n\t\t\t\t}\n\t\t\t\tif (node != null) {\n\t\t\t\t\tnodePrev.next = node.next;\n\t\t\t\t}\n\t\t\t}\n\t\t}"};
    this.codeOptions = [{code:"public class LinkedList implements ILinkedList {\n  \tprivate LinkedListNode head;", isEdit: false, nLines: 2}, {code:"\n\tpublic void insert(Integer element) {", isEdit: false, nLines: 2}, {isEdit: true, method: "insert", nLines: 1}, {code:"\t}\n\n\tpublic void remove(Integer element) {", isEdit: false, nLines: 3}, {isEdit: true, method: "remove", nLines: 1}, {code:"\t}\n\n\tpublic LinkedListNode getHead() {\n\t\treturn this.head;\n\t}\n}", isEdit: false, nLines: 6}];
  }

  render() {
    return (
      <DsLayout tipo={this.tipo} methods={this.methods} dsName={this.dsName} dsNodeName={this.dsNodeName} codeNode={this.codeNode} dsActions={this.dsActions} defaultMethods={this.defaultMethods} codeOptions={this.codeOptions} />
    );
  }
}

export default LinkedListLayout;