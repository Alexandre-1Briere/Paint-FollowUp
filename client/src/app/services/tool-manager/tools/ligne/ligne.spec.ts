import { CommonModule } from '@angular/common';
import { Component, NgModule, ViewContainerRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { SvgPolylineComponent } from '../../../../components/svgElement/svg-polyline/svg-polyline.component';
import { DEFAULT_BLUE } from '../../../../constants/colors';
import { KEY_DOWN } from '../../../../constants/keyboard';
import { KeyboardKey } from '../../../../enums/keyboard';
import { KeyboardState } from '../../../../logic/events/keyboard/keyboard-state';
import { MouseEventData, MouseLocation } from '../../../../logic/events/mouse/mouse-event-data';
import { KeyboardManagerService } from '../../../events/keyboard-manager.service';
import { SvgComponentsManagerService } from '../../../svg/svg-components-manager.service';
import { ToolsOptionsManagerService } from '../../tools-options-manager/tools-options-manager.service';
import { Coords } from '../coords';
import { Tool } from '../tool/tool';
import { Ligne } from './ligne';

class LigneTestable extends Ligne {
  constructor() { super(); }
  getPoints(): Coords[] { return this.points; }
  getCoords(): Coords | undefined { return this.coords; }
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
    SvgPolylineComponent,
    MockViewComponent,
  ],
  entryComponents: [
    SvgPolylineComponent,
  ],
  providers: [
    SvgComponentsManagerService,
    ToolsOptionsManagerService,
    KeyboardManagerService,
  ],
})
class TestModule {}

const DEFAULT_THICKNESS = '10';
const DEFAULT_COLOR = '#112233';

