// Add and Update Text Node
import { selectedFirstNode} from './property';
import { NodeName } from '../types';
import { Rectangle } from './basicNode';

export function matchName(name:string): NodeName {
  let names = name.match(/#([0-9\:]+) ?([a-z]*)/);
  let nodeName:NodeName = {id:"", type:""};
  if (names){
    nodeName.id = names[1] ? names[1] : "";
    nodeName.type = names[2] ? names[2] : "fill";
  }
  return nodeName;
}

export async function setText(text:TextNode, newCharacters:string) {
  let font = <FontName> text.fontName;
  await figma.loadFontAsync({ family:font.family, style:font.style });
  text.characters = newCharacters;
}

export async function addTextNearSelected(text:string, name:string){
  let elementNode = <Rectangle> selectedFirstNode();

  await figma.loadFontAsync({family:"Roboto", style: "Regular"});
  const textNode = figma.createText();
  textNode.fontSize = 12;
  textNode.fontName = {family:"Roboto", style: "Regular"}
  textNode.x = elementNode.node.x;
  textNode.y = elementNode.node.y + elementNode.node.height + 20;
  textNode.characters = text;
  textNode.name = name;
  if(elementNode.node.parent){
    elementNode.node.parent.appendChild(textNode);
  }
}