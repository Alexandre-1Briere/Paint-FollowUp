import { MOUSE_DOWN,
         MOUSE_ENTER, MOUSE_LEAVE, MOUSE_LEFT_BUTTON, MOUSE_MOVE,
         MOUSE_RIGHT_BUTTON, MOUSE_UP, MOUSE_WHEEL, MOUSE_WHEEL_UP_MAX, NO_BUTTON_PRESSED} from '../../../constants/mouse';
import { MouseButtonAction, MouseButtonState, MouseEventData,
         MouseLocation, MouseMovement, MouseWheelState } from './mouse-event-data';

export class MouseUtilities {
  static isLeftButtonPressed(event: MouseEvent): boolean {
    return event.button === MOUSE_LEFT_BUTTON && event.buttons !== NO_BUTTON_PRESSED;
  }

  static isRightButtonPressed(event: MouseEvent): boolean {
    return event.button === MOUSE_RIGHT_BUTTON && event.buttons !== NO_BUTTON_PRESSED;
  }

  static updateMouseButtons(event: MouseEvent, mouseEventData: MouseEventData): void {
    const LEFT_BUTTON = true;
    const RIGHT_BUTTON = false;
    MouseUtilities.updateMouseButton(event, mouseEventData, LEFT_BUTTON);
    MouseUtilities.updateMouseButton(event, mouseEventData, RIGHT_BUTTON);
  }

  private static updateMouseButton(event: MouseEvent, mouseEventData: MouseEventData, isLeftButton: boolean): void {
    const mouseButton = isLeftButton ? mouseEventData.leftButton : mouseEventData.rightButton;
    mouseButton.action = MouseButtonAction.None;

    const previousState = mouseButton.state;
    const isButtonConcerned = isLeftButton ? event.button === MOUSE_LEFT_BUTTON : event.button === MOUSE_RIGHT_BUTTON;

    switch (event.type) {
      case MOUSE_DOWN: {
        if (isButtonConcerned) {
          mouseEventData.updateMouseDown(event, mouseButton);
        }
        break;
      }
      case MOUSE_UP: {
        if (isButtonConcerned) {
          if (mouseButton.state === MouseButtonState.Pressed) {
            mouseEventData.updateClick(event, mouseButton);
          }

          mouseButton.state = MouseButtonState.Released;
        }
        break;
      }
    }

    mouseButton.stateHasChanged = previousState !== mouseButton.state;
  }

  static mouseMovement(event: MouseEvent): MouseMovement {
    switch (event.type) {
      case MOUSE_MOVE: {
        return MouseMovement.Moved;
      }
      default: {
        return MouseMovement.None;
      }
    }
  }

  static mouseWheelState(event: MouseEvent): MouseWheelState {
    switch (event.type) {
      case MOUSE_WHEEL: {
        const wheelEvent = event as WheelEvent;
        if (this.isWheelUp(wheelEvent.deltaY)) {
          return MouseWheelState.WheelUp;
        } else {
          return MouseWheelState.WheelDown;
        }
      }
      default: {
        return MouseWheelState.None;
      }
    }
  }

  static updateMouseLocation(event: MouseEvent, mouseEventData: MouseEventData): void {
    const previousLocation = mouseEventData.location;

    switch (event.type) {
      case MOUSE_ENTER: {
        mouseEventData.location = MouseLocation.Inside;
        break;
      }
      case MOUSE_LEAVE: {
        mouseEventData.location = MouseLocation.Outside;
        break;
      }
    }

    mouseEventData.locationHasChanged = previousLocation !== mouseEventData.location;
  }

  static isWheelUp(wheelDelta: number): boolean {
    return wheelDelta <= MOUSE_WHEEL_UP_MAX;
  }
}