describe('Ligne', () => {
  let ligne: LigneTestable;
  let mockViewComponent: MockViewComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestModule],
    })
    .compileComponents();

    ligne = new LigneTestable();

    Tool.SVG_COMPONENT_MANAGER = TestBed.get(SvgComponentsManagerService);
    Tool.TOOL_OPTIONS_MANAGER = TestBed.get(ToolsOptionsManagerService);
    Tool.KEYBOARD_MANAGER_SERVICE = TestBed.get(KeyboardManagerService);

    const fixture = TestBed.createComponent(MockViewComponent);
    mockViewComponent = fixture.componentInstance;
    Tool.SVG_COMPONENT_MANAGER.initialiseViewContainerRef(mockViewComponent.viewContainerRef);
  });

  it('should create an instance', () => {
    expect(new Ligne()).toBeTruthy();
  });

  it('should return the instance of a "Ligne" type', () => {
    const ligneInstance = Ligne.getInstance();
    expect(ligneInstance instanceof Ligne).toBeTruthy();
  });

  it('#createLigne() should call createSvgComponent properly', () => {
    spyOn(Tool.SVG_COMPONENT_MANAGER, 'createSvgComponent');
    ligne.onLeftClick(new MouseEventData(), new KeyboardState());
    expect(Tool.SVG_COMPONENT_MANAGER.createSvgComponent).toHaveBeenCalled();
  });

  it('#createLigne() sets thickness correctly', () => {
    ligne.onLeftClick(new MouseEventData(), new KeyboardState());

    const CREATED_SVG_INDEX = 0;
    let drawnSvg = Tool.SVG_COMPONENT_MANAGER.getSvgComponent(CREATED_SVG_INDEX, SvgPolylineComponent) as SvgPolylineComponent;
    let toolSize = Tool.TOOL_OPTIONS_MANAGER.getSettings().size;
    let testedSize = toolSize !== undefined ? toolSize : Ligne.DEFAULT_SIZE;
    expect(drawnSvg.getThickness()).toEqual(testedSize);

    Tool.SVG_COMPONENT_MANAGER.resetSvgComponents();
    Tool.TOOL_OPTIONS_MANAGER.getSettings().setSize(DEFAULT_THICKNESS);
    ligne.onLeftClick(new MouseEventData(), new KeyboardState());

    drawnSvg = Tool.SVG_COMPONENT_MANAGER.getSvgComponent(CREATED_SVG_INDEX, SvgPolylineComponent) as SvgPolylineComponent;
    toolSize = Tool.TOOL_OPTIONS_MANAGER.getSettings().size;
    testedSize = toolSize !== undefined ? toolSize : Ligne.DEFAULT_SIZE;
    expect(drawnSvg.getThickness()).toEqual(testedSize);
  });

  it('#createLigne() sets color correctly', () => {
    ligne.onLeftClick(new MouseEventData(), new KeyboardState());

    const CREATED_SVG_INDEX = 0;
    let drawnSvg = Tool.SVG_COMPONENT_MANAGER.getSvgComponent(CREATED_SVG_INDEX, SvgPolylineComponent) as SvgPolylineComponent;
    let color = Tool.TOOL_OPTIONS_MANAGER.getSettings().primaryColor;
    let testedColor = color !== undefined ? color : DEFAULT_BLUE;
    expect(drawnSvg.getPrimaryColor()).toEqual(testedColor);

    Tool.SVG_COMPONENT_MANAGER.resetSvgComponents();
    Tool.TOOL_OPTIONS_MANAGER.setPrimaryColor(DEFAULT_COLOR);
    ligne.onLeftClick(new MouseEventData(), new KeyboardState());

    drawnSvg = Tool.SVG_COMPONENT_MANAGER.getSvgComponent(CREATED_SVG_INDEX, SvgPolylineComponent) as SvgPolylineComponent;
    color = Tool.TOOL_OPTIONS_MANAGER.getSettings().primaryColor;
    testedColor = color !== undefined ? color : DEFAULT_BLUE;
    expect(drawnSvg.getPrimaryColor()).toEqual(testedColor);
  });

  it('#createLigne() sets junction radius correctly', () => {
    const CREATED_SVG_INDEX = 0;
    const NO_JUNCTION_RADIUS = 0;
    const DEFAULT_JUNCTION_RADIUS = 20;
    ligne.onLeftClick(new MouseEventData(), new KeyboardState());

    let drawnSvg = Tool.SVG_COMPONENT_MANAGER.getSvgComponent(CREATED_SVG_INDEX, SvgPolylineComponent) as SvgPolylineComponent;
    let radius = Tool.TOOL_OPTIONS_MANAGER.getSettings().pointsSize;
    let testedRadius = radius !== undefined ? radius : NO_JUNCTION_RADIUS;
    expect(drawnSvg.getJunctionRadius()).toEqual(testedRadius);

    Tool.SVG_COMPONENT_MANAGER.resetSvgComponents();
    Tool.TOOL_OPTIONS_MANAGER.setPointSize(DEFAULT_JUNCTION_RADIUS);
    ligne.onLeftClick(new MouseEventData(), new KeyboardState());

    drawnSvg = Tool.SVG_COMPONENT_MANAGER.getSvgComponent(CREATED_SVG_INDEX, SvgPolylineComponent) as SvgPolylineComponent;
    radius = Tool.TOOL_OPTIONS_MANAGER.getSettings().pointsSize;
    testedRadius = radius !== undefined ? radius : NO_JUNCTION_RADIUS;
    expect(drawnSvg.getJunctionRadius()).toEqual(testedRadius);
  });

  it('#reset() removes visual line indicator', () => {
    ligne.onLeftClick(new MouseEventData(), new KeyboardState());
    const removeSpy = spyOn(Tool.SVG_COMPONENT_MANAGER, 'removeSvgComponent');
    ligne.reset();
    expect(removeSpy).toHaveBeenCalled();
  });

  it('#onRemovingTool() calls reset', () => {
    const resetSpy = spyOn(ligne, 'reset');
    ligne.onRemovingTool(new MouseEventData(), new KeyboardState());
    expect(resetSpy).toHaveBeenCalled();
  });

  it('#onMouseMove() does not call createLigne when outside drawing board', () => {
    spyOn(Tool.SVG_COMPONENT_MANAGER, 'createSvgComponent');
    const mouseData = new MouseEventData();
    mouseData.location = MouseLocation.Outside;
    ligne.onMouseMove(mouseData, new KeyboardState());
    expect(Tool.SVG_COMPONENT_MANAGER.createSvgComponent).not.toHaveBeenCalled();
  });

  it('#maxAxisDistance() works as expected', () => {
    const POINT1 = {x: 1, y: 1};
    const POINT2 = {x: 10, y: 11};
    const EXPECTED_DISTANCE = 10;
    expect(ligne.maxAxisDistance(POINT1, POINT2)).toBe(EXPECTED_DISTANCE);
  });

  it('#onKeyPress() should call cancelOnGoing after escape key', () => {
    spyOn(ligne, 'cancelOnGoing');

    const KEY_ESCAPE = KeyboardKey.Esc;
    const eventEscape = new KeyboardEvent(KEY_DOWN, {key: KEY_ESCAPE.toString()});
    Tool.KEYBOARD_MANAGER_SERVICE.receiveKeyboardEvent(eventEscape);

    ligne.onKeyPress(new MouseEventData(), new KeyboardState());
    expect(ligne.cancelOnGoing).toHaveBeenCalled();
  });

  it('#onKeyPress() should pop points after backspace key', () => {
    spyOn(ligne, 'cancelOnGoing');
    ligne.onLeftClick(new MouseEventData(), new KeyboardState());
    ligne.onLeftClick(new MouseEventData(), new KeyboardState());

    const KEY_BACKSPACE = KeyboardKey.Backspace;
    const eventBackspace = new KeyboardEvent(KEY_DOWN, {key: KEY_BACKSPACE.toString()});
    Tool.KEYBOARD_MANAGER_SERVICE.receiveKeyboardEvent(eventBackspace);

    ligne.onKeyPress(new MouseEventData(), new KeyboardState());
    const EXPECTED_LENGTH = 1;
    expect(ligne.getPoints().length).toBe(EXPECTED_LENGTH);
  });

  it('#onKeyPress() should not pop points when backspace key IS NOT pressed', () => {
    spyOn(ligne, 'cancelOnGoing');
    ligne.onLeftClick(new MouseEventData(), new KeyboardState());
    ligne.onLeftClick(new MouseEventData(), new KeyboardState());

    ligne.onKeyPress(new MouseEventData(), new KeyboardState());
    const EXPECTED_LENGTH = 2;
    expect(ligne.getPoints().length).toBe(EXPECTED_LENGTH);
  });

  it('#onLeftClick() changes coords when inside drawing board', () => {
    ligne.onLeftClick(new MouseEventData(), new KeyboardState());
    expect(ligne.getCoords()).toBeDefined();
  });

  it('#onLeftClick() does not change coords when outside drawing board', () => {
    const mouseData = new MouseEventData();
    mouseData.location = MouseLocation.Outside;
    ligne.onLeftClick(mouseData, new KeyboardState());
    expect(ligne.getCoords()).toBeUndefined();
  });

  it('#onLeftClick() changes points when inside drawing board', () => {
    spyOn(ligne.getPoints(), 'push');
    ligne.onLeftClick(new MouseEventData(), new KeyboardState());
    expect(ligne.getPoints().push).toHaveBeenCalled();
  });

  it('#onLeftClick() does not change points when outside drawing board', () => {
    spyOn(ligne.getPoints(), 'push');
    const mouseData = new MouseEventData();
    mouseData.location = MouseLocation.Outside;
    ligne.onLeftClick(mouseData, new KeyboardState());
    expect(ligne.getPoints().push).not.toHaveBeenCalled();
  });

  it('#onLeftClick() does not call createLigne when outside drawing board', () => {
    spyOn(Tool.SVG_COMPONENT_MANAGER, 'createSvgComponent');
    const mouseData = new MouseEventData();
    mouseData.location = MouseLocation.Outside;
    ligne.onLeftClick(mouseData, new KeyboardState());
    expect(Tool.SVG_COMPONENT_MANAGER.createSvgComponent).not.toHaveBeenCalled();
  });

  it('#onLeftDoubleClick() calls to createLigne', () => {
    spyOn(Tool.SVG_COMPONENT_MANAGER, 'createSvgComponent');

    ligne.onLeftClick(new MouseEventData(), new KeyboardState());
    ligne.onLeftClick(new MouseEventData(), new KeyboardState());
    ligne.onLeftDoubleClick(new MouseEventData(), new KeyboardState());

    const NUMBER_OF_CREATES = 3;
    expect(Tool.SVG_COMPONENT_MANAGER.createSvgComponent).toHaveBeenCalledTimes(NUMBER_OF_CREATES);
  });

  it('#onLeftDoubleClick() calls to reset', () => {
    spyOn(ligne, 'reset');

    ligne.onLeftClick(new MouseEventData(), new KeyboardState());
    ligne.onLeftClick(new MouseEventData(), new KeyboardState());
    ligne.onLeftDoubleClick(new MouseEventData(), new KeyboardState());

    expect(ligne.reset).toHaveBeenCalled();
  });

  it('#onLeftDoubleClick() does not call createLigne when lastPoint is undefined', () => {
    spyOn(Tool.SVG_COMPONENT_MANAGER, 'createSvgComponent');
    ligne.onLeftDoubleClick(new MouseEventData(), new KeyboardState());
    expect(Tool.SVG_COMPONENT_MANAGER.createSvgComponent).not.toHaveBeenCalled();
  });

  it('#onLeftDoubleClick() does not call createLigne when coords is undefined', () => {
    spyOn(Tool.SVG_COMPONENT_MANAGER, 'createSvgComponent');
    const mouseData = new MouseEventData();
    mouseData.location = MouseLocation.Outside;
    ligne.onLeftDoubleClick(mouseData, new KeyboardState());
    expect(Tool.SVG_COMPONENT_MANAGER.createSvgComponent).not.toHaveBeenCalled();
  });

  it('#onLeftDoubleClick() sends line when not closing on first point', () => {
    ligne.onLeftClick(new MouseEventData(), new KeyboardState());
    ligne.onLeftClick(new MouseEventData(), new KeyboardState());
    const FAR = 40;
    const mouseData = new MouseEventData();
    mouseData.x = FAR;
    ligne.onLeftDoubleClick(mouseData, new KeyboardState());

    const NUMBER_OF_POINTS = 0;
    expect(ligne.getPoints().length).toBe(NUMBER_OF_POINTS);
  });

  it('#cancelOnGoing() calls to reset', () => {
    spyOn(ligne, 'reset');
    ligne.cancelOnGoing(new MouseEventData(), new KeyboardState());
    expect(ligne.reset).toHaveBeenCalled();
  });

  it('#computeCoords() respects 45 degree angle', () => {
    const X1 = 20;
    const Y1 = 20;
    const X2 = 100;
    const Y2 = 90;

    const mouseData1 = new MouseEventData();
    mouseData1.x = X1;
    mouseData1.y = Y1;
    const mouseData2 = new MouseEventData();
    mouseData2.x = X2;
    mouseData2.y = Y2;

    const KEY_SHIFT = KeyboardKey.LShift;
    const eventShift = new KeyboardEvent(KEY_DOWN, {key: KEY_SHIFT.toString()});
    Tool.KEYBOARD_MANAGER_SERVICE.receiveKeyboardEvent(eventShift);

    ligne.onLeftClick(mouseData1, new KeyboardState());
    ligne.onLeftClick(mouseData2, new KeyboardState());

    const EXPECTED_POSITION = 95;
    const BAD_POSITION = -1;
    let testedX = BAD_POSITION;
    let testedY = BAD_POSITION;
    const coords = ligne.getCoords();
    if (coords !== undefined) {
      testedX = coords.x;
      testedY = coords.y;
    }

    expect(testedX).toBeCloseTo(EXPECTED_POSITION);
    expect(testedY).toBeCloseTo(EXPECTED_POSITION);
  });

  it('#computeCoords() respects horizontal angle', () => {
    const X1 = 20;
    const Y1 = 20;
    const X2 = 100;
    const Y2 = 25;

    const mouseData1 = new MouseEventData();
    mouseData1.x = X1;
    mouseData1.y = Y1;
    const mouseData2 = new MouseEventData();
    mouseData2.x = X2;
    mouseData2.y = Y2;

    const KEY_SHIFT = KeyboardKey.LShift;
    const eventShift = new KeyboardEvent(KEY_DOWN, {key: KEY_SHIFT.toString()});
    Tool.KEYBOARD_MANAGER_SERVICE.receiveKeyboardEvent(eventShift);

    ligne.onLeftClick(mouseData1, new KeyboardState());
    ligne.onLeftClick(mouseData2, new KeyboardState());

    const BAD_POSITION = -1;
    let testedX = BAD_POSITION;
    let testedY = BAD_POSITION;
    const coords = ligne.getCoords();
    if (coords !== undefined) {
      testedX = coords.x;
      testedY = coords.y;
    }

    expect(testedX).toBeCloseTo(X2);
    expect(testedY).toBeCloseTo(Y1);
  });

  it('#computeCoords() respects vertical angle', () => {
    const X1 = 20;
    const Y1 = 20;
    const X2 = 15;
    const Y2 = 100;

    const mouseData1 = new MouseEventData();
    mouseData1.x = X1;
    mouseData1.y = Y1;
    const mouseData2 = new MouseEventData();
    mouseData2.x = X2;
    mouseData2.y = Y2;

    const KEY_SHIFT = KeyboardKey.LShift;
    const eventShift = new KeyboardEvent(KEY_DOWN, {key: KEY_SHIFT.toString()});
    Tool.KEYBOARD_MANAGER_SERVICE.receiveKeyboardEvent(eventShift);

    ligne.onLeftClick(mouseData1, new KeyboardState());
    ligne.onLeftClick(mouseData2, new KeyboardState());

    const BAD_POSITION = -1;
    let testedX = BAD_POSITION;
    let testedY = BAD_POSITION;
    const coords = ligne.getCoords();
    if (coords !== undefined) {
      testedX = coords.x;
      testedY = coords.y;
    }

    expect(testedX).toBeCloseTo(X1);
    expect(testedY).toBeCloseTo(Y2);
  });

  it('#computeCoords() returns undefined when mouse is outside drawing board', () => {
    const mouseData = new MouseEventData();
    mouseData.location = MouseLocation.Outside;

    ligne.onLeftClick(mouseData, new KeyboardState());

    expect(ligne.getCoords()).toBeUndefined();
  });
});
// tslint:disable:max-file-line-count
