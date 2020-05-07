import { AT_LEAST_ONE_BUTTON_PRESSED, MOUSE_CLICK, MOUSE_DOWN, MOUSE_ENTER, MOUSE_LEAVE,
         MOUSE_LEFT_BUTTON, MOUSE_MOVE, MOUSE_RIGHT_BUTTON, MOUSE_UP, MOUSE_WHEEL,
         MOUSE_WHEEL_DOWN_MIN, MOUSE_WHEEL_UP_MAX } from '../../../constants/mouse';
import { MouseButtonAction, MouseButtonState, MouseEventData,
         MouseLocation, MouseMovement, MouseWheelState } from './mouse-event-data';
import { MouseUtilities } from './mouse-utilities';

const DEFAULT_MOUSE_LOCATION = MouseLocation.Inside;

describe('MouseUtilities', () => {

  let mouseEventData: MouseEventData;

  beforeEach(() => {
    mouseEventData = new MouseEventData();
  });

  it('should create an instance', () => {
    expect(new MouseUtilities()).toBeTruthy();
  });

  it('#isLeftButtonPressed() is true when left-click event is sent', () => {
    const event = new MouseEvent(MOUSE_CLICK, {button: MOUSE_LEFT_BUTTON, buttons: AT_LEAST_ONE_BUTTON_PRESSED});
    expect(MouseUtilities.isLeftButtonPressed(event)).toBeTruthy();
  });

  it('#isLeftButtonPressed() is false when right-click event is sent', () => {
    const event = new MouseEvent(MOUSE_CLICK, {button: MOUSE_RIGHT_BUTTON, buttons: AT_LEAST_ONE_BUTTON_PRESSED});
    expect(MouseUtilities.isLeftButtonPressed(event)).toBeFalsy();
  });

  it('#isRightButtonPressed() is true when right-click event is sent', () => {
    const event = new MouseEvent(MOUSE_CLICK, {button: MOUSE_RIGHT_BUTTON, buttons: AT_LEAST_ONE_BUTTON_PRESSED});
    expect(MouseUtilities.isRightButtonPressed(event)).toBeTruthy();
  });

  it('#isRightButtonPressed() is false when left-click event is sent', () => {
    const event = new MouseEvent(MOUSE_CLICK, {button: MOUSE_LEFT_BUTTON, buttons: AT_LEAST_ONE_BUTTON_PRESSED});
    expect(MouseUtilities.isRightButtonPressed(event)).toBeFalsy();
  });

  it('#updateMouseButton() sets action to Click after click event', () => {
    const leftUpEvent = new MouseEvent(MOUSE_UP);
    const leftDownEvent = new MouseEvent(MOUSE_DOWN);
    MouseUtilities.updateMouseButtons(leftDownEvent, mouseEventData);
    MouseUtilities.updateMouseButtons(leftUpEvent, mouseEventData);
    expect(mouseEventData.leftButton.action).toEqual(MouseButtonAction.Click);
  });

  it('#updateMouseButton() sets action to DblClick after consecutive mouse clicks events', () => {
    const leftUpEvent = new MouseEvent(MOUSE_UP);
    const leftDownEvent = new MouseEvent(MOUSE_DOWN);
    MouseUtilities.updateMouseButtons(leftDownEvent, mouseEventData);
    MouseUtilities.updateMouseButtons(leftUpEvent, mouseEventData);
    MouseUtilities.updateMouseButtons(leftDownEvent, mouseEventData);
    MouseUtilities.updateMouseButtons(leftUpEvent, mouseEventData);
    expect(mouseEventData.leftButton.action).toEqual(MouseButtonAction.DblClick);
  });

  it('#updateMouseButton() sets state to Pressed after mousedown event', () => {
    const event = new MouseEvent(MOUSE_DOWN);
    MouseUtilities.updateMouseButtons(event, mouseEventData);
    expect(mouseEventData.leftButton.state).toEqual(MouseButtonState.Pressed);
  });

  it('#updateMouseButton() sets state to Released after mouseup event', () => {
    const event = new MouseEvent(MOUSE_UP);
    MouseUtilities.updateMouseButtons(event, mouseEventData);
    expect(mouseEventData.leftButton.state).toEqual(MouseButtonState.Released);
  });

  it('#updateMouseButton() sets stateHasChanged correctly', () => {
    let event = new MouseEvent(MOUSE_DOWN);
    MouseUtilities.updateMouseButtons(event, mouseEventData);
    expect(mouseEventData.leftButton.stateHasChanged).toBeTruthy();

    event = new MouseEvent(MOUSE_UP);
    MouseUtilities.updateMouseButtons(event, mouseEventData);
    expect(mouseEventData.leftButton.stateHasChanged).toBeTruthy();

    MouseUtilities.updateMouseButtons(event, mouseEventData);
    expect(mouseEventData.leftButton.stateHasChanged).toBeFalsy();
  });

  it('#mouseMovement() returns Moved after mousemove event', () => {
    const event = new MouseEvent(MOUSE_MOVE);
    expect(MouseUtilities.mouseMovement(event)).toEqual(MouseMovement.Moved);
  });

  it('#mouseMovement() returns None after a non mousemove event', () => {
    const event = new MouseEvent(MOUSE_CLICK);
    expect(MouseUtilities.mouseMovement(event)).toEqual(MouseMovement.None);
  });

  it('#mouseWheelState() returns WheelUp after a wheel-up event', () => {
    const event = new WheelEvent(MOUSE_WHEEL, {deltaY: MOUSE_WHEEL_UP_MAX});
    expect(MouseUtilities.mouseWheelState(event)).toEqual(MouseWheelState.WheelUp);
  });

  it('#mouseWheelState() returns WheelDown after a wheel-down event', () => {
    const event = new WheelEvent(MOUSE_WHEEL, {deltaY: MOUSE_WHEEL_DOWN_MIN});
    expect(MouseUtilities.mouseWheelState(event)).toEqual(MouseWheelState.WheelDown);
  });

  it('#mouseWheelState() returns None after a non wheel event', () => {
    const event = new MouseEvent(MOUSE_CLICK);
    expect(MouseUtilities.mouseWheelState(event)).toEqual(MouseWheelState.None);
  });

  it('#mouseLocation() returns Inside after a mouseenter event', () => {
    const event = new MouseEvent(MOUSE_ENTER);
    MouseUtilities.updateMouseLocation(event, mouseEventData);
    expect(mouseEventData.location).toEqual(MouseLocation.Inside);
  });

  it('#mouseLocation() returns Outside after a mouseleave event', () => {
    const event = new MouseEvent(MOUSE_LEAVE);
    MouseUtilities.updateMouseLocation(event, mouseEventData);
    expect(mouseEventData.location).toEqual(MouseLocation.Outside);
  });

  it('#mouseLocation() returns same value if event is neither mouseenter or mouseleave', () => {
    const event = new MouseEvent(MOUSE_CLICK);
    MouseUtilities.updateMouseLocation(event, mouseEventData);
    expect(mouseEventData.location).toEqual(DEFAULT_MOUSE_LOCATION);
  });

  it('#mouseLocation() correctly assigns locationHasChanged', () => {
    const MOUSE_LOCATION_CHANGED = true;
    let event = new MouseEvent(MOUSE_LEAVE);
    MouseUtilities.updateMouseLocation(event, mouseEventData);
    expect(mouseEventData.locationHasChanged).toBeTruthy(MOUSE_LOCATION_CHANGED);

    event = new MouseEvent(MOUSE_ENTER);
    MouseUtilities.updateMouseLocation(event, mouseEventData);
    expect(mouseEventData.locationHasChanged).toBeTruthy(MOUSE_LOCATION_CHANGED);

    MouseUtilities.updateMouseLocation(event, mouseEventData);
    expect(mouseEventData.locationHasChanged).toBeFalsy(MOUSE_LOCATION_CHANGED);
  });

  it('#isWheelUp() returns correct value with defined constants', () => {
    expect(MouseUtilities.isWheelUp(MOUSE_WHEEL_UP_MAX)).toBeTruthy();
    expect(MouseUtilities.isWheelUp(MOUSE_WHEEL_DOWN_MIN)).toBeFalsy();
  });
});
