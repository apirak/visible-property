import { Rectangle } from './basicNode';
import { selectedFirstNode } from './property';
import { addText } from './textUtility';

export async function addLineNearSelected(type:string):Promise<void> {
  const margin = 8;
  let elementNode = <Rectangle> selectedFirstNode();

  const frame:FrameNode = figma.createFrame();
  const fills:Paint[] = [];
  frame.fills = fills;

  const centerLine:LineNode = figma.createLine()
  centerLine.name = "center line";  

  const headLine:LineNode = figma.createLine()  
  headLine.name = "head line";  

  const tailLine:LineNode = figma.createLine()  
  tailLine.name = "tail line";  

  let lenght = 0
  if (type == "height") { lenght = elementNode.node.height}
  if (type == "width") { lenght = elementNode.node.width}
  const textNode = await addText(String(lenght), margin, 1);
  tailLine.name = "lenght";
  textNode.textAlignHorizontal = "CENTER";
  textNode.textAlignVertical = "CENTER";   

  switch(type) {
    case "height":
      frame.x = elementNode.node.x + elementNode.node.width + margin;
      frame.y = elementNode.node.y;
      frame.name = "height"
      frame.resizeWithoutConstraints(100, elementNode.node.height); 

      centerLine.x = Math.round((margin/2)-1);
      centerLine.y = 1 ;
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
      frame.name = "width"
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
        
      // textNode.rotation = 0;
      textNode.x = Math.round((elementNode.node.width-textNode.width)/2);
      textNode.y = margin;
      textNode.constraints = <Constraints> {horizontal: "CENTER", vertical:"MIN"};

      frame.resizeWithoutConstraints(elementNode.node.width, margin+textNode.height);
      break;
  }  
  
  frame.appendChild(centerLine)
  frame.appendChild(headLine);
  frame.appendChild(tailLine);
  frame.appendChild(textNode)

  if(elementNode.node.parent){
    elementNode.node.parent.appendChild(frame);
  }
}
