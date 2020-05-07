import { CommonModule } from '@angular/common';
import { Component, NgModule, ViewContainerRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {SvgUndoRedoService} from '../undo-redo/svg-undo-redo.service';

import { SvgComponentsManagerService } from './svg-components-manager.service';

import { SvgRectangleComponent } from '../../components/drawing/work-board/svg-rectangle/svg-rectangle.component';
import { SvgLayer, SvgStatus, SvgType } from '../../enums/svg';
import { SvgJson } from '../../interfaces/svg-json';
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
  providers: [
    ViewManagerService,
  ],
})
class TestModule {}

describe('SvgComponentsManagerService', () => {
  let service: SvgComponentsManagerService;
  let boardFixture: ComponentFixture<MockViewComponent>;

  TestSpeedUpgrader.overWriteModuleResetForSpeedGain();

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestModule],
    }).compileComponents();

    boardFixture = TestBed.createComponent(MockViewComponent);
    service = TestBed.get(SvgComponentsManagerService);
  });

  const initializeBoard = () => {
    boardFixture.detectChanges();
    const board = boardFixture.componentInstance;
    service.initialiseViewContainerRef(board.viewContainerRef);
  };

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('#createSvgComponent() returns undefined when viewContainerRef is undefined', () => {
    const undefinedRectangle = service.createSvgComponent();
    expect(undefinedRectangle).not.toBeDefined();
  });

  it('#createSvgComponent() returns an SvgInstance when viewContainerRef is defined', () => {
    initializeBoard();
    const rectangle = service.createSvgComponent();
    expect(rectangle).toBeDefined();
  });

  it('#createSvgComponent() correctly creates an SvgInstance no matter the onTopOfView argument', () => {
    initializeBoard();

    const SECOND_PARAMETER_COMBINATIONS = 3;
    service.createSvgComponent();
    service.createSvgComponent({
      onTopOfLayer: false,
      svgStatus: SvgStatus.Permanent,
      svgLayer: SvgLayer.Stack,
      svgType: SvgType.SvgRectangleComponent,
    });
    service.createSvgComponent({
      onTopOfLayer: true,
      svgStatus: SvgStatus.Permanent,
      svgLayer: SvgLayer.Stack,
      svgType: SvgType.SvgRectangleComponent,
    });

    expect(service.componentsCount()).toEqual(SECOND_PARAMETER_COMBINATIONS);
  });

  it('#createSvgComponent() does not remove SVG inProgress with removeInProgress=false', () => {
    initializeBoard();

    const rectangle = service.createSvgComponent();
    if (rectangle !== undefined) {
      rectangle.status = SvgStatus.InProgress;
      service.createSvgComponent({
        onTopOfLayer: true,
        svgStatus: SvgStatus.Permanent,
        svgLayer: SvgLayer.Stack,
        svgType: SvgType.SvgRectangleComponent},
        false,
      );
    }

    const EXPECTED_COUNT = 2;
    expect(service.countAllSvg()).toBe(EXPECTED_COUNT);
  });

  it('#duplicateSvgComponent() places created components correctly', () => {
    initializeBoard();

    const rectangle = service.createSvgComponent();
    if (rectangle !== undefined) {
      const rectangleNext1 = service.duplicateSvgComponent(rectangle, true, SvgStatus.Permanent);
      const rectangleTop = service.duplicateSvgComponent(rectangle, false, SvgStatus.Permanent);
      const rectangleNext2 = service.duplicateSvgComponent(rectangle, true, SvgStatus.Permanent);

      const RECTANGLE_TOP_INDEX = 3;
      expect(rectangleNext2 === service.viewManager.svgComponents[1].instance).toBeTruthy();
      expect(rectangleNext1 === service.viewManager.svgComponents[2].instance).toBeTruthy();
      expect(rectangleTop === service.viewManager.svgComponents[RECTANGLE_TOP_INDEX].instance).toBeTruthy();
    } else {
      const TEST_HAS_FAILED = false;
      expect(TEST_HAS_FAILED).toBeTruthy();
    }
  });

  it('#duplicateSvgComponent() returns undefined when input does not exist', () => {
    initializeBoard();
    service.createSvgComponent();
    expect(service.duplicateSvgComponent(new SvgRectangleComponent())).toBeUndefined();
  });

  it('#createMultipleSvgComponents() works as expected', () => {
    initializeBoard();
    const SMALL = 100;
    const BIG = 1000;
    const rectangleTemplate = new SvgRectangleComponent();

    const svgJsons = [];
    rectangleTemplate.fitExactlyInside(0, 0, SMALL, SMALL);
    svgJsons.push(rectangleTemplate.createSvgJson());
    rectangleTemplate.fitExactlyInside(0, 0, BIG, BIG);
    svgJsons.push(rectangleTemplate.createSvgJson());

    const TRANSLATION = 50;
    const components = service.createMultipleSvgComponents(svgJsons,
      (component) => { component.translate({x: TRANSLATION, y: TRANSLATION}); });
    expect(components.length).toBe(2);
    expect(components[0].getCenter()).toEqual({x: SMALL / 2 + TRANSLATION, y: SMALL / 2 + TRANSLATION});
    expect(components[1].getCenter()).toEqual({x: BIG / 2 + TRANSLATION, y: BIG / 2 + TRANSLATION});
  });

  it('#createMultipleSvgComponents() works as expected when lambda is not supplied', () => {
    initializeBoard();
    const COLOR = '#1928af';
    const rectangleTemplate = new SvgRectangleComponent();

    const svgJsons = [];
    rectangleTemplate.setPrimaryColor(COLOR);
    svgJsons.push(rectangleTemplate.createSvgJson());

    const components = service.createMultipleSvgComponents(svgJsons);
    expect(components.length).toBe(1);
    expect(service.countAllSvg()).toBe(1);
    expect(components[0].getPrimaryColor()).toBe(COLOR);
  });

  it('#createMultipleSvgComponents() does not save when array is empty', () => {
    initializeBoard();
    const svgUndoRedoService = TestBed.get(SvgUndoRedoService) as SvgUndoRedoService;
    const saveSpy = spyOn(svgUndoRedoService, 'saveSvgBoard');
    const components = service.createMultipleSvgComponents([]);
    expect(components.length).toBe(0);
    expect(service.countAllSvg()).toBe(0);
    expect(saveSpy).not.toHaveBeenCalled();
  });

  it('#componentsCount() returns 0 when viewContainerRef is undefined', () => {
    const componentsCount = service.componentsCount();
    expect(componentsCount).toEqual(0);
  });

  it('#componentsCount() returns correct count after multiple insertions', () => {
    initializeBoard();

    const REPETITIONS = 2;
    for (let n = 0; n < REPETITIONS; ++n) {
      service.createSvgComponent();
    }

    const componentsCount = service.componentsCount();
    expect(componentsCount).toEqual(REPETITIONS);
  });

  it('#componentsCount() returns correct count after multiple insertions with different svg status', () => {
    initializeBoard();

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
    const componentsCount = service.componentsCount();
    expect(componentsCount).toEqual(REPETITIONS_TO_COUNT);
  });

  it('#getSvgComponent() returns undefined when viewContainerRef is undefined', () => {
    const undefinedRectangle = service.getSvgComponent(0, SvgRectangleComponent);
    expect(undefinedRectangle).not.toBeDefined();
  });

  it('#getSvgComponent() returns undefined when index is negative', () => {
    const INVALID_INDEX = -1;
    const undefinedRectangle = service.getSvgComponent(INVALID_INDEX, SvgRectangleComponent);
    expect(undefinedRectangle).not.toBeDefined();
  });

  it('#getSvgComponent() returns undefined when index is too large', () => {
    initializeBoard();

    const REPETITIONS = 2;
    for (let n = 0; n < REPETITIONS; ++n) {
      service.createSvgComponent();
    }
    const undefinedRectangle = service.getSvgComponent(REPETITIONS, SvgRectangleComponent);

    expect(undefinedRectangle).not.toBeDefined();
  });

  it('#getSvgBoard() returns an empty svgJson when there is no components', () => {
    const EMPTY_SVG_BOARD = service.getSvgBoard();
    expect(EMPTY_SVG_BOARD.components).toEqual([]);
  });

  it('#getSvgBoard() returns svgJson with correct length', () => {
    initializeBoard();

    const REPETITIONS = 3;
    for (let n = 0; n < REPETITIONS; ++n) {
      service.createSvgComponent();
    }

    const SVG_BOARD = service.getSvgBoard();
    expect(SVG_BOARD.components.length).toBe(REPETITIONS);
  });

  it('#loadSvgBoard() resets SvgComponents', () => {
    initializeBoard();

    const EMPTY_SVG_BOARD = {components: []};

    const REPETITIONS = 3;
    for (let n = 0; n < REPETITIONS; ++n) {
      service.createSvgComponent();
    }
    service.loadSvgBoard(EMPTY_SVG_BOARD);

    expect(service.countAllSvg()).toBe(0);
  });

  it('#loadSvgBoard() does not load faulty content', () => {
    initializeBoard();

    const SVG_JSON: SvgJson = {svgType: undefined, content: '{"x": 0}'};
    const FAULTY_SVG_JASON = {components: [SVG_JSON]};

    const REPETITIONS = 3;
    for (let n = 0; n < REPETITIONS; ++n) {
      service.createSvgComponent();
    }
    service.loadSvgBoard(FAULTY_SVG_JASON);

    expect(service.countAllSvg()).toBe(0);
  });

  it('#loadSvgBoard() adds have correct default values', () => {
    initializeBoard();

    const SVG_JSON: SvgJson = {svgType: SvgType.SvgRectangleComponent, content: '{"x": 0}'};
    const SVG_JASON = {components: [SVG_JSON]};

    const REPETITIONS = 3;
    for (let n = 0; n < REPETITIONS; ++n) {
      service.createSvgComponent();
    }
    service.loadSvgBoard(SVG_JASON);

    const rectangle = service.getSvgComponent(0, SvgRectangleComponent);
    let status = SvgStatus.InProgress;
    let layer = SvgLayer.Visual;
    if (rectangle !== undefined) {
      status = rectangle.status;
      layer = rectangle.layer;
    }

    const EXPECTED_STATUS = SvgStatus.Permanent;
    const EXPECTED_LAYER = SvgLayer.Stack;
    expect(status).toBe(EXPECTED_STATUS);
    expect(layer).toBe(EXPECTED_LAYER);
  });

  it('#resetSvgComponents() removes all components', () => {
    initializeBoard();

    const REPETITIONS = 2;
    for (let n = 0; n < REPETITIONS; ++n) {
      service.createSvgComponent();
    }
    service.resetSvgComponents();
    const undefinedRectangle = service.getSvgComponent(0, SvgRectangleComponent);

    expect(undefinedRectangle).not.toBeDefined();
  });

  it('#refreshSvgComponent() refresh specified svgComponent', () => {
    initializeBoard();

    const REPETITIONS = 3;
    for (let n = 0; n < REPETITIONS; ++n) {
      const rectangle = service.createSvgComponent();
      if (rectangle !== undefined) {
        rectangle.centerAt({x: n, y: 0});
      }
    }
    const secondRectIndex = 1;
    const spy = spyOn(service.viewManager.svgComponents[secondRectIndex].changeDetectorRef, 'detectChanges');
    const secondRect = service.getSvgComponent(secondRectIndex);
    if (secondRect !== undefined) {
      service.refreshSvgComponent(secondRect);
    }
    expect(spy).toHaveBeenCalled();
    const ELEMENT_INDEX = 5;
    const undefinedRect = service.getSvgComponent(ELEMENT_INDEX);
    if (undefinedRect !== undefined) {
      service.refreshSvgComponent(undefinedRect);
    }
    expect(spy).not.toHaveBeenCalledTimes(2);
  });

  it('#removeSvgComponent() removes specified svgComponent', () => {
    initializeBoard();

    const REPETITIONS = 3;
    for (let n = 0; n < REPETITIONS; ++n) {
      const rectangle = service.createSvgComponent();
      if (rectangle !== undefined) {
        rectangle.centerAt({x: n, y: 0});
      }
    }
    const SECOND_RECTANGLE = service.getSvgComponent(1);
    if (SECOND_RECTANGLE !== undefined) {
      service.removeSvgComponent(SECOND_RECTANGLE);
    }

    const REMAINING_COMPONENTS =  2;
    expect(service.countAllSvg()).toBe(REMAINING_COMPONENTS);

    const FIRST_COMPONENT = service.getSvgComponent(0);
    const LAST_COMPONENT = service.getSvgComponent(1);
    const WRONG = -1;
    let firstX = WRONG;
    let lastX = WRONG;
    if (FIRST_COMPONENT !== undefined && LAST_COMPONENT !== undefined) {
      firstX = FIRST_COMPONENT.getCenter().x;
      lastX = LAST_COMPONENT.getCenter().x;
    }
    const EXPECTED_FIRST_X = 0;
    const EXPECTED_LAST_X = 2;
    expect(firstX).toBe(EXPECTED_FIRST_X);
    expect(lastX).toBe(EXPECTED_LAST_X);
  });

  it('#refreshSvgComponent() works as expected', () => {
    initializeBoard();

    const rectangle = service.createSvgComponent();
    const viewManagerService: ViewManagerService = TestBed.get(ViewManagerService);
    spyOn(viewManagerService.svgComponents[0].changeDetectorRef, 'detectChanges');
    if (rectangle !== undefined) {
      service.refreshSvgComponent(rectangle);
    }

    expect(viewManagerService.svgComponents[0].changeDetectorRef.detectChanges).toHaveBeenCalled();
  });

  it('#refreshSvgComponent() does nothing if component does not exist', () => {
    initializeBoard();

    service.createSvgComponent();
    const viewManagerService: ViewManagerService = TestBed.get(ViewManagerService);
    spyOn(viewManagerService.svgComponents[0].changeDetectorRef, 'detectChanges');

    service.refreshSvgComponent(new SvgRectangleComponent());

    expect(viewManagerService.svgComponents[0].changeDetectorRef.detectChanges).not.toHaveBeenCalled();
  });

  it('#removeInProgress() removes last item when its status is InProgress', () => {
    initializeBoard();

    const rectangle = service.createSvgComponent();
    if (rectangle !== undefined) {
      rectangle.status = SvgStatus.InProgress;
    }
    service.removeInProgress();

    const EMPTY_INDEX = 0;
    expect(service.getSvgComponent(EMPTY_INDEX, SvgRectangleComponent)).not.toBeDefined();
  });
});
// tslint:disable-next-line:max-file-line-count
// since we just have a long test file not a long functionality file
