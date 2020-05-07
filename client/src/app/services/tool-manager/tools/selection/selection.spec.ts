import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { SvgRectangleComponent } from '../../../../components/svgElement/svg-rectangle/svg-rectangle.component';
import { SvgSelectionComponent } from '../../../../components/svgElement/svg-selection/svg-selection.component';
import { KEY_DOWN, KEY_UP } from '../../../../constants/keyboard';
import { KeyboardKey } from '../../../../enums/keyboard';
import { SvgLayer, SvgStatus, SvgType } from '../../../../enums/svg';
import { Boundary } from '../../../../logic/collisions/base-collision/boundary';
import { KeyboardState } from '../../../../logic/events/keyboard/keyboard-state';
import { MouseEventData, MouseWheelState } from '../../../../logic/events/mouse/mouse-event-data';
import { SvgBasicProperties } from '../../../../logic/svg/base-svg/svg-basic-properties';
import { MockViewContainerRefComponent } from '../../../../testHelpers/svgBoard/mock-view-container-ref-component.spec';
import { TestSpeedUpgrader } from '../../../../testHelpers/test-speed-upgrader.spec';
import { ClipboardService } from '../../../clipboard/clipboard.service';
import { SvgCollisionsService } from '../../../collisions/svg-collisions.service';
import { DrawingBaseParametersAccessorService } from '../../../drawing-base-parameters-accessor/drawing-base-parameters-accessor.service';
import { KeyboardManagerService } from '../../../events/keyboard-manager.service';
import { SvgTransformationService } from '../../../svg-transformation/svg-transformation.service';
import { SvgComponentsManagerService } from '../../../svg/svg-components-manager.service';
import { SvgUndoRedoService } from '../../../undo-redo/svg-undo-redo.service';
import { Tool } from '../tool/tool';
import { Selection, SelectionState } from './selection';

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [
    SvgSelectionComponent,
    SvgRectangleComponent,
    MockViewContainerRefComponent,
  ],
  entryComponents: [
    SvgSelectionComponent,
    SvgRectangleComponent,
  ],
  providers: [
    DrawingBaseParametersAccessorService,
    SvgComponentsManagerService,
    SvgTransformationService,
    SvgUndoRedoService,
    SvgCollisionsService,
    KeyboardManagerService,
  ],
})
class TestModule {}

const RECTANGLE1 = {topLeft: {x: 0, y: 0}, bottomRight: {x: 200, y: 200}, center: {x: 100, y: 100}};
const RECTANGLE2 = {topLeft: {x: 0, y: 300}, bottomRight: {x: 200, y: 500}, center: {x: 100, y: 400}};
const RECTANGLE3 = {topLeft: {x: 300, y: 0}, bottomRight: {x: 500, y: 200}, center: {x: 400, y: 100}};
const RECTANGLE4 = {topLeft: {x: 300, y: 300}, bottomRight: {x: 500, y: 500}, center: {x: 400, y: 400}};
const BOARD_SETUP: Boundary[] = [RECTANGLE1, RECTANGLE2, RECTANGLE3, RECTANGLE4];
const BOARD_SIZE = 500;

const SELECTION_STATE = 'state';
const CURSOR_STATE = 'cursorState';

const SELECTION_RECTANGLE = 'selectionRectangle';
const SELECTED_COMPONENTS = 'selectedSvgComponents';

