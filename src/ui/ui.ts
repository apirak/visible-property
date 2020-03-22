import { UIActionTypes, UIAction, WorkerActionTypes, WorkerAction, UIInformation, NodeInfo } from '../types';

import './ui.css';

function getElementById(id:string):HTMLElement | undefined {
  let element:HTMLElement | null = document.getElementById(id);
  if (element) {
    return element;
  }
}

function updatePropertyStyle(type:string, circleColor:string, value:string, valueColor:string, addDisplay:string) {
  let elementColor = getElementById(type + "_1_color");
  if (elementColor) {  
    if (type == "fill") {
      elementColor.style.background = circleColor;
    }
    if (type == "stroke") {
      elementColor.style.borderColor = circleColor;
    }
  }

  let elementValue = getElementById(type + "_1_value");
  if (elementValue) {
    elementValue.innerHTML = value;
    elementValue.style.color = valueColor;
  }

  let elementAdd = getElementById(type + "_1_add")
  if (elementAdd) {
    elementAdd.style.display = addDisplay;
  }

  let elementDescription = getElementById("description_value")
  if (elementDescription) {
    elementDescription.innerHTML = value;
    elementDescription.style.color = valueColor;
  }

  let elementDescriptionAdd = getElementById("description_add")
  if (elementDescriptionAdd) {
    elementDescriptionAdd.style.display = addDisplay;
  }
}

function updateUI(payload:any):void{
  let uiInformation = <UIInformation> payload;
  const myElement:HTMLElement | null = document.getElementById("visibleProperty");
  if (myElement) {
    myElement.innerHTML = String(uiInformation.countPropertyTexts);
  }

  const normalColor = "#000000";
  const disableColor = "#AAAAAA";

  if (uiInformation.selectedNode) {
    if (uiInformation.selectedNode.fillColor) {
      updatePropertyStyle("fill", 
        uiInformation.selectedNode.fillColor, 
        uiInformation.selectedNode.fillColor, 
        normalColor, "block");
    } else {
      updatePropertyStyle("fill", disableColor, "Fill is Empty", disableColor, "none")
    }

    if (uiInformation.selectedNode.strokeColor) {
      updatePropertyStyle("stroke", 
        uiInformation.selectedNode.strokeColor, 
        uiInformation.selectedNode.strokeColor, 
        normalColor, "block");
    } else {
      updatePropertyStyle("stroke", disableColor, "Stroke is Empty", disableColor, "none")
    }

    if (uiInformation.selectedNode.description) {
      updatePropertyStyle("description", 
        disableColor, 
        uiInformation.selectedNode.description, 
        normalColor, "block")
    } else {
      updatePropertyStyle("description", 
        disableColor, 
        "Not a component", 
        disableColor, "none")
    }
  }
}

function postMessageToPlugin({ type, payload }: UIAction): void {
  parent.postMessage({ pluginMessage: { type, payload } }, '*');
}

// Listen to messages received from the plugin worker (src/plugin/plugin.ts)
function listenToPluginMessages(): void {
  window.onmessage = function(event: MessageEvent): void {
    const pluginMessage = event.data.pluginMessage as WorkerAction;
    const { type, payload } = pluginMessage;
    switch (type) {
      case WorkerActionTypes.CREATE_RECTANGLE_NOTIFY:
        payload && alert(payload);
        break;
      case WorkerActionTypes.UPDATE_SELECTED_PROPERTY:
        payload && alert(payload);
        break;
      case WorkerActionTypes.UPDATE_UI_PROPERTY_NOTIFY:
        payload && alert(payload);
        break;
      case WorkerActionTypes.UPDATE_UI_PROPERTY:
        payload && updateUI(payload);
        break;
    }
  };
}

function listenersToClickEvent(): void {
  document.addEventListener('click', function(event: MouseEvent) {
    const target = event.target as HTMLElement;

    switch (target.id) {
      case 'updateAll':
        postMessageToPlugin({ type: UIActionTypes.UPDATE_ALL});
        break;
      case 'fill_1_add':
        postMessageToPlugin({ type: UIActionTypes.ADD_FILL});
        break;
      case 'stroke_1_add':
        postMessageToPlugin({ type: UIActionTypes.ADD_STROKE});
        break; 
      case 'description_add':
        postMessageToPlugin({ type: UIActionTypes.ADD_DESCRIPTION});
        break;                  
    }
  });
}

// Initialize all the things
listenToPluginMessages();
listenersToClickEvent();