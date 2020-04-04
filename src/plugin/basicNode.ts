import { colorToHex } from './colorUtility';

export interface BasicNode {
  node: ComponentNode | RectangleNode | any;
  getID():string;
  getFill():string;
  getStroke():string;
  getDescription():string;
  getWidth():number;
  getHeight():number;
}

export class BasicNode implements BasicNode{
  node: ComponentNode | RectangleNode | any;

  constructor(originalNode:ComponentNode | RectangleNode) {
    this.node = originalNode;
  }

  isSolidPaints(fills: readonly Paint[] | PluginAPI['mixed']): fills is SolidPaint[] {
    if (fills as Paint[] != undefined){
      if ((fills as Paint[]).length != 0){ 
        return (fills as SolidPaint[])[0].color != undefined;
      }
    }
    return false;
  }  
  
  getID():string {
    return this.node.id;
  }

  getFill():string {
    if (this.isSolidPaints(this.node.fills)){
      return colorToHex(this.node.fills[0].color).toUpperCase();
    } else {
      return "";
    }
  }

  getStroke():string {
    if (this.isSolidPaints(this.node.strokes)) {
      return colorToHex(this.node.strokes[0].color).toUpperCase();
    } else {
      return "";
    }
  }

  getDescription():string {
    return "";
  }

  getWidth():number{
    if(this.node.width != undefined){
      return this.node.width;
    } else {;
      return 0;
    }
  }

  getHeight():number{
    if(this.node.height != undefined){
      return this.node.height;
    } else {
      return 0;
    }
  }
}

export class Component extends BasicNode{
  componentNode:ComponentNode;

  constructor(originalNode:ComponentNode | RectangleNode ) {
    super(originalNode);
    this.componentNode = <ComponentNode>originalNode
  }

  getDescription():string {
    return this.componentNode.description;
  }
}

export class Rectangle extends BasicNode {

}

export function nodeFactory(nodeId:string):BasicNode | Rectangle | Component {
  let node = figma.getNodeById(nodeId);

  switch (node && node.type) {
    case "COMPONENT":
      return new Component(<ComponentNode>node);
      break;
    case "RECTANGLE":
      return new Rectangle(<RectangleNode>node);
      break;
    default:
      return new Rectangle(<RectangleNode>node);
      break;
  }
}