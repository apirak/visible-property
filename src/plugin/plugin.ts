import { UIActionTypes, UIAction, WorkerActionTypes, WorkerAction } from '../types';
import { colorNumberToHex, rgbToHex, colorToHex } from './color';
import { getPropertyFromNode, isSolidPaints, getFillsColor, getStrokesColor, prepareValueForUI, selectedFirstNode } from './property';
import { matchName, setText, addTextNearSelected } from './text';

function postMessageToUI({ type, payload }: WorkerAction): void {
  figma.ui.postMessage({ type, payload });
}

function updateUI():void {
  postMessageToUI({ type: WorkerActionTypes.UPDATE_UI_PROPERTY, payload: prepareValueForUI() });
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

figma.showUI(__html__, { width: 250, height: 220 });
updateUI();
