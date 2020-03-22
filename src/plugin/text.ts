// Add and Update Text Node
import { selectedFirstNode } from './property';

export function matchName(name:string):{id:string, type:string} {
  let names = name.match(/#([0-9\:]+) ?([a-z]*)/);
  if (names){
    let nodeId = names[1] ? names[1] : "";
    let nodeType = names[2] ? names[2] : "fill";
    return {id:nodeId, type:nodeType};
  } else {
    return {id:"", type:""};
  }
}

export async function setText(text:TextNode, newCharacters:string) {
  let font = <FontName> text.fontName;
  await figma.loadFontAsync({ family:font.family, style:font.style });
  text.characters = newCharacters;
}

export async function addTextNearSelected(text:string, name:string){
  let node = selectedFirstNode();

  await figma.loadFontAsync({family:"Roboto", style: "Regular"});
  const textNode = figma.createText();
  textNode.fontSize = 12;
  textNode.fontName = {family:"Roboto", style: "Regular"}
  textNode.x = node.x;
  textNode.y = node.y + node.height + 20;
  textNode.characters = text;
  textNode.name = name;
  if(node.parent){
    node.parent.appendChild(textNode);
  }
}