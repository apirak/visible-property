import { Rectangle } from './basicNode';
import { selectedFirstNode } from './property';
import { addText } from './textUtility';
import { clone } from './externalUtility';

export async function addLineNearSelected(type:string, frameName:string):Promise<void> {
  const margin = 8;
  // const lineColor = "C70606";
  let elementNode = <Rectangle> selectedFirstNode();

  const frame:FrameNode = figma.createFrame();
  const fills:Paint[] = [];
  frame.fills = fills;
  frame.name = frameName;

  const centerLine:LineNode = figma.createLine();
  centerLine.name = "center line";

  const strokeColor = clone(centerLine.strokes);
  strokeColor[0].color.r = 0.779;
  strokeColor[0].color.g = 0.023;
  strokeColor[0].color.b = 0.023;
  centerLine.strokes = strokeColor;

  const headLine:LineNode = figma.createLine(); 
  headLine.name = "head line";  
  headLine.strokes = strokeColor;

  const tailLine:LineNode = figma.createLine(); 
  tailLine.name = "tail line";  
  tailLine.strokes = strokeColor;

  let lenght = 0
  if (type == "height") { lenght = elementNode.node.height; }
  if (type == "width") { lenght = elementNode.node.width; }
  const textNode = await addText(String(+parseFloat(lenght.toFixed(2))), margin, 1);
  textNode.name = "lenght";
  textNode.textAlignHorizontal = "CENTER";
  textNode.textAlignVertical = "CENTER";   

  switch(type) {
    case "height":
      frame.x = elementNode.node.x + elementNode.node.width + margin;
      frame.y = elementNode.node.y;
      frame.resizeWithoutConstraints(100, elementNode.node.height); 

      centerLine.x = Math.round((margin/2)-1);
      centerLine.y = 1;
      centerLine.resizeWithoutConstraints(elementNode.node.height, 0);
      centerLine.rotation = -90;
      centerLine.constraints = <Constraints> {horizontal: "MIN", vertical:"STRETCH"};  
      
      headLine.x = 0;
      headLine.y = 1;
      headLine.resizeWithoutConstraints(margin-1, 0);
      headLine.constraints = <Constraints> {horizontal: "MIN", vertical:"MIN"};
      
      tailLine.x = 0;
      tailLine.y = elementNode.node.height;
      tailLine.resizeWithoutConstraints(margin-1, 0);
      tailLine.constraints = <Constraints> {horizontal: "MIN", vertical:"MAX"};

      textNode.y = Math.round((elementNode.node.height-textNode.height)/2); 
      textNode.x = margin
      textNode.constraints = <Constraints> {horizontal: "MIN", vertical:"CENTER"};

      frame.resizeWithoutConstraints(margin+textNode.width, elementNode.node.height); 
      break;
    case "width":
      frame.x = elementNode.node.x;
      frame.y = elementNode.node.y + elementNode.node.height + margin;
      frame.resizeWithoutConstraints(100, elementNode.node.width); 

      centerLine.x = 1;
      centerLine.y = Math.round(margin/2);
      centerLine.resizeWithoutConstraints(elementNode.node.width, 0);
      centerLine.constraints = <Constraints> {horizontal: "STRETCH", vertical:"MIN"};

      headLine.x = 0;
      headLine.y = 0;
      headLine.resizeWithoutConstraints(margin-1, 0);
      headLine.rotation = -90;
      headLine.constraints = <Constraints> {horizontal: "MIN", vertical:"MIN"};

      tailLine.x = elementNode.node.width-1;
      tailLine.y = 0;
      tailLine.resizeWithoutConstraints(margin-1, 0);
      tailLine.rotation = -90;
      tailLine.constraints = <Constraints> {horizontal: "MAX", vertical:"MIN"};   
        
      textNode.x = Math.round((elementNode.node.width-textNode.width)/2);
      textNode.y = margin;
      textNode.constraints = <Constraints> {horizontal: "CENTER", vertical:"MIN"};

      frame.resizeWithoutConstraints(elementNode.node.width, margin+textNode.height);
      break;
  }  
  
  frame.appendChild(centerLine);
  frame.appendChild(headLine);
  frame.appendChild(tailLine);
  frame.appendChild(textNode);

  if(elementNode.node.parent){
    elementNode.node.parent.appendChild(frame);
  }
}
