import { UIActionTypes, UIAction, WorkerActionTypes, WorkerAction } from '../types';

function postMessageToUI({ type, payload }: WorkerAction): void {
  figma.ui.postMessage({ type, payload });
}

function searchVisiblePropertyTextNodes():TextNode[] {
  const nodes = figma.currentPage.findAll(node => node.type === "TEXT" && node.name.charAt(0) === "#");
  return nodes.map(node => <TextNode> node)
}

function selectedNodeExist():boolean {
  return figma.currentPage.selection.length != 0
}

function selectedFirstNode():RectangleNode {
  // [TODO] Selected may not Rectangle Node
  return <RectangleNode> figma.currentPage.selection[0];
}

function colorNumberToHex(color:number):string {
  var hex = Math.round(color * 255).toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r:number, g:number, b:number):string {
  return "#" + colorNumberToHex(r) + colorNumberToHex(g) + colorNumberToHex(b)
}

function colorToHex(color:any):string{
  return rgbToHex(color["r"], color["g"], color["b"]).toUpperCase();
}

function isSolidPaints(fills: readonly Paint[] | PluginAPI['mixed']): fills is SolidPaint[] {
  if (fills as Paint[] != undefined){
    if ((fills as Paint[]).length != 0){ 
      return (fills as SolidPaint[])[0].color != undefined;
    }
  }
  return false;
}

function getPropertyFromNode(node:RectangleNode, propertyName:string) :string {
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

function prepareValueForUI():any{
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

function updateUI():void {
  postMessageToUI({ type: WorkerActionTypes.UPDATE_UI_PROPERTY, payload: prepareValueForUI() });
}

// function getColorByType(nodeId:string, type:string):string {
//   let selectedNode = <RectangleNode> figma.getNodeById(nodeId); 
//   if(selectedNode && selectedNode[type][0]) {
//       return colorToHex(selectedNode[type][0]["color"]);
//   } else {
//     return " ";
//   }
// }

function getFillsColor(nodeId:string):string {
  let selectedNode = <RectangleNode> figma.getNodeById(nodeId); 
  return getPropertyFromNode(selectedNode, "fill");
}

function getStrokesColor(nodeId:string):string {
  let selectedNode = <RectangleNode> figma.getNodeById(nodeId); 
  return getPropertyFromNode(selectedNode, "stroke");
}

async function setText(text:TextNode, newCharacters:string) {
  let font = <FontName> text.fontName;
  await figma.loadFontAsync({ family:font.family, style:font.style });
  text.characters = newCharacters;
}

function matchName(name:string):{id:string, type:string} {
  let names = name.match(/#([0-9\:]+) ?([a-z]*)/);
  if (names){
    let nodeId = names[1] ? names[1] : "";
    let nodeType = names[2] ? names[2] : "fill";
    return {id:nodeId, type:nodeType};
  } else {
    return {id:"", type:""};
  }
}

function updateAllTextProperty() {
  const nodes = figma.currentPage.findAll(node => node.type === "TEXT" && node.name.charAt(0) === "#");
  
  nodes.forEach(node => {
    let {id, type} = matchName(node.name);
    if (type == "stroke") {
      setText(node as TextNode, getStrokesColor(id));
    } else {
      setText(node as TextNode, getFillsColor(id));
    }
  });

  figma.notify('Updated 👍');
}

async function addTextNearSelected(text:string, name:string){
  let node = selectedFirstNode();

  await figma.loadFontAsync({family:"Roboto", style: "Regular"});
  const textNode = figma.createText();
  textNode.fontSize = 12;
  textNode.fontName = {family:"Roboto", style: "Regular"}
  textNode.x = node.x;
  textNode.y = node.y + node.height + 20;
  textNode.characters = text;
  textNode.name = name;
  node.parent.appendChild(textNode);
}

function addFillTextProperty() {
  const hexColor:string = getPropertyFromNode(selectedFirstNode(), "fill");
  const name:string = "#"+selectedFirstNode().id + " fill";
  addTextNearSelected(hexColor, name);
}

function addStrokeTextProperty() {
  const hexColor:string = getPropertyFromNode(selectedFirstNode(), "stroke");
  const name:string = "#"+selectedFirstNode().id + " stroke";
  addTextNearSelected(hexColor, name);
}

// Listen to messages received from the plugin UI (src/ui/ui.ts)
figma.ui.onmessage = function({ type, payload }: UIAction): void {
  switch (type) {
    case UIActionTypes.CLOSE:
      figma.closePlugin();
      break;
    case UIActionTypes.UPDATE_ALL:
      updateAllTextProperty();
      break;
    case UIActionTypes.ADD_FILL:
      addFillTextProperty();
      break;
    case UIActionTypes.ADD_STROKE:
      addStrokeTextProperty();
      break;
  }
};

figma.on("selectionchange", () => { 
  updateUI();
})

// Show the plugin interface (https://www.figma.com/plugin-docs/creating-ui/)
// Remove this in case your plugin doesn't need a UI, make network requests, use browser APIs, etc.
// If you need to make network requests you need an invisible UI (https://www.figma.com/plugin-docs/making-network-requests/)
figma.showUI(__html__, { width: 250, height: 220 });
updateUI();
