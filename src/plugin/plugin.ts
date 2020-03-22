import { UIActionTypes, UIAction, WorkerActionTypes, WorkerAction, NodeName } from '../types';
import { getPropertyFromNode, getColor, prepareValueForUI, selectedFirstNode, getDescription } from './property';
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

    if (nodeName.type){
      if (nodeName.type == "description") {
        setText(node as TextNode, getDescription(nodeName.id, nodeName.type));
      } else {
        setText(node as TextNode, getColor(nodeName.id, nodeName.type));
      }
    }
  });

  figma.notify('Updated 👍');
}

function addTextProperty(property:string) {
  const textValue:string = getPropertyFromNode(selectedFirstNode(), property);
  const textName:string = "#"+selectedFirstNode().id + " " + property;
  addTextNearSelected(textValue, textName);
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
  }
};

figma.on("selectionchange", () => { 
  updateUI();
})

figma.showUI(__html__, { width: 250, height: 285 });
updateUI();
