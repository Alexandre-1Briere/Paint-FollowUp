import { CommonModule } from '@angular/common';
import { Component, NgModule, ViewContainerRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { SvgRectangleComponent } from '../../../../components/drawing/work-board/svg-rectangle/svg-rectangle.component';
import { DEFAULT_BLUE, DEFAULT_YELLOW } from '../../../../constants/colors';
import { KEY_DOWN } from '../../../../constants/keyboard';
import { KeyboardKey } from '../../../../enums/keyboard';
import { KeyboardState } from '../../../../logic/events/keyboard/keyboard-state';
import { MouseEventData, MouseLocation } from '../../../../logic/events/mouse/mouse-event-data';
import { TestSpeedUpgrader } from '../../../../testHelpers/test-speed-upgrader.spec';
import { KeyboardManagerService } from '../../../events/keyboard-manager.service';
import { SvgComponentsManagerService } from '../../../svg/svg-components-manager.service';
import { ToolsOptionsManagerService } from '../../tools-options-manager/tools-options-manager.service';
import { Tool } from '../tool/tool';
import { Rectangle } from './rectangle';

class RectangleTestable extends Rectangle {
  constructor() { super(); }
}

// tslint:disable:max-classes-per-file
@Component({
  selector: 'app-mock-view-component',
  template: '',
})
class MockViewComponent {
  constructor(public viewContainerRef: ViewContainerRef) {}
}

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [
    SvgRectangleComponent,
    MockViewComponent,
  ],
  entryComponents: [
    SvgRectangleComponent,
  ],
  providers: [
    SvgComponentsManagerService,
    ToolsOptionsManagerService,
    KeyboardManagerService,
  ],
})
class TestModule {}

const DEFAULT_OUTLINE_THICKNESS = '10';
const DEFAULT_COLOR = '#112233';

