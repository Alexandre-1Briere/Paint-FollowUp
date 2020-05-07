import { Component, NgModule, ViewContainerRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { SvgBrushComponent } from '../../../../components/svgElement/svg-brush/svg-brush.component';
import { BrushTextures } from '../../../../components/svgElement/svg-brush/textures';
import { DEFAULT_BLUE } from '../../../../constants/colors';
import { KeyboardState } from '../../../../logic/events/keyboard/keyboard-state';
import {
  MouseButtonAction,
  MouseEventData,
  MouseLocation,
  MouseMovement,
} from '../../../../logic/events/mouse/mouse-event-data';
import { SvgComponentsManagerService } from '../../../svg/svg-components-manager.service';
import { ToolsOptionsManagerService } from '../../tools-options-manager/tools-options-manager.service';
import { Coords } from '../coords';
import { Tool } from '../tool/tool';
import { Pinceau } from './pinceau';

class PinceauTestable extends Pinceau {
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
    SvgBrushComponent,
    MockViewComponent,
  ],
  entryComponents: [
    SvgBrushComponent,
  ],
  providers: [
    SvgComponentsManagerService,
    ToolsOptionsManagerService,
  ],
})
class TestModule {}

const DEFAULT_THICKNESS = '10';
const DEFAULT_COLOR = '#112233';

