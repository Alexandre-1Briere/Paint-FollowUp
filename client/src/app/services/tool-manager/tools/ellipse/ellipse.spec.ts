import {CommonModule} from '@angular/common';
import {Component, NgModule, ViewContainerRef} from '@angular/core';
import {TestBed} from '@angular/core/testing';
import {SvgEllipseComponent} from '../../../../components/drawing/work-board/svg-ellipse/svg-ellipse.component';
import {SvgSelectionComponent} from '../../../../components/drawing/work-board/svg-selection/svg-selection.component';
import {DEFAULT_BLUE, DEFAULT_YELLOW} from '../../../../constants/colors';
import {KEY_DOWN} from '../../../../constants/keyboard';
import {KeyboardKey} from '../../../../enums/keyboard';
import {SvgStatus} from '../../../../enums/svg';
import {KeyboardState} from '../../../../logic/events/keyboard/keyboard-state';
import {MouseEventData, MouseLocation} from '../../../../logic/events/mouse/mouse-event-data';
import {KeyboardManagerService} from '../../../events/keyboard-manager.service';
import {SvgComponentsManagerService} from '../../../svg/svg-components-manager.service';
import {ToolsOptionsManagerService} from '../../tools-options-manager/tools-options-manager.service';
import {Tool} from '../tool/tool';
import {Ellipse} from './ellipse';

