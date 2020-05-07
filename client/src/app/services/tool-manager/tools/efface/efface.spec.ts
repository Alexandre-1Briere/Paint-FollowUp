import { CommonModule } from '@angular/common';
import { Component, NgModule, ViewContainerRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Point } from 'src/app/interfaces/point';
import { SvgRectangleComponent } from '../../../../components/drawing/work-board/svg-rectangle/svg-rectangle.component';
import { SvgSelectionComponent } from '../../../../components/drawing/work-board/svg-selection/svg-selection.component';
import { KEY_DOWN } from '../../../../constants/keyboard';
import { KeyboardKey } from '../../../../enums/keyboard';
import { SvgLayer, SvgStatus, SvgType } from '../../../../enums/svg';
import { KeyboardState } from '../../../../logic/events/keyboard/keyboard-state';
import { MouseEventData, MouseLocation } from '../../../../logic/events/mouse/mouse-event-data';
import { SvgBasicProperties } from '../../../../logic/svg/base-svg/svg-basic-properties';
import { TestSpeedUpgrader } from '../../../../testHelpers/test-speed-upgrader.spec';
import { SvgCollisionsService } from '../../../collisions/svg-collisions.service';
import { KeyboardManagerService } from '../../../events/keyboard-manager.service';
import { SvgComponentsManagerService } from '../../../svg/svg-components-manager.service';
import { SvgUndoRedoService } from '../../../undo-redo/svg-undo-redo.service';
import { ToolsOptionsManagerService } from '../../tools-options-manager/tools-options-manager.service';
import { Coords } from '../coords';
import { Tool } from '../tool/tool';
import { Efface } from './efface';

class EffaceTestable extends Efface {
  constructor() {
    super();
  }

  setIsPressed(pressed: boolean): void {
    this.isPressed = pressed;
  }

  setSelected(selected: Map<SvgBasicProperties, SvgBasicProperties | undefined>): void {
    this.selected = selected;
  }

  setEraserSquare(svgRectangleComponent: SvgRectangleComponent | undefined): void {
    this.eraserSquare = svgRectangleComponent;
  }

  testComputeCoords(mouseData: MouseEventData): Coords {
    return this.computeCoords(mouseData);
  }

  testCreateSvg(): void {
    return this.createSvg();
  }
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
    MockViewComponent,
    SvgSelectionComponent,
    SvgRectangleComponent,
  ],
  entryComponents: [
    SvgRectangleComponent,
    SvgSelectionComponent,
  ],
  providers: [
    SvgComponentsManagerService,
    ToolsOptionsManagerService,
    KeyboardManagerService,
    SvgCollisionsService,
    SvgUndoRedoService,
  ],
})
class TestModule {}

const SELECTED = 'selected';

