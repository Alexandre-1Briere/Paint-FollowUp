import {CommonModule} from '@angular/common';
import {Component, NgModule, ViewContainerRef} from '@angular/core';
import {TestBed} from '@angular/core/testing';
import {SvgSelectionComponent} from '../../../../../components/svgElement/svg-selection/svg-selection.component';
import {Point} from '../../../../../interfaces/point';
import {CollisionDetection} from '../../../../../logic/collisions/detection/collision-detection';
import {PolygonCollidable} from '../../../../../logic/collisions/polygon/polygon-collidable';
import {TestSpeedUpgrader} from '../../../../../testHelpers/test-speed-upgrader.spec';
import {SvgCollisionsService} from '../../../../collisions/svg-collisions.service';
import {KeyboardManagerService} from '../../../../events/keyboard-manager.service';
import {SvgComponentsManagerService} from '../../../../svg/svg-components-manager.service';
import {Tool} from '../../tool/tool';
import {VisualSelection} from './visual-selection';

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
    SvgSelectionComponent,
    MockViewComponent,
  ],
  entryComponents: [
    SvgSelectionComponent,
  ],
  providers: [
    SvgComponentsManagerService,
    SvgCollisionsService,
    KeyboardManagerService,
  ],
})
class TestModule {}

describe('VisualSelection', () => {
  let visualSelection: VisualSelection;
  let mockViewComponent: MockViewComponent;

  TestSpeedUpgrader.overWriteModuleResetForSpeedGain();

  beforeEach(() => {

    TestBed.configureTestingModule({
      imports: [TestModule],
    }).compileComponents();

    visualSelection = new VisualSelection();

    Tool.SVG_COMPONENT_MANAGER = TestBed.get(SvgComponentsManagerService);
    Tool.SVG_COLLISIONS_SERVICE = TestBed.get(SvgCollisionsService);

    const fixture = TestBed.createComponent(MockViewComponent);
    mockViewComponent = fixture.componentInstance;
    Tool.SVG_COMPONENT_MANAGER.initialiseViewContainerRef(mockViewComponent.viewContainerRef);
  });

  const checkRectangleMatch = (topLeft: Point, bottomRight: Point): boolean => {
    const CORNER_START = 'cornerStart';
    const CORNER_END = 'cornerEnd';

    return topLeft.x === visualSelection[CORNER_START].x &&
           topLeft.y === visualSelection[CORNER_START].y &&
           bottomRight.x === visualSelection[CORNER_END].x &&
           bottomRight.y === visualSelection[CORNER_END].y;
  };

  it('should create an instance', () => {
    expect(visualSelection).toBeTruthy();
  });

  it('selection is undefined by default', () => {
    expect(visualSelection.selection).toBeUndefined();
  });

  it('#display() makes selection defined', () => {
    visualSelection.display();
    expect(visualSelection.selection).toBeDefined();
  });

  it('#hide() makes selection undefined', () => {
    visualSelection.display();
    visualSelection.hide();
    expect(visualSelection.selection).toBeUndefined();
  });

  it('#hide() prevents selection to be displayed after any refresh', () => {
    const POINT = {x: 4, y: 4};
    visualSelection.hide();
    visualSelection.startDragging(POINT);
    visualSelection.continueDragging(POINT);
    visualSelection.setCorners(POINT, POINT);
    expect(visualSelection.selection).toBeUndefined();
  });

  it('#startDragging() places both corners at correct location', () => {
    const POINT = {x: 5, y: 5};
    visualSelection.startDragging(POINT);
    expect(checkRectangleMatch(POINT, POINT)).toBeTruthy();
  });

  it('#continueDragging() moves only end corner', () => {
    const POINT = {x: 5, y: 5};
    visualSelection.startDragging(POINT);
    const END_POINT = {x: 10, y: 10};
    visualSelection.continueDragging(END_POINT);
    expect(checkRectangleMatch(POINT, END_POINT)).toBeTruthy();
  });

  it('#setCorners() moves only end corner', () => {
    const START_POINT = {x: 5, y: 5};
    const END_POINT = {x: 10, y: 10};
    visualSelection.setCorners(START_POINT, END_POINT);
    expect(checkRectangleMatch(START_POINT, END_POINT)).toBeTruthy();
  });

  it('#getCenter() works as expected', () => {
    const START_POINT = {x: 0, y: 0};
    const END_POINT = {x: 10, y: 10};
    visualSelection.setCorners(START_POINT, END_POINT);
    expect(visualSelection.getCenter()).toEqual({x: 5, y: 5});
  });

  it('#getCenter() works as expected even with translation', () => {
    const START_POINT = {x: 0, y: 0};
    const END_POINT = {x: 10, y: 10};
    visualSelection.setCorners(START_POINT, END_POINT);
    const selection = visualSelection.selection;
    if (selection) {
      selection.translate({x: 1, y: -1});
    }
    expect(visualSelection.getCenter()).toEqual({x: 6, y: 4});
  });

  it('#getComponentsInContact returns [] when selection=undefined', () => {
    expect(visualSelection.getComponentsInContact()).toEqual([]);
  });

  it('#getComponentsInContact works as expected when selection is defined', () => {
    const ORIGIN = {x: 0, y: 0};
    visualSelection.setCorners(ORIGIN, ORIGIN);
    if (visualSelection.selection !== undefined) {
      spyOn(visualSelection.selection, 'getHitbox');
      visualSelection.getComponentsInContact();
      expect(visualSelection.selection.getHitbox).toHaveBeenCalled();
    } else {
      const MUST_FAILED = true;
      expect(false).toBe(MUST_FAILED);
    }
  });

  it('#getHitbox() has correct dimensions', () => {
    const START_POINT = {x: 6, y: 6};
    const END_POINT = {x: 11, y: 11};
    visualSelection.setCorners(START_POINT, END_POINT);
    const hitbox = visualSelection.getHitbox();

    const HORIZONTAL_AXIS = {x: 1, y: 0};
    const VERTICAL_AXIS = {x: 0, y: 1};
    const horizontalProjection = hitbox.getLinearProjection(HORIZONTAL_AXIS);
    const verticalProjection = hitbox.getLinearProjection(VERTICAL_AXIS);
    expect(horizontalProjection.end - horizontalProjection.start).toBe(END_POINT.x - START_POINT.x);
    expect(verticalProjection.end - verticalProjection.start).toBe(END_POINT.y - START_POINT.y);
  });

  it('#getHitbox() cannot be intersected with visible element when selection=undefined', () => {
    const hitbox = visualSelection.getHitbox();
    const TOP_LEFT = {x: 0, y: 0};
    const BOTTOM_RIGHT = {x: 9000, y: 9000};
    const viewRectangleHitBox = PolygonCollidable.createRectangle(TOP_LEFT, BOTTOM_RIGHT);
    expect(CollisionDetection.checkIntersection(hitbox, viewRectangleHitBox)).toBeFalsy();
  });

  it('#displaySelection() does not attempt to change data when selection is undefined', () => {
    const DISPLAY_SELECTION = 'displaySelection';
    spyOn(Tool.SVG_COMPONENT_MANAGER, 'createSvgComponent').and.returnValue(undefined);
    visualSelection[DISPLAY_SELECTION]();
    expect(visualSelection.selection).toBeUndefined();
  });
});
