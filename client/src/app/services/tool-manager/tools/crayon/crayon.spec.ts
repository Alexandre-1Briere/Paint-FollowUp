import { Component, NgModule, ViewContainerRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { SvgPencilComponent } from '../../../../components/svgElement/svg-pencil/svg-pencil.component';
import { DEFAULT_BLUE } from '../../../../constants/colors';
import { KeyboardState } from '../../../../logic/events/keyboard/keyboard-state';
import { MouseButtonAction, MouseEventData, MouseLocation, MouseMovement } from '../../../../logic/events/mouse/mouse-event-data';
import { SvgComponentsManagerService } from '../../../svg/svg-components-manager.service';
import { ToolsOptionsManagerService } from '../../tools-options-manager/tools-options-manager.service';
import { Coords } from '../coords';
import { Tool } from '../tool/tool';
import { Crayon } from './crayon';

class CrayonTestable extends Crayon {
  constructor() { super(); }
  getPoints(): Coords[] { return this.points; }
  getCoords(): Coords | undefined { return this.coords; }
  setIsDrawing(isDrawing: boolean): void { this.isDrawing = isDrawing; }
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
  declarations: [
    SvgPencilComponent,
    MockViewComponent,
  ],
  entryComponents: [
    SvgPencilComponent,
  ],
  providers: [
    SvgComponentsManagerService,
    ToolsOptionsManagerService,
  ],
})
class TestModule {}

const DEFAULT_THICKNESS = '10';
const DEFAULT_COLOR = '#112233';

