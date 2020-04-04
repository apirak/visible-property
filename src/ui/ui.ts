import { UIActionTypes, UIAction, WorkerActionTypes, WorkerAction, UIInformation } from '../types';

import './ui.css';

const normalColor = "#000000";
const disableColor = "#AAAAAA";
const fillDisableColor = "#F0F0F0";

function getElementById(id:string):HTMLElement | undefined {
  let element:HTMLElement | null = document.getElementById(id);
  if (element) {
    return element;
  }
}

function updateDescription(uiInformation:UIInformation) :void {
  let elementValue = getElementById("description_value");
  let elementAdd = getElementById("description_add");

  if (elementValue && elementAdd) {
    if (uiInformation.isSelected && uiInformation.selectedNode && uiInformation.selectedNode.description) {
        elementValue.innerHTML = uiInformation.selectedNode.description;
        elementValue.style.color = normalColor;
        elementAdd.style.display = "block";
    } else {
        elementValue.innerHTML = "Not a component"
        elementValue.style.color = disableColor;
        elementAdd.style.display = "none";
    }
  }
}

function updateSize(type:string, uiInformation:UIInformation) :void {
  let elementValue = getElementById(type + "_value");
  let elementAdd = getElementById(type + "_add");
  let size:number = 0;

  if (elementValue && elementAdd) {
    if (uiInformation.isSelected && uiInformation.selectedNode) {
      if(type == "height") { size = uiInformation.selectedNode.height; } 
      if(type == "width") { size = uiInformation.selectedNode.width; }
      elementValue.innerHTML = String(size);
      elementValue.style.color = normalColor;
      elementAdd.style.display = "block";
    } else {
      elementValue.innerHTML = "Not Selected";
      elementValue.style.color = disableColor;
      elementAdd.style.display = "none";
    }
  }
}

function updateStyle(type:string, uiInformation:UIInformation) :void {
  let elementColor = getElementById(type + "_1_color");
  let elementValue = getElementById(type + "_1_value");
  let elementAdd = getElementById(type + "_1_add")
  let value = "";

  if (elementColor && elementValue && elementAdd) {
    if (uiInformation.isSelected && uiInformation.selectedNode) {
      if(type == "fill" && uiInformation.selectedNode.fillColor) { 
        value = uiInformation.selectedNode.fillColor; 
        elementColor.style.background = value;
      }
      if(type == "stroke" && uiInformation.selectedNode.strokeColor) { 
        value = uiInformation.selectedNode.strokeColor; 
        elementColor.style.background = "#FFFFFF";
        elementColor.style.borderColor = value;
      }
      if(value) {
        elementValue.style.color = normalColor;
        elementValue.innerHTML = String(value);
        elementAdd.style.display = "block";
      } else {
        elementColor.style.borderColor = fillDisableColor;
        elementColor.style.background = fillDisableColor;
        elementValue.style.color = disableColor;
        elementValue.innerHTML = "Empty "+type;
        elementAdd.style.display = "none";
      }
    } else {
      elementValue.style.color = disableColor;
      elementValue.innerHTML = "Not selected";
      elementAdd.style.display = "none";
    }
  }
}

function updateCountProperty(uiInformation:UIInformation) :void {
  const elementCount = getElementById("visibleProperty");
  if (elementCount) {
    elementCount.innerHTML = String(uiInformation.countPropertyTexts);
  }
}

function updateUI(payload:any):void{
  updateCountProperty(payload);
  updateStyle("fill", payload);
  updateStyle("stroke", payload);
  updateDescription(payload);
  updateSize("width", payload);
  updateSize("height", payload);
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