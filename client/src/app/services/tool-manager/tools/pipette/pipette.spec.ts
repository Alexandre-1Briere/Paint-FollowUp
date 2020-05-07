import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { KeyboardState } from 'src/app/logic/events/keyboard/keyboard-state';
import { DrawingBoardComponent } from '../../../../components/drawing/work-board/drawing-board/drawing-board.component';
import { SvgEllipseComponent } from '../../../../components/svgElement/svg-ellipse/svg-ellipse.component';
import { SvgRectangleComponent } from '../../../../components/svgElement/svg-rectangle/svg-rectangle.component';
import { SvgLayer, SvgStatus, SvgType } from '../../../../enums/svg';
import { Point } from '../../../../interfaces/point';
import { MouseEventData, MouseLocation } from '../../../../logic/events/mouse/mouse-event-data';
import { SvgBasicProperties } from '../../../../logic/svg/base-svg/svg-basic-properties';
import { SvgEllipseProperties } from '../../../../logic/svg/ellipse/svg-ellipse-properties';
import { TestSpeedUpgrader } from '../../../../testHelpers/test-speed-upgrader.spec';
import { DrawingAccessorService } from '../../../current-drawing-accessor/drawing-accessor.service';
import { DrawingBaseParametersAccessorService } from '../../../drawing-base-parameters-accessor/drawing-base-parameters-accessor.service';
import { SvgComponentsManagerService } from '../../../svg/svg-components-manager.service';
import { SvgUndoRedoService } from '../../../undo-redo/svg-undo-redo.service';
import { ToolsOptionsManagerService } from '../../tools-options-manager/tools-options-manager.service';
import { Tool } from '../tool/tool';
import { Pipette } from './pipette';

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [
    DrawingBoardComponent,
    SvgRectangleComponent,
    SvgEllipseComponent,
  ],
  entryComponents: [
    SvgRectangleComponent,
    SvgEllipseComponent,
  ],
  providers: [
    SvgComponentsManagerService,
    DrawingAccessorService,
    DrawingBaseParametersAccessorService,
    ToolsOptionsManagerService,
    SvgUndoRedoService,
  ],
})
class TestModule {}

const COLOR = 'color';
const COLOR_IS_BEING_FETCHED = 'colorIsBeingFetched';
const CREATE_SVG = 'createSvg';
const ENOUGH_TIME_FOR_CANVAS_TO_BE_RENDERED = 500;

