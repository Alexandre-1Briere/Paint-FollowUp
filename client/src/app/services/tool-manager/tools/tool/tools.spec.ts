import { KeyboardState } from '../../../../logic/events/keyboard/keyboard-state';
import { MouseEventData } from '../../../../logic/events/mouse/mouse-event-data';
import { Tool } from './tool';

class ToolTestable extends Tool {
  constructor() { super(); }
}

describe('Tool', () => {
  let tool: ToolTestable;

  beforeEach(() => {
    tool = new ToolTestable();
  });

  it('should create an instance', () => {
    expect(new ToolTestable()).toBeTruthy();
  });

  it('Functions to be overloaded do nothing at all', () => {
    const mouseData = new MouseEventData();
    const keyboardState = new KeyboardState();

    tool.reset();
    tool.cancelOnGoing(mouseData, keyboardState);
    tool.onLeftDown(mouseData, keyboardState);
    tool.onLeftUp(mouseData, keyboardState);
    tool.onLeftClick(mouseData, keyboardState);
    tool.onRightDown(mouseData, keyboardState);
    tool.onRightUp(mouseData, keyboardState);
    tool.onRightClick(mouseData, keyboardState);
    tool.onLeftDoubleClick(mouseData, keyboardState);
    tool.onMouseMove(mouseData, keyboardState);
    tool.onMouseEnter(mouseData, keyboardState);
    tool.onMouseLeave(mouseData, keyboardState);
    tool.onWheelEvent(mouseData, keyboardState);
    tool.onKeyPress(mouseData, keyboardState);
    tool.onKeyRelease(mouseData, keyboardState);

    expect(tool.origin).toBeUndefined();
    expect(tool.primaryButton).toBeUndefined();
  });
});
