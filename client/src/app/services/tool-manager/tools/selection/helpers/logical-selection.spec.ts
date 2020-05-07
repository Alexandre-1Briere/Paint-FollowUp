import { CommonModule } from '@angular/common';
import { Component, NgModule, ViewContainerRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { SvgRectangleComponent } from '../../../../../components/drawing/work-board/svg-rectangle/svg-rectangle.component';
import { SvgSelectionComponent } from '../../../../../components/drawing/work-board/svg-selection/svg-selection.component';
import { SvgLayer, SvgStatus, SvgType } from '../../../../../enums/svg';
import { Point } from '../../../../../interfaces/point';
import { SvgBasicProperties } from '../../../../../logic/svg/base-svg/svg-basic-properties';
import { TestSpeedUpgrader } from '../../../../../testHelpers/test-speed-upgrader.spec';
import {ClipboardService} from '../../../../clipboard/clipboard.service';
import { SvgCollisionsService } from '../../../../collisions/svg-collisions.service';
import {DrawingBaseParametersAccessorService} from '../../../../drawing-base-parameters-accessor/drawing-base-parameters-accessor.service';
import { KeyboardManagerService } from '../../../../events/keyboard-manager.service';
import { SvgComponentsManagerService } from '../../../../svg/svg-components-manager.service';
import {SvgUndoRedoService} from '../../../../undo-redo/svg-undo-redo.service';
import { Tool } from '../../tool/tool';
import { LogicalSelection } from './logical-selection';

// tslint:disable:max-classes-per-file
@Component({
  selector: 'app-mock-view-component',
  template: '',
})
class MockViewComponent {
  constructor(public viewContainerRef: ViewContainerRef) {}
}

const ORIGIN = {x: 0, y: 0};
const DEFAULT_COLOR = '#000000';
const VISUAL_SELECTION = 'visualSelection';
const SELECTED_SVG_COMPONENTS = 'selectedSvgComponents';
const CAN_ALTER_COMPONENTS = 'canAlterComponents';
const REMOVE_TO_SELECTED_SVG_COMPONENTS = 'removeToSelectedSvgComponents';

interface Rectangle {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [
    SvgSelectionComponent,
    SvgRectangleComponent,
    MockViewComponent,
  ],
  entryComponents: [
    SvgSelectionComponent,
    SvgRectangleComponent,
  ],
  providers: [
    DrawingBaseParametersAccessorService,
    SvgComponentsManagerService,
    SvgCollisionsService,
    KeyboardManagerService,
  ],
})
class TestModule {}

const BOARD_SIZE = 1000;