describe('Selection', () => {
  let selection: Selection;
  let mockViewComponent: MockViewContainerRefComponent;

  TestSpeedUpgrader.overWriteModuleResetForSpeedGain();

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestModule],
    }).compileComponents();

    selection = new Selection();

    Tool.SVG_COLLISIONS_SERVICE = TestBed.get(SvgCollisionsService);
    Tool.SVG_TRANSFORMATION_SERVICE = TestBed.get(SvgTransformationService);
    Tool.SVG_COMPONENT_MANAGER = TestBed.get(SvgComponentsManagerService);
    Tool.CLIPBOARD_SERVICE = TestBed.get(ClipboardService);
    Tool.KEYBOARD_MANAGER_SERVICE = TestBed.get(KeyboardManagerService);
    Tool.UNDO_REDO_SERVICE = TestBed.get(SvgUndoRedoService);

    Tool.CLIPBOARD_SERVICE.drawingBaseParametersService.setDrawingBaseParameters(BOARD_SIZE, BOARD_SIZE, '#000000');

    const fixture = TestBed.createComponent(MockViewContainerRefComponent);
    mockViewComponent = fixture.componentInstance;
    Tool.SVG_COMPONENT_MANAGER.initialiseViewContainerRef(mockViewComponent.viewContainerRef);
  });

  const setupRectanglesOnBoard = (): Map<Boundary, SvgBasicProperties> => {
    const map = new Map();
    for (const rectangle of BOARD_SETUP) {
      const component = Tool.SVG_COMPONENT_MANAGER.createSvgComponent({
        onTopOfLayer: true,
        svgStatus: SvgStatus.Permanent,
        svgLayer: SvgLayer.Stack,
        svgType: SvgType.SvgRectangleComponent,
      }, false, false) as SvgRectangleComponent;
      component.fitExactlyInside(rectangle.topLeft.x, rectangle.topLeft.y, rectangle.bottomRight.x, rectangle.bottomRight.y);
      map.set(rectangle, component);
    }
    return map;
  };

  const mouseEventDataAt = (rectangle: Boundary): MouseEventData => {
    const mouseEventData = new MouseEventData();
    mouseEventData.x = rectangle.center.x;
    mouseEventData.y = rectangle.center.y;
    return mouseEventData;
  };

  const mouseEventDataBetween = (rectangle1: Boundary, rectangle2: Boundary): MouseEventData => {
    const mouseEventData = new MouseEventData();
    mouseEventData.x = (rectangle1.center.x + rectangle2.center.x) / 2;
    mouseEventData.y = (rectangle1.center.y + rectangle2.center.y) / 2;
    return mouseEventData;
  };

  const keyboardEvent = (eventType: string, arrowKey: KeyboardKey, keyboardState: KeyboardState): void => {
    const event = new KeyboardEvent(eventType, {key: arrowKey});
    keyboardState.update(event);
    if (eventType === KEY_DOWN) {
      selection.onKeyPress(new MouseEventData(), keyboardState);
    } else {
      selection.onKeyRelease(new MouseEventData(), keyboardState);
    }
  };

  const selectRectangle = (mouseEventStart: MouseEventData, mouseEventEnd: MouseEventData): void => {
    selection.onLeftDown(mouseEventStart, new KeyboardState());
    selection.onMouseMove(mouseEventEnd, new KeyboardState());
    selection.onLeftUp(mouseEventEnd, new KeyboardState());
  };

  const selectInversionRectangle = (mouseEventStart: MouseEventData, mouseEventEnd: MouseEventData): void => {
    selection.onRightDown(mouseEventStart, new KeyboardState());
    selection.onMouseMove(mouseEventEnd, new KeyboardState());
    selection.onRightUp(mouseEventEnd, new KeyboardState());
  };

  const leftClick = (mouseEvent: MouseEventData): void => {
    selection.onLeftDown(mouseEvent, new KeyboardState());
    selection.onLeftUp(mouseEvent, new KeyboardState());
    selection.onLeftClick(mouseEvent, new KeyboardState());
  };

  const rightClick = (mouseEvent: MouseEventData): void => {
    selection.onRightDown(mouseEvent, new KeyboardState());
    selection.onRightUp(mouseEvent, new KeyboardState());
    selection.onRightClick(mouseEvent, new KeyboardState());
  };

  it('should create an instance', () => {
    expect(selection).toBeTruthy();
  });

  it('#cancelOnGoing() calls reset', () => {
    spyOn(selection, 'reset');
    selection.cancelOnGoing();
    expect(selection.reset).toHaveBeenCalled();
  });

  it('#cancelOnGoing() calls svgTransformationService.terminate', () => {
    spyOn(Tool.SVG_TRANSFORMATION_SERVICE, 'terminate');
    selection.cancelOnGoing();
    expect(Tool.SVG_TRANSFORMATION_SERVICE.terminate).toHaveBeenCalled();
  });

  it('#onRemovingTool() calls cancelOnGoing()', () => {
    spyOn(selection, 'cancelOnGoing');
    selection.onRemovingTool(new MouseEventData(), new KeyboardState());
    expect(selection.cancelOnGoing).toHaveBeenCalled();
  });

  it('#selectSvgComponents() works as expected', () => {
    const cancelSpy = spyOn(selection, 'cancelOnGoing');
    selection.selectSvgComponents([new SvgRectangleComponent(), new SvgRectangleComponent()]);
    expect(cancelSpy).toHaveBeenCalled();
    expect(selection[SELECTION_RECTANGLE][SELECTED_COMPONENTS].length).toBe(2);
    expect(selection[SELECTION_STATE]).toBe(SelectionState.Manipulation);
  });

  it('#selectSvgComponents() does not change state if components=[]', () => {
    const cancelSpy = spyOn(selection, 'cancelOnGoing');
    selection.selectSvgComponents([]);
    expect(cancelSpy).toHaveBeenCalled();
    expect(selection[SELECTION_STATE]).toBe(SelectionState.Nothing);
  });

  it('#onLeftDown() selects component', () => {
    const rectangles = setupRectanglesOnBoard();
    selection.onLeftDown(mouseEventDataAt(RECTANGLE1), new KeyboardState());
    expect(selection[SELECTION_RECTANGLE][SELECTED_COMPONENTS].length).toBe(1);
    expect(rectangles.get(RECTANGLE1)).toEqual(selection[SELECTION_RECTANGLE][SELECTED_COMPONENTS][0]);
  });

  it('#onLeftDown() selection rectangle will not select components when not in contact', () => {
    setupRectanglesOnBoard();
    selectRectangle(mouseEventDataBetween(RECTANGLE1, RECTANGLE2), mouseEventDataBetween(RECTANGLE3, RECTANGLE4));
    expect(selection[SELECTION_RECTANGLE][SELECTED_COMPONENTS].length).toBe(0);
  });

  it('#onLeftDown() can drag control point', () => {
    setupRectanglesOnBoard();
    const mouseEvent = new MouseEventData();
    mouseEvent.x = -1;
    mouseEvent.y = -1;
    selectRectangle(mouseEvent, mouseEventDataAt(RECTANGLE4));
    mouseEvent.x = BOARD_SIZE / 2;
    mouseEvent.y = 0;
    selection.onLeftDown(mouseEvent, new KeyboardState());
    mouseEvent.x = BOARD_SIZE / 2;
    mouseEvent.y = BOARD_SIZE / 2;
    selection.onMouseMove(mouseEvent, new KeyboardState());
    selection.onLeftUp(mouseEvent, new KeyboardState());

    const VISUAL_SELECTION = 'visualSelection';
    const selectionBox = selection[SELECTION_RECTANGLE][VISUAL_SELECTION].selection as unknown as SvgSelectionComponent;
    const boundary = selectionBox.getBoundary();
    expect(boundary.topLeft).toEqual({x: 0, y: BOARD_SIZE / 2});
    expect(boundary.bottomRight).toEqual({x: BOARD_SIZE, y: BOARD_SIZE});
  });

  it('#onLeftDown() can still select after Ctrl + A', () => {
    setupRectanglesOnBoard();
    Tool.KEYBOARD_MANAGER_SERVICE.receiveKeyboardEvent(new KeyboardEvent(KEY_DOWN, {key: KeyboardKey.Ctrl}));
    Tool.KEYBOARD_MANAGER_SERVICE.receiveKeyboardEvent(new KeyboardEvent(KEY_DOWN, {key: KeyboardKey.A}));
    selection.onKeyPress(new MouseEventData(), Tool.KEYBOARD_MANAGER_SERVICE.getKeyboardState());
    leftClick(mouseEventDataAt(RECTANGLE1));
    expect(selection[SELECTION_RECTANGLE][SELECTED_COMPONENTS].length).toBe(1);
  });

  it('#onRightDown() can add components with inversion rectangle', () => {
    setupRectanglesOnBoard();
    selectRectangle(mouseEventDataBetween(RECTANGLE1, RECTANGLE3), mouseEventDataAt(RECTANGLE2));
    selectInversionRectangle(mouseEventDataBetween(RECTANGLE1, RECTANGLE3), mouseEventDataAt(RECTANGLE4));
    expect(selection[SELECTION_RECTANGLE][SELECTED_COMPONENTS].length).toBe(BOARD_SETUP.length);
  });

  it('#onRightDown() can remove components with inversion rectangle', () => {
    setupRectanglesOnBoard();
    selectRectangle(mouseEventDataBetween(RECTANGLE1, RECTANGLE3), mouseEventDataAt(RECTANGLE2));
    selectInversionRectangle(mouseEventDataBetween(RECTANGLE1, RECTANGLE3), mouseEventDataAt(RECTANGLE2));
    expect(selection[SELECTION_RECTANGLE][SELECTED_COMPONENTS].length).toBe(0);
  });

  it('#onRightDown() can remove and add components at the same time with inversion rectangle', () => {
    setupRectanglesOnBoard();
    selectRectangle(mouseEventDataBetween(RECTANGLE1, RECTANGLE3), mouseEventDataAt(RECTANGLE2));
    selectInversionRectangle(mouseEventDataBetween(RECTANGLE1, RECTANGLE2), mouseEventDataAt(RECTANGLE3));
    expect(selection[SELECTION_RECTANGLE][SELECTED_COMPONENTS].length).toBe(2);
  });

  it('#onLeftClick() selects component and unselects everything else', () => {
    const rectangles = setupRectanglesOnBoard();
    selectRectangle(mouseEventDataAt(RECTANGLE1), mouseEventDataAt(RECTANGLE4));
    leftClick(mouseEventDataAt(RECTANGLE3));
    expect(selection[SELECTION_RECTANGLE][SELECTED_COMPONENTS].length).toBe(1);
    expect(rectangles.get(RECTANGLE3)).toEqual(selection[SELECTION_RECTANGLE][SELECTED_COMPONENTS][0]);
  });

  it('#onLeftClick() calls reset when there is no selected components', () => {
    setupRectanglesOnBoard();
    spyOn(selection, 'reset');
    leftClick(mouseEventDataBetween(RECTANGLE3, RECTANGLE4));
    expect(selection.reset).toHaveBeenCalled();
  });

  it('#onRightClick() selects component', () => {
    const rectangles = setupRectanglesOnBoard();
    rightClick(mouseEventDataAt(RECTANGLE2));
    expect(selection[SELECTION_RECTANGLE][SELECTED_COMPONENTS].length).toBe(1);
    expect(rectangles.get(RECTANGLE2)).toEqual(selection[SELECTION_RECTANGLE][SELECTED_COMPONENTS][0]);
  });

  it('#onRightClick() calls reset when there is no selected components', () => {
    setupRectanglesOnBoard();
    selection.onRightDown(mouseEventDataBetween(RECTANGLE3, RECTANGLE4), new KeyboardState());
    selection.onRightUp(mouseEventDataBetween(RECTANGLE3, RECTANGLE4), new KeyboardState());
    spyOn(selection, 'reset');
    selection.onRightClick(mouseEventDataBetween(RECTANGLE3, RECTANGLE4), new KeyboardState());
    expect(selection.reset).toHaveBeenCalled();
  });

  it('#onLeftUp() selects rectangle after onLeftDown()', () => {
    const rectangles = setupRectanglesOnBoard();
    selectRectangle(mouseEventDataBetween(RECTANGLE1, RECTANGLE3), mouseEventDataAt(RECTANGLE4));
    expect(selection[SELECTION_RECTANGLE][SELECTED_COMPONENTS].length).toBe(2);
    expect(rectangles.get(RECTANGLE3)).toEqual(selection[SELECTION_RECTANGLE][SELECTED_COMPONENTS][0]);
    expect(rectangles.get(RECTANGLE4)).toEqual(selection[SELECTION_RECTANGLE][SELECTED_COMPONENTS][1]);
  });

  it('#onRightUp() selects rectangle after onRightDown()', () => {
    setupRectanglesOnBoard();
    selectInversionRectangle(mouseEventDataBetween(RECTANGLE1, RECTANGLE3), mouseEventDataAt(RECTANGLE4));
    expect(selection[SELECTION_RECTANGLE][SELECTED_COMPONENTS].length).toBe(2);
  });

  it('#onWheelEvent() rotates selection by 15 degrees with wheelup', () => {
    setupRectanglesOnBoard();
    selectInversionRectangle(mouseEventDataBetween(RECTANGLE1, RECTANGLE3), mouseEventDataAt(RECTANGLE4));
    const rotationSpy = spyOn(selection[SELECTION_RECTANGLE], 'rotateClockwiseAroundCenter').and.stub();
    const mouseEventData = new MouseEventData();
    mouseEventData.wheel = MouseWheelState.WheelUp;
    selection.onWheelEvent(mouseEventData, new KeyboardState());
    const EXPECTED_ANGLE = 15;
    expect(rotationSpy).toHaveBeenCalledWith(EXPECTED_ANGLE);
  });

  it('#onWheelEvent() rotates selection by 1 degree with wheelup and Alt down', () => {
    setupRectanglesOnBoard();
    selectInversionRectangle(mouseEventDataBetween(RECTANGLE1, RECTANGLE3), mouseEventDataAt(RECTANGLE4));
    const rotationSpy = spyOn(selection[SELECTION_RECTANGLE], 'rotateClockwiseAroundCenter').and.stub();
    const mouseEventData = new MouseEventData();
    mouseEventData.wheel = MouseWheelState.WheelUp;
    const keyboardState = new KeyboardState();
    keyboardState.update(new KeyboardEvent(KEY_DOWN, {key: (KeyboardKey.Alt).toString()}));
    selection.onWheelEvent(mouseEventData, keyboardState);
    expect(rotationSpy).toHaveBeenCalledWith(1);
  });

  it('#onWheelEvent() rotates selection by -15 degrees with wheeldown', () => {
    setupRectanglesOnBoard();
    selectInversionRectangle(mouseEventDataBetween(RECTANGLE1, RECTANGLE3), mouseEventDataAt(RECTANGLE4));
    const rotationSpy = spyOn(selection[SELECTION_RECTANGLE], 'rotateClockwiseAroundCenter').and.stub();
    const mouseEventData = new MouseEventData();
    mouseEventData.wheel = MouseWheelState.WheelDown;
    selection.onWheelEvent(mouseEventData, new KeyboardState());
    const EXPECTED_ANGLE = -15;
    expect(rotationSpy).toHaveBeenCalledWith(EXPECTED_ANGLE);
  });

  it('#onWheelEvent() rotates selection by -1 degree with wheeldown and Alt down', () => {
    setupRectanglesOnBoard();
    selectInversionRectangle(mouseEventDataBetween(RECTANGLE1, RECTANGLE3), mouseEventDataAt(RECTANGLE4));
    const rotationSpy = spyOn(selection[SELECTION_RECTANGLE], 'rotateClockwiseAroundCenter').and.stub();
    const mouseEventData = new MouseEventData();
    mouseEventData.wheel = MouseWheelState.WheelDown;
    const keyboardState = new KeyboardState();
    keyboardState.update(new KeyboardEvent(KEY_DOWN, {key: (KeyboardKey.Alt).toString()}));
    selection.onWheelEvent(mouseEventData, keyboardState);
    expect(rotationSpy).toHaveBeenCalledWith(-1);
  });

  it('#onWheelEvent() rotates components individually when shift is pressed', () => {
    setupRectanglesOnBoard();
    selectInversionRectangle(mouseEventDataBetween(RECTANGLE1, RECTANGLE3), mouseEventDataAt(RECTANGLE4));
    const rotationSpy = spyOn(selection[SELECTION_RECTANGLE], 'rotateClockwiseAroundSelf').and.stub();
    const mouseEventData = new MouseEventData();
    mouseEventData.wheel = MouseWheelState.WheelUp;
    const keyboardState = new KeyboardState();
    keyboardState.update(new KeyboardEvent(KEY_DOWN, {key: (KeyboardKey.LShift).toString()}));
    selection.onWheelEvent(mouseEventData, keyboardState);
    const EXPECTED_ANGLE = 15;
    expect(rotationSpy).toHaveBeenCalledWith(EXPECTED_ANGLE);
  });

  it('#onKeyPress() moves selection', () => {
    const rectangles = setupRectanglesOnBoard();
    selectRectangle(mouseEventDataAt(RECTANGLE4), mouseEventDataAt(RECTANGLE4));
    const keyboardState = new KeyboardState();
    keyboardEvent(KEY_DOWN, KeyboardKey.Left, keyboardState);
    keyboardEvent(KEY_DOWN, KeyboardKey.Down, keyboardState);

    const WRONG = 10000;
    let newX = WRONG;
    let newY = -WRONG;
    const rectangle = rectangles.get(RECTANGLE4);
    if (rectangle !== undefined) {
      newX = rectangle.getCenter().x;
      newY = rectangle.getCenter().y;
    }
    expect(newX).toBeLessThan(RECTANGLE4.center.x);
    expect(newY).toBeGreaterThan(RECTANGLE4.center.y);
    selection.reset();
  });

  it('#onKeyPress() selects every components after Ctrl + A', () => {
    setupRectanglesOnBoard();
    Tool.KEYBOARD_MANAGER_SERVICE.receiveKeyboardEvent(new KeyboardEvent(KEY_DOWN, {key: KeyboardKey.Ctrl}));
    Tool.KEYBOARD_MANAGER_SERVICE.receiveKeyboardEvent(new KeyboardEvent(KEY_DOWN, {key: KeyboardKey.A}));
    selection.onKeyPress(new MouseEventData(), Tool.KEYBOARD_MANAGER_SERVICE.getKeyboardState());
    expect(selection[SELECTION_RECTANGLE][SELECTED_COMPONENTS].length).toBe(BOARD_SETUP.length);
  });

  it('#onKeyPress() after Ctrl + A does not change selection state on empty board', () => {
    Tool.KEYBOARD_MANAGER_SERVICE.receiveKeyboardEvent(new KeyboardEvent(KEY_DOWN, {key: KeyboardKey.Ctrl}));
    Tool.KEYBOARD_MANAGER_SERVICE.receiveKeyboardEvent(new KeyboardEvent(KEY_DOWN, {key: KeyboardKey.A}));
    selection.onKeyPress(new MouseEventData(), Tool.KEYBOARD_MANAGER_SERVICE.getKeyboardState());
    expect(selection[SELECTION_STATE]).toBe(SelectionState.Nothing);
  });

  it('#onKeyPress() does nothing after Ctrl + A when action is occuring', () => {
    setupRectanglesOnBoard();
    selection.onLeftDown(mouseEventDataBetween(RECTANGLE1, RECTANGLE4), new KeyboardState());
    Tool.KEYBOARD_MANAGER_SERVICE.receiveKeyboardEvent(new KeyboardEvent(KEY_DOWN, {key: KeyboardKey.Ctrl}));
    Tool.KEYBOARD_MANAGER_SERVICE.receiveKeyboardEvent(new KeyboardEvent(KEY_DOWN, {key: KeyboardKey.A}));
    selection.onKeyPress(new MouseEventData(), Tool.KEYBOARD_MANAGER_SERVICE.getKeyboardState());
    expect(selection[SELECTION_RECTANGLE][SELECTED_COMPONENTS].length).toBe(0);
  });

  it('#onKeyPress() deletes all selected components after Delete key', () => {
    setupRectanglesOnBoard();
    selectRectangle(mouseEventDataBetween(RECTANGLE3, RECTANGLE4), mouseEventDataAt(RECTANGLE1));
    Tool.KEYBOARD_MANAGER_SERVICE.receiveKeyboardEvent(new KeyboardEvent(KEY_DOWN, {key: KeyboardKey.Delete}));

    const saveSpy = spyOn(Tool.UNDO_REDO_SERVICE, 'saveSvgBoard').and.stub();
    const resetSpy = spyOn(selection, 'reset');
    selection.onKeyPress(new MouseEventData(), Tool.KEYBOARD_MANAGER_SERVICE.getKeyboardState());
    expect(Tool.SVG_COMPONENT_MANAGER.componentsCount()).toBe(2);
    expect(saveSpy).toHaveBeenCalled();
    expect(resetSpy).toHaveBeenCalled();
  });

  it('#onKeyPress() adds selected components to clipboard after Ctrl + C keys', () => {
    setupRectanglesOnBoard();
    selectRectangle(mouseEventDataBetween(RECTANGLE3, RECTANGLE4), mouseEventDataAt(RECTANGLE1));
    Tool.KEYBOARD_MANAGER_SERVICE.receiveKeyboardEvent(new KeyboardEvent(KEY_DOWN, {key: KeyboardKey.Ctrl}));
    Tool.KEYBOARD_MANAGER_SERVICE.receiveKeyboardEvent(new KeyboardEvent(KEY_DOWN, {key: KeyboardKey.C}));

    const clipboardSpy = spyOn(Tool.CLIPBOARD_SERVICE, 'replaceContent');
    selection.onKeyPress(new MouseEventData(), Tool.KEYBOARD_MANAGER_SERVICE.getKeyboardState());
    expect(clipboardSpy).toHaveBeenCalled();
  });

  it('#onKeyPress() does nothing if no components are selected after Delete key', () => {
    setupRectanglesOnBoard();
    Tool.KEYBOARD_MANAGER_SERVICE.receiveKeyboardEvent(new KeyboardEvent(KEY_DOWN, {key: KeyboardKey.Delete}));

    const resetSpy = spyOn(selection, 'cancelOnGoing');
    selection.onKeyPress(new MouseEventData(), Tool.KEYBOARD_MANAGER_SERVICE.getKeyboardState());
    expect(Tool.SVG_COMPONENT_MANAGER.countAllSvg()).toBe(BOARD_SETUP.length);
    expect(resetSpy).not.toHaveBeenCalled();
  });

  it('#onKeyPress() adds selected components to clipboard after Ctrl + X keys', () => {
    setupRectanglesOnBoard();
    selectRectangle(mouseEventDataBetween(RECTANGLE3, RECTANGLE4), mouseEventDataAt(RECTANGLE1));
    Tool.KEYBOARD_MANAGER_SERVICE.receiveKeyboardEvent(new KeyboardEvent(KEY_DOWN, {key: KeyboardKey.Ctrl}));
    Tool.KEYBOARD_MANAGER_SERVICE.receiveKeyboardEvent(new KeyboardEvent(KEY_DOWN, {key: KeyboardKey.X}));

    const clipboardSpy = spyOn(Tool.CLIPBOARD_SERVICE, 'replaceContent');
    selection.onKeyPress(new MouseEventData(), Tool.KEYBOARD_MANAGER_SERVICE.getKeyboardState());
    expect(clipboardSpy).toHaveBeenCalled();
  });

  it('#onKeyPress() deletes selected components after Ctrl + X keys', () => {
    setupRectanglesOnBoard();
    selectRectangle(mouseEventDataBetween(RECTANGLE3, RECTANGLE4), mouseEventDataAt(RECTANGLE1));
    Tool.KEYBOARD_MANAGER_SERVICE.receiveKeyboardEvent(new KeyboardEvent(KEY_DOWN, {key: KeyboardKey.Ctrl}));
    Tool.KEYBOARD_MANAGER_SERVICE.receiveKeyboardEvent(new KeyboardEvent(KEY_DOWN, {key: KeyboardKey.X}));

    const saveSpy = spyOn(Tool.UNDO_REDO_SERVICE, 'saveSvgBoard').and.stub();
    const resetSpy = spyOn(selection, 'reset');
    selection.onKeyPress(new MouseEventData(), Tool.KEYBOARD_MANAGER_SERVICE.getKeyboardState());
    expect(Tool.SVG_COMPONENT_MANAGER.componentsCount()).toBe(2);
    expect(saveSpy).toHaveBeenCalled();
    expect(resetSpy).toHaveBeenCalled();
  });

  it('#onKeyPress() duplicates selected components after Ctrl + D keys', () => {
    setupRectanglesOnBoard();
    selectRectangle(mouseEventDataBetween(RECTANGLE3, RECTANGLE4), mouseEventDataAt(RECTANGLE1));
    Tool.KEYBOARD_MANAGER_SERVICE.receiveKeyboardEvent(new KeyboardEvent(KEY_DOWN, {key: KeyboardKey.Ctrl}));
    Tool.KEYBOARD_MANAGER_SERVICE.receiveKeyboardEvent(new KeyboardEvent(KEY_DOWN, {key: KeyboardKey.D}));

    const saveSpy = spyOn(Tool.UNDO_REDO_SERVICE, 'saveSvgBoard').and.stub();
    const resetSpy = spyOn(Tool.SVG_TRANSFORMATION_SERVICE, 'reset');
    selection.onKeyPress(new MouseEventData(), Tool.KEYBOARD_MANAGER_SERVICE.getKeyboardState());
    expect(Tool.SVG_COMPONENT_MANAGER.componentsCount()).toBe(BOARD_SETUP.length + 2);
    expect(saveSpy).toHaveBeenCalled();
    expect(resetSpy).toHaveBeenCalled();
  });

  it('#clipboardActionsAreAvailable() works as expected', () => {
    setupRectanglesOnBoard();
    expect(selection.clipboardActionsAreAvailable()).toBeFalsy();
    selectRectangle(mouseEventDataBetween(RECTANGLE3, RECTANGLE4), mouseEventDataAt(RECTANGLE1));
    expect(selection.clipboardActionsAreAvailable()).toBeTruthy();
  });

  it('#onKeyRelease() when arrows are no longer active allows new actions to be performed', () => {
    setupRectanglesOnBoard();
    selectRectangle(mouseEventDataAt(RECTANGLE2), mouseEventDataAt(RECTANGLE2));
    const keyboardState = new KeyboardState();
    keyboardEvent(KEY_DOWN, KeyboardKey.Up, keyboardState);
    keyboardEvent(KEY_UP, KeyboardKey.Up, keyboardState);
    selection.onLeftDown(mouseEventDataBetween(RECTANGLE1, RECTANGLE2), keyboardState);
    expect(selection[CURSOR_STATE].getAnchorPoint()).toEqual(
      {x: mouseEventDataBetween(RECTANGLE1, RECTANGLE2).x, y: mouseEventDataBetween(RECTANGLE1, RECTANGLE2).y},
    );
  });
});
// tslint:disable:max-file-line-count
// This is only a test file; not a functionality file
