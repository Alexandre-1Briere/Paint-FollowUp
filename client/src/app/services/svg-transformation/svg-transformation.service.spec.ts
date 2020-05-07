import { TestBed } from '@angular/core/testing';

import { CommonModule } from '@angular/common';
import { Component, NgModule, ViewContainerRef } from '@angular/core';
import { SvgRectangleComponent } from '../../components/drawing/work-board/svg-rectangle/svg-rectangle.component';
import { SvgLayer, SvgStatus, SvgType } from '../../enums/svg';
import { Point } from '../../interfaces/point';
import { SvgRectangleProperties } from '../../logic/svg/rectangle/svg-rectangle-properties';
import { SvgComponentsManagerService } from '../svg/svg-components-manager.service';
import { SvgUndoRedoService } from '../undo-redo/svg-undo-redo.service';
import { SvgTransformationService } from './svg-transformation.service';

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
  entryComponents: [SvgRectangleComponent],
})
class TestModule {}

describe('SvgTransformationService', () => {
  let service: SvgTransformationService;
  let svgComponentsManagerService: SvgComponentsManagerService;
  let mockViewComponent: MockViewComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestModule],
    });

    service = TestBed.get(SvgTransformationService);
    svgComponentsManagerService = TestBed.get(SvgComponentsManagerService);

    const fixture = TestBed.createComponent(MockViewComponent);
    mockViewComponent = fixture.componentInstance;
    svgComponentsManagerService.initialiseViewContainerRef(mockViewComponent.viewContainerRef);
  });

  const createRectangle = (topLeft: Point, bottomRight: Point): SvgRectangleProperties => {
    const rectangle = svgComponentsManagerService.createSvgComponent({
      onTopOfLayer: true,
      svgStatus: SvgStatus.Permanent,
      svgLayer: SvgLayer.Stack,
      svgType: SvgType.SvgRectangleComponent,
    }) as SvgRectangleComponent;
    rectangle.fitExactlyInside(topLeft.x, topLeft.y, bottomRight.x, bottomRight.y);

    return rectangle;
  };

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('#begin() followed by terminate() does not change svgComponents', () => {
    const COMPONENTS = [
      createRectangle({x: 0, y: 0}, {x: 10, y: 10}),
    ];
    const REFERENCE = {x: 10, y: 10};
    service.begin(COMPONENTS, REFERENCE);
    service.terminate();

    const CENTER = 5;
    expect(COMPONENTS[0].getCenter().x).toBe(CENTER);
    expect(COMPONENTS[0].getCenter().y).toBe(CENTER);
  });

  it('#begin() followed by translateAll does proper transformation', () => {
    const COMPONENTS = [
      createRectangle({x: 0, y: 0}, {x: 10, y: 10}),
    ];
    const REFERENCE = {x: 10, y: 10};
    const NEW_LOCATION = {x: 15, y: 20};
    service.begin(COMPONENTS, REFERENCE);
    service.translateAllTo(NEW_LOCATION);

    const CENTER = 5;
    expect(COMPONENTS[0].getCenter().x).toBe(CENTER + NEW_LOCATION.x - REFERENCE.x);
    expect(COMPONENTS[0].getCenter().y).toBe(CENTER + NEW_LOCATION.y - REFERENCE.y);
  });

  it('#terminate() saves board when changes occured', () => {
    const svgUndoRedoService: SvgUndoRedoService = TestBed.get(SvgUndoRedoService);
    const COMPONENTS = [
      createRectangle({x: 0, y: 0}, {x: 10, y: 10}),
    ];
    spyOn(svgUndoRedoService, 'saveSvgBoard');

    const REFERENCE = {x: 10, y: 10};
    const NEW_LOCATION = {x: 10, y: 11};
    service.begin(COMPONENTS, REFERENCE);
    service.translateAllTo(NEW_LOCATION);
    service.terminate();

    expect(svgUndoRedoService.saveSvgBoard).toHaveBeenCalledTimes(2);
  });

  it('#terminate() does not save board when no changes occured', () => {
    const svgUndoRedoService: SvgUndoRedoService = TestBed.get(SvgUndoRedoService);
    const COMPONENTS = [
      createRectangle({x: 0, y: 0}, {x: 10, y: 10}),
    ];
    spyOn(svgUndoRedoService, 'saveSvgBoard');

    const REFERENCE = {x: 10, y: 10};
    service.begin(COMPONENTS, REFERENCE);
    service.translateAllTo(REFERENCE);
    service.terminate();

    expect(svgUndoRedoService.saveSvgBoard).toHaveBeenCalledTimes(1);
  });
});
