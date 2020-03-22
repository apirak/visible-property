// Get property from Node
import { colorNumberToHex, rgbToHex, colorToHex} from './colorUtility';

export function isSolidPaints(fills: readonly Paint[] | PluginAPI['mixed']): fills is SolidPaint[] {
  if (fills as Paint[] != undefined){
    if ((fills as Paint[]).length != 0){ 
      return (fills as SolidPaint[])[0].color != undefined;
    }
  }
  return false;
}

export function getFillsColor(nodeId:string):string {
  let selectedNode = <RectangleNode> figma.getNodeById(nodeId); 
  return getPropertyFromNode(selectedNode, "fill");
}

export function getStrokesColor(nodeId:string):string {
  let selectedNode = <RectangleNode> figma.getNodeById(nodeId); 
  return getPropertyFromNode(selectedNode, "stroke");
}

export function getPropertyFromNode(node:RectangleNode, propertyName:string) :string {
  let fills = node.fills;
  let strokes = node.strokes;
  let property:string;

  if (propertyName == "fill" && isSolidPaints(fills)){
    return colorToHex(fills[0].color).toUpperCase();
  };

  if (propertyName == "stroke" && isSolidPaints(strokes)) {
    return colorToHex(strokes[0].color).toUpperCase();
  };

  return "";
}

export function selectedFirstNode():RectangleNode {
  // [TODO] Selected may not Rectangle Node
  return <RectangleNode> figma.currentPage.selection[0];
}

export function selectedNodeExist():boolean {
  return figma.currentPage.selection.length != 0
}

export function searchVisiblePropertyTextNodes():TextNode[] {
  const nodes = figma.currentPage.findAll(node => node.type === "TEXT" && node.name.charAt(0) === "#");
  return nodes.map(node => <TextNode> node)
}

export function prepareValueForUI():any{
  let message:any = {};

  const countText:number = searchVisiblePropertyTextNodes().length;
  message["countText"] = countText;

  if (selectedNodeExist()) {
    message["isSelected"] = true;

    // [TODO] consider fills and stroke may have more than one
    message["fill"] = getPropertyFromNode(selectedFirstNode(), "fill");
    message["stroke"] = getPropertyFromNode(selectedFirstNode(), "stroke");

  } else {
    message["isSelected"] = false;
  }
  return message;
}