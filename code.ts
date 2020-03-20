function searchVisiblePropertyTextNodes():TextNode[] {
  const nodes = figma.currentPage.findAll(node => node.type === "TEXT" && node.name.charAt(0) === "#");
  return nodes.map(node => <TextNode> node)
}

function selectedNodeExist():boolean {
  return figma.currentPage.selection.length != 0
}

function firstSelectedNode():RectangleNode {
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
  return rgbToHex(color["r"], color["g"], color["b"]);
}

function matchName(name:string):{nodeId:string, type:string} {
  let names = name.match(/#([0-9\:]+) ?([a-z]*)/);
  let nodeId = names[1] ? names[1] : null;
  let type = names[2] ? names[2] : "fill";
  return {nodeId, type};
}

async function setText(text:TextNode, newCharacters:string) {
  let font = <FontName> text.fontName;
  await figma.loadFontAsync({ family:font.family, style:font.style });
  text.characters = newCharacters;
}

async function addTextNearSelected(text:string, name:string){
  let node = firstSelectedNode();

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

function getColorByType(nodeId:string, type:string):string {
  let selectedNode = <RectangleNode> figma.getNodeById(nodeId); 
  if(selectedNode) {
    if(selectedNode[type][0]) {
      const hexColor:string = colorToHex(selectedNode[type][0]["color"]);
      return hexColor.toUpperCase();
    }
  }
}

function getFillsColor(nodeId:string):string {
  return getColorByType(nodeId, "fills");
}

function getStrokesColor(nodeId:string):string {
  return getColorByType(nodeId, "strokes");
}

function prepareValueForUI():any{
  let message = {};

  const countText:number = searchVisiblePropertyTextNodes().length;
  message["countText"] = countText;

  if (selectedNodeExist()) {
    const selectedNode = firstSelectedNode(); 
    message["isSelected"] = true;

    // [TODO] consider fills and stroke may have more than one
    if(selectedNode.fills[0]) {
      message["fill"] = colorToHex(selectedNode.fills[0].color);
    }
    if (selectedNode.strokes[0]) {
      message["stroke"] = colorToHex(selectedNode.strokes[0]["color"]);
    }
  } else {
    message["isSelected"] = false;
  }
  return message;
}

function updateUI():void {
  figma.ui.postMessage(prepareValueForUI());
}

function updateAll() {
  const nodes = figma.currentPage.findAll(node => node.type === "TEXT" && node.name.charAt(0) === "#");
  
  nodes.forEach(node => {
    let {nodeId, type} = matchName(node.name);
    if (type == "stroke") {
      setText(node as TextNode, getStrokesColor(nodeId));
    } else {
      setText(node as TextNode, getFillsColor(nodeId));
    }
  });
}

// EVENT HANDLER

figma.on("selectionchange", () => { 
  updateUI();
})

figma.ui.onmessage = msg => {
  if (msg.type === 'update_all') {
    updateAll();
    figma.closePlugin();
  }

  if (msg.type === "add_fill") {
    const hexColor:string = colorToHex(firstSelectedNode().fills[0].color)
    const name:string = "#"+firstSelectedNode().id + " fill";
    addTextNearSelected(hexColor.toUpperCase(), name);
  }

  if (msg.type === "add_stroke") {
    const hexColor:string = colorToHex(firstSelectedNode().strokes[0]["color"]);
    const name:string = "#"+firstSelectedNode().id + " stroke";
    addTextNearSelected(hexColor.toUpperCase(), name);
  } 
};

// MAIN FUNCTION

figma.showUI(__html__,{width:250, height:220});
updateUI();