import { UIActionTypes, UIAction, WorkerActionTypes, WorkerAction, NodeName } from '../types';
import { prepareValueForUI, selectedFirstNode } from './property';
import { matchName, setText, addTextNearSelected } from './textUtility';
import { addLineNearSelected } from './lineUtility';
import { BasicNode, nodeFactory } from './basicNode';


function postMessageToUI({ type, payload }: WorkerAction): void {
  figma.ui.postMessage({ type, payload });
}

export function getDescription(nodeId:string, property:string):string {
  return nodeFactory(nodeId).getDescription();
}

function updateAllTextProperty() {
  const nodes = figma.currentPage.findAll(node => node.type === "TEXT" && node.name.charAt(0) === "#");
  
  nodes.forEach(node => {
    let nodeName:NodeName = matchName(node.name);

    switch(nodeName.type) {
      case "fill":
        setText(node as TextNode, nodeFactory(nodeName.id).getFill());
        break;
      case "stroke":
        setText(node as TextNode, nodeFactory(nodeName.id).getStroke());
        break;
      case "description": 
        setText(node as TextNode, nodeFactory(nodeName.id).getDescription());
        break;
    }
  });

  figma.notify('Updated 👍');
}

function addTextProperty(property:string) {
  let selectedNode:BasicNode = selectedFirstNode();
  let textValue:string = "";

  switch(property) {
    case "fill":
      textValue = selectedNode.getFill()
      break;
    case "stroke":
      textValue = selectedNode.getStroke();
      break;
    case "description":
      textValue = selectedNode.getDescription();
      break;
  }

  const textName:string = "#"+selectedNode.getID() + " " + property;
  addTextNearSelected(textValue, textName);
}

function addScaleProperty(property:string) {
  let selectedNode:BasicNode = selectedFirstNode();
  let textValue:string = "";
  let long:number = 1;

  switch(property) {
    case "height":
      textValue = String(selectedNode.getWidth());
      long = selectedNode.getHeight();
      break;
    case "width":
      textValue = String(selectedNode.getHeight());
      long = selectedNode.getWidth();
      break;
  }
  console.log("long: "+long);
  addLineNearSelected(property);
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
      addTextProperty("fill");
      break;
    case UIActionTypes.ADD_STROKE:
      addTextProperty("stroke");
      break;
    case UIActionTypes.ADD_DESCRIPTION:
      addTextProperty("description");
      break;
    case UIActionTypes.ADD_HEIGHT:
      addScaleProperty("height");
      break;           
    case UIActionTypes.ADD_WIDTH:
      addScaleProperty("width");
      break;      
  }
};

function updateUI():void {
  postMessageToUI({ type: WorkerActionTypes.UPDATE_UI_PROPERTY, payload: prepareValueForUI() });
}

figma.on("selectionchange", () => { 
  updateUI();
})

figma.showUI(__html__, { width: 250, height: 282 });
updateUI();
