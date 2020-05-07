import {CommonModule} from '@angular/common';
import {Component, NgModule, ViewContainerRef} from '@angular/core';
import {TestBed} from '@angular/core/testing';
import {SvgPolygonComponent} from '../../../../components/svgElement/svg-polygon/svg-polygon.component';
import {SvgSelectionComponent} from '../../../../components/svgElement/svg-selection/svg-selection.component';
import {SvgStatus} from '../../../../enums/svg';
import {KeyboardState} from '../../../../logic/events/keyboard/keyboard-state';
import {MouseEventData, MouseLocation, } from '../../../../logic/events/mouse/mouse-event-data';
import {TestSpeedUpgrader} from '../../../../testHelpers/test-speed-upgrader.spec';
import {KeyboardManagerService} from '../../../events/keyboard-manager.service';
import {SvgComponentsManagerService} from '../../../svg/svg-components-manager.service';
import {ToolsOptionsManagerService} from '../../tools-options-manager/tools-options-manager.service';
import {Tool} from '../tool/tool';
import {Polygone} from './polygone';

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
    SvgPolygonComponent,
    MockViewComponent,
    SvgSelectionComponent,
  ],
  entryComponents: [
    SvgPolygonComponent,
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

describe('Polygon', () => {
  let polygone: Polygone;
  let mockViewComponent: MockViewComponent;
  TestSpeedUpgrader.overWriteModuleResetForSpeedGain();

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestModule],
    }).compileComponents();

    polygone = new Polygone();

    Tool.SVG_COMPONENT_MANAGER = TestBed.get(SvgComponentsManagerService);
    Tool.TOOL_OPTIONS_MANAGER = TestBed.get(ToolsOptionsManagerService);
    Tool.KEYBOARD_MANAGER_SERVICE = TestBed.get(KeyboardManagerService);

    const fixture = TestBed.createComponent(MockViewComponent);
    mockViewComponent = fixture.componentInstance;
    Tool.SVG_COMPONENT_MANAGER.initialiseViewContainerRef(mockViewComponent.viewContainerRef);
  });

  it('should create an instance', () => {
    expect(polygone).toBeTruthy();
  });

  it('should return the instance of a "Polygone" type', () => {
    const polygoneInstance = Polygone.getInstance();
    expect(polygoneInstance instanceof Polygone).toBeTruthy();
  });

  it('#createPolygon() should call createSvgComponent properly', () => {
    spyOn(Tool.SVG_COMPONENT_MANAGER, 'createSvgComponent');
    polygone.onLeftDown(new MouseEventData(), new KeyboardState());
    polygone.onLeftUp(new MouseEventData(), new KeyboardState());
    expect(Tool.SVG_COMPONENT_MANAGER.createSvgComponent).toHaveBeenCalled();
  });

  it('#createpolygon() sets thickness correctly', () => {
    polygone.onLeftDown(new MouseEventData(), new KeyboardState());
    polygone.onMouseMove(new MouseEventData(), new KeyboardState());

    const TARGET_OUTLINE_THICKNESS = 'targetOutlineThickness';
    const WRONG_VALUE  = 7;
    let drawnSvg = polygone.latestPolygon as SvgPolygonComponent;
    drawnSvg[TARGET_OUTLINE_THICKNESS] = WRONG_VALUE;
    let toolSize = Tool.TOOL_OPTIONS_MANAGER.getSettings().size;
    let testedSize = toolSize !== undefined ? toolSize : Polygone.DEFAULT_NUMBER_OF_SIDES;
    expect(drawnSvg[TARGET_OUTLINE_THICKNESS]).toEqual(testedSize);

    Tool.SVG_COMPONENT_MANAGER.resetSvgComponents();
    Tool.TOOL_OPTIONS_MANAGER.getSettings().setBorderSize(DEFAULT_OUTLINE_THICKNESS);
    polygone.onLeftDown(new MouseEventData(), new KeyboardState());
    polygone.onMouseMove(new MouseEventData(), new KeyboardState());

    drawnSvg = polygone.latestPolygon as SvgPolygonComponent;
    const CORRECT_VALUE = 10;
    drawnSvg[TARGET_OUTLINE_THICKNESS] = CORRECT_VALUE;
    toolSize = Tool.TOOL_OPTIONS_MANAGER.getSettings().borderSize;
    testedSize = toolSize !== undefined ? toolSize : Polygone.DEFAULT_NUMBER_OF_SIDES;
    expect(drawnSvg[TARGET_OUTLINE_THICKNESS]).toEqual(testedSize);
  });

  it('#createpolygon() sets primaryColor correctly', () => {
    polygone.onLeftDown(new MouseEventData(), new KeyboardState());
    polygone.onMouseMove(new MouseEventData(), new KeyboardState());

    let drawnSvg = polygone.latestPolygon as SvgPolygonComponent;
    let testedColor = Tool.TOOL_OPTIONS_MANAGER.getSettings().primaryColor;
    expect(drawnSvg.getPrimaryColor()).toEqual(testedColor);

    Tool.SVG_COMPONENT_MANAGER.resetSvgComponents();
    Tool.TOOL_OPTIONS_MANAGER.setPrimaryColor(DEFAULT_COLOR);
    polygone.onLeftDown(new MouseEventData(), new KeyboardState());
    polygone.onMouseMove(new MouseEventData(), new KeyboardState());

    drawnSvg = polygone.latestPolygon as SvgPolygonComponent;
    testedColor = Tool.TOOL_OPTIONS_MANAGER.getSettings().primaryColor;
    expect(drawnSvg.getPrimaryColor()).toEqual(testedColor);
  });

  it('#createpolygon() sets secondaryColor correctly', () => {
    polygone.onLeftDown(new MouseEventData(), new KeyboardState());
    polygone.onMouseMove(new MouseEventData(), new KeyboardState());

    let drawnSvg = polygone.latestPolygon as SvgPolygonComponent;
    let testedColor = Tool.TOOL_OPTIONS_MANAGER.getSettings().secondaryColor;
    expect(drawnSvg.getSecondaryColor()).toEqual(testedColor);

    Tool.SVG_COMPONENT_MANAGER.resetSvgComponents();
    Tool.TOOL_OPTIONS_MANAGER.setSecondaryColor(DEFAULT_COLOR);
    polygone.onLeftDown(new MouseEventData(), new KeyboardState());
    polygone.onMouseMove(new MouseEventData(), new KeyboardState());

    drawnSvg = polygone.latestPolygon as SvgPolygonComponent;
    testedColor = Tool.TOOL_OPTIONS_MANAGER.getSettings().secondaryColor;
    expect(drawnSvg.getSecondaryColor()).toEqual(testedColor);
  });

  it('#createpolygon() does not recreate boundingRect when SvgStatus=permanent', () => {
    polygone.boundingRect = new SvgSelectionComponent();
    polygone.origin = {x: 0, y: 0};
    polygone.coords = {x: 5, y: 5};
    polygone.createPolygon(SvgStatus.Permanent);
    expect(polygone.boundingRect).toBeUndefined();
  });

  it('#createBoundingRect() returns undefined if polygon is not create', () => {
    polygone.boundingRect = new SvgSelectionComponent();
    polygone.origin = {x: 0, y: 0};
    polygone.coords = {x: 5, y: 5};
    expect(polygone.createBoundingRect()).toBeUndefined();
  });

  it('#onLeftDown() does not change origin when outside drawing board', () => {
    const mouseData = new MouseEventData();
    mouseData.location = MouseLocation.Outside;
    polygone.onLeftDown(mouseData, new KeyboardState());
    expect(polygone.origin).toBeUndefined();
  });

  it('#onLeftDown() does not set origin when already defined', () => {
    polygone.onLeftDown(new MouseEventData(), new KeyboardState());
    const mouseData = new MouseEventData();
    const POSITION = 10;
    mouseData.x = POSITION;
    polygone.onLeftDown(mouseData, new KeyboardState());

    const EXPECTED_POSITION = 0;
    expect(polygone.origin).toBeDefined();
    const X = polygone.origin !== undefined ? polygone.origin.x : POSITION;
    expect(X).toBe(EXPECTED_POSITION);
  });

  it('#onLeftUp() does not call reset when origin is undefined', () => {
    // tslint:disable-next-line:no-any
    spyOn<any>(polygone, 'reset').and.callThrough();
    polygone.onLeftUp(new MouseEventData(), new KeyboardState());
    expect(polygone.reset).not.toHaveBeenCalled();
  });

  it('#onMouseMove() does not call createRectangle when origin is undefined', () => {
    spyOn(polygone, 'createPolygon');
    polygone.onMouseMove(new MouseEventData(), new KeyboardState());
    expect(polygone.createPolygon).not.toHaveBeenCalled();
  });

  it('#onMouseMove() removes selection boundary', () => {
    polygone.boundingRect = new SvgSelectionComponent();
    polygone.onLeftDown(new MouseEventData(), new KeyboardState());
    const removeSpy = spyOn(Tool.SVG_COMPONENT_MANAGER, 'removeSvgComponent');
    polygone.onMouseMove(new MouseEventData(), new KeyboardState());
    expect(removeSpy).toHaveBeenCalled();
  });

  it('#cancelOnGoing() calls to reset', () => {
    polygone.coords = {x: 3, y: 4};
    spyOn(polygone, 'reset');
    polygone.cancelOnGoing(new MouseEventData(), new KeyboardState());
    expect(polygone.reset).toHaveBeenCalled();
  });

  it('#cancelOnGoing() calls to reset', () => {
    // tslint:disable-next-line:no-any
    const resetSpy = spyOn<any>(polygone, 'reset').and.callThrough();
    polygone.cancelOnGoing(new MouseEventData(), new KeyboardState());
    expect(resetSpy.calls.any).toBeTruthy();
  });

  it('#computeCoords() returns undefined when origin is undefined', () => {
    polygone.computeCoords(new MouseEventData());
    expect(polygone.coords).toBeUndefined();
  });

  it('#reset() returns undefined when origin is undefined', () => {
    polygone.boundingRect = new SvgSelectionComponent();
    polygone.reset();
    expect(polygone.coords).toBeUndefined();
  });

});