describe('LogicalSelection', () => {
  let logicalSelection: LogicalSelection;
  let mockViewComponent: MockViewComponent;

  TestSpeedUpgrader.overWriteModuleResetForSpeedGain();

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestModule],
    }).compileComponents();

    logicalSelection = new LogicalSelection(true);

    Tool.SVG_COMPONENT_MANAGER = TestBed.get(SvgComponentsManagerService);
    Tool.SVG_COLLISIONS_SERVICE = TestBed.get(SvgCollisionsService);
    Tool.CLIPBOARD_SERVICE = TestBed.get(ClipboardService);
    Tool.UNDO_REDO_SERVICE = TestBed.get(SvgUndoRedoService);

    Tool.CLIPBOARD_SERVICE.drawingBaseParametersService.setDrawingBaseParameters(BOARD_SIZE, BOARD_SIZE, '#000000');

    const fixture = TestBed.createComponent(MockViewComponent);
    mockViewComponent = fixture.componentInstance;
    Tool.SVG_COMPONENT_MANAGER.initialiseViewContainerRef(mockViewComponent.viewContainerRef);
  });

  const placeRectanglesOnBoard = (rectangles: Rectangle[]): SvgBasicProperties[] => {
    const components = [];
    for (const rectangle of rectangles) {
      const component = Tool.SVG_COMPONENT_MANAGER.createSvgComponent({
        onTopOfLayer: true,
        svgStatus: SvgStatus.Permanent,
        svgLayer: SvgLayer.Stack,
        svgType: SvgType.SvgRectangleComponent,
      }) as SvgRectangleComponent;
      component.fitExactlyInside(rectangle.x1, rectangle.y1, rectangle.x2, rectangle.y2);
      components.push(component);
    }
    return components;
  };

  const selectRectangle = (selection: LogicalSelection, to: Point, from?: Point): void => {
    if (from !== undefined) {
      selection.startSelectionRectangle(from);
    }
    selection.tryToSelectRectangle(to);
  };

  it('should create an instance', () => {
    expect(logicalSelection).toBeTruthy();
  });

  it('Defaults values are correct', () => {
    expect(logicalSelection[VISUAL_SELECTION].selection).toBeUndefined();
    expect(logicalSelection[SELECTED_SVG_COMPONENTS]).toEqual([]);
    expect(logicalSelection[CAN_ALTER_COMPONENTS]).toBeFalsy();
  });

  it('#getAllComponents() is working as expected, adding selection to selected components', () => {
    placeRectanglesOnBoard([
      {x1: 0, y1: 0, x2: 20, y2: 20},
      {x1: 25, y1: 0, x2: 40, y2: 40},
    ]);
    const BOTTOM_RIGHT = {x: 30, y: 30};
    selectRectangle(logicalSelection, BOTTOM_RIGHT, ORIGIN);

    const COMPONENT_COUNT = 3;
    expect(logicalSelection.getAllComponents().length).toBe(COMPONENT_COUNT);
  });

  it('#getAllComponents() returns only selected components when visible=false', () => {
    logicalSelection = new LogicalSelection(false);
    placeRectanglesOnBoard([
      {x1: 0, y1: 0, x2: 20, y2: 20},
    ]);
    logicalSelection.tryToSelectAtCursor({x: 10, y: 10});

    expect(logicalSelection.getAllComponents().length).toBe(1);
  });

  it('#selectAll() selects all permanents svgs', () => {
    logicalSelection = new LogicalSelection(false);
    const components = placeRectanglesOnBoard([
      {x1: 0, y1: 0, x2: 20, y2: 20},
      {x1: 21, y1: 21, x2: 40, y2: 40},
      {x1: 41, y1: 41, x2: 60, y2: 60},
    ]);
    components[1].status = SvgStatus.InProgress;
    logicalSelection.selectAll();

    expect(logicalSelection.getAllComponents().length).toBe(2);
  });

  it('#selectSvgComponents() works as expected', () => {
    logicalSelection = new LogicalSelection(false);
    const componentToUnselect = placeRectanglesOnBoard([
      {x1: 10, y1: 10, x2: 20, y2: 20},
    ]);
    logicalSelection.selectSvgComponents(componentToUnselect);
    expect(logicalSelection.getAllComponents().length).toBe(1);

    const components = placeRectanglesOnBoard([
      {x1: 0, y1: 0, x2: 20, y2: 20},
      {x1: 20, y1: 20, x2: 60, y2: 60},
    ]);
    logicalSelection.selectSvgComponents(components);
    expect(logicalSelection.getAllComponents().length).toBe(2);
  });

  it('#deleteSelection() works as expected', () => {
    logicalSelection = new LogicalSelection(false);
    placeRectanglesOnBoard([
      {x1: 0, y1: 0, x2: 10, y2: 10},
      {x1: 10, y1: 10, x2: 20, y2: 20},
    ]);
    logicalSelection.selectAll();
    const resetSpy = spyOn(logicalSelection, 'reset');
    logicalSelection.deleteSelection();
    expect(Tool.SVG_COMPONENT_MANAGER.countAllSvg()).toBe(0);
    expect(resetSpy).toHaveBeenCalled();
  });

  it('#replaceClipboardContent() works as expected', () => {
    logicalSelection = new LogicalSelection(false);
    placeRectanglesOnBoard([
      {x1: 0, y1: 0, x2: 10, y2: 10},
    ]);
    logicalSelection.selectAll();
    expect(Tool.CLIPBOARD_SERVICE.ctrlVIsAvailable()).toBeFalsy();
    logicalSelection.replaceClipboardContent();
    expect(Tool.CLIPBOARD_SERVICE.ctrlVIsAvailable()).toBeTruthy();
  });

  it('#duplicateContent() works as expected', () => {
    logicalSelection = new LogicalSelection(false);
    placeRectanglesOnBoard([
      {x1: 0, y1: 0, x2: 20, y2: 20},
    ]);
    logicalSelection.selectAll();

    logicalSelection.duplicateContent();
    expect(Tool.CLIPBOARD_SERVICE.ctrlVIsAvailable()).toBeFalsy();
    const NEW_CENTER_X = 15;
    expect(logicalSelection[SELECTED_SVG_COMPONENTS][0].getCenter().x).toBeCloseTo(NEW_CENTER_X);
    expect(logicalSelection[SELECTED_SVG_COMPONENTS].length).toBe(1);
  });

  it('#rotateClockwiseAroundCenter() works as expected', () => {
    logicalSelection = new LogicalSelection(false);
    placeRectanglesOnBoard([
      {x1: 0, y1: 0, x2: 20, y2: 20},
      {x1: 80, y1: 80, x2: 100, y2: 100},
    ]);
    logicalSelection.selectAll();
    const spySaveBoard = spyOn(Tool.UNDO_REDO_SERVICE, 'saveSvgBoard').and.stub();

    const QUARTER_TURN = 90;
    logicalSelection.rotateClockwiseAroundCenter(QUARTER_TURN);
    expect(logicalSelection[SELECTED_SVG_COMPONENTS][0].getCenter()).toEqual({x: 90, y: 10});
    expect(logicalSelection[SELECTED_SVG_COMPONENTS][1].getCenter()).toEqual({x: 10, y: 90});
    expect(spySaveBoard).toHaveBeenCalled();
  });

  it('#rotateClockwiseAroundCenter() does not save board when selection is empty', () => {
    logicalSelection = new LogicalSelection(false);
    logicalSelection.selectAll();
    const spySaveBoard = spyOn(Tool.UNDO_REDO_SERVICE, 'saveSvgBoard').and.stub();
    logicalSelection.rotateClockwiseAroundCenter(1);
    expect(spySaveBoard).not.toHaveBeenCalled();
  });

  it('#rotateClockwiseAroundSelf() works as expected', () => {
    logicalSelection = new LogicalSelection(false);
    placeRectanglesOnBoard([
      {x1: 0, y1: 0, x2: 20, y2: 20},
      {x1: 80, y1: 80, x2: 100, y2: 100},
    ]);
    logicalSelection.selectAll();
    const spySaveBoard = spyOn(Tool.UNDO_REDO_SERVICE, 'saveSvgBoard').and.stub();

    const QUARTER_TURN = 90;
    logicalSelection.rotateClockwiseAroundSelf(QUARTER_TURN);
    expect(logicalSelection[SELECTED_SVG_COMPONENTS][0].getCenter()).toEqual({x: 10, y: 10});
    expect(logicalSelection[SELECTED_SVG_COMPONENTS][1].getCenter()).toEqual({x: 90, y: 90});
    expect(spySaveBoard).toHaveBeenCalled();
  });

  it('#rotateClockwiseAroundSelf() updates visual selection', () => {
    logicalSelection = new LogicalSelection(true, DEFAULT_COLOR, true);
    placeRectanglesOnBoard([
      {x1: 0, y1: 0, x2: 20, y2: 20},
    ]);
    logicalSelection.selectAll();
    spyOn(Tool.UNDO_REDO_SERVICE, 'saveSvgBoard').and.stub();

    const HALF_QUARTER_TURN = 45;
    logicalSelection.rotateClockwiseAroundSelf(HALF_QUARTER_TURN);

    const boundary = logicalSelection[VISUAL_SELECTION].getHitbox();
    const horizontalProjection = boundary.getLinearProjection({x: 1, y: 0});
    const verticalProjection = boundary.getLinearProjection({x: 0, y: 1});
    expect(horizontalProjection).toEqual(verticalProjection);
    const EXPECTED_PROJECTION_START = -4;
    expect(verticalProjection.start).toBeLessThan(EXPECTED_PROJECTION_START);
    const EXPECTED_PROJECTION_END = 24;
    expect(verticalProjection.end).toBeGreaterThan(EXPECTED_PROJECTION_END);
  });

  it('#rotateClockwiseAroundSelf() does not save board when selection is empty', () => {
    logicalSelection = new LogicalSelection(false);
    logicalSelection.selectAll();
    const spySaveBoard = spyOn(Tool.UNDO_REDO_SERVICE, 'saveSvgBoard').and.stub();
    logicalSelection.rotateClockwiseAroundSelf(1);
    expect(spySaveBoard).not.toHaveBeenCalled();
  });

  it('#inContactWithCursor() is working as expected', () => {
    placeRectanglesOnBoard([
      {x1: 0, y1: 0, x2: 20, y2: 20},
      {x1: 25, y1: 0, x2: 40, y2: 40},
    ]);
    const BOTTOM_RIGHT = {x: 30, y: 30};
    selectRectangle(logicalSelection, BOTTOM_RIGHT, ORIGIN);
    expect(logicalSelection.inContactWithCursor({x: 2, y: 42})).toBeFalsy();
    expect(logicalSelection.inContactWithCursor({x: 40, y: 40})).toBeTruthy();
    expect(logicalSelection.inContactWithCursor({x: 0, y: 0})).toBeTruthy();
  });

  it('#enableControlPoints() does nothing if selection is undefined', () => {
    logicalSelection.enableControlPoints(true);
    const SIZE = 10;
    placeRectanglesOnBoard([
      {x1: 0, y1: 0, x2: SIZE, y2: SIZE},
    ]);
    const BOTTOM_RIGHT = {x: 20, y: 20};
    selectRectangle(logicalSelection, BOTTOM_RIGHT, ORIGIN);
    expect(logicalSelection.tryToGrabControlPoint({x: 0, y: SIZE / 2})).toBeFalsy();
  });

  it('#tryToGrabControlPoint() is working as expected', () => {
    expect(logicalSelection.tryToGrabControlPoint({x: 0, y: 0})).toBeFalsy();
    const SIZE = 20;
    placeRectanglesOnBoard([
      {x1: 0, y1: 0, x2: SIZE, y2: SIZE},
    ]);
    const BOTTOM_RIGHT = {x: SIZE, y: SIZE};
    selectRectangle(logicalSelection, BOTTOM_RIGHT, ORIGIN);
    expect(logicalSelection.tryToGrabControlPoint({x: SIZE / 2, y: 0})).toBeFalsy();
    logicalSelection.enableControlPoints(true);
    expect(logicalSelection.tryToGrabControlPoint({x: SIZE / 2, y: 0})).toBeTruthy();
  });

  it('#tryToMoveControlPoint() is working as expected', () => {
    expect(logicalSelection.tryToMoveControlPoint({x: 0, y: 0})).toBeFalsy();
    const SIZE = 20;
    placeRectanglesOnBoard([
      {x1: 0, y1: 0, x2: SIZE, y2: SIZE},
    ]);
    const BOTTOM_RIGHT = {x: SIZE, y: SIZE};
    selectRectangle(logicalSelection, BOTTOM_RIGHT, ORIGIN);
    logicalSelection.enableControlPoints(true);
    expect(logicalSelection.tryToMoveControlPoint({x: 0, y: SIZE / 2})).toBeFalsy();
    logicalSelection.tryToGrabControlPoint({x: SIZE / 2, y: 0});
    expect(logicalSelection.tryToMoveControlPoint({x: 0, y: SIZE / 2})).toBeTruthy();
  });

  it('#tryToMoveControlPoint() translates components properly', () => {
    logicalSelection = new LogicalSelection(true, DEFAULT_COLOR, true);
    placeRectanglesOnBoard([
      {x1: 0, y1: 0, x2: 20, y2: 20},
      {x1: 30, y1: 30, x2: 50, y2: 50},
    ]);
    logicalSelection.selectAll();

    logicalSelection.enableControlPoints(true);
    logicalSelection.tryToGrabControlPoint({x: 25, y: 50});
    logicalSelection.tryToMoveControlPoint({x: 0, y: 10});
    expect(logicalSelection[SELECTED_SVG_COMPONENTS][0].getCenter()).toEqual({x: 10, y: 2});
    expect(logicalSelection[SELECTED_SVG_COMPONENTS][1].getCenter()).toEqual({x: 40, y: 8});
  });

  it('#tryToMoveControlPoint() does not translate components if move is not successful', () => {
    logicalSelection = new LogicalSelection(true, DEFAULT_COLOR, true);
    placeRectanglesOnBoard([
      {x1: 0, y1: 0, x2: 20, y2: 20},
      {x1: 30, y1: 30, x2: 50, y2: 50},
    ]);
    logicalSelection.selectAll();

    logicalSelection.enableControlPoints(true);
    logicalSelection.tryToGrabControlPoint({x: 25, y: 50});
    logicalSelection.tryToMoveControlPoint({x: 0, y: 0});
    expect(logicalSelection[SELECTED_SVG_COMPONENTS][0].getCenter()).toEqual({x: 10, y: 10});
    expect(logicalSelection[SELECTED_SVG_COMPONENTS][1].getCenter()).toEqual({x: 40, y: 40});
  });

  it('#finishMovingControlPoint() is working as expected', () => {
    const saveSpy = spyOn(Tool.UNDO_REDO_SERVICE, 'saveSvgBoard').and.stub();
    logicalSelection.finishMovingControlPoint();
    expect(saveSpy).not.toHaveBeenCalled();

    const SIZE = 20;
    placeRectanglesOnBoard([
      {x1: 0, y1: 0, x2: SIZE, y2: SIZE},
    ]);
    const BOTTOM_RIGHT = {x: SIZE, y: SIZE};
    selectRectangle(logicalSelection, BOTTOM_RIGHT, ORIGIN);
    logicalSelection.tryToGrabControlPoint({x: SIZE / 2, y: 0});
    logicalSelection.finishMovingControlPoint();
    expect(logicalSelection.tryToMoveControlPoint({x: 0, y: SIZE / 2})).toBeFalsy();
    expect(saveSpy).toHaveBeenCalled();
  });

  it('#dragSelection() is updating visual-selection', () => {
    logicalSelection.startSelectionRectangle(ORIGIN);
    const POINT = {x: 10, y: 10};
    logicalSelection.dragSelectionRectangle(POINT);
    const selection = logicalSelection[VISUAL_SELECTION].selection;
    expect(selection).toBeDefined();
    if (selection !== undefined) {
      expect(selection.getCenter().x).toBe(POINT.x / 2);
      expect(selection.getCenter().y).toBe(POINT.y / 2);
    }
  });

  it('#tryToSelectRectangle() sets status properly', () => {
    logicalSelection = new LogicalSelection(true, DEFAULT_COLOR, true);
    const components = placeRectanglesOnBoard([
      {x1: 0, y1: 0, x2: 5, y2: 5},
      {x1: 20, y1: 20, x2: 30, y2: 30},
    ]);
    const POINT = {x: 25, y: 25};
    selectRectangle(logicalSelection, POINT, ORIGIN);
    expect(components[0].isSelected).toBeTruthy();
    expect(components[1].isSelected).toBeTruthy();
  });

  it('#tryToSelectAtCursor() works as expected', () => {
    const components = placeRectanglesOnBoard([
      {x1: 0, y1: 0, x2: 5, y2: 5},
      {x1: 20, y1: 20, x2: 30, y2: 30},
    ]);
    logicalSelection.tryToSelectAtCursor({x: 2, y: 2});
    expect(logicalSelection[SELECTED_SVG_COMPONENTS][0]).toEqual(components[0]);
    logicalSelection.tryToSelectAtCursor({x: 25, y: 25});
    expect(logicalSelection[SELECTED_SVG_COMPONENTS][0]).toEqual(components[1]);
    logicalSelection.tryToSelectAtCursor({x: -1, y: -1});
    expect(logicalSelection[SELECTED_SVG_COMPONENTS].length).toBe(0);
  });

  it('#tryToSelectAtCursor() correctly sets status when canAlterComponent=true', () => {
    logicalSelection = new LogicalSelection(true, DEFAULT_COLOR, true);
    const component = placeRectanglesOnBoard([
      {x1: 0, y1: 0, x2: 5, y2: 5},
    ]);
    logicalSelection.tryToSelectAtCursor({x: 2, y: 2});
    expect(component[0].isSelected).toBeTruthy();
    logicalSelection.tryToSelectAtCursor({x: 7, y: 5});
    expect(component[0].isSelected).toBeFalsy();
    expect(logicalSelection.hasSelectedComponents()).toBeFalsy();
  });

  it('#tryToApplyInversion() is working when canAlterComponents=true', () => {
    const selectionToInvert = new LogicalSelection(true, DEFAULT_COLOR, true);
    const ownedComponents = placeRectanglesOnBoard([
      {x1: 0, y1: 0, x2: 4, y2: 4},
      {x1: 6, y1: 6, x2: 10, y2: 10},
    ]);
    const componentsInverted = placeRectanglesOnBoard([
        {x1: 20, y1: 20, x2: 25, y2: 25},
      {x1: 26, y1: 26, x2: 30, y2: 30},
    ]);
    componentsInverted.push(ownedComponents[1]);

    const OWNED_COMPONENTS = {x: 10, y: 10};
    selectRectangle(selectionToInvert, OWNED_COMPONENTS, ORIGIN);
    logicalSelection[SELECTED_SVG_COMPONENTS] = componentsInverted;

    selectionToInvert.tryToApplyInversionFrom(logicalSelection);
    const COMPONENT_COUNT = 3;
    expect(selectionToInvert[SELECTED_SVG_COMPONENTS].length).toBe(COMPONENT_COUNT);
    expect(selectionToInvert[SELECTED_SVG_COMPONENTS][0]).toEqual(ownedComponents[0]);
    expect(selectionToInvert[SELECTED_SVG_COMPONENTS][1]).toEqual(componentsInverted[0]);
    expect(selectionToInvert[SELECTED_SVG_COMPONENTS][2]).toEqual(componentsInverted[1]);
  });

  it('#tryToApplyInversion() does nothing when canAlterComponents=false', () => {
    const selectionToInvert = new LogicalSelection(true, DEFAULT_COLOR, false);
    const ownedComponents = placeRectanglesOnBoard([
      {x1: 0, y1: 0, x2: 5, y2: 5},
    ]);
    const componentsNotInverted = placeRectanglesOnBoard([
      {x1: 10, y1: 10, x2: 20, y2: 20},
    ]);

    const OWNED_COMPONENTS = {x: 5, y: 5};
    selectRectangle(selectionToInvert, OWNED_COMPONENTS, ORIGIN);
    logicalSelection[SELECTED_SVG_COMPONENTS] = componentsNotInverted;

    selectionToInvert.tryToApplyInversionFrom(logicalSelection);
    expect(selectionToInvert[SELECTED_SVG_COMPONENTS].length).toBe(1);
    expect(selectionToInvert[SELECTED_SVG_COMPONENTS][0]).toEqual(ownedComponents[0]);
  });

  it('#tryToApplyInversion() sets status properly', () => {
    const selectionToInvert = new LogicalSelection(true, DEFAULT_COLOR, true);
    const componentInverted = placeRectanglesOnBoard([
      {x1: 0, y1: 0, x2: 5, y2: 5},
    ]);

    logicalSelection[SELECTED_SVG_COMPONENTS] = componentInverted;

    selectionToInvert.tryToApplyInversionFrom(logicalSelection);
    expect(componentInverted[0].isSelected).toBeTruthy();
    selectionToInvert.tryToApplyInversionFrom(logicalSelection);
    expect(componentInverted[0].isSelected).toBeFalsy();
  });

  it('#replaceWith() is working as expected', () => {
    const selectionToReplace = new LogicalSelection(false);
    selectionToReplace[SELECTED_SVG_COMPONENTS] = placeRectanglesOnBoard([{x1: 0, y1: 0, x2: 4, y2: 4}]);
    logicalSelection[SELECTED_SVG_COMPONENTS] = placeRectanglesOnBoard([{x1: 5, y1: 5, x2: 10, y2: 10}]);

    selectionToReplace.replaceWith(logicalSelection);
    expect(selectionToReplace[SELECTED_SVG_COMPONENTS].length).toBe(1);
    expect(selectionToReplace[SELECTED_SVG_COMPONENTS][0]).toBe(logicalSelection[SELECTED_SVG_COMPONENTS][0]);
  });

  it('#removeToSelectedSvgComponents() is setting status correctly', () => {
    logicalSelection = new LogicalSelection(true, DEFAULT_COLOR, true);

    const ownedComponent = placeRectanglesOnBoard([{x1: 0, y1: 0, x2: 10, y2: 10}]);
    const POINT = {x: 10, y: 10};
    selectRectangle(logicalSelection, POINT, ORIGIN);

    logicalSelection[REMOVE_TO_SELECTED_SVG_COMPONENTS](ownedComponent);
    expect(ownedComponent[0].isSelected).toBeFalsy();
    expect(logicalSelection[SELECTED_SVG_COMPONENTS].length).toBe(0);
  });

  it('#removeToSelectedSvgComponents() respects canAlterComponent', () => {
    const mainSelection = new LogicalSelection(true, DEFAULT_COLOR, true);
    const ownedComponent = placeRectanglesOnBoard([
        {x1: 0, y1: 0, x2: 10, y2: 10},
        {x1: 12, y1: 12, x2: 15, y2: 15},
    ]);
    const POINT = {x: 15, y: 15};
    selectRectangle(logicalSelection, POINT, ORIGIN);
    selectRectangle(mainSelection, POINT, ORIGIN);

    const removedComponents = placeRectanglesOnBoard([{x1: 20, y1: 20, x2: 30, y2: 30}]);
    removedComponents.push(ownedComponent[1]);

    logicalSelection[REMOVE_TO_SELECTED_SVG_COMPONENTS](removedComponents);
    expect(ownedComponent[1].isSelected).toBeTruthy();

    mainSelection[REMOVE_TO_SELECTED_SVG_COMPONENTS](removedComponents);
    expect(ownedComponent[1].isSelected).toBeFalsy();
    expect(logicalSelection[SELECTED_SVG_COMPONENTS].length).toBe(1);
  });
});
// tslint:disable:max-file-line-count
// This is only a test file; not a functionality file
