// UI actions
export enum UIActionTypes {
  CLOSE = 'CLOSE',
  NOTIFY = 'NOTIFY',
  UPDATE_ALL = 'UPDATE_ALL',
  ADD_FILL = 'ADD_FILL',
  ADD_STROKE = 'ADD_STROKE',
}

export interface UIAction {
  type: UIActionTypes;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload?: any;
}

// Worker actions
export enum WorkerActionTypes {
  CREATE_RECTANGLE_NOTIFY = 'CREATE_RECTANGLE_NOTIFY',
  UPDATE_SELECTED_PROPERTY= 'UPDATE_SELECTED_PROPERTY',
  UPDATE_UI_PROPERTY = 'UPDATE_UI_PROPERTY',
  UPDATE_UI_PROPERTY_NOTIFY = 'UPDATE_UI_PROPERTY_NOTIFY',
}

export interface WorkerAction {
  type: WorkerActionTypes;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload?: any;
}