// tslint:disable:no-any
// Reason: allow spyOn<any>
describe('Efface', () => {
  let efface: EffaceTestable;
  let mockViewComponent: MockViewComponent;
  TestSpeedUpgrader.overWriteModuleResetForSpeedGain();

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestModule],
    })
        .compileComponents();

    efface = new EffaceTestable();

    Tool.SVG_COMPONENT_MANAGER = TestBed.get(SvgComponentsManagerService);
    Tool.SVG_COLLISIONS_SERVICE = TestBed.get(SvgCollisionsService);
    Tool.TOOL_OPTIONS_MANAGER = TestBed.get(ToolsOptionsManagerService);
    Tool.UNDO_REDO_SERVICE = TestBed.get(SvgUndoRedoService);
    Tool.KEYBOARD_MANAGER_SERVICE = TestBed.get(KeyboardManagerService);

    const fixture = TestBed.createComponent(MockViewComponent);
    mockViewComponent = fixture.componentInstance;
    Tool.SVG_COMPONENT_MANAGER.initialiseViewContainerRef(mockViewComponent.viewContainerRef);
  });

  const placeRectangle = (center: Point, size: {size: number}): SvgBasicProperties => {
    const component = Tool.SVG_COMPONENT_MANAGER.createSvgComponent({
      onTopOfLayer: true,
      svgStatus: SvgStatus.Permanent,
      svgLayer: SvgLayer.Stack,
      svgType: SvgType.SvgRectangleComponent,
    }) as SvgRectangleComponent;
    const side = size.size;
    component.fitExactlyInside(center.x - side / 2, center.y - side / 2, center.x + side / 2, center.y + side / 2);
    return component;
  };

  const mouseEventDataAt = (point: Point): MouseEventData => {
    const mouseEventData = new MouseEventData();
    mouseEventData.x = point.x;
    mouseEventData.y = point.y;
    return mouseEventData;
  };

  it('should create an instance', () => {
    expect(new Efface()).toBeTruthy();
  });

  it('should return the instance of a "efface" type', () => {
    const effaceInstance = Efface.getInstance();
    expect(effaceInstance instanceof Efface).toBeTruthy();
  });

  it('#onSettingTool() should call creatEraserSquare and onMouseMove type', () => {
    const createEraserSquareSpy = spyOn<any>(efface, 'createEraserSquare').and.callThrough();
    spyOn(efface, 'onMouseMove');
    efface.onMouseMove(new MouseEventData(), new KeyboardState());
    efface.onSettingTool(new MouseEventData(), new KeyboardState());
    expect(createEraserSquareSpy.calls.any()).toBeTruthy();
    expect(efface.onMouseMove).toHaveBeenCalled();
  });

  it('#computeCoords() should a instance of Coords', () => {
    const computeCoords = efface.testComputeCoords(new MouseEventData());
    expect(computeCoords).toBeDefined();
  });

  it('#createSvg() should call creatEraserSquare', () => {
    const createEraserSquareSpy = spyOn<any>(efface, 'createEraserSquare').and.callThrough();
    efface.setEraserSquare(undefined);
    efface.testCreateSvg();
    expect(createEraserSquareSpy.calls.all()).toBeTruthy();
  });

  it('#reset() should call removeSvgComponent and clearSelected', () => {
    const removeSagComponentSpy = spyOn<any>(Tool.SVG_COMPONENT_MANAGER, 'removeSvgComponent').and.callThrough();
    const clearSelectedSpy = spyOn<any>(efface, 'clearSelected').and.callThrough();
    const mapSvgBasicSelected = new Map();
    efface.setSelected(mapSvgBasicSelected);
    efface.reset();
    expect(clearSelectedSpy.calls.all()).toBeTruthy();
    expect(removeSagComponentSpy).toBeTruthy();
  });

  it('#reset() calls removeSvgComponent only for selected entries with defined component', () => {
    efface.setSelected(new Map().set(new SvgRectangleComponent(), undefined));
    const removeSvgComponentSpy = spyOn(Tool.SVG_COMPONENT_MANAGER, 'removeSvgComponent');
    efface.reset();
    expect(removeSvgComponentSpy).not.toHaveBeenCalled();
  });

  it('#cancelOnGoing() should call reset() and remove eraserSquare', () => {
    const removeSvgComponentSpy = spyOn(Tool.SVG_COMPONENT_MANAGER, 'removeSvgComponent');
    spyOn(efface, 'reset');
    efface.setEraserSquare(new SvgRectangleComponent());
    efface.cancelOnGoing(new MouseEventData(), new KeyboardState());
    expect(efface.reset).toHaveBeenCalled();
    expect(removeSvgComponentSpy).toHaveBeenCalled();
  });

  it('#onBoardChange() calls onMouseMove()', () => {
    spyOn(efface, 'onMouseMove');
    efface.onBoardChange(new MouseEventData(), new KeyboardState());
    expect(efface.onMouseMove).toHaveBeenCalled();
  });

  it('#onLeftDown() followed by onLeftUp() can erase component', () => {
    placeRectangle({ x: 100, y: 100 }, {size: 50});
    expect(Tool.SVG_COMPONENT_MANAGER.componentsCount()).toBe(1);
    efface.onLeftDown(mouseEventDataAt({x: 90, y: 90}), new KeyboardState());
    efface.onMouseMove(mouseEventDataAt({x: 100, y: 100}), new KeyboardState());
    efface.onLeftUp(mouseEventDataAt({x: 110, y: 110}), new KeyboardState());
    expect(Tool.SVG_COMPONENT_MANAGER.componentsCount()).toBe(0);
  });

  it('#onLeftDown() followed by onLeftUp() does not erase component when location is outside', () => {
    placeRectangle({x: 100, y: 100}, {size: 200});
    const mouseEvent = new MouseEventData();
    mouseEvent.x = 0;
    mouseEvent.y = 0;
    mouseEvent.location = MouseLocation.Outside;
    efface.onLeftDown(mouseEvent, new KeyboardState());
    efface.onMouseMove(mouseEvent, new KeyboardState());
    efface.onLeftUp(mouseEvent, new KeyboardState());
    expect(Tool.SVG_COMPONENT_MANAGER.componentsCount()).toBe(1);
  });

  it('#onLeftDown() followed by onLeftUp() on empty space does not erase component', () => {
    placeRectangle({x: 100, y: 100}, {size: 50});
    efface.onLeftDown(mouseEventDataAt({x: 40, y: 40}), new KeyboardState());
    efface.onMouseMove(mouseEventDataAt({x: 40, y: 60}), new KeyboardState());
    efface.onLeftUp(mouseEventDataAt({x: 40, y: 60}), new KeyboardState());
    expect(Tool.SVG_COMPONENT_MANAGER.componentsCount()).toBe(1);
  });

  it('#onLeftDown() followed by onLeftUp() can erase multiple components', () => {
    placeRectangle({x: 100, y: 100}, {size: 50});
    placeRectangle({x: 400, y: 400}, {size: 50});
    expect(Tool.SVG_COMPONENT_MANAGER.componentsCount()).toBe(2);
    efface.onLeftDown(mouseEventDataAt({x: 90, y: 90}), new KeyboardState());
    efface.onMouseMove(mouseEventDataAt({x: 100, y: 100}), new KeyboardState());
    efface.onMouseMove(mouseEventDataAt({x: 400, y: 400}), new KeyboardState());
    efface.onLeftUp(mouseEventDataAt({x: 410, y: 410}), new KeyboardState());
    expect(Tool.SVG_COMPONENT_MANAGER.componentsCount()).toBe(0);
  });

  it('#onLeftDown() followed by onLeftClick() erases component', () => {
    placeRectangle({x: 50, y: 50}, {size: 60});
    efface.onMouseMove(mouseEventDataAt({x: 25, y: 25}), new KeyboardState());
    efface.onLeftDown(mouseEventDataAt({x: 25, y: 25}), new KeyboardState());
    expect(Tool.SVG_COMPONENT_MANAGER.componentsCount()).toBe(1);
    efface.onLeftClick(mouseEventDataAt({x: 25, y: 25}), new KeyboardState());
    expect(Tool.SVG_COMPONENT_MANAGER.componentsCount()).toBe(0);
  });

  it('#onLeftDown() followed by onLeftClick() on empty space does not erase component', () => {
    placeRectangle({x: 100, y: 100}, {size: 50});
    efface.onLeftDown(mouseEventDataAt({x: 160, y: 40}), new KeyboardState());
    efface.onMouseMove(mouseEventDataAt({x: 160, y: 60}), new KeyboardState());
    efface.onLeftUp(mouseEventDataAt({x: 160, y: 60}), new KeyboardState());
    efface.onLeftClick(mouseEventDataAt({x: 160, y: 60}), new KeyboardState());
    expect(Tool.SVG_COMPONENT_MANAGER.componentsCount()).toBe(1);
  });

  it('#onLeftDown() followed with dragging highlights components hovered on', () => {
    placeRectangle({x: 100, y: 100}, {size: 20});
    placeRectangle({x: 200, y: 150}, {size: 20});
    efface.onLeftDown(mouseEventDataAt({x: 0, y: 0}), new KeyboardState());
    efface.onMouseMove(mouseEventDataAt({x: 100, y: 100}), new KeyboardState());
    expect(efface[SELECTED].size).toBe(1);
    efface.onMouseMove(mouseEventDataAt({x: 200, y: 150}), new KeyboardState());
    expect(efface[SELECTED].size).toBe(2);
    efface.onMouseMove(mouseEventDataAt({x: 150, y: 100}), new KeyboardState());
    expect(efface[SELECTED].size).toBe(2);
  });

  it('#onMouseLeave() should call onLeftUp ', () => {
    const onLeftUpSpy = spyOn<any>(efface, 'onLeftUp').and.callThrough();
    efface.onMouseLeave(new MouseEventData(), new KeyboardState());
    expect(onLeftUpSpy).toHaveBeenCalled();
  });

  it('#clearSelected() should clear the svg tools selected', () => {
    const rectangle1: SvgBasicProperties = new SvgRectangleComponent();
    const rectangle2: SvgBasicProperties = new SvgRectangleComponent();
    efface[SELECTED] = new Map();
    efface[SELECTED].set(rectangle1, rectangle1);
    efface[SELECTED].set(rectangle2, rectangle2);
    efface.clearSelected();
    expect(efface[SELECTED].size).toEqual(0);
  });

  it('#clearSelected() removes selected even with svg undefined ', () => {
    const rectangle: SvgBasicProperties = new SvgRectangleComponent();
    efface[SELECTED] = new Map();
    efface[SELECTED].set(rectangle, undefined);
    efface.clearSelected();
    expect(efface[SELECTED].size).toBe(0);
  });

  it('#eraseFirstUnder() is working as expected', () => {
    const bottomRectangle = placeRectangle({x: 100, y: 100}, {size: 100});
    placeRectangle({x: 100, y: 100}, {size: 100});
    efface.onMouseMove(mouseEventDataAt({x: 100, y: 100}), new KeyboardState());
    efface.eraseFirstUnder();
    expect(Tool.SVG_COMPONENT_MANAGER.getSvgComponent(0)).toBe(bottomRectangle);
    efface.eraseFirstUnder();
    expect(Tool.SVG_COMPONENT_MANAGER.componentsCount()).toBe(0);
  });

  it('#eraseFirstUnder() does nothing when eraser is undefined', () => {
    placeRectangle({x: 100, y: 100}, {size: 1000});
    efface.eraseFirstUnder();
    expect(Tool.SVG_COMPONENT_MANAGER.componentsCount()).toBe(1);
  });

  it('#eraseFirstUnder() does remove component when nothing is contact', () => {
    placeRectangle({x: 100, y: 100}, {size: 50});
    spyOn(Tool.SVG_COMPONENT_MANAGER, 'removeSvgComponent');
    efface.onMouseMove(mouseEventDataAt({x: 0, y: 0}), new KeyboardState());
    efface.eraseFirstUnder();
    expect(Tool.SVG_COMPONENT_MANAGER.removeSvgComponent).not.toHaveBeenCalled();
  });

  it('#onMouseLeave() should call onLeftUp', () => {
    const onLeftUpSpy = spyOn<any>(efface, 'onLeftUp').and.callThrough();
    efface.onMouseLeave(new MouseEventData(), new KeyboardState());
    expect(onLeftUpSpy).toHaveBeenCalled();
  });

  it('#onKeyPress() should call cancelOnGoing, createEraserSquare and onMouseMove ', () => {
    const cancelOnGoingSpy = spyOn(efface, 'cancelOnGoing');
    const createEraserSquareSpy = spyOn<any>(efface, 'createEraserSquare');
    const onMouseMoveSpy = spyOn(efface, 'selectAllUnder');
    const KEY_ESC = KeyboardKey.Esc;
    const eventEsc = new KeyboardEvent(KEY_DOWN, {key: KEY_ESC.toString()});
    Tool.KEYBOARD_MANAGER_SERVICE.receiveKeyboardEvent(eventEsc);
    efface.setIsPressed(true);
    efface.onKeyPress(new MouseEventData(), new KeyboardState());
    expect(cancelOnGoingSpy).toHaveBeenCalled();
    expect(createEraserSquareSpy).toHaveBeenCalled();
    expect(onMouseMoveSpy).toHaveBeenCalled();
  });

  it('#onKeyPress() should not call cancelOnGoing, createEraserSquare and onMouseMove ', () => {
    const cancelOnGoingSpy = spyOn<any>(efface, 'cancelOnGoing');
    const createEraserSquareSpy = spyOn<any>(efface, 'createEraserSquare');
    const onMouseMoveSpy = spyOn<any>(efface, 'selectAllUnder');
    const KEY_ESC = KeyboardKey.Esc;
    const eventEsc = new KeyboardEvent(KEY_DOWN, {key: KEY_ESC.toString()});
    Tool.KEYBOARD_MANAGER_SERVICE.receiveKeyboardEvent(eventEsc);
    efface.setIsPressed(false);
    efface.onKeyPress(new MouseEventData(), new KeyboardState());
    expect(cancelOnGoingSpy).not.toHaveBeenCalled();
    expect(createEraserSquareSpy).not.toHaveBeenCalled();
    expect(onMouseMoveSpy).not.toHaveBeenCalled();
  });

  it('#selectFirstUnder() highlights component hovered on', () => {
    placeRectangle({x: 100, y: 100}, {size: 20});
    placeRectangle({x: 200, y: 150}, {size: 20});
    efface.onMouseMove(mouseEventDataAt({x: 100, y: 100}), new KeyboardState());
    expect(efface[SELECTED].size).toBe(1);
    efface.onMouseMove(mouseEventDataAt({x: 150, y: 100}), new KeyboardState());
    expect(efface[SELECTED].size).toBe(0);
    efface.onMouseMove(mouseEventDataAt({x: 200, y: 150}), new KeyboardState());
    expect(efface[SELECTED].size).toBe(1);
  });

  it('#selectFirstUnder() does not add duplicates', () => {
    placeRectangle({x: 100, y: 100}, {size: 1000});
    efface.onMouseMove(mouseEventDataAt({x: 100, y: 100}), new KeyboardState());
    efface.selectFirstUnder();
    expect(efface[SELECTED].size).toBe(1);
    efface.selectFirstUnder();
    expect(efface[SELECTED].size).toBe(1);
  });

  it('#selectFirstUnder() does not add to selected when duplication has error', () => {
    placeRectangle({x: 100, y: 100}, {size: 1000});
    spyOn(efface, 'getRedDuplicate').and.returnValue(undefined);
    efface.onMouseMove(mouseEventDataAt({x: 100, y: 100}), new KeyboardState());
    efface.selectFirstUnder();
    expect(efface[SELECTED].size).toBe(0);
  });

  it('#getRedDuplicate returns undefined when component is not on board', () => {
    const noRectangle = efface.getRedDuplicate(new SvgRectangleComponent());
    expect(noRectangle).toBeUndefined();
  });

  it('#selectAllUnder() does not add duplicates to selected map', () => {
    placeRectangle({x: 100, y: 100}, {size: 50});
    placeRectangle({x: 100, y: 100}, {size: 50});
    efface.onMouseMove(mouseEventDataAt({x: 100, y: 100}), new KeyboardState());
    efface.selectAllUnder();
    expect(efface[SELECTED].size).toBe(2);
    efface.selectAllUnder();
    expect(efface[SELECTED].size).toBe(2);
  });

  it('#selectAllUnder() does nothing when eraser is undefined', () => {
    placeRectangle({x: 100, y: 100}, {size: 1000});
    efface.selectAllUnder();
    expect(efface[SELECTED]).toBeUndefined();
  });
});
// tslint:disable:max-file-line-count
