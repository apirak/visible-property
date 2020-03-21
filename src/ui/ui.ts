import { UIActionTypes, UIAction, WorkerActionTypes, WorkerAction } from '../types';

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
}

function updateUI(payload:any):void{
  let message = payload;
  const myElement:HTMLElement | null = document.getElementById("visibleProperty");
  if (myElement) {
    myElement.innerHTML = message.countText;
  }

  const normalColor = "#000000";
  const disableColor = "#AAAAAA";

  if (message.fill) {
    updatePropertyStyle("fill", message.fill, message.fill, normalColor, "block")
  } else {
    updatePropertyStyle("fill", disableColor, "Fill is Empty", disableColor, "none")
  }

  if (message.stroke) {
    updatePropertyStyle("stroke", message.stroke, message.stroke, "#000000", "block")
  } else {
    updatePropertyStyle("stroke", disableColor, "Stroke is Empty", disableColor, "none")
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
    }
  });
}

// Initialize all the things
listenToPluginMessages();
listenersToClickEvent();