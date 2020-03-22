import { UIActionTypes, UIAction, WorkerActionTypes, WorkerAction, NodeName } from '../types';
import { colorNumberToHex, rgbToHex, colorToHex } from './colorUtility';
import { getPropertyFromNode, isSolidPaints, getFillsColor, getStrokesColor, prepareValueForUI, selectedFirstNode } from './property';
import { matchName, setText, addTextNearSelected } from './textUtility';

function postMessageToUI({ type, payload }: WorkerAction): void {
  figma.ui.postMessage({ type, payload });
}

function updateUI():void {
  postMessageToUI({ type: WorkerActionTypes.UPDATE_UI_PROPERTY, payload: prepareValueForUI() });
}

function updateAllTextProperty() {
  const nodes = figma.currentPage.findAll(node => node.type === "TEXT" && node.name.charAt(0) === "#");
  
  nodes.forEach(node => {
    let nodeName:NodeName = matchName(node.name);
    if (nodeName.type == "stroke") {
      setText(node as TextNode, getStrokesColor(nodeName.id));
    } else {
      setText(node as TextNode, getFillsColor(nodeName.id));
    }
  });

  figma.notify('Updated 👍');
}

function addTextProperty(type:string) {
  const hexColor:string = getPropertyFromNode(selectedFirstNode(), type);
  const name:string = "#"+selectedFirstNode().id + " " + type;
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
      addTextProperty("fill");
      break;
    case UIActionTypes.ADD_STROKE:
      addTextProperty("stroke");
      break;
  }
};

figma.on("selectionchange", () => { 
  updateUI();
})

figma.showUI(__html__, { width: 250, height: 220 });
updateUI();