describe('Crayon', () => {
  let crayon: CrayonTestable;
  let mockViewComponent: MockViewComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestModule],
    })
    .compileComponents();

    crayon = new CrayonTestable();

    Tool.SVG_COMPONENT_MANAGER = TestBed.get(SvgComponentsManagerService);
    Tool.TOOL_OPTIONS_MANAGER = TestBed.get(ToolsOptionsManagerService);

    const fixture = TestBed.createComponent(MockViewComponent);
    mockViewComponent = fixture.componentInstance;
    Tool.SVG_COMPONENT_MANAGER.initialiseViewContainerRef(mockViewComponent.viewContainerRef);
  });

  it('should create an instance', () => {
    expect(new Crayon()).toBeTruthy();
  });

  it('#getInstance() should return the instance of a "Crayon" type', () => {
    const crayonInstance = Crayon.getInstance();
    expect(crayonInstance instanceof Crayon).toBeTruthy();
  });

  it('#createSvg() should call createSvgComponent properly', () => {
    spyOn(Tool.SVG_COMPONENT_MANAGER, 'createSvgComponent');
    const IS_DRAWING = true;
    crayon.setIsDrawing(IS_DRAWING);
    crayon.onLeftUp(new MouseEventData(), new KeyboardState());
    expect(Tool.SVG_COMPONENT_MANAGER.createSvgComponent).toHaveBeenCalled();
  });

  it('#createSvg() sets thickness correctly', () => {
    const IS_DRAWING = true;
    crayon.setIsDrawing(IS_DRAWING);
    crayon.onLeftUp(new MouseEventData(), new KeyboardState());

    const CREATED_SVG_INDEX = 0;
    let drawnSvg = Tool.SVG_COMPONENT_MANAGER.getSvgComponent(CREATED_SVG_INDEX, SvgPencilComponent) as SvgPencilComponent;
    let toolSize = Tool.TOOL_OPTIONS_MANAGER.getSettings().size;
    let testedSize = toolSize !== undefined ? toolSize : Crayon.DEFAULT_SIZE;
    expect(drawnSvg.getThickness()).toEqual(testedSize);

    Tool.SVG_COMPONENT_MANAGER.resetSvgComponents();
    Tool.TOOL_OPTIONS_MANAGER.getSettings().setSize(DEFAULT_THICKNESS);
    crayon.setIsDrawing(IS_DRAWING);
    crayon.onLeftUp(new MouseEventData(), new KeyboardState());

    drawnSvg = Tool.SVG_COMPONENT_MANAGER.getSvgComponent(CREATED_SVG_INDEX, SvgPencilComponent) as SvgPencilComponent;
    toolSize = Tool.TOOL_OPTIONS_MANAGER.getSettings().size;
    testedSize = toolSize !== undefined ? toolSize : Crayon.DEFAULT_SIZE;
    expect(drawnSvg.getThickness()).toEqual(testedSize);
  });

  it('#createSvg() sets color correctly', () => {
    const IS_DRAWING = true;
    crayon.setIsDrawing(IS_DRAWING);
    crayon.onLeftUp(new MouseEventData(), new KeyboardState());

    const CREATED_SVG_INDEX = 0;
    let drawnSvg = Tool.SVG_COMPONENT_MANAGER.getSvgComponent(CREATED_SVG_INDEX, SvgPencilComponent) as SvgPencilComponent;
    let color = Tool.TOOL_OPTIONS_MANAGER.getSettings().primaryColor;
    let testedColor = color !== undefined ? color : DEFAULT_BLUE;
    expect(drawnSvg.getPrimaryColor()).toEqual(testedColor);

    Tool.SVG_COMPONENT_MANAGER.resetSvgComponents();
    Tool.TOOL_OPTIONS_MANAGER.setPrimaryColor(DEFAULT_COLOR);
    crayon.setIsDrawing(IS_DRAWING);
    crayon.onLeftUp(new MouseEventData(), new KeyboardState());

    drawnSvg = Tool.SVG_COMPONENT_MANAGER.getSvgComponent(CREATED_SVG_INDEX, SvgPencilComponent) as SvgPencilComponent;
    color = Tool.TOOL_OPTIONS_MANAGER.getSettings().primaryColor;
    testedColor = color !== undefined ? color : DEFAULT_BLUE;
    expect(drawnSvg.getPrimaryColor()).toEqual(testedColor);
  });

  it('#cancelOnGoing() should resets coords and points', () => {
    crayon.cancelOnGoing(new MouseEventData(), new KeyboardState());
    const NO_POINTS = 0;
    expect(crayon.getPoints().length).toBe(NO_POINTS);
    expect(crayon.getCoords()).toBeUndefined();
  });

  it('#onLeftDown() should update coords and points', () => {
    const initialNumberPoints = crayon.getPoints().length;
    const mouseEventData = new MouseEventData();
    mouseEventData.leftButton.action = MouseButtonAction.Click;
    const X = 3;
    const Y = 4;
    mouseEventData.x = X;
    mouseEventData.y = Y;

    crayon.onLeftDown(mouseEventData, new KeyboardState());
    const WRONG = -1;
    let xTested = WRONG;
    let yTested = WRONG;
    const coords = crayon.getCoords();
    if (coords !== undefined) {
      xTested = coords.x;
      yTested = coords.y;
    }

    expect(xTested).toBe(X);
    expect(yTested).toBe(Y);
    const EXPECTED_NUMBER_POINTS = initialNumberPoints + 1;
    expect(crayon.getPoints().length).toBe(EXPECTED_NUMBER_POINTS);
  });

  it('#onLeftDown() when outside drawing board does not add points', () => {
    const mouseData = new MouseEventData();
    mouseData.location = MouseLocation.Outside;
    crayon.onLeftDown(mouseData, new KeyboardState());
    const NO_POINTS = 0;
    expect(crayon.getPoints().length).toBe(NO_POINTS);
  });

  it('#onLeftUp() should resets coords and points', () => {
    const mouseEventData = new MouseEventData();
    const X = 3;
    const Y = 4;
    mouseEventData.x = X;
    mouseEventData.y = Y;

    crayon.onLeftUp(mouseEventData, new KeyboardState());

    const EXPECTED_NUMBER_POINTS = 0;
    expect(crayon.getPoints().length).toBe(EXPECTED_NUMBER_POINTS);
    expect(crayon.getCoords()).toBeUndefined();
  });

  it('#onMouseMove() should update coords and points', () => {
    const initialNumberPoints = crayon.getPoints().length;
    const mouseEventData = new MouseEventData();
    mouseEventData.movement = MouseMovement.Moved;
    const X = 40;
    const Y = 50;
    mouseEventData.x = X;
    mouseEventData.y = Y;

    const CURRENTLY_DRAWING = true;
    crayon.setIsDrawing(CURRENTLY_DRAWING);
    crayon.onMouseMove(mouseEventData, new KeyboardState());
    const WRONG = -1;
    let xTested = WRONG;
    let yTested = WRONG;
    const coords = crayon.getCoords();
    if (coords !== undefined) {
      xTested = coords.x;
      yTested = coords.y;
    }

    expect(xTested).toBe(X);
    expect(yTested).toBe(Y);
    const EXPECTED_NUMBER_POINTS = initialNumberPoints + 1;
    expect(crayon.getPoints().length).toBe(EXPECTED_NUMBER_POINTS);
  });

  it('#onMouseMove() does not update points when isDrawing=false', () => {
    crayon.onMouseMove(new MouseEventData(), new KeyboardState());

    const NO_POINTS_ADDED = 0;
    expect(crayon.getPoints().length).toBe(NO_POINTS_ADDED);
  });

  it('#onMouseLeave() should resets coords and points', () => {
    crayon.onMouseLeave(new MouseEventData(), new KeyboardState());

    const EXPECTED_NUMBER_POINTS = 0;
    expect(crayon.getPoints().length).toBe(EXPECTED_NUMBER_POINTS);
    expect(crayon.getCoords()).toBeUndefined();
  });
});
