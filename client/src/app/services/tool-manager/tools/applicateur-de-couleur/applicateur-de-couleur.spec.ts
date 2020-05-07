import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { SvgRectangleComponent } from '../../../../components/drawing/work-board/svg-rectangle/svg-rectangle.component';
import { SvgSelectionComponent } from '../../../../components/drawing/work-board/svg-selection/svg-selection.component';
import { SvgLayer, SvgStatus, SvgType } from '../../../../enums/svg';
import { Point } from '../../../../interfaces/point';
import { KeyboardState } from '../../../../logic/events/keyboard/keyboard-state';
import { MouseEventData, MouseLocation } from '../../../../logic/events/mouse/mouse-event-data';
import { SvgAerosolProperties } from '../../../../logic/svg/aerosol/svg-aerosol-properties';
import { SvgBasicProperties } from '../../../../logic/svg/base-svg/svg-basic-properties';
import { MockViewContainerRefComponent } from '../../../../testHelpers/svgBoard/mock-view-container-ref-component.spec';
import { TestSpeedUpgrader } from '../../../../testHelpers/test-speed-upgrader.spec';
import { SvgCollisionsService } from '../../../collisions/svg-collisions.service';
import { KeyboardManagerService } from '../../../events/keyboard-manager.service';
import { SvgComponentsManagerService } from '../../../svg/svg-components-manager.service';
import { ToolsOptionsManagerService } from '../../tools-options-manager/tools-options-manager.service';
import { Coords } from '../coords';
import { Tool } from '../tool/tool';
import { ApplicateurDeCouleur } from './applicateur-de-couleur';

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [
    MockViewContainerRefComponent,
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
  ],
})
class TestModule {}

const INITIAL_TEST_COLOR = '#13579b';
const COORDS = 'coords';
const TARGET = 'target';
const GET_COLLIDER = 'getCollider';

