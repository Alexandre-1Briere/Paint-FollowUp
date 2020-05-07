import {CursorState, MouseButtonUsed} from './cursor-state';

const ORIGIN = {x: 0, y: 0};

describe('CursorState', () => {
  let cursorState: CursorState;

  beforeEach(() => {
    cursorState = new CursorState();
  });

  it('should create an instance', () => {
    expect(cursorState).toBeTruthy();
  });

  it('Default values are correct', () => {
    expect(cursorState.getAnchorPoint()).toEqual(ORIGIN);
    expect(cursorState.getCursorButton()).toBe(MouseButtonUsed.None);
  });

  it('getAnchorPoint() remains true when cursor remains close to anchor', () => {
    const POSITION1 = {x: 1, y: 1};
    const POSITION2 = {x: -2, y: 0};
    const POSITION3 = {x: -2, y: 0};
    cursorState.tryToSetAnchor(ORIGIN, MouseButtonUsed.None);
    cursorState.updateCursor(POSITION1);
    cursorState.updateCursor(POSITION2);
    cursorState.updateCursor(POSITION3);
    expect(cursorState.cursorIsAnchored()).toBeTruthy();
  });

  it('#getLogicalCursorPosition() returns position of cursor if dragging; anchor position otherwise' , () => {
    const DRAG_POSITION = {x: 5, y: 5};
    const DRAG_CLOSE_TO_ANCHOR = {x: -2, y: -2};
    cursorState.tryToSetAnchor(ORIGIN, MouseButtonUsed.None);
    expect(cursorState.getLogicalCursorPosition()).toEqual(ORIGIN);

    cursorState.updateCursor(DRAG_POSITION);
    expect(cursorState.getLogicalCursorPosition()).toEqual(DRAG_POSITION);

    cursorState.updateCursor(DRAG_CLOSE_TO_ANCHOR);
    expect(cursorState.getLogicalCursorPosition()).toEqual(ORIGIN);
  });

  it('#tryToSetAnchor() places correct values', () => {
    const ANCHOR = {x: 5, y: 5};
    cursorState.tryToSetAnchor(ANCHOR, MouseButtonUsed.Left);
    expect(cursorState.getAnchorPoint()).toEqual(ANCHOR);
    expect(cursorState.cursorIsAnchored()).toBeTruthy();
    expect(cursorState.getCursorButton()).toBe(MouseButtonUsed.Left);
  });

  it('#tryToSetAnchor() does nothing when anchorPermission=false', () => {
    const ANCHOR = {x: 5, y: 5};
    cursorState.tryToSetAnchor(ANCHOR, MouseButtonUsed.Left);
    const UNSUCCESSFULL_ANCHOR = {x: -1, y: -1};
    cursorState.tryToSetAnchor(UNSUCCESSFULL_ANCHOR, MouseButtonUsed.Left);
    expect(cursorState.getAnchorPoint()).toEqual(ANCHOR);
  });

  it('#tryToFreeAnchorPermission() allows tryToSetAnchor() to be successfull', () => {
    const ANCHOR = {x: 5, y: 5};
    cursorState.tryToSetAnchor(ANCHOR, MouseButtonUsed.Left);
    cursorState.tryToFreeAnchorPermission(MouseButtonUsed.Left);

    cursorState.tryToSetAnchor(ORIGIN, MouseButtonUsed.Right);
    expect(cursorState.getAnchorPoint()).toEqual(ORIGIN);
    expect(cursorState.getCursorButton()).toBe(MouseButtonUsed.Right);
  });

  it('#tryToFreeAnchorPermission() does nothing when bouton is not matching', () => {
    const ANCHOR = {x: 5, y: 5};
    cursorState.tryToSetAnchor(ANCHOR, MouseButtonUsed.Left);
    cursorState.tryToFreeAnchorPermission(MouseButtonUsed.Right);
    cursorState.tryToSetAnchor(ORIGIN, MouseButtonUsed.Right);

    expect(cursorState.getAnchorPoint()).toEqual(ANCHOR);
    expect(cursorState.getCursorButton()).toBe(MouseButtonUsed.Left);
  });

  it('#updateCursor() is working as expected', () => {
    const POINT = {x: 10, y: 10};
    cursorState.updateCursor(POINT);
    expect(cursorState.getCursorPosition()).toEqual(POINT);
    expect(cursorState.cursorIsDragging()).toBeTruthy();
    expect(cursorState.cursorIsAnchored()).toBeFalsy();
  });
});
