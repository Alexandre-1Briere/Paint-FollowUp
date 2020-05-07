import { Injectable } from '@angular/core';
import { NO_CLICK_TIMESTAMP } from '../../../constants/mouse';

@Injectable({
  providedIn: 'root',
})
export class MouseEventData {
  leftButton: MouseButton;
  rightButton: MouseButton;
  movement: MouseMovement;
  wheel: MouseWheelState;
  location: MouseLocation;
  locationHasChanged: boolean;
  x: number;
  y: number;

  private xLastClick: number;
  private yLastClick: number;

  constructor() {
    const DEFAULT_MOUSE_MOVEMENT = MouseMovement.None;
    const DEFAULT_MOUSE_WHEEL = MouseWheelState.None;
    const DEFAULT_MOUSE_LOCATION = MouseLocation.Inside;
    const DEFAULT_MOUSE_LOCATION_HAS_CHANGED = false;
    const DEFAULT_POSITION = 0;

    this.leftButton = MouseEventData.defaultButton();

    this.rightButton = MouseEventData.defaultButton();

    this.movement = DEFAULT_MOUSE_MOVEMENT;
    this.wheel = DEFAULT_MOUSE_WHEEL;
    this.location = DEFAULT_MOUSE_LOCATION;
    this.locationHasChanged = DEFAULT_MOUSE_LOCATION_HAS_CHANGED;
    this.x = DEFAULT_POSITION;
    this.y = DEFAULT_POSITION;

    this.xLastClick = this.x;
    this.yLastClick = this.y;
  }

  static defaultButton(): MouseButton {
    const DEFAULT_MOUSE_BUTTON_ACTION = MouseButtonAction.None;
    const DEFAULT_MOUSE_BUTTON_STATE = MouseButtonState.Released;
    const DEFAULT_MOUSE_STATE_HAS_CHANGED = false;

    return {
      action: DEFAULT_MOUSE_BUTTON_ACTION,
      lastMouseDownTimestamp: NO_CLICK_TIMESTAMP,
      lastClickTimestamp: NO_CLICK_TIMESTAMP,
      state: DEFAULT_MOUSE_BUTTON_STATE,
      stateHasChanged: DEFAULT_MOUSE_STATE_HAS_CHANGED,
    };
  }

  updateMouseDown(event: MouseEvent, mouseButton: MouseButton): void {
    if (mouseButton.state === MouseButtonState.Released) {
      mouseButton.lastMouseDownTimestamp = event.timeStamp;
    }
    mouseButton.state = MouseButtonState.Pressed;
  }

  updateClick(event: MouseEvent, mouseButton: MouseButton): void {
    const MAXIMUM_TIME_FOR_CLICK = 125;

    if (event.timeStamp - mouseButton.lastMouseDownTimestamp < MAXIMUM_TIME_FOR_CLICK) {
      mouseButton.action = MouseButtonAction.Click;
      this.updateDblClick(event, mouseButton);
    }
  }

  updateDblClick(event: MouseEvent, mouseButton: MouseButton): void {
    const MAXIMUM_TIME_FOR_DBLCLICK = 400;
    const MAXIMUM_MOVEMENT_SQUARED_DURING_DBL_CLICK = 625;
    const currentTimestamp = event.timeStamp;

    let dx = this.xLastClick * this.xLastClick;
    let dy = this.yLastClick * this.yLastClick;
    this.xLastClick = this.x;
    this.yLastClick = this.y;
    dx = Math.abs(dx - this.xLastClick * this.xLastClick);
    dy = Math.abs(dy - this.yLastClick * this.yLastClick);

    if (currentTimestamp - mouseButton.lastClickTimestamp < MAXIMUM_TIME_FOR_DBLCLICK
        && dx + dy < MAXIMUM_MOVEMENT_SQUARED_DURING_DBL_CLICK) {
      mouseButton.action = MouseButtonAction.DblClick;
    } else {
      mouseButton.lastClickTimestamp = currentTimestamp;
    }
  }

  clone(): MouseEventData {
    const newMouseEventData = new MouseEventData();

    newMouseEventData.leftButton = {
      action: this.leftButton.action,
      lastMouseDownTimestamp: this.leftButton.lastMouseDownTimestamp,
      lastClickTimestamp: this.leftButton.lastClickTimestamp,
      state: this.leftButton.state,
      stateHasChanged: this.leftButton.stateHasChanged,
    };

    newMouseEventData.rightButton = {
      action: this.rightButton.action,
      lastMouseDownTimestamp: this.rightButton.lastMouseDownTimestamp,
      lastClickTimestamp: this.rightButton.lastClickTimestamp,
      state: this.rightButton.state,
      stateHasChanged: this.rightButton.stateHasChanged,
    };

    newMouseEventData.movement = this.movement;
    newMouseEventData.wheel = this.wheel;
    newMouseEventData.location = this.location;
    newMouseEventData.locationHasChanged = this.locationHasChanged;
    newMouseEventData.x = this.x;
    newMouseEventData.y = this.y;

    newMouseEventData.xLastClick = this.xLastClick;
    newMouseEventData.yLastClick = this.yLastClick;

    return newMouseEventData;
  }
}

export interface MouseButton {
  action: MouseButtonAction;
  lastMouseDownTimestamp: number;
  lastClickTimestamp: number;
  state: MouseButtonState;
  stateHasChanged: boolean;
}

export const enum MouseButtonAction {
  Click,
  DblClick,
  None,
}

export const enum MouseButtonState {
  Pressed,
  Released,
}

export const enum MouseMovement {
  Moved,
  None,
}

export const enum MouseWheelState {
  WheelUp,
  WheelDown,
  None,
}

export const enum MouseLocation {
  Inside,
  Outside,
}