describe('Pinceau', () => {
  let pinceau: PinceauTestable;
  let mockViewComponent: MockViewComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestModule],
    })
    .compileComponents();

    pinceau = new PinceauTestable();

    Tool.SVG_COMPONENT_MANAGER = TestBed.get(SvgComponentsManagerService);
    Tool.TOOL_OPTIONS_MANAGER = TestBed.get(ToolsOptionsManagerService);

    const fixture = TestBed.createComponent(MockViewComponent);
    mockViewComponent = fixture.componentInstance;
    Tool.SVG_COMPONENT_MANAGER.initialiseViewContainerRef(mockViewComponent.viewContainerRef);
  });

  it('should create an instance', () => {
    expect(new Pinceau()).toBeTruthy();
  });

  it('should return the instance of a "Pinceau" type', () => {
    const pinceauInstance = Pinceau.getInstance();
    expect(pinceauInstance instanceof Pinceau).toBeTruthy();
  });

  it('#createSvg() should call createSvgComponent properly', () => {
    spyOn(Tool.SVG_COMPONENT_MANAGER, 'createSvgComponent');
    const IS_DRAWING = true;
    pinceau.setIsDrawing(IS_DRAWING);
    pinceau.onLeftUp(new MouseEventData(), new KeyboardState());
    expect(Tool.SVG_COMPONENT_MANAGER.createSvgComponent).toHaveBeenCalled();
  });

  it('#createSvg() sets thickness correctly', () => {
    const IS_DRAWING = true;
    pinceau.setIsDrawing(IS_DRAWING);
    pinceau.onLeftUp(new MouseEventData(), new KeyboardState());

    const CREATED_SVG_INDEX = 0;
    let drawnSvg = Tool.SVG_COMPONENT_MANAGER.getSvgComponent(CREATED_SVG_INDEX, SvgBrushComponent) as SvgBrushComponent;
    let toolSize = Tool.TOOL_OPTIONS_MANAGER.getSettings().size;
    let testedSize = toolSize !== undefined ? toolSize : Pinceau.DEFAULT_SIZE;
    expect(drawnSvg.getThickness()).toEqual(testedSize);

    Tool.SVG_COMPONENT_MANAGER.resetSvgComponents();
    Tool.TOOL_OPTIONS_MANAGER.getSettings().setSize(DEFAULT_THICKNESS);
    pinceau.setIsDrawing(IS_DRAWING);
    pinceau.onLeftUp(new MouseEventData(), new KeyboardState());

    drawnSvg = Tool.SVG_COMPONENT_MANAGER.getSvgComponent(CREATED_SVG_INDEX, SvgBrushComponent) as SvgBrushComponent;
    toolSize = Tool.TOOL_OPTIONS_MANAGER.getSettings().size;
    testedSize = toolSize !== undefined ? toolSize : Pinceau.DEFAULT_SIZE;
    expect(drawnSvg.getThickness()).toEqual(testedSize);
  });

  it('#createSvg() sets color correctly', () => {
    const IS_DRAWING = true;
    pinceau.setIsDrawing(IS_DRAWING);
    pinceau.onLeftUp(new MouseEventData(), new KeyboardState());

    const CREATED_SVG_INDEX = 0;
    let drawnSvg = Tool.SVG_COMPONENT_MANAGER.getSvgComponent(CREATED_SVG_INDEX, SvgBrushComponent) as SvgBrushComponent;
    let color = Tool.TOOL_OPTIONS_MANAGER.getSettings().primaryColor;
    let testedColor = color !== undefined ? color : DEFAULT_BLUE;
    expect(drawnSvg.getPrimaryColor()).toEqual(testedColor);

    Tool.SVG_COMPONENT_MANAGER.resetSvgComponents();
    Tool.TOOL_OPTIONS_MANAGER.setPrimaryColor(DEFAULT_COLOR);
    pinceau.setIsDrawing(IS_DRAWING);
    pinceau.onLeftUp(new MouseEventData(), new KeyboardState());

    drawnSvg = Tool.SVG_COMPONENT_MANAGER.getSvgComponent(CREATED_SVG_INDEX, SvgBrushComponent) as SvgBrushComponent;
    color = Tool.TOOL_OPTIONS_MANAGER.getSettings().primaryColor;
    testedColor = color !== undefined ? color : DEFAULT_BLUE;
    expect(drawnSvg.getPrimaryColor()).toEqual(testedColor);
  });

  it('#createSvg() sets texture correctly', () => {
    const IS_DRAWING = true;
    pinceau.setIsDrawing(IS_DRAWING);
    pinceau.onLeftUp(new MouseEventData(), new KeyboardState());

    const CREATED_SVG_INDEX = 0;
    let drawnSvg = Tool.SVG_COMPONENT_MANAGER.getSvgComponent(CREATED_SVG_INDEX, SvgBrushComponent) as SvgBrushComponent;
    const DEFAULT_TEXTURE = BrushTextures.Diffuse;
    expect(drawnSvg.getTextureName()).toEqual(DEFAULT_TEXTURE.toString());

    Tool.SVG_COMPONENT_MANAGER.resetSvgComponents();
    const CHOSEN_TEXTURE = BrushTextures.Shadow;
    Tool.TOOL_OPTIONS_MANAGER.getSettings().brushTexture = CHOSEN_TEXTURE;
    pinceau.setIsDrawing(IS_DRAWING);
    pinceau.onLeftUp(new MouseEventData(), new KeyboardState());

    drawnSvg = Tool.SVG_COMPONENT_MANAGER.getSvgComponent(CREATED_SVG_INDEX, SvgBrushComponent) as SvgBrushComponent;
    expect(drawnSvg.getTextureName()).toEqual(CHOSEN_TEXTURE);
  });

  it('#cancelOnGoing() should resets coords and points', () => {
    pinceau.cancelOnGoing(new MouseEventData(), new KeyboardState());
    const NO_POINTS = 0;
    expect(pinceau.getPoints().length).toBe(NO_POINTS);
    expect(pinceau.getCoords()).toBeUndefined();
  });

  it('#onLeftDown() should update coords and points', () => {
    const initialNumberPoints = pinceau.getPoints().length;
    const mouseEventData = new MouseEventData();
    mouseEventData.leftButton.action = MouseButtonAction.Click;
    const X = 3;
    const Y = 4;
    mouseEventData.x = X;
    mouseEventData.y = Y;

    pinceau.onLeftDown(mouseEventData, new KeyboardState());
    const WRONG = -1;
    let xTested = WRONG;
    let yTested = WRONG;
    const coords = pinceau.getCoords();
    if (coords !== undefined) {
      xTested = coords.x;
      yTested = coords.y;
    }

    expect(xTested).toBe(X);
    expect(yTested).toBe(Y);
    const EXPECTED_NUMBER_POINTS = initialNumberPoints + 1;
    expect(pinceau.getPoints().length).toBe(EXPECTED_NUMBER_POINTS);
  });

  it('#onLeftDown() does not call computeCoords when location is outside', () => {
    spyOn(pinceau, 'computeCoords');
    const mouseData = new MouseEventData();
    mouseData.location = MouseLocation.Outside;
    pinceau.onLeftDown(mouseData, new KeyboardState());
    expect(pinceau.computeCoords).not.toHaveBeenCalled();
  });

  it('#onLeftUp() should resets coords and points', () => {
    const mouseEventData = new MouseEventData();
    const X = 3;
    const Y = 4;
    mouseEventData.x = X;
    mouseEventData.y = Y;

    pinceau.onLeftUp(mouseEventData, new KeyboardState());

    const EXPECTED_NUMBER_POINTS = 0;
    expect(pinceau.getPoints().length).toBe(EXPECTED_NUMBER_POINTS);
    expect(pinceau.getCoords()).toBeUndefined();
  });

  it('#onMouseMove() should update coords and points', () => {
    const initialNumberPoints = pinceau.getPoints().length;
    const mouseEventData = new MouseEventData();
    mouseEventData.movement = MouseMovement.Moved;
    const X = 40;
    const Y = 50;
    mouseEventData.x = X;
    mouseEventData.y = Y;

    const CURRENTLY_DRAWING = true;
    pinceau.setIsDrawing(CURRENTLY_DRAWING);
    pinceau.onMouseMove(mouseEventData, new KeyboardState());
    const WRONG = -1;
    let xTested = WRONG;
    let yTested = WRONG;
    const coords = pinceau.getCoords();
    if (coords !== undefined) {
      xTested = coords.x;
      yTested = coords.y;
    }

    expect(xTested).toBe(X);
    expect(yTested).toBe(Y);
    const EXPECTED_NUMBER_POINTS = initialNumberPoints + 1;
    expect(pinceau.getPoints().length).toBe(EXPECTED_NUMBER_POINTS);
  });

  it('#onMouseMove() does not update points when isDrawing=false', () => {
    pinceau.onMouseMove(new MouseEventData(), new KeyboardState());

    const NO_POINTS_ADDED = 0;
    expect(pinceau.getPoints().length).toBe(NO_POINTS_ADDED);
  });

  it('#onMouseLeave() should resets coords and points', () => {
    pinceau.onMouseLeave(new MouseEventData(), new KeyboardState());

    const EXPECTED_NUMBER_POINTS = 0;
    expect(pinceau.getPoints().length).toBe(EXPECTED_NUMBER_POINTS);
    expect(pinceau.getCoords()).toBeUndefined();
  });
});