describe('Pipette', () => {
  let pipette: Pipette;
  let boardFixture: ComponentFixture<DrawingBoardComponent>;
  let drawingBoard: DrawingBoardComponent;
  TestSpeedUpgrader.overWriteModuleResetForSpeedGain();

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestModule],
    }).compileComponents();

    pipette = new Pipette();

    Tool.SVG_COMPONENT_MANAGER = TestBed.get(SvgComponentsManagerService);
    Tool.CANVAS_SERVICE = TestBed.get(DrawingAccessorService);
    Tool.TOOL_OPTIONS_MANAGER = TestBed.get(ToolsOptionsManagerService);
    Tool.UNDO_REDO_SERVICE = TestBed.get(SvgUndoRedoService);
    spyOn(Tool.UNDO_REDO_SERVICE, 'saveSvgBoard').and.stub();

    boardFixture = TestBed.createComponent(DrawingBoardComponent);
    drawingBoard = boardFixture.componentInstance;
    Tool.SVG_COMPONENT_MANAGER.initialiseViewContainerRef(drawingBoard.rootSvg);
    boardFixture.detectChanges();
    Tool.CANVAS_SERVICE.setTrackedDrawingRef(drawingBoard.svgElement);
    drawingBoard.ngOnInit();
  });

  const placeRectangle = (center: Point, size: number, color?: string): SvgBasicProperties => {
    const component = Tool.SVG_COMPONENT_MANAGER.createSvgComponent({
      onTopOfLayer: true,
      svgStatus: SvgStatus.Permanent,
      svgLayer: SvgLayer.Stack,
      svgType: SvgType.SvgRectangleComponent,
    }) as SvgRectangleComponent;
    component.fitExactlyInside(center.x - size / 2, center.y - size / 2, center.x + size / 2, center.y + size / 2);
    if (color !== undefined) {
      component.setPrimaryColor(color);
      component.setSecondaryColor(color);
    }
    boardFixture.detectChanges();
    return component;
  };

  const mouseEventDataAt = (x: number, y: number): MouseEventData => {
    const mouseEventData = new MouseEventData();
    mouseEventData.x = x;
    mouseEventData.y = y;
    return mouseEventData;
  };

  it('should create an instance', () => {
    expect(pipette).toBeTruthy();
  });

  it('#createSvg() remains at default values when coords is undefined', () => {
    const COLORED_RING = 'coloredRing';
    pipette[CREATE_SVG]();
    const COMPONENT_COUNT = 3;
    expect(Tool.SVG_COMPONENT_MANAGER.countAllSvg()).toBe(COMPONENT_COUNT);
    const coloredRing = pipette[COLORED_RING];
    if (coloredRing !== undefined) {
      expect(coloredRing.getSecondaryColor()).toBe(new SvgEllipseProperties().getSecondaryColor());
    } else {
      const WRONG = false;
      expect(WRONG).toBeTruthy();
    }
  });

  it('#createSvg() does not call getRing() when ring already exists', () => {
    const GET_RING = 'getRing';
    // tslint:disable-next-line:no-any
    spyOn<any>(pipette, GET_RING).and.callThrough();
    pipette[CREATE_SVG]();
    boardFixture.detectChanges();
    pipette[CREATE_SVG]();
    const COMPONENT_COUNT = 3;
    expect(pipette[GET_RING]).toHaveBeenCalledTimes(COMPONENT_COUNT);
  });

  it('#cancelOnGoing() does not call SvgComponentsManager.removeSvgComponent() when rings are undefined', () => {
    spyOn(Tool.SVG_COMPONENT_MANAGER, 'removeSvgComponent');
    pipette.cancelOnGoing(new MouseEventData(), new KeyboardState());
    expect(Tool.SVG_COMPONENT_MANAGER.removeSvgComponent).not.toHaveBeenCalled();
  });

  it('#cancelOnGoing() removes pipette colored circle', async () => {
    const COLOR_ON_BOARD = '#ddeeff';
    const COMPONENT_COUNT = 3;
    const SIZE = 1000;
    const RADIUS = 100;
    placeRectangle({ x: 500, y: 500 }, SIZE, COLOR_ON_BOARD);
    pipette.onMouseMove(mouseEventDataAt(RADIUS, RADIUS), new KeyboardState());
    await new Promise((resolve) => setTimeout(resolve, ENOUGH_TIME_FOR_CANVAS_TO_BE_RENDERED));
    expect(Tool.SVG_COMPONENT_MANAGER.countAllSvg()).toBe(1 + COMPONENT_COUNT);
    pipette.cancelOnGoing(new MouseEventData(), new KeyboardState());
    expect(Tool.SVG_COMPONENT_MANAGER.countAllSvg()).toBe(1);
  });

  it('#onBoardChange() calls onMouseMove()', () => {
    spyOn(pipette, 'onMouseMove');
    pipette.onBoardChange(new MouseEventData(), new KeyboardState());
    expect(pipette.onMouseMove).toHaveBeenCalled();
  });

  it('#onMouseMove() picks color', async () => {
    const COLOR_ON_BOARD = '#aabbcc';
    const SIZE = 1000;
    const RADIUS = 10;
    placeRectangle({ x: 500, y: 500 }, SIZE, COLOR_ON_BOARD);
    pipette.onMouseMove(mouseEventDataAt(RADIUS, RADIUS), new KeyboardState());
    await new Promise((resolve) => setTimeout(resolve, ENOUGH_TIME_FOR_CANVAS_TO_BE_RENDERED));
    expect(pipette[COLOR]).toBe(COLOR_ON_BOARD);
  });

  it('#onMouseLeave() calls onLeftUp()', () => {
    const COLOR_ON_BOARD = '#445566';
    const SIZE = 1000;
    placeRectangle({x: 500, y: 500}, SIZE, COLOR_ON_BOARD);
    spyOn(pipette, 'onLeftUp');
    pipette.onMouseLeave(new MouseEventData(), new KeyboardState());
    expect(pipette.onLeftUp).toHaveBeenCalled();
  });

  it('#onMouseLeave() calls onRightUp()', () => {
    const COLOR_ON_BOARD = '#445566';
    const SIZE = 1000;
    placeRectangle({x: 500, y: 500}, SIZE, COLOR_ON_BOARD);
    spyOn(pipette, 'onRightUp');
    pipette.onMouseLeave(new MouseEventData(), new KeyboardState());
    expect(pipette.onRightUp).toHaveBeenCalled();
  });

  it('#onLeftDown() followed by onLeftUp() picks correct color', async () => {
    const COLOR_ON_BOARD = '#345678';
    const SIZE = 1000;
    const RADIUS = 50;
    placeRectangle({x: 500, y: 500}, SIZE, COLOR_ON_BOARD);
    pipette.onLeftDown(mouseEventDataAt(RADIUS, RADIUS), new KeyboardState());
    pipette.onLeftUp(mouseEventDataAt(RADIUS, RADIUS), new KeyboardState());
    await new Promise((resolve) => setTimeout(resolve, ENOUGH_TIME_FOR_CANVAS_TO_BE_RENDERED));
    expect(Tool.TOOL_OPTIONS_MANAGER.getSettings().primaryColor).toBe(COLOR_ON_BOARD);
    expect(Tool.TOOL_OPTIONS_MANAGER.getSettings().secondaryColor).not.toBe(COLOR_ON_BOARD);
  });

  it('#onLeftDown() does nothing when mouse is outside', () => {
    const mouseEvent = new MouseEventData();
    mouseEvent.location = MouseLocation.Outside;
    pipette.onLeftDown(mouseEvent, new KeyboardState());
    expect(Tool.SVG_COMPONENT_MANAGER.countAllSvg()).toBe(0);
  });

  it('#onRightDown() followed by onRightUp() picks correct color', async () => {
    const COLOR_ON_BOARD = '#abcdef';
    const SIZE = 1000;
    const RADIUS = 50;
    placeRectangle({x: 500, y: 500}, SIZE, COLOR_ON_BOARD);
    pipette.onRightDown(mouseEventDataAt(RADIUS, RADIUS), new KeyboardState());
    pipette.onRightUp(mouseEventDataAt(RADIUS, RADIUS), new KeyboardState());
    await new Promise((resolve) => setTimeout(resolve, ENOUGH_TIME_FOR_CANVAS_TO_BE_RENDERED));
    expect(Tool.TOOL_OPTIONS_MANAGER.getSettings().secondaryColor).toBe(COLOR_ON_BOARD);
    expect(Tool.TOOL_OPTIONS_MANAGER.getSettings().primaryColor).not.toBe(COLOR_ON_BOARD);
  });

  it('#onRightDown() does nothing when mouse is outside', () => {
    const mouseEvent = new MouseEventData();
    mouseEvent.location = MouseLocation.Outside;
    pipette.onRightDown(mouseEvent, new KeyboardState());
    expect(Tool.SVG_COMPONENT_MANAGER.countAllSvg()).toBe(0);
  });

  it('#setPrimaryColor() does not send undefined to ToolOptionManager', async () => {
    spyOn(pipette, 'getColorUnderCursor').and.returnValue(Promise.resolve(false));
    spyOn(Tool.TOOL_OPTIONS_MANAGER, 'setPrimaryColor');
    pipette.setPrimaryColor(new MouseEventData());
    expect(Tool.TOOL_OPTIONS_MANAGER.setPrimaryColor).not.toHaveBeenCalled();
  });

  it('#setSecondaryColor() does not send undefined to ToolOptionManager', async () => {
    spyOn(pipette, 'getColorUnderCursor').and.returnValue(Promise.resolve(false));
    spyOn(Tool.TOOL_OPTIONS_MANAGER, 'setSecondaryColor');
    pipette.setSecondaryColor(new MouseEventData());
    expect(Tool.TOOL_OPTIONS_MANAGER.setSecondaryColor).not.toHaveBeenCalled();
  });

  it('#getColorUnderCursor() does try to read canvas when already loading', () => {
    expect(pipette[COLOR_IS_BEING_FETCHED]).toBeFalsy();
    const RADIUS = 100;
    pipette.getColorUnderCursor(mouseEventDataAt(RADIUS, RADIUS)).then(() => {
      return;
    });
    expect(pipette[COLOR_IS_BEING_FETCHED]).toBeTruthy();

    spyOn(Tool.CANVAS_SERVICE, 'getCurrentDrawingElement');
    const RADIUS2 = 500;
    pipette.getColorUnderCursor(mouseEventDataAt(RADIUS2, RADIUS2)).then(() => {
      return;
    });
    expect(Tool.CANVAS_SERVICE.getCurrentDrawingElement).not.toHaveBeenCalled();
  });

  it('should call onMouseMove()', () => {
    const spy = spyOn(pipette, 'onMouseEnter');
    pipette.onMouseEnter(mouseEventDataAt(0, 0), new KeyboardState());
    expect(spy).toHaveBeenCalled();
  });

  it('should set isInside to true', () => {
    pipette.isInside = false;
    pipette.onMouseEnter(mouseEventDataAt(0, 0), new KeyboardState());
    expect(pipette.isInside).toBeTruthy();
  });
});
