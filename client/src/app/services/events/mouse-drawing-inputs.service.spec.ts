import { TestBed } from '@angular/core/testing';
import { Subscription } from 'rxjs';
import { AT_LEAST_ONE_BUTTON_PRESSED, MOUSE_DOWN, MOUSE_LEAVE,
         MOUSE_LEFT_BUTTON, MOUSE_MOVE, MOUSE_RIGHT_BUTTON, MOUSE_UP,
         MOUSE_WHEEL, MOUSE_WHEEL_DOWN_MIN, MOUSE_WHEEL_UP_MAX, NO_BUTTON_PRESSED } from '../../constants/mouse';
import { MouseButtonAction, MouseButtonState, MouseEventData,
         MouseMovement, MouseWheelState } from '../../logic/events/mouse/mouse-event-data';
import { MouseDrawingInputsService } from './mouse-drawing-inputs.service';

class MockComponent {
  subscription: Subscription;
  mouseData: MouseEventData;
}

describe('MouseDrawingInputsService', () => {
  let service: MouseDrawingInputsService;
  let mockComponent: MockComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({});

    service = TestBed.get(MouseDrawingInputsService);

    mockComponent = new MockComponent();
    mockComponent.subscription = service.getMouseOutputObs().subscribe((mouseEventData) => {
      mockComponent.mouseData = mouseEventData;
    });
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('#receiveMouseAction() sends correct data after left-click event', () => {
    const leftUpEvent = new MouseEvent(MOUSE_UP, {button: MOUSE_LEFT_BUTTON, buttons: AT_LEAST_ONE_BUTTON_PRESSED});
    const leftDownEvent = new MouseEvent(MOUSE_DOWN, {button: MOUSE_LEFT_BUTTON, buttons: AT_LEAST_ONE_BUTTON_PRESSED});
    service.receiveMouseAction(leftDownEvent);
    service.receiveMouseAction(leftUpEvent);

    const isLeftButtonClicked = mockComponent.mouseData.leftButton.action === MouseButtonAction.Click;
    expect(isLeftButtonClicked).toBeTruthy();
  });

  it('#receiveMouseAction() sends correct data after left-dblclick event', () => {
    const leftUpEvent = new MouseEvent(MOUSE_UP, {button: MOUSE_LEFT_BUTTON, buttons: AT_LEAST_ONE_BUTTON_PRESSED});
    const leftDownEvent = new MouseEvent(MOUSE_DOWN, {button: MOUSE_LEFT_BUTTON, buttons: AT_LEAST_ONE_BUTTON_PRESSED});
    service.receiveMouseAction(leftDownEvent);
    service.receiveMouseAction(leftUpEvent);
    service.receiveMouseAction(leftDownEvent);
    service.receiveMouseAction(leftUpEvent);

    const isLeftButtonDblClicked = mockComponent.mouseData.leftButton.action === MouseButtonAction.DblClick;
    expect(isLeftButtonDblClicked).toBeTruthy();
  });

  it('#receiveMouseAction() sends correct data after right-click event', () => {
    const leftUpEvent = new MouseEvent(MOUSE_UP, {button: MOUSE_RIGHT_BUTTON, buttons: AT_LEAST_ONE_BUTTON_PRESSED});
    const leftDownEvent = new MouseEvent(MOUSE_DOWN, {button: MOUSE_RIGHT_BUTTON, buttons: AT_LEAST_ONE_BUTTON_PRESSED});
    service.receiveMouseAction(leftDownEvent);
    service.receiveMouseAction(leftUpEvent);

    const isRightButtonClicked = mockComponent.mouseData.rightButton.action === MouseButtonAction.Click;
    expect(isRightButtonClicked).toBeTruthy();
  });

  it('#receiveMouseAction() sends correct data after right-dblclick event', () => {
    const leftUpEvent = new MouseEvent(MOUSE_UP, {button: MOUSE_RIGHT_BUTTON, buttons: AT_LEAST_ONE_BUTTON_PRESSED});
    const leftDownEvent = new MouseEvent(MOUSE_DOWN, {button: MOUSE_RIGHT_BUTTON, buttons: AT_LEAST_ONE_BUTTON_PRESSED});
    service.receiveMouseAction(leftDownEvent);
    service.receiveMouseAction(leftUpEvent);
    service.receiveMouseAction(leftDownEvent);
    service.receiveMouseAction(leftUpEvent);

    const isRightButtonDblClicked = mockComponent.mouseData.rightButton.action === MouseButtonAction.DblClick;
    expect(isRightButtonDblClicked).toBeTruthy();
  });

  it('#receiveMouseAction() correctly set mouse state after button release', () => {
    const eventPressed = new MouseEvent(MOUSE_DOWN, {button: MOUSE_LEFT_BUTTON, buttons: AT_LEAST_ONE_BUTTON_PRESSED});
    service.receiveMouseAction(eventPressed);
    const eventReleased = new MouseEvent(MOUSE_UP, {button: MOUSE_LEFT_BUTTON, buttons: NO_BUTTON_PRESSED});
    service.receiveMouseAction(eventReleased);

    const isLeftButtonReleased = mockComponent.mouseData.leftButton.state === MouseButtonState.Released;
    expect(isLeftButtonReleased).toBeTruthy();
    const isRightButtonReleased = mockComponent.mouseData.rightButton.state === MouseButtonState.Released;
    expect(isRightButtonReleased).toBeTruthy();
  });

  it('#receiveMouseAction() does not change mouse state when unknown button is pressed', () => {
    const eventPressed = new MouseEvent(MOUSE_DOWN, {button: MOUSE_LEFT_BUTTON, buttons: AT_LEAST_ONE_BUTTON_PRESSED});
    service.receiveMouseAction(eventPressed);
    const UNKNOWN_BUTTON = 99;
    const eventUnknown = new MouseEvent(MOUSE_UP, {button: UNKNOWN_BUTTON, buttons: AT_LEAST_ONE_BUTTON_PRESSED});
    service.receiveMouseAction(eventUnknown);

    const isLeftButtonPressed = mockComponent.mouseData.leftButton.state === MouseButtonState.Pressed;
    expect(isLeftButtonPressed).toBeTruthy();
  });

  it('#receiveMouseAction() sends correct data after mousemove event', () => {
    const event = new MouseEvent(MOUSE_MOVE);
    service.receiveMouseAction(event);

    const mouseMoved = mockComponent.mouseData.movement === MouseMovement.Moved;
    expect(mouseMoved).toBeTruthy();
  });

  it('#receiveMouseAction() sends correct data after mousewheel up event', () => {
    const event = new WheelEvent(MOUSE_WHEEL, {deltaY: MOUSE_WHEEL_UP_MAX});
    service.receiveMouseAction(event);

    const mouseWheelUp = mockComponent.mouseData.wheel === MouseWheelState.WheelUp;
    expect(mouseWheelUp).toBeTruthy();
  });

  it('#receiveMouseAction() sends correct data after mousewheel down event', () => {
    const event = new WheelEvent(MOUSE_WHEEL, {deltaY: MOUSE_WHEEL_DOWN_MIN});
    service.receiveMouseAction(event);

    const mouseWheelDown = mockComponent.mouseData.wheel === MouseWheelState.WheelDown;
    expect(mouseWheelDown).toBeTruthy();
  });

  it('#receiveMouseAction() sends correct position when inside drawing board', () => {
    const event = new MouseEvent(MOUSE_MOVE);
    const MOUSE_X_IN_DRAWING_BOARD = 50;
    const MOUSE_Y_IN_DRAWING_BOARD = 40;
    spyOnProperty(event, 'offsetX', 'get').and.returnValue(MOUSE_X_IN_DRAWING_BOARD);
    spyOnProperty(event, 'offsetY', 'get').and.returnValue(MOUSE_Y_IN_DRAWING_BOARD);
    service.receiveMouseAction(event);

    expect(service.getMouseOutput().x).toEqual(MOUSE_X_IN_DRAWING_BOARD);
    expect(service.getMouseOutput().y).toEqual(MOUSE_Y_IN_DRAWING_BOARD);
  });

  it('#receiveMouseAction() sends correct position when outside drawing board', () => {
    const eventMouseOutside = new MouseEvent(MOUSE_LEAVE);
    service.receiveMouseAction(eventMouseOutside);

    const event = new MouseEvent(MOUSE_MOVE);
    const MOUSE_X = 80;
    const MOUSE_Y = 30;
    spyOnProperty(event, 'clientX', 'get').and.returnValue(MOUSE_X);
    spyOnProperty(event, 'clientY', 'get').and.returnValue(MOUSE_Y);

    const DRAWING_BOARD_TOP_LEFT_X = 100;
    const DRAWING_BOARD_TOP_LEFT_Y = 10;
    service.drawingBoardTopLeftX = DRAWING_BOARD_TOP_LEFT_X;
    service.drawingBoardTopLeftY = DRAWING_BOARD_TOP_LEFT_Y;
    const FROM_DRAWING_BOARD = false;
    service.receiveMouseAction(event, FROM_DRAWING_BOARD);

    const MOUSE_X_IN_DRAWING_BOARD = MOUSE_X - DRAWING_BOARD_TOP_LEFT_X;
    const MOUSE_Y_IN_DRAWING_BOARD = MOUSE_Y - DRAWING_BOARD_TOP_LEFT_Y;
    expect(service.getMouseOutput().x).toEqual(MOUSE_X_IN_DRAWING_BOARD);
    expect(service.getMouseOutput().y).toEqual(MOUSE_Y_IN_DRAWING_BOARD);
  });

  it('#receiveMouseAction() with fromDrawingBoard=false does not overwrite position', () => {
    const eventInsideDrawingBoard = new MouseEvent(MOUSE_MOVE);
    const MOUSE_X = 110;
    const MOUSE_Y = 20;
    spyOnProperty(eventInsideDrawingBoard, 'offsetX', 'get').and.returnValue(MOUSE_X);
    spyOnProperty(eventInsideDrawingBoard, 'offsetY', 'get').and.returnValue(MOUSE_Y);
    spyOnProperty(eventInsideDrawingBoard, 'clientX', 'get').and.returnValue(MOUSE_X);
    spyOnProperty(eventInsideDrawingBoard, 'clientY', 'get').and.returnValue(MOUSE_Y);

    const DRAWING_BOARD_TOP_LEFT_X = 100;
    const DRAWING_BOARD_TOP_LEFT_Y = 10;
    service.drawingBoardTopLeftX = DRAWING_BOARD_TOP_LEFT_X;
    service.drawingBoardTopLeftY = DRAWING_BOARD_TOP_LEFT_Y;

    service.receiveMouseAction(eventInsideDrawingBoard);
    const FROM_DRAWING_BOARD = false;
    service.receiveMouseAction(eventInsideDrawingBoard, FROM_DRAWING_BOARD);

    expect(service.getMouseOutput().x).toEqual(MOUSE_X);
    expect(service.getMouseOutput().y).toEqual(MOUSE_Y);
  });
});
