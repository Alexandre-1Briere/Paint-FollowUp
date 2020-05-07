import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonModule } from '@angular/common';
import { Component, NgModule, ViewContainerRef } from '@angular/core';
import { DrawingBoardComponent } from '../../components/drawing/work-board/drawing-board/drawing-board.component';
import { SvgRectangleComponent } from '../../components/svgElement/svg-rectangle/svg-rectangle.component';
import { SvgLayer, SvgStatus } from '../../enums/svg';
import { TestSpeedUpgrader } from '../../testHelpers/test-speed-upgrader.spec';
import { ViewManagerService } from './view-manager.service';

// tslint:disable:max-classes-per-file
@Component({
  selector: 'app-mock-view-component',
  template: '',
})
class MockViewComponent {
  constructor(public viewContainerRef: ViewContainerRef) {}
}

@NgModule({
  imports: [CommonModule],
  declarations: [
    SvgRectangleComponent,
    MockViewComponent,
  ],
  entryComponents: [
    SvgRectangleComponent,
  ],
})
class TestModule {}

describe('ViewManagerService', () => {
  let service: ViewManagerService;
  let boardFixture: ComponentFixture<MockViewComponent>;

  TestSpeedUpgrader.overWriteModuleResetForSpeedGain();

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        DrawingBoardComponent,
      ],
      imports: [TestModule],
    }).compileComponents();

    boardFixture = TestBed.createComponent(MockViewComponent);
    service = TestBed.get(ViewManagerService);
  });

  const initialiseViewContainerRef = (): void => {
    boardFixture.detectChanges();
    const board = boardFixture.componentInstance;
    service.initialiseViewContainerRef(board.viewContainerRef);
  };

  it('should be created', () => {
    const viewManagerService: ViewManagerService = TestBed.get(ViewManagerService);
    expect(viewManagerService).toBeTruthy();
  });

  it('#createSvgComponent() returns undefined when viewContainerRef is undefined', () => {
    const undefinedRectangle = service.createSvgComponent();
    expect(undefinedRectangle).not.toBeDefined();
  });

  it('#createSvgComponent() returns an SvgInstance when viewContainerRef is defined', () => {
    initialiseViewContainerRef();
    const rectangle = service.createSvgComponent();
    expect(rectangle).toBeDefined();
  });

  it('#createSvgComponent() correctly creates an SvgInstance no matter the onTopOfView argument', () => {
    initialiseViewContainerRef();

    const SECOND_PARAMETER_COMBINATIONS = 3;
    service.createSvgComponent();
    service.createSvgComponent(false);
    service.createSvgComponent(true);

    expect(service.componentsCount()).toEqual(SECOND_PARAMETER_COMBINATIONS);
  });

  it('#createSvgComponent() correctly inserts all elements after complex insertions', () => {
    initialiseViewContainerRef();

    let id = 0;
    const REPETITIONS = 3;
    for (let n = 0; n < REPETITIONS; ++n) {
      const svgComponent = service.createSvgComponent(false, SvgLayer.Grid);
      if (svgComponent !== undefined) {
        svgComponent.centerAt({x: id++, y: 0});
      }
    }
    for (let n = 0; n < REPETITIONS; ++n) {
      const svgComponent = service.createSvgComponent(true, SvgLayer.Stack);
      if (svgComponent !== undefined) {
        svgComponent.centerAt({x: id++, y: 0});
      }
    }
    for (let n = 0; n < REPETITIONS; ++n) {
      const svgComponent = service.createSvgComponent( false, SvgLayer.Stack);
      if (svgComponent !== undefined) {
        svgComponent.centerAt({x: id++, y: 0});
      }
    }

    const WRONG_ID = -1;

    const LAST_GRID = 8;
    let rectangle = service.getSvgComponent(LAST_GRID);
    const EXPECTED_LAST_GRID_ID = 0;
    let rectangleId = rectangle !== undefined ? rectangle.getCenter().x : WRONG_ID;
    expect(rectangleId).toBe(EXPECTED_LAST_GRID_ID);

    const LAST_STACK = 5;
    rectangle = service.getSvgComponent(LAST_STACK);
    const EXPECTED_LAST_STACK_ID = 5;
    rectangleId = rectangle !== undefined ? rectangle.getCenter().x : WRONG_ID;
    expect(rectangleId).toBe(EXPECTED_LAST_STACK_ID);

    const FIRST_STACK = 0;
    rectangle = service.getSvgComponent(FIRST_STACK);
    const EXPECTED_FIRST_STACK_ID = 8;
    rectangleId = rectangle !== undefined ? rectangle.getCenter().x : WRONG_ID;
    expect(rectangleId).toBe(EXPECTED_FIRST_STACK_ID);
  });

  it('#componentsCount() returns 0 when viewContainerRef is undefined', () => {
    const componentsCount = service.componentsCount();
    expect(componentsCount).toEqual(0);
  });

  it('#componentsCount() returns correct count after multiple insertions', () => {
    initialiseViewContainerRef();

    const REPETITIONS = 2;
    for (let n = 0; n < REPETITIONS; ++n) {
      service.createSvgComponent();
    }

    const componentsCount = service.componentsCount();
    expect(componentsCount).toEqual(REPETITIONS);
  });

  it('#componentsCount() returns correct count after multiple insertions with different svg status', () => {
    initialiseViewContainerRef();

    const REPETITIONS_PERMANENT = 2;
    for (let n = 0; n < REPETITIONS_PERMANENT; ++n) {
      service.createSvgComponent();
    }
    const REPETITIONS_IN_PROGRESS = 2;
    for (let n = 0; n < REPETITIONS_IN_PROGRESS; ++n) {
      const svgComponent = service.createSvgComponent();
      if (svgComponent !== undefined) {
        svgComponent.status = SvgStatus.InProgress;
      }
    }

    const REPETITIONS_TO_COUNT = REPETITIONS_PERMANENT;
    const componentsCount = service.componentsCount(SvgStatus.Permanent);
    expect(componentsCount).toEqual(REPETITIONS_TO_COUNT);
  });

  it('#getSvgComponent() returns undefined when viewContainerRef is undefined', () => {
    const undefinedRectangle = service.getSvgComponent(0);
    expect(undefinedRectangle).not.toBeDefined();
  });

  it('#getSvgComponent() returns undefined when index is negative', () => {
    const INVALID_INDEX = -1;
    const undefinedRectangle = service.getSvgComponent(INVALID_INDEX);
    expect(undefinedRectangle).not.toBeDefined();
  });

  it('#getSvgComponent() returns undefined when index is too large', () => {
    initialiseViewContainerRef();

    const REPETITIONS = 2;
    for (let n = 0; n < REPETITIONS; ++n) {
      service.createSvgComponent();
    }
    const undefinedRectangle = service.getSvgComponent(REPETITIONS);

    expect(undefinedRectangle).not.toBeDefined();
  });

  it('#removeSvgComponent() removes inserted element', () => {
    initialiseViewContainerRef();

    service.createSvgComponent();
    service.removeSvgComponent(0);
    const undefinedRectangle = service.getSvgComponent(0);

    expect(undefinedRectangle).not.toBeDefined();
  });

  it('#removeSvgComponent() does not remove inserted element with negative index', () => {
    initialiseViewContainerRef();

    service.createSvgComponent();
    const INVALID_INDEX = -1;
    service.removeSvgComponent(INVALID_INDEX);
    const rectangle = service.getSvgComponent(0);

    expect(rectangle).toBeDefined();
  });

  it('#removeSvgComponent() does not remove inserted element when index is too large', () => {
    initialiseViewContainerRef();

    const REPETITIONS = 2;
    for (let n = 0; n < REPETITIONS; ++n) {
      service.createSvgComponent();
    }
    service.removeSvgComponent(REPETITIONS);
    const rectangle = service.getSvgComponent(REPETITIONS - 1);

    expect(rectangle).toBeDefined();
  });

  it('#resetSvgComponents() removes all components', () => {
    initialiseViewContainerRef();

    const REPETITIONS = 2;
    for (let n = 0; n < REPETITIONS; ++n) {
      service.createSvgComponent();
    }
    service.resetSvgComponents();
    const undefinedRectangle = service.getSvgComponent(0);

    expect(undefinedRectangle).not.toBeDefined();
  });

  it('#resetSvgComponents() does nothing when specified layer is absent', () => {
    initialiseViewContainerRef();

    const REPETITIONS = 2;
    for (let n = 0; n < REPETITIONS; ++n) {
      service.createSvgComponent();
    }
    service.resetSvgComponents(SvgLayer.Grid);

    expect(service.componentsCount()).toBe(REPETITIONS);
  });

  it('#resetSvgComponents() removes only components in specified layer', () => {
    initialiseViewContainerRef();

    const REPETITIONS = 2;
    for (let n = 0; n < REPETITIONS; ++n) {
      service.createSvgComponent();
    }
    for (let n = 0; n < REPETITIONS; ++n) {
      service.createSvgComponent(true, SvgLayer.Visual);
    }
    for (let n = 0; n < REPETITIONS; ++n) {
      service.createSvgComponent(false, SvgLayer.Grid);
    }

    service.resetSvgComponents(SvgLayer.Visual);

    const EXPECTED_COUNT = 4;
    expect(service.componentsCount()).toBe(EXPECTED_COUNT);
    const EXPECTED_COUNT_REMAINING_LAYER = REPETITIONS;
    expect(service.componentsCount(SvgStatus.Permanent, SvgLayer.Stack)).toBe(EXPECTED_COUNT_REMAINING_LAYER);
    expect(service.componentsCount(SvgStatus.Permanent, SvgLayer.Grid)).toBe(EXPECTED_COUNT_REMAINING_LAYER);
  });

  it('#tryToGetLayerIndex() returns correct index after multiple insertions', () => {
    initialiseViewContainerRef();

    const REPETITIONS = 2;
    for (let n = 0; n < REPETITIONS; ++n) {
      service.createSvgComponent(true, SvgLayer.Stack);
    }
    service.createSvgComponent(true, SvgLayer.Grid);

    const EXPECTED_INDEX_TOP_STACK = REPETITIONS - 1;
    expect(service.tryToGetLayerIndex(SvgLayer.Stack)).toBe(EXPECTED_INDEX_TOP_STACK);
  });

  it('#tryToGetLayerIndex() returns undefined when no insertion occured', () => {
    expect(service.tryToGetLayerIndex(SvgLayer.Stack)).toBeUndefined();
  });

  it('#indexToInsert() returns correct index when no insertion occured', () => {
    const FIRST_INSERTION_INDEX = 0;
    expect(service.indexToInsert(SvgLayer.Stack)).toBe(FIRST_INSERTION_INDEX);
  });

  it('#indexToInsert() returns correct index when multiple insertions occured', () => {
    initialiseViewContainerRef();

    const REPETITIONS = 2;
    for (let n = 0; n < REPETITIONS; ++n) {
      service.createSvgComponent(true, SvgLayer.Stack);
    }
    service.createSvgComponent(true, SvgLayer.Grid);

    const EXPECTED_INSERTION_INDEX = REPETITIONS;
    expect(service.indexToInsert(SvgLayer.Stack)).toBe(EXPECTED_INSERTION_INDEX);
  });

  it('#indexToInsert() returns correct index for bottom insertion', () => {
    initialiseViewContainerRef();

    service.createSvgComponent(true, SvgLayer.Stack);

    const FIRST_INDEX = 0;
    expect(service.indexToInsert(SvgLayer.Stack, false)).toBe(FIRST_INDEX);
  });
});