class EllipseTestable extends Ellipse {
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
    SvgEllipseComponent,
    SvgSelectionComponent,
    MockViewComponent,
  ],
  entryComponents: [
    SvgEllipseComponent,
    SvgSelectionComponent,
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

describe('Ellipse', () => {
  let ellipse: EllipseTestable;
  let mockViewComponent: MockViewComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestModule],
    })
      .compileComponents();

    ellipse = new EllipseTestable();

    Tool.SVG_COMPONENT_MANAGER = TestBed.get(SvgComponentsManagerService);
    Tool.TOOL_OPTIONS_MANAGER = TestBed.get(ToolsOptionsManagerService);
    Tool.KEYBOARD_MANAGER_SERVICE = TestBed.get(KeyboardManagerService);

    const fixture = TestBed.createComponent(MockViewComponent);
    mockViewComponent = fixture.componentInstance;
    Tool.SVG_COMPONENT_MANAGER.initialiseViewContainerRef(mockViewComponent.viewContainerRef);
  });

  it('should create an instance', () => {
    expect(new Ellipse()).toBeTruthy();
  });

  it('should return the instance of a "Ellipse" type', () => {
    const ellipseInstance = Ellipse.getInstance();
    expect(ellipseInstance instanceof Ellipse).toBeTruthy();
  });

  it('#createEllipse() should call createSvgComponent properly', () => {
    spyOn(Tool.SVG_COMPONENT_MANAGER, 'createSvgComponent');
    ellipse.onLeftDown(new MouseEventData(), new KeyboardState());
    ellipse.onLeftUp(new MouseEventData(), new KeyboardState());
    expect(Tool.SVG_COMPONENT_MANAGER.createSvgComponent).toHaveBeenCalled();
  });

  it('#createEllipse() sets thickness correctly', () => {
    ellipse.onLeftDown(new MouseEventData(), new KeyboardState());
    ellipse.onLeftUp(new MouseEventData(), new KeyboardState());

    const CREATED_SVG_INDEX = 0;
    let drawnSvg = Tool.SVG_COMPONENT_MANAGER.getSvgComponent(CREATED_SVG_INDEX, SvgEllipseComponent) as SvgEllipseComponent;
    let toolSize = Tool.TOOL_OPTIONS_MANAGER.getSettings().size;
    let testedSize = toolSize !== undefined ? toolSize : Ellipse.DEFAULT_SIZE;
    expect(drawnSvg.getOutlineThickness()).toEqual(testedSize);

    Tool.SVG_COMPONENT_MANAGER.resetSvgComponents();
    Tool.TOOL_OPTIONS_MANAGER.getSettings().setBorderSize(DEFAULT_OUTLINE_THICKNESS);
    ellipse.onLeftDown(new MouseEventData(), new KeyboardState());
    ellipse.onLeftUp(new MouseEventData(), new KeyboardState());

    drawnSvg = Tool.SVG_COMPONENT_MANAGER.getSvgComponent(CREATED_SVG_INDEX, SvgEllipseComponent) as SvgEllipseComponent;
    toolSize = Tool.TOOL_OPTIONS_MANAGER.getSettings().borderSize;
    testedSize = toolSize !== undefined ? toolSize : Ellipse.DEFAULT_SIZE;
    expect(drawnSvg.getOutlineThickness()).toEqual(testedSize);
  });

  it('#createEllipse() sets primaryColor correctly', () => {
    ellipse.onLeftDown(new MouseEventData(), new KeyboardState());
    ellipse.onLeftUp(new MouseEventData(), new KeyboardState());

    const CREATED_SVG_INDEX = 0;
    let drawnSvg = Tool.SVG_COMPONENT_MANAGER.getSvgComponent(CREATED_SVG_INDEX, SvgEllipseComponent) as SvgEllipseComponent;
    let color = Tool.TOOL_OPTIONS_MANAGER.getSettings().primaryColor;
    let testedColor = color !== undefined ? color : DEFAULT_BLUE;
    expect(drawnSvg.getPrimaryColor()).toEqual(testedColor);

    Tool.SVG_COMPONENT_MANAGER.resetSvgComponents();
    Tool.TOOL_OPTIONS_MANAGER.setPrimaryColor(DEFAULT_COLOR);
    ellipse.onLeftDown(new MouseEventData(), new KeyboardState());
    ellipse.onLeftUp(new MouseEventData(), new KeyboardState());

    drawnSvg = Tool.SVG_COMPONENT_MANAGER.getSvgComponent(CREATED_SVG_INDEX, SvgEllipseComponent) as SvgEllipseComponent;
    color = Tool.TOOL_OPTIONS_MANAGER.getSettings().primaryColor;
    testedColor = color !== undefined ? color : DEFAULT_BLUE;
    expect(drawnSvg.getPrimaryColor()).toEqual(testedColor);
  });

  it('#createEllipse() sets secondaryColor correctly', () => {
    ellipse.onLeftDown(new MouseEventData(), new KeyboardState());
    ellipse.onLeftUp(new MouseEventData(), new KeyboardState());

    const CREATED_SVG_INDEX = 0;
    let drawnSvg = Tool.SVG_COMPONENT_MANAGER.getSvgComponent(CREATED_SVG_INDEX, SvgEllipseComponent) as SvgEllipseComponent;
    let color = Tool.TOOL_OPTIONS_MANAGER.getSettings().secondaryColor;
    let testedColor = color !== undefined ? color : DEFAULT_YELLOW;
    expect(drawnSvg.getSecondaryColor()).toEqual(testedColor);

    Tool.SVG_COMPONENT_MANAGER.resetSvgComponents();
    Tool.TOOL_OPTIONS_MANAGER.setSecondaryColor(DEFAULT_COLOR);
    ellipse.onLeftDown(new MouseEventData(), new KeyboardState());
    ellipse.onLeftUp(new MouseEventData(), new KeyboardState());

    drawnSvg = Tool.SVG_COMPONENT_MANAGER.getSvgComponent(CREATED_SVG_INDEX, SvgEllipseComponent) as SvgEllipseComponent;
    color = Tool.TOOL_OPTIONS_MANAGER.getSettings().secondaryColor;
    testedColor = color !== undefined ? color : DEFAULT_YELLOW;
    expect(drawnSvg.getSecondaryColor()).toEqual(testedColor);
  });

  it('#createEllipse() with SvgStatus=permanent removes boundingRect', () => {
    ellipse.origin = {x: 0, y: 0};
    ellipse.coords = {x: 2, y: 2};
    ellipse.createEllipse(SvgStatus.InProgress);
    const removeSpy = spyOn(Tool.SVG_COMPONENT_MANAGER, 'removeSvgComponent');
    ellipse.createEllipse(SvgStatus.Permanent);
    expect(removeSpy).toHaveBeenCalled();
    expect(ellipse.boundingRect).toBeUndefined();
  });

  it('#createBoundingRect() returns undefined when either coords or origin is undefined', () => {
    expect(ellipse.createBoundingRect()).toBeUndefined();
    ellipse.origin = {x: 0, y: 0};
    expect(ellipse.createBoundingRect()).toBeUndefined();
    ellipse.origin = undefined;
    ellipse.coords = {x: 2, y: 2};
    expect(ellipse.createBoundingRect()).toBeUndefined();
  });

  it('#reset() removes boundingRect', () => {
    ellipse.origin = {x: 0, y: 0};
    ellipse.coords = {x: 5, y: 5};
    ellipse.boundingRect = ellipse.createBoundingRect();
    const removeSpy = spyOn(Tool.SVG_COMPONENT_MANAGER, 'removeSvgComponent');
    ellipse.reset();
    expect(removeSpy).toHaveBeenCalled();
    expect(ellipse.boundingRect).toBeUndefined();
  });

  it('#onKeyPress() should call cancelOnGoing with Escape key pressed', () => {
    spyOn(ellipse, 'cancelOnGoing');

    const KEY_ESCAPE = KeyboardKey.Esc;
    const eventEscape = new KeyboardEvent(KEY_DOWN, {key: KEY_ESCAPE.toString()});
    const keyboardState = new KeyboardState();
    keyboardState.update(eventEscape);
    ellipse.onKeyPress(new MouseEventData(), keyboardState);

    expect(ellipse.cancelOnGoing).toHaveBeenCalled();
  });

  it('#onKeyPress() should call onMouseMove', () => {
    spyOn(ellipse, 'onMouseMove');
    ellipse.onKeyPress(new MouseEventData(), new KeyboardState());
    expect(ellipse.onMouseMove).toHaveBeenCalled();
  });

  it('#onLeftDown() does not change origin when outside drawing board', () => {
    const mouseData = new MouseEventData();
    mouseData.location = MouseLocation.Outside;
    ellipse.onLeftDown(mouseData, new KeyboardState());
    expect(ellipse.origin).toBeUndefined();
  });

  it('#onLeftDown() does not set origin when already defined', () => {
    ellipse.onLeftDown(new MouseEventData(), new KeyboardState());
    const mouseData = new MouseEventData();
    const POSITION = 10;
    mouseData.x = POSITION;
    ellipse.onLeftDown(mouseData, new KeyboardState());

    const EXPECTED_POSITION = 0;
    expect(ellipse.origin).toBeDefined();
    const X = ellipse.origin !== undefined ? ellipse.origin.x : POSITION;
    expect(X).toBe(EXPECTED_POSITION);
  });

  it('#onLeftUp() does not call reset when origin is undefined', () => {
    spyOn(ellipse, 'reset');
    ellipse.onLeftUp(new MouseEventData(), new KeyboardState());
    expect(ellipse.reset).not.toHaveBeenCalled();
  });

  it('#onMouseMove() does not call createEllipse when origin is undefined', () => {
    spyOn(ellipse, 'createEllipse');
    ellipse.onMouseMove(new MouseEventData(), new KeyboardState());
    expect(ellipse.createEllipse).not.toHaveBeenCalled();
  });

  it('#cancelOnGoing() calls to reset', () => {
    spyOn(ellipse, 'reset');
    ellipse.cancelOnGoing(new MouseEventData(), new KeyboardState());
    expect(ellipse.reset).toHaveBeenCalled();
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
    ellipse.onLeftDown(mouseData1, new KeyboardState());
    ellipse.onMouseMove(mouseData2, new KeyboardState());

    const EXPECTED_POSITION = 100;
    const BAD_POSITION = -1;
    let testedX = BAD_POSITION;
    let testedY = BAD_POSITION;
    if (ellipse.coords !== undefined) {
      testedX = ellipse.coords.x;
      testedY = ellipse.coords.y;
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
    ellipse.onLeftDown(mouseData1, new KeyboardState());
    ellipse.onMouseMove(mouseData2, new KeyboardState());

    const EXPECTED_POSITION = 50;
    const BAD_POSITION = -1;
    let testedX = BAD_POSITION;
    let testedY = BAD_POSITION;
    if (ellipse.coords !== undefined) {
      testedX = ellipse.coords.x;
      testedY = ellipse.coords.y;
    }

    expect(testedX).toBeCloseTo(EXPECTED_POSITION);
    expect(testedY).toBeCloseTo(EXPECTED_POSITION);
  });

  it('#computeCoords() returns undefined when origin is undefined', () => {
    ellipse.computeCoords(new MouseEventData());
    expect(ellipse.coords).toBeUndefined();
  });
});
