import { TestBed } from '@angular/core/testing';

import { CommonModule } from '@angular/common';
import { Component, NgModule, ViewContainerRef } from '@angular/core';
import { SvgRectangleComponent } from '../../components/drawing/work-board/svg-rectangle/svg-rectangle.component';
import { SvgLayer, SvgStatus, SvgType } from '../../enums/svg';
import { Point } from '../../interfaces/point';
import { PolygonCollidable } from '../../logic/collisions/polygon/polygon-collidable';
import { SvgRectangleProperties } from '../../logic/svg/rectangle/svg-rectangle-properties';
import { SvgComponentsManagerService } from '../svg/svg-components-manager.service';
import { SvgCollisionsService } from './svg-collisions.service';

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
    SvgRectangleComponent,
    MockViewComponent,
  ],
  entryComponents: [
    SvgRectangleComponent,
  ],
  providers: [
    SvgComponentsManagerService,
  ],
})
class TestModule {}

describe('SvgCollisionsService', () => {
  let service: SvgCollisionsService;
  let svgComponentsManagerService: SvgComponentsManagerService;
  let mockViewComponent: MockViewComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestModule],
    });

    service = TestBed.get(SvgCollisionsService);
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

  it('#getSvgComponentsInContact() returns [] on empty board', () => {
    const TOP_LEFT = {x: 0, y: 0};
    const BOTTOM_RIGHT = {x: 10, y: 10};
    const selection = PolygonCollidable.createRectangle(TOP_LEFT, BOTTOM_RIGHT);

    expect(service.getSvgComponentsInContact(selection)).toEqual([]);
  });

  it('#getSvgComponentsInContact() returns [] when selection does not contact anything', () => {
    const TOP_LEFT = {x: 0, y: 0};
    const BOTTOM_RIGHT = {x: 10, y: 10};
    const selection = PolygonCollidable.createRectangle(TOP_LEFT, BOTTOM_RIGHT);

    const RECTANGLE_TOP_LEFT = {x: 11, y: 0};
    const RECTANGLE_BOTTOM_RIGHT = {x: 20, y: 10};
    createRectangle(RECTANGLE_TOP_LEFT, RECTANGLE_BOTTOM_RIGHT);

    expect(service.getSvgComponentsInContact(selection)).toEqual([]);
  });

  it('#getSvgComponentsInContact() returns all components in contact', () => {
    const TOP_LEFT = {x: 0, y: 0};
    const BOTTOM_RIGHT = {x: 10, y: 10};
    const selection = PolygonCollidable.createRectangle(TOP_LEFT, BOTTOM_RIGHT);

    const RECTANGLE1_TOP_LEFT = {x: 5, y: 5};
    const RECTANGLE1_BOTTOM_RIGHT = {x: 10, y: 10};
    const RECTANGLE1 = createRectangle(RECTANGLE1_TOP_LEFT, RECTANGLE1_BOTTOM_RIGHT);
    const RECTANGLE1_ID = RECTANGLE1.getCenter().x;

    const RECTANGLE_NOT_IN_CONTACT_TOP_LEFT = {x: 20, y: 20};
    const RECTANGLE_NOT_IN_CONTACT_BOTTOM_RIGHT = {x: 25, y: 25};
    createRectangle(RECTANGLE_NOT_IN_CONTACT_TOP_LEFT, RECTANGLE_NOT_IN_CONTACT_BOTTOM_RIGHT);

    const RECTANGLE2_TOP_LEFT = {x: -5, y: -5};
    const RECTANGLE2_BOTTOM_RIGHT = {x: 5, y: 5};
    const RECTANGLE2 = createRectangle(RECTANGLE2_TOP_LEFT, RECTANGLE2_BOTTOM_RIGHT);
    const RECTANGLE2_ID = RECTANGLE2.getCenter().x;

    const componentsInContact = service.getSvgComponentsInContact(selection);
    expect(componentsInContact.length).toBe(2);
    expect(componentsInContact[0].getCenter().x).toEqual(RECTANGLE1_ID);
    expect(componentsInContact[1].getCenter().x).toEqual(RECTANGLE2_ID);
  });

  it('#getTopSvgComponentInContact() returns undefined on empty board', () => {
    const TOP_LEFT = {x: 0, y: 0};
    const BOTTOM_RIGHT = {x: 1, y: 1};
    const cursor = PolygonCollidable.createRectangle(TOP_LEFT, BOTTOM_RIGHT);

    expect(service.getTopSvgComponentInContact(cursor)).toBeUndefined();
  });

  it('#getTopSvgComponentInContact() returns topMost element', () => {
    const TOP_LEFT = {x: 5, y: 5};
    const BOTTOM_RIGHT = {x: 6, y: 6};
    const cursor = PolygonCollidable.createRectangle(TOP_LEFT, BOTTOM_RIGHT);

    const RECTANGLE1_TOP_LEFT = {x: 5, y: 5};
    const RECTANGLE1_BOTTOM_RIGHT = {x: 10, y: 10};
    createRectangle(RECTANGLE1_TOP_LEFT, RECTANGLE1_BOTTOM_RIGHT);

    const RECTANGLE2_TOP_LEFT = {x: -5, y: -5};
    const RECTANGLE2_BOTTOM_RIGHT = {x: 6, y: 6};
    const RECTANGLE2 = createRectangle(RECTANGLE2_TOP_LEFT, RECTANGLE2_BOTTOM_RIGHT);
    const RECTANGLE2_ID = RECTANGLE2.getCenter().x;

    const RECTANGLE_NOT_IN_CONTACT_TOP_LEFT = {x: 7, y: 7};
    const RECTANGLE_NOT_IN_CONTACT_BOTTOM_RIGHT = {x: 8, y: 8};
    createRectangle(RECTANGLE_NOT_IN_CONTACT_TOP_LEFT, RECTANGLE_NOT_IN_CONTACT_BOTTOM_RIGHT);

    const topElement = service.getTopSvgComponentInContact(cursor);
    expect(topElement).toBeDefined();
    if (topElement !== undefined) {
      expect(topElement.getCenter().x).toEqual(RECTANGLE2_ID);
    }
  });
});
