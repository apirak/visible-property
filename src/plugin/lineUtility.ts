import { Rectangle } from './basicNode';
import { selectedFirstNode } from './property';

export function addLineNearSelected(type:string):void {
  const margin = 8;
  let elementNode = <Rectangle> selectedFirstNode();
  let scaleX = 1;
  let scaleY = 1;
  let scaleWidth = margin;
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

  const centerLine:LineNode = figma.createLine()
  frame.appendChild(centerLine)
  centerLine.name = "center line";
  centerLine.x = margin/2;
  centerLine.y = 1 ;
  centerLine.resizeWithoutConstraints(scaleHeight, 0);
  centerLine.rotation = -90;
  centerLine.constraints = <Constraints> {horizontal: "CENTER", vertical:"STRETCH"};
  
  const headLine:LineNode = figma.createLine()
  frame.appendChild(headLine);
  headLine.name = "head line";
  headLine.x = 1;
  headLine.y = 1;
  headLine.resizeWithoutConstraints(margin, 0);
  headLine.constraints = <Constraints> {horizontal: "CENTER", vertical:"MIN"};

  const tailLine:LineNode = figma.createLine()
  frame.appendChild(tailLine);
  tailLine.name = "tail line";
  tailLine.x = 1;
  tailLine.y = scaleHeight;
  tailLine.resizeWithoutConstraints(margin, 0);
  tailLine.constraints = <Constraints> {horizontal: "CENTER", vertical:"MAX"};

  if(elementNode.node.parent){
    elementNode.node.parent.appendChild(frame);
  }
}