describe('Rectangle', () => {
  let rectangle: RectangleTestable;
  let mockViewComponent: MockViewComponent;
  TestSpeedUpgrader.overWriteModuleResetForSpeedGain();
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestModule],
    })
    .compileComponents();

    rectangle = new RectangleTestable();

    Tool.SVG_COMPONENT_MANAGER = TestBed.get(SvgComponentsManagerService);
    Tool.TOOL_OPTIONS_MANAGER = TestBed.get(ToolsOptionsManagerService);
    Tool.KEYBOARD_MANAGER_SERVICE = TestBed.get(KeyboardManagerService);

    const fixture = TestBed.createComponent(MockViewComponent);
    mockViewComponent = fixture.componentInstance;
    Tool.SVG_COMPONENT_MANAGER.initialiseViewContainerRef(mockViewComponent.viewContainerRef);
  });

  it('should create an instance', () => {
    expect(new Rectangle()).toBeTruthy();
  });

  it('should return the instance of a "Rectangle" type', () => {
    const rectangleInstance = Rectangle.getInstance();
    expect(rectangleInstance instanceof Rectangle).toBeTruthy();
  });

  it('#createRectangle() should call createSvgComponent properly', () => {
    spyOn(Tool.SVG_COMPONENT_MANAGER, 'createSvgComponent');
    rectangle.onLeftDown(new MouseEventData(), new KeyboardState());
    rectangle.onLeftUp(new MouseEventData(), new KeyboardState());
    expect(Tool.SVG_COMPONENT_MANAGER.createSvgComponent).toHaveBeenCalled();
  });

  it('#createRectangle() sets thickness correctly', () => {
    rectangle.onLeftDown(new MouseEventData(), new KeyboardState());
    rectangle.onLeftUp(new MouseEventData(), new KeyboardState());

    const CREATED_SVG_INDEX = 0;
    let drawnSvg = Tool.SVG_COMPONENT_MANAGER.getSvgComponent(CREATED_SVG_INDEX, SvgRectangleComponent) as SvgRectangleComponent;
    let toolSize = Tool.TOOL_OPTIONS_MANAGER.getSettings().size;
    let testedSize = toolSize !== undefined ? toolSize : Rectangle.DEFAULT_SIZE;
    expect(drawnSvg.getOutlineThickness()).toEqual(testedSize);

    Tool.SVG_COMPONENT_MANAGER.resetSvgComponents();
    Tool.TOOL_OPTIONS_MANAGER.getSettings().setBorderSize(DEFAULT_OUTLINE_THICKNESS);
    rectangle.onLeftDown(new MouseEventData(), new KeyboardState());
    rectangle.onLeftUp(new MouseEventData(), new KeyboardState());

    drawnSvg = Tool.SVG_COMPONENT_MANAGER.getSvgComponent(CREATED_SVG_INDEX, SvgRectangleComponent) as SvgRectangleComponent;
    toolSize = Tool.TOOL_OPTIONS_MANAGER.getSettings().borderSize;
    testedSize = toolSize !== undefined ? toolSize : Rectangle.DEFAULT_SIZE;
    expect(drawnSvg.getOutlineThickness()).toEqual(testedSize);
  });

  it('#createRectangle() sets primaryColor correctly', () => {
    rectangle.onLeftDown(new MouseEventData(), new KeyboardState());
    rectangle.onLeftUp(new MouseEventData(), new KeyboardState());

    const CREATED_SVG_INDEX = 0;
    let drawnSvg = Tool.SVG_COMPONENT_MANAGER.getSvgComponent(CREATED_SVG_INDEX, SvgRectangleComponent) as SvgRectangleComponent;
    let color = Tool.TOOL_OPTIONS_MANAGER.getSettings().primaryColor;
    let testedColor = color !== undefined ? color : DEFAULT_BLUE;
    expect(drawnSvg.getPrimaryColor()).toEqual(testedColor);

    Tool.SVG_COMPONENT_MANAGER.resetSvgComponents();
    Tool.TOOL_OPTIONS_MANAGER.setPrimaryColor(DEFAULT_COLOR);
    rectangle.onLeftDown(new MouseEventData(), new KeyboardState());
    rectangle.onLeftUp(new MouseEventData(), new KeyboardState());

    drawnSvg = Tool.SVG_COMPONENT_MANAGER.getSvgComponent(CREATED_SVG_INDEX, SvgRectangleComponent) as SvgRectangleComponent;
    color = Tool.TOOL_OPTIONS_MANAGER.getSettings().primaryColor;
    testedColor = color !== undefined ? color : DEFAULT_BLUE;
    expect(drawnSvg.getPrimaryColor()).toEqual(testedColor);
  });

  it('#createRectangle() sets secondaryColor correctly', () => {
    rectangle.onLeftDown(new MouseEventData(), new KeyboardState());
    rectangle.onLeftUp(new MouseEventData(), new KeyboardState());

    const CREATED_SVG_INDEX = 0;
    let drawnSvg = Tool.SVG_COMPONENT_MANAGER.getSvgComponent(CREATED_SVG_INDEX, SvgRectangleComponent) as SvgRectangleComponent;
    let color = Tool.TOOL_OPTIONS_MANAGER.getSettings().secondaryColor;
    let testedColor = color !== undefined ? color : DEFAULT_YELLOW;
    expect(drawnSvg.getSecondaryColor()).toEqual(testedColor);

    Tool.SVG_COMPONENT_MANAGER.resetSvgComponents();
    Tool.TOOL_OPTIONS_MANAGER.setSecondaryColor(DEFAULT_COLOR);
    rectangle.onLeftDown(new MouseEventData(), new KeyboardState());
    rectangle.onLeftUp(new MouseEventData(), new KeyboardState());

    drawnSvg = Tool.SVG_COMPONENT_MANAGER.getSvgComponent(CREATED_SVG_INDEX, SvgRectangleComponent) as SvgRectangleComponent;
    color = Tool.TOOL_OPTIONS_MANAGER.getSettings().secondaryColor;
    testedColor = color !== undefined ? color : DEFAULT_YELLOW;
    expect(drawnSvg.getSecondaryColor()).toEqual(testedColor);
  });

  it('#onKeyPress() should call cancelOnGoing with Escape key pressed', () => {
    spyOn(rectangle, 'cancelOnGoing');

    const KEY_ESCAPE = KeyboardKey.Esc;
    const eventEscape = new KeyboardEvent(KEY_DOWN, {key: KEY_ESCAPE.toString()});
    const keyboardState = new KeyboardState();
    keyboardState.update(eventEscape);
    rectangle.onKeyPress(new MouseEventData(), keyboardState);

    expect(rectangle.cancelOnGoing).toHaveBeenCalled();
  });

  it('#onKeyPress() should call onMouseMove', () => {
    spyOn(rectangle, 'onMouseMove');
    rectangle.onKeyPress(new MouseEventData(), new KeyboardState());
    expect(rectangle.onMouseMove).toHaveBeenCalled();
  });

  it('#onLeftDown() does not change origin when outside drawing board', () => {
    const mouseData = new MouseEventData();
    mouseData.location = MouseLocation.Outside;
    rectangle.onLeftDown(mouseData, new KeyboardState());
    expect(rectangle.origin).toBeUndefined();
  });

  it('#onLeftDown() does not set origin when already defined', () => {
    rectangle.onLeftDown(new MouseEventData(), new KeyboardState());
    const mouseData = new MouseEventData();
    const POSITION = 10;
    mouseData.x = POSITION;
    rectangle.onLeftDown(mouseData, new KeyboardState());

    const EXPECTED_POSITION = 0;
    expect(rectangle.origin).toBeDefined();
    const X = rectangle.origin !== undefined ? rectangle.origin.x : POSITION;
    expect(X).toBe(EXPECTED_POSITION);
  });

  it('#onLeftUp() does not call reset when origin is undefined', () => {
    spyOn(rectangle, 'reset');
    rectangle.onLeftUp(new MouseEventData(), new KeyboardState());
    expect(rectangle.reset).not.toHaveBeenCalled();
  });

  it('#onMouseMove() does not call createRectangle when origin is undefined', () => {
    spyOn(rectangle, 'createRectangle');
    rectangle.onMouseMove(new MouseEventData(), new KeyboardState());
    expect(rectangle.createRectangle).not.toHaveBeenCalled();
  });

  it('#cancelOnGoing() calls to reset', () => {
    spyOn(rectangle, 'reset');
    rectangle.cancelOnGoing(new MouseEventData(), new KeyboardState());
    expect(rectangle.reset).toHaveBeenCalled();
  });

  it('#computeCoords() respects square shape when shift is pressed', () => {
    const X1 = 50;
    const Y1 = 50;
    const X2 = 100;
    const Y2 = 75;

    const mouseData1 = new MouseEventData();
    mouseData1.x = X1;
    mouseData1.y = Y1;
    const mouseData2 = new MouseEventData();
    mouseData2.x = X2;
    mouseData2.y = Y2;

    const KEY_SHIFT = KeyboardKey.LShift;
    const eventShift = new KeyboardEvent(KEY_DOWN, {key: KEY_SHIFT.toString()});
    Tool.KEYBOARD_MANAGER_SERVICE.receiveKeyboardEvent(eventShift);
    rectangle.onLeftDown(mouseData1, new KeyboardState());
    rectangle.onMouseMove(mouseData2, new KeyboardState());

    const EXPECTED_POSITION = 100;
    const BAD_POSITION = -1;
    let testedX = BAD_POSITION;
    let testedY = BAD_POSITION;
    if (rectangle.coords !== undefined) {
      testedX = rectangle.coords.x;
      testedY = rectangle.coords.y;
    }

    expect(testedX).toBeCloseTo(EXPECTED_POSITION);
    expect(testedY).toBeCloseTo(EXPECTED_POSITION);
  });

  it('#computeCoords() respects square shape when shift is pressed when dragging to top-left', () => {
    const X1 = 100;
    const Y1 = 100;
    const X2 = 50;
    const Y2 = 75;

    const mouseData1 = new MouseEventData();
    mouseData1.x = X1;
    mouseData1.y = Y1;
    const mouseData2 = new MouseEventData();
    mouseData2.x = X2;
    mouseData2.y = Y2;

    const KEY_SHIFT = KeyboardKey.LShift;
    const eventShift = new KeyboardEvent(KEY_DOWN, {key: KEY_SHIFT.toString()});
    Tool.KEYBOARD_MANAGER_SERVICE.receiveKeyboardEvent(eventShift);
    rectangle.onLeftDown(mouseData1, new KeyboardState());
    rectangle.onMouseMove(mouseData2, new KeyboardState());

    const EXPECTED_POSITION = 50;
    const BAD_POSITION = -1;
    let testedX = BAD_POSITION;
    let testedY = BAD_POSITION;
    if (rectangle.coords !== undefined) {
      testedX = rectangle.coords.x;
      testedY = rectangle.coords.y;
    }

    expect(testedX).toBeCloseTo(EXPECTED_POSITION);
    expect(testedY).toBeCloseTo(EXPECTED_POSITION);
  });

  it('#computeCoords() returns undefined when origin is undefined', () => {
    rectangle.computeCoords(new MouseEventData());
    expect(rectangle.coords).toBeUndefined();
  });
});