// tslint:disable:no-any
// tslint:disable:no-magic-numbers
// Reasons: allow spyOn<any> and convenient calls to testing functions
describe('ApplicateurDeCouleur', () => {
  let applicateurDeCouleur: ApplicateurDeCouleur;
  let mockViewComponent: MockViewContainerRefComponent;
  TestSpeedUpgrader.overWriteModuleResetForSpeedGain();

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestModule],
    }).compileComponents();

    applicateurDeCouleur = new ApplicateurDeCouleur();

    Tool.SVG_COMPONENT_MANAGER = TestBed.get(SvgComponentsManagerService);
    Tool.SVG_COLLISIONS_SERVICE = TestBed.get(SvgCollisionsService);
    Tool.TOOL_OPTIONS_MANAGER = TestBed.get(ToolsOptionsManagerService);
    Tool.TOOL_OPTIONS_MANAGER = TestBed.get(ToolsOptionsManagerService);
    Tool.KEYBOARD_MANAGER_SERVICE = TestBed.get(KeyboardManagerService);

    const fixture = TestBed.createComponent(MockViewContainerRefComponent);
    mockViewComponent = fixture.componentInstance;
    Tool.SVG_COMPONENT_MANAGER.initialiseViewContainerRef(mockViewComponent.viewContainerRef);
  });

  const placeRectangle = (center: Point, size: number, color: string): SvgBasicProperties => {
    const component = Tool.SVG_COMPONENT_MANAGER.createSvgComponent({
      onTopOfLayer: true,
      svgStatus: SvgStatus.Permanent,
      svgLayer: SvgLayer.Stack,
      svgType: SvgType.SvgRectangleComponent,
    }) as SvgRectangleComponent;
    component.fitExactlyInside(center.x - size / 2, center.y - size / 2, center.x + size / 2, center.y + size / 2);
    component.setPrimaryColor(color);
    component.setSecondaryColor(color);
    return component;
  };

  const mouseEventDataAt = (x: number, y: number): MouseEventData => {
    const mouseEventData = new MouseEventData();
    mouseEventData.x = x;
    mouseEventData.y = y;
    return mouseEventData;
  };

  it('should create an instance', () => {
    expect(new ApplicateurDeCouleur()).toBeTruthy();
  });

  it('should return the instance of a "ApplicateurDeCouleur" type', () => {
    const applicatorOfColeusInstance = ApplicateurDeCouleur.getInstance();
    expect(applicatorOfColeusInstance instanceof ApplicateurDeCouleur).toBeTruthy();
  });

  it('should return the instance of a "ApplicateurDeCouleur" type', () => {
    const applicatorOfColeusInstance = ApplicateurDeCouleur.getInstance();
    expect(applicatorOfColeusInstance instanceof ApplicateurDeCouleur).toBeTruthy();
  });

  it('#reset() should  assigned undefined to coords and target', () => {
     applicateurDeCouleur.reset();
     expect(applicateurDeCouleur[COORDS]).toBeUndefined();
     expect(applicateurDeCouleur[TARGET]).toBeUndefined();
  });

  it('#cancelOnGoing() should call reset()', () => {
    spyOn<any>(applicateurDeCouleur, 'reset');
    applicateurDeCouleur.cancelOnGoing(new MouseEventData(), new KeyboardState());
    expect(applicateurDeCouleur.reset).toHaveBeenCalled();
  });

  it('#onLeftDown() does nothing when mouse is outside', () => {
    const mouseEvent = new MouseEventData();
    mouseEvent.location = MouseLocation.Outside;
    applicateurDeCouleur.onLeftDown(mouseEvent, new KeyboardState());
    expect(applicateurDeCouleur[COORDS]).toBeUndefined();
  });

  it('#onLeftDown() does not cancel successful onLeftDown()', () => {
    const rectangle = placeRectangle({x: 50, y: 50}, 100, INITIAL_TEST_COLOR);
    applicateurDeCouleur.onLeftDown(mouseEventDataAt(50, 50), new KeyboardState());
    applicateurDeCouleur.onLeftDown(mouseEventDataAt(1000, 1000), new KeyboardState());
    applicateurDeCouleur.onLeftUp(mouseEventDataAt(50, 50), new KeyboardState());
    expect(rectangle.getPrimaryColor()).toBe(Tool.TOOL_OPTIONS_MANAGER.getSettings().primaryColor);
  });

  it('#onLeftDown() is successful event if previous onLeftDown failed', () => {
    const rectangle = placeRectangle({x: 50, y: 50}, 100, INITIAL_TEST_COLOR);
    applicateurDeCouleur.onLeftDown(mouseEventDataAt(1000, 1000), new KeyboardState());
    applicateurDeCouleur.onLeftDown(mouseEventDataAt(50, 50), new KeyboardState());
    applicateurDeCouleur.onLeftUp(mouseEventDataAt(50, 50), new KeyboardState());
    expect(rectangle.getPrimaryColor()).toBe(Tool.TOOL_OPTIONS_MANAGER.getSettings().primaryColor);
  });

  it('#onLeftUp() applies primary color after onLeftDown()', () => {
    const rectangle = placeRectangle({x: 50, y: 50}, 100, INITIAL_TEST_COLOR);
    applicateurDeCouleur.onLeftDown(mouseEventDataAt(50, 50), new KeyboardState());
    const saveSpy = spyOn(Tool.UNDO_REDO_SERVICE, 'saveSvgBoard').and.stub();
    applicateurDeCouleur.onLeftUp(mouseEventDataAt(50, 50), new KeyboardState());
    expect(rectangle.getPrimaryColor()).toBe(Tool.TOOL_OPTIONS_MANAGER.getSettings().primaryColor);
    expect(rectangle.getSecondaryColor()).toBe(INITIAL_TEST_COLOR);
    expect(saveSpy).toHaveBeenCalled();
  });

  it('#onLeftUp() doest not save board if primary color has not changed after onLeftDown()', () => {
    placeRectangle({x: 50, y: 50}, 100, INITIAL_TEST_COLOR);
    applicateurDeCouleur.onLeftDown(mouseEventDataAt(50, 50), new KeyboardState());
    applicateurDeCouleur.onLeftUp(mouseEventDataAt(50, 50), new KeyboardState());
    const saveSpy = spyOn(Tool.UNDO_REDO_SERVICE, 'saveSvgBoard').and.stub();
    applicateurDeCouleur.onLeftDown(mouseEventDataAt(50, 50), new KeyboardState());
    applicateurDeCouleur.onLeftUp(mouseEventDataAt(50, 50), new KeyboardState());
    expect(saveSpy).not.toHaveBeenCalled();
  });

  it('#onLeftUp() applies primary color only on top component after onLeftDown()', () => {
    const rectangleBottom = placeRectangle({x: 50, y: 50}, 100, INITIAL_TEST_COLOR);
    const rectangleTop = placeRectangle({x: 50, y: 50}, 50, INITIAL_TEST_COLOR);
    expect(rectangleBottom.getPrimaryColor()).toBe(INITIAL_TEST_COLOR);
    applicateurDeCouleur.onLeftDown(mouseEventDataAt(50, 50), new KeyboardState());
    applicateurDeCouleur.onLeftUp(mouseEventDataAt(50, 50), new KeyboardState());
    expect(rectangleTop.getPrimaryColor()).toBe(Tool.TOOL_OPTIONS_MANAGER.getSettings().primaryColor);
    expect(rectangleBottom.getPrimaryColor()).toBe(INITIAL_TEST_COLOR);
  });

  it('#onLeftUp() does nothing if mouse changed target after onLeftDown()', () => {
    const rectangleBottom = placeRectangle({x: 50, y: 50}, 100, INITIAL_TEST_COLOR);
    const rectangleTop = placeRectangle({x: 50, y: 50}, 50, INITIAL_TEST_COLOR);
    applicateurDeCouleur.onLeftDown(mouseEventDataAt(50, 50), new KeyboardState());
    applicateurDeCouleur.onLeftUp(mouseEventDataAt(95, 95), new KeyboardState());
    expect(rectangleTop.getPrimaryColor()).toBe(INITIAL_TEST_COLOR);
    expect(rectangleBottom.getPrimaryColor()).toBe(INITIAL_TEST_COLOR);
  });

  it('#onLeftUp() does not change color if mouse was on nothing during onLeftDown()', () => {
    const rectangleBottom = placeRectangle({x: 50, y: 50}, 100, INITIAL_TEST_COLOR);
    const rectangleTop = placeRectangle({x: 50, y: 50}, 50, INITIAL_TEST_COLOR);
    applicateurDeCouleur.onLeftDown(mouseEventDataAt(-1000, -1000), new KeyboardState());
    applicateurDeCouleur.onLeftUp(mouseEventDataAt(50, 50), new KeyboardState());
    expect(rectangleTop.getPrimaryColor()).toBe(INITIAL_TEST_COLOR);
    expect(rectangleBottom.getPrimaryColor()).toBe(INITIAL_TEST_COLOR);
  });

  it('#onLeftUp() does not change color when no longer on component after onLeftDown()', () => {
    const rectangle = placeRectangle({x: 50, y: 50}, 100, INITIAL_TEST_COLOR);
    applicateurDeCouleur.onLeftDown(mouseEventDataAt(50, 50), new KeyboardState());
    applicateurDeCouleur.onLeftUp(mouseEventDataAt(1000, 1000), new KeyboardState());
    expect(rectangle.getPrimaryColor()).toBe(INITIAL_TEST_COLOR);
  });

  it('#onLeftUp() does not change color without onLeftDown()', () => {
    const rectangle = placeRectangle({x: 50, y: 50}, 100, INITIAL_TEST_COLOR);
    applicateurDeCouleur.onLeftUp(mouseEventDataAt(50, 50), new KeyboardState());
    expect(rectangle.getPrimaryColor()).toBe(INITIAL_TEST_COLOR);
  });

  it('#onRightDown() does nothing when mouse is outside', () => {
    const mouseEvent = new MouseEventData();
    mouseEvent.location = MouseLocation.Outside;
    applicateurDeCouleur.onRightDown(mouseEvent, new KeyboardState());
    expect(applicateurDeCouleur[COORDS]).toBeUndefined();
  });

  it('#onRightDown() should call onLeftDown()', () => {
    spyOn<any>(applicateurDeCouleur, 'onLeftDown');
    applicateurDeCouleur.onRightDown(new MouseEventData(), new KeyboardState());
    expect(applicateurDeCouleur.onLeftDown).toHaveBeenCalled();
  });

  it('#onRightUp() applies secondary color after onRightDown()', () => {
    const rectangle = placeRectangle({x: 50, y: 50}, 100, INITIAL_TEST_COLOR);
    applicateurDeCouleur.onRightDown(mouseEventDataAt(50, 50), new KeyboardState());
    const saveSpy = spyOn(Tool.UNDO_REDO_SERVICE, 'saveSvgBoard').and.stub();
    applicateurDeCouleur.onRightUp(mouseEventDataAt(50, 50), new KeyboardState());
    expect(rectangle.getPrimaryColor()).toBe(INITIAL_TEST_COLOR);
    expect(rectangle.getSecondaryColor()).toBe(Tool.TOOL_OPTIONS_MANAGER.getSettings().secondaryColor);
    expect(saveSpy).toHaveBeenCalled();
  });

  it('#onRightUp() does not save board if secondary color has not changed after onRightDown()', () => {
    placeRectangle({x: 50, y: 50}, 100, INITIAL_TEST_COLOR);
    applicateurDeCouleur.onRightDown(mouseEventDataAt(50, 50), new KeyboardState());
    applicateurDeCouleur.onRightUp(mouseEventDataAt(50, 50), new KeyboardState());
    const saveSpy = spyOn(Tool.UNDO_REDO_SERVICE, 'saveSvgBoard').and.stub();
    applicateurDeCouleur.onRightDown(mouseEventDataAt(50, 50), new KeyboardState());
    applicateurDeCouleur.onRightUp(mouseEventDataAt(50, 50), new KeyboardState());
    expect(saveSpy).not.toHaveBeenCalled();
  });

  it('#onRightUp() should call computeCoords(), setSecondaryColorFirstUnder() and reset()', () => {
    const svgAerosol: SvgBasicProperties = new SvgAerosolProperties();
    applicateurDeCouleur[TARGET] = svgAerosol;
    const computeCoordsSpy = spyOn<any>(applicateurDeCouleur, 'computeCoords').and.callThrough();
    spyOn<any>(applicateurDeCouleur, 'setSecondaryColorFirstUnder');
    spyOn<any>(applicateurDeCouleur, 'reset');
    applicateurDeCouleur.onRightUp(new MouseEventData(), new KeyboardState());
    expect(computeCoordsSpy).toHaveBeenCalled();
    expect(applicateurDeCouleur.setSecondaryColorFirstUnder).toHaveBeenCalled();
    expect(applicateurDeCouleur.reset).toHaveBeenCalled();
  });

  it('#onRightUp() applies secondary color only on top component after onRightDown()', () => {
    const rectangleBottom = placeRectangle({x: 50, y: 50}, 100, INITIAL_TEST_COLOR);
    const rectangleTop = placeRectangle({x: 50, y: 50}, 50, INITIAL_TEST_COLOR);
    expect(rectangleBottom.getSecondaryColor()).toBe(INITIAL_TEST_COLOR);
    applicateurDeCouleur.onRightDown(mouseEventDataAt(50, 50), new KeyboardState());
    applicateurDeCouleur.onRightUp(mouseEventDataAt(50, 50), new KeyboardState());
    expect(rectangleTop.getSecondaryColor()).toBe(Tool.TOOL_OPTIONS_MANAGER.getSettings().secondaryColor);
    expect(rectangleBottom.getSecondaryColor()).toBe(INITIAL_TEST_COLOR);
  });

  it('#onRightUp() does nothing if mouse changed target after onRightDown()', () => {
    const rectangleBottom = placeRectangle({x: 50, y: 50}, 100, INITIAL_TEST_COLOR);
    const rectangleTop = placeRectangle({x: 50, y: 50}, 50, INITIAL_TEST_COLOR);
    applicateurDeCouleur.onRightDown(mouseEventDataAt(50, 50), new KeyboardState());
    applicateurDeCouleur.onRightUp(mouseEventDataAt(5, 5), new KeyboardState());
    expect(rectangleTop.getSecondaryColor()).toBe(INITIAL_TEST_COLOR);
    expect(rectangleBottom.getSecondaryColor()).toBe(INITIAL_TEST_COLOR);
  });

  it('#onRightUp() does not change color if mouse was on nothing during onRightDown()', () => {
    const rectangleBottom = placeRectangle({x: 50, y: 50}, 100, INITIAL_TEST_COLOR);
    const rectangleTop = placeRectangle({x: 50, y: 50}, 50, INITIAL_TEST_COLOR);
    applicateurDeCouleur.onRightDown(mouseEventDataAt(1000, 1000), new KeyboardState());
    applicateurDeCouleur.onRightUp(mouseEventDataAt(50, 50), new KeyboardState());
    expect(rectangleTop.getSecondaryColor()).toBe(INITIAL_TEST_COLOR);
    expect(rectangleBottom.getSecondaryColor()).toBe(INITIAL_TEST_COLOR);
  });

  it('#onRightUp() does not change color when no longer on component after onRightDown()', () => {
    const rectangle = placeRectangle({x: 50, y: 50}, 100, INITIAL_TEST_COLOR);
    applicateurDeCouleur.onRightDown(mouseEventDataAt(50, 50), new KeyboardState());
    applicateurDeCouleur.onRightUp(mouseEventDataAt(-1000, -1000), new KeyboardState());
    expect(rectangle.getSecondaryColor()).toBe(INITIAL_TEST_COLOR);
  });

  it('#onRightUp() does not change color without onRightDown()', () => {
    const rectangle = placeRectangle({x: 50, y: 50}, 100, INITIAL_TEST_COLOR);
    applicateurDeCouleur.onRightUp(mouseEventDataAt(50, 50), new KeyboardState());
    expect(rectangle.getSecondaryColor()).toBe(INITIAL_TEST_COLOR);
  });

  it('#onMouseLeave() should reset()', () => {
    spyOn(applicateurDeCouleur, 'reset');
    applicateurDeCouleur.onMouseLeave(new MouseEventData(), new KeyboardState());
    expect(applicateurDeCouleur.reset).toHaveBeenCalled();
  });

  it('#setPrimaryColorFirstUnder() does nothing when coords is undefined', () => {
    const rectangle = placeRectangle({x: 50, y: 50}, 100, INITIAL_TEST_COLOR);
    applicateurDeCouleur.setPrimaryColorFirstUnder();
    expect(rectangle.getPrimaryColor()).toBe(INITIAL_TEST_COLOR);
  });

  it('#setSecondaryColorFirstUnder() does nothing when coords is undefined', () => {
    const rectangle = placeRectangle({x: 50, y: 50}, 100, INITIAL_TEST_COLOR);
    applicateurDeCouleur.setSecondaryColorFirstUnder();
    expect(rectangle.getSecondaryColor()).toBe(INITIAL_TEST_COLOR);
  });

  it('#setSecondaryColorFirstUnder() does nothing when coords is undefined', () => {
    const rectangle = placeRectangle({x: 50, y: 50}, 100, INITIAL_TEST_COLOR);
    applicateurDeCouleur.setSecondaryColorFirstUnder();
    expect(rectangle.getSecondaryColor()).toBe(INITIAL_TEST_COLOR);
  });

  it('#getCollider() should  return a collider with specific parameter', () => {
     const collider = Tool.SVG_COMPONENT_MANAGER
        .createSvgComponent({
          onTopOfLayer: true,
          svgStatus: SvgStatus.Temporary,
          svgLayer: SvgLayer.Visual,
          svgType: SvgType.SvgRectangleComponent,
        }) as SvgRectangleComponent;
     const X = 100;
     const Y = 100;
     const DEFAULT_SIZE = 1;
     applicateurDeCouleur[COORDS] = new Coords(X , Y);
     const corner1 = new Coords(X - DEFAULT_SIZE / 2, Y - DEFAULT_SIZE / 2);
     const corner2 = new Coords(X + DEFAULT_SIZE / 2, Y + DEFAULT_SIZE / 2);
     collider.fitExactlyInside(corner1.x, corner1.y, corner2.x, corner2.y);

     collider.setPrimaryOpacity(0);
     collider.setSecondaryOpacity(0);
     const VALUE_EXPECTED = applicateurDeCouleur[GET_COLLIDER]();
     expect(VALUE_EXPECTED).toEqual(collider);
  });

  it('#getCollider() should  return a undefined in case coords is undefined', () => {
    const collider = Tool.SVG_COMPONENT_MANAGER
        .createSvgComponent({
          onTopOfLayer: true,
          svgStatus: SvgStatus.Temporary,
          svgLayer: SvgLayer.Visual,
          svgType: SvgType.SvgRectangleComponent,
        }) as SvgRectangleComponent;

    collider.setPrimaryOpacity(0);
    collider.setSecondaryOpacity(0);
    const VALUE_EXPECTED = applicateurDeCouleur[GET_COLLIDER]();
    expect(VALUE_EXPECTED).toEqual(undefined);
  });
});
// tslint:disable:max-file-line-count
// This is just a test file, not a functionality file
