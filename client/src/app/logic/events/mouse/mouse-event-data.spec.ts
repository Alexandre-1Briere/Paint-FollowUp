import { MOUSE_DOWN } from '../../../constants/mouse';
import { MouseButtonAction, MouseEventData } from './mouse-event-data';

describe('MouseEventData', () => {
  it('should create an instance', () => {
    expect(new MouseEventData()).toBeTruthy();
  });

  it('#updateMouseDown() changes lastMouseDownTimestamp', () => {
    const mouseEventData = new MouseEventData();
    const OLD_TIME_STAMP = -1;
    mouseEventData.leftButton.lastMouseDownTimestamp = OLD_TIME_STAMP;

    const leftUpEvent = new MouseEvent(MOUSE_DOWN);
    const leftDownEvent = new MouseEvent(MOUSE_DOWN);
    mouseEventData.updateMouseDown(leftUpEvent, mouseEventData.leftButton);
    mouseEventData.updateMouseDown(leftDownEvent, mouseEventData.leftButton);

    const MINIMUM_TIME_STAMP = 0;
    expect(mouseEventData.leftButton.lastMouseDownTimestamp).toBeGreaterThanOrEqual(MINIMUM_TIME_STAMP);
  });

  it('#updateClick() sets action to click with normal conditions', () => {
    const mouseEventData = new MouseEventData();
    const leftDownEvent = new MouseEvent(MOUSE_DOWN);
    mouseEventData.leftButton.lastMouseDownTimestamp = leftDownEvent.timeStamp;
    mouseEventData.updateClick(leftDownEvent, mouseEventData.leftButton);

    expect(mouseEventData.leftButton.action).toBe(MouseButtonAction.Click);
  });

  it('#updateClick() does not call updateDblClick when timeout is expired', () => {
    const mouseEventData = new MouseEventData();
    const leftDownEvent = new MouseEvent(MOUSE_DOWN);
    const TIMEOUT = 1000;
    mouseEventData.leftButton.lastMouseDownTimestamp = leftDownEvent.timeStamp - TIMEOUT;
    spyOn(mouseEventData, 'updateDblClick');
    mouseEventData.updateClick(leftDownEvent, mouseEventData.leftButton);

    expect(mouseEventData.updateDblClick).not.toHaveBeenCalled();
  });
});
