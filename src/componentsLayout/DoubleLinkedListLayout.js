import React, { Component } from 'react';
import DsLayout from './DsLayout.js';

class DoubleLinkedListLayout extends Component {
  constructor(props) {
    super(props);

    this.tipo = "DOUBLE_LINKED_LIST";
    this.methods = ["insert", "remove", "insertFirst", "removeFirst", "removeLast"];
    this.dsName = "DoubleLinkedList";
    this.dsNodeName = "DoubleLinkedListNode";
    this.codeNode = "public class DoubleLinkedListNode {\n\n\tpublic Integer data;\n\tpublic DoubleLinkedListNode next;\n\tpublic DoubleLinkedListNode previous;\n\n\tpublic DoubleLinkedListNode() {\n\t}\n\n\tpublic DoubleLinkedListNode(Integer data, DoubleLinkedListNode next, DoubleLinkedListNode previous) {\n\t\tthis.data = data;\n\t\tthis.next = next;\n\t\tthis.previous = previous;\n\t}\n}";
    this.dsActions = {DEFAULT: {name: "Ação..."}, INSERT: {name: "Inserir elemento", hasElement: true}, REMOVE: {name: "Remover elemento", hasElement: true}, INSERT_FIRST: {name: "Inserir primeiro elemento", hasElement: true}, REMOVE_FIRST: {name: "Remover primeiro elemento", hasElement: false}, REMOVE_LAST: {name: "Remover ultimo elemento", hasElement: false}};
    this.defaultMethods = {insert: "\t\tDoubleLinkedListNode node = new DoubleLinkedListNode(element, null, null);\n\t\tif (this.head == null) {\n\t\t\tthis.head = node;\n\t\t\tthis.last = node;\n\t\t} else {\n\t\t\tthis.last.next = node;\n\t\t\tnode.previous = this.last;\n\t\t\tthis.last = node;\n\t\t}", remove: "\t\tif (this.head != null) {\n\t\t\tif (this.head.data.equals(element)) {\n\t\t\t\tthis.removeFirst();\n\t\t\t} else {\n\t\t\t\tDoubleLinkedListNode node = this.head.next;\n\t\t\t\twhile(node != null && !node.data.equals(element)) {\n\t\t\t\t\tnode = node.next;\n\t\t\t\t}\n\t\t\t\tif (node != null) {\n\t\t\t\t\tif (node.next == null) {\n\t\t\t\t\t\tthis.removeLast();\n\t\t\t\t\t} else {\n\t\t\t\t\t\tnode.next.previous = node.previous;\n\t\t\t\t\t\tnode.previous.next = node.next;\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t}\n\t\t}", insertFirst: "\t\tDoubleLinkedListNode node = new DoubleLinkedListNode(element, null, null);\n\t\tif (this.head == null) {\n\t\t\tthis.head = node;\n\t\t\tthis.last = node;\n\t\t} else {\n\t\t\tthis.head.previous = node;\n\t\t\tnode.next = this.head;\n\t\t\tthis.head = node;\n\t\t}", removeFirst: "\t\tif (this.head != null) {\n\t\t\tDoubleLinkedListNode newHead = this.head.next;\n\t\t\tif (newHead == null) {\n\t\t\t\tthis.head = null;\n\t\t\t\tthis.last = null;\n\t\t\t} else {\n\t\t\t\tnewHead.previous = null;\n\t\t\t\tif(newHead.next == null) {\n\t\t\t\t\tthis.head = newHead;\n\t\t\t\t\tthis.last = newHead;\n\t\t\t\t} else {\n\t\t\t\t\tthis.head = newHead;\n\t\t\t\t}\n\t\t\t}\n\t\t}", removeLast: "\t\tif (this.last != null) {\n\t\t\tDoubleLinkedListNode newLast = this.last.previous;\n\t\t\tif (newLast == null) {\n\t\t\t\tthis.head = null;\n\t\t\t\tthis.last = null;\n\t\t\t} else {\n\t\t\t\tnewLast.next = null;\n\t\t\t\tif(newLast.previous == null) {\n\t\t\t\t\tthis.head = newLast;\n\t\t\t\t\tthis.last = newLast;\n\t\t\t\t} else {\n\t\t\t\t\tthis.last = newLast;\n\t\t\t\t}\n\t\t\t}\n\t\t}"};
    this.codeOptions = [{code:"public class DoubleLinkedList implements IDoubleLinkedList {\n\tprivate DoubleLinkedListNode head;\n\tprivate DoubleLinkedListNode last;", isEdit: false, nLines: 3}, {code:"\n\tpublic void insert(Integer element) {", isEdit: false, nLines: 2}, {isEdit: true, method: "insert", nLines: 1}, {code:"\t}\n\n\tpublic void insertFirst(Integer element) {", isEdit: false, nLines: 3}, {isEdit: true, method: "insertFirst", nLines: 1}, {code:"\t}\n\n\tpublic void remove(Integer element) {", isEdit: false, nLines: 3}, {isEdit: true, method: "remove", nLines: 1}, {code:"\t}\n\n\tpublic void removeFirst() {", isEdit: false, nLines: 3}, {isEdit: true, method: "removeFirst", nLines: 1}, {code:"\t}\n\n\tpublic void removeLast() {", isEdit: false, nLines: 3}, {isEdit: true, method: "removeLast", nLines: 1}, {code:"\t}\n\n\tpublic DoubleLinkedListNode getHead() {\n\t\treturn this.head;\n\t}", isEdit: false, nLines: 5}, {code:"\n\tpublic DoubleLinkedListNode getLast() {\n\t\treturn this.last;\n\t}\n}", isEdit: false, nLines: 5}];
  }

  render() {
    return (
      <DsLayout tipo={this.tipo} methods={this.methods} dsName={this.dsName} dsNodeName={this.dsNodeName} codeNode={this.codeNode} dsActions={this.dsActions} defaultMethods={this.defaultMethods} codeOptions={this.codeOptions} />
    );
  }
}

export default DoubleLinkedListLayout;