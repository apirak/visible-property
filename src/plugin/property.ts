// Get property from Node
import { colorToHex } from './colorUtility';
import { UIInformation, NodeInfo } from '../types';

export function isSolidPaints(fills: readonly Paint[] | PluginAPI['mixed']): fills is SolidPaint[] {
  if (fills as Paint[] != undefined){
    if ((fills as Paint[]).length != 0){ 
      return (fills as SolidPaint[])[0].color != undefined;
    }
  }
  return false;
}

export function getPropertyFromNode(node:RectangleNode | ComponentNode , propertyName:string) :string {
  let fills = node.fills;
  let strokes = node.strokes;
  let property:string;

  if (propertyName == "fill" && isSolidPaints(fills)){
    return colorToHex(fills[0].color).toUpperCase();
  };

  if (propertyName == "stroke" && isSolidPaints(strokes)) {
    return colorToHex(strokes[0].color).toUpperCase();
  };

  if (propertyName == "description" && node.type == "COMPONENT"){
    return node.description;
  }

  return "";
}

export function getColor(nodeId:string, property:string):string {
  let selectedNode = <RectangleNode> figma.getNodeById(nodeId); 
  return getPropertyFromNode(selectedNode, property);
}

export function getDescription(nodeId:string, property:string):string {
  let testSelectedNode = figma.getNodeById(nodeId);
  if (testSelectedNode && testSelectedNode.type == "COMPONENT") {
    let selectedNode = <ComponentNode> figma.getNodeById(nodeId); 
    return getPropertyFromNode(selectedNode, property);
  } else {
    return "";
  }
}

export function selectedFirstNode():RectangleNode | ComponentNode {
  let node = figma.currentPage.selection[0];
  
  switch (node.type) {
    case "COMPONENT":
      return <ComponentNode> node;
      break;
    case "RECTANGLE":
      return <RectangleNode> node;
      break;
    default:
      return <RectangleNode> figma.currentPage.selection[0];
      break;
  }
}

export function selectedNodeExist():boolean {
  return figma.currentPage.selection.length != 0
}

export function searchVisiblePropertyTextNodes():TextNode[] {
  const nodes = figma.currentPage.findAll(node => node.type === "TEXT" && node.name.charAt(0) === "#");
  return nodes.map(node => <TextNode> node)
}

export function prepareValueForUI():UIInformation{
  const countText:number = searchVisiblePropertyTextNodes().length;

  let uiInformation:UIInformation = {countPropertyTexts: countText, isSelected: false};

  if (selectedNodeExist()) {
    uiInformation.isSelected = true;

    let nodeInfo:NodeInfo = {
      fillColor: getPropertyFromNode(selectedFirstNode(), "fill"),
      strokeColor: getPropertyFromNode(selectedFirstNode(), "stroke"),
      description: getPropertyFromNode(selectedFirstNode(), "description"),
    }
    
    uiInformation.selectedNode = nodeInfo;

  } else {
    uiInformation.isSelected = false;
  }
  return uiInformation;
}