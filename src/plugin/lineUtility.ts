import { Rectangle } from './basicNode';
import { selectedFirstNode } from './property';
import { addText } from './textUtility';

export async function addLineNearSelected(type:string):Promise<void> {
  const margin = 8;
  const textWidth = 32;
  const textHeight = 14;
  let elementNode = <Rectangle> selectedFirstNode();
  let scaleX = 1;
  let scaleY = 1;
  let scaleWidth = margin + textWidth;
  let scaleHeight = 1;  

  const frame:FrameNode = figma.createFrame();

  switch(type) {
    case "width":
      scaleX = elementNode.node.x + elementNode.node.width;
      scaleY = elementNode.node.y + elementNode.node.height + margin;
      scaleHeight = elementNode.node.width;
      frame.rotation = -90;
      break;
    case "height":
      scaleX = elementNode.node.x + elementNode.node.width + margin;
      scaleY = elementNode.node.y;
      scaleHeight = elementNode.node.height;
      break;
  }  

  frame.resizeWithoutConstraints(scaleWidth, scaleHeight);
  frame.x = scaleX;
  frame.y = scaleY;

  const fills:Paint[] = [];
  frame.fills = fills;

  const centerLine:LineNode = figma.createLine()
  frame.appendChild(centerLine)
  centerLine.name = "center line";
  centerLine.x = margin/2;
  centerLine.y = 1 ;
  centerLine.resizeWithoutConstraints(scaleHeight, 0);
  centerLine.rotation = -90;
  centerLine.constraints = <Constraints> {horizontal: "MIN", vertical:"STRETCH"};
  
  const headLine:LineNode = figma.createLine()
  frame.appendChild(headLine);
  headLine.name = "head line";
  headLine.x = 1;
  headLine.y = 1;
  headLine.resizeWithoutConstraints(margin, 0);
  headLine.constraints = <Constraints> {horizontal: "MIN", vertical:"MIN"};

  const tailLine:LineNode = figma.createLine()
  frame.appendChild(tailLine);
  tailLine.name = "tail line";
  tailLine.x = 1;
  tailLine.y = scaleHeight;
  tailLine.resizeWithoutConstraints(margin, 0);
  tailLine.constraints = <Constraints> {horizontal: "MIN", vertical:"MAX"};

  const textNode = await addText("bank", margin, Math.round((scaleHeight-textHeight)/2));
  frame.appendChild(textNode)

  switch(type) {
    case "width":
      textNode.rotation = 90;
      break;
    case "height":
      textNode.rotation = 0;
      break;
  }

  if(elementNode.node.parent){
    elementNode.node.parent.appendChild(frame);
  }
}
