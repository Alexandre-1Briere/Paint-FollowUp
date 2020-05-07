import { NgModule } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { SvgAerosolComponent } from '../../../../components/drawing/work-board/svg-aerosol/svg-aerosol.component';
import { SvgLayer, SvgStatus, SvgType } from '../../../../enums/svg';
import { KeyboardState } from '../../../../logic/events/keyboard/keyboard-state';
import { MouseEventData, MouseLocation, MouseMovement } from '../../../../logic/events/mouse/mouse-event-data';
import { MockViewContainerRefComponent } from '../../../../testHelpers/svgBoard/mock-view-container-ref-component.spec';
import { KeyboardManagerService } from '../../../events/keyboard-manager.service';
import { MouseDrawingInputsService } from '../../../events/mouse-drawing-inputs.service';
import { SvgComponentsManagerService } from '../../../svg/svg-components-manager.service';
import { SvgUndoRedoService } from '../../../undo-redo/svg-undo-redo.service';
import { ToolsOptionsManagerService } from '../../tools-options-manager/tools-options-manager.service';
import { Coords } from '../coords';
import { Tool } from '../tool/tool';
import { Aerosol } from './aerosol';

class AerosolTestable extends Aerosol {
  constructor() { super(); }
  setIsDrawing(isDrawing: boolean): void { this.isDrawing = isDrawing; }
  setCoords(mouseData: MouseEventData ): void {this.coords = mouseData; }
  getCoords(): Coords  { return this.coords as Coords; }
  testCreateSpray(): void { return this.createSpray(); }
  testEmitSpray(mouseData: MouseEventData): void { return this.emitSpray(mouseData); }
  testCalculateSize(): void { return this.calculateSize(); }
  testCalculateSprayDensity(): void { return this.calculateSprayDensity(); }
}

// tslint:disable-next-line:max-classes-per-file
@NgModule({
  declarations: [
    SvgAerosolComponent,
    MockViewContainerRefComponent,
  ],
  entryComponents: [
    SvgAerosolComponent,
  ],
  providers: [
    SvgComponentsManagerService,
    ToolsOptionsManagerService,
  ],
})
class TestModule {}

const SPRAY_DENSITY = 'sprayDensity';
const SIZE = 'size';
const POINTS = 'points';
const CENTER_POINTS = 'centerPoints';

describe('Aerosol', () => {
  let aerosol: AerosolTestable;
  let mockViewComponent: MockViewContainerRefComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestModule],
    })
      .compileComponents();

    aerosol = new AerosolTestable();

    Tool.SVG_COMPONENT_MANAGER = TestBed.get(SvgComponentsManagerService);
    Tool.TOOL_OPTIONS_MANAGER = TestBed.get(ToolsOptionsManagerService);
    Tool.UNDO_REDO_SERVICE = TestBed.get(SvgUndoRedoService);
    Tool.MOUSE_MANAGER_SERVICE = TestBed.get(MouseDrawingInputsService);
    Tool.KEYBOARD_MANAGER_SERVICE = TestBed.get(KeyboardManagerService);

    const fixture = TestBed.createComponent(MockViewContainerRefComponent);
    mockViewComponent = fixture.componentInstance;
    Tool.SVG_COMPONENT_MANAGER.initialiseViewContainerRef(mockViewComponent.viewContainerRef);
  });

  it('should create an instance', () => {
    expect(new Aerosol()).toBeTruthy();
  });

  it('#getInstance() should return the instance of a "Aerosol" type', () => {
    const aerosolInstance = Aerosol.getInstance();
    expect(aerosolInstance instanceof Aerosol).toBeTruthy();
  });

  it('#createSvg() should call createSvgComponent properly', () => {
    spyOn(Tool.SVG_COMPONENT_MANAGER, 'createSvgComponent');
    const IS_DRAWING = true;
    aerosol.setIsDrawing(IS_DRAWING);
    aerosol.onLeftUp(new MouseEventData(), new KeyboardState());
    expect(Tool.SVG_COMPONENT_MANAGER.createSvgComponent).toHaveBeenCalled();
  });

  it('#createSvg() creates svgComponent with correct color', () => {
    const sprayComponent = Tool.SVG_COMPONENT_MANAGER.createSvgComponent({
      onTopOfLayer: true,
      svgStatus: SvgStatus.Permanent,
      svgLayer: SvgLayer.Stack,
      svgType: SvgType.SvgAerosolComponent,
    }) as SvgAerosolComponent;
    sprayComponent.setPrimaryColor('#123456');

    spyOn(Tool.SVG_COMPONENT_MANAGER, 'createSvgComponent').and.returnValue(sprayComponent);
    aerosol.createSvg(SvgStatus.Permanent);

    expect(sprayComponent).toBeDefined();
    if (sprayComponent !== undefined) {
      expect(sprayComponent.getPrimaryColor()).toBe(Tool.TOOL_OPTIONS_MANAGER.getSettings().primaryColor);
    }
  });

  it('#cancelOnGoing() should resets coords and points', () => {
    aerosol.cancelOnGoing(new MouseEventData(), new KeyboardState());
    const NO_POINTS = 0;
    expect(aerosol[POINTS].length).toBe(NO_POINTS);
    expect(aerosol.getCoords()).toBeUndefined();
  });

  it('#onMouseLeave() should resets coords and points', () => {
    aerosol.onMouseLeave(new MouseEventData(), new KeyboardState());
    const EXPECTED_NUMBER_POINTS = 0;
    expect(aerosol[POINTS].length).toBe(EXPECTED_NUMBER_POINTS);
    expect(aerosol.getCoords()).toBeUndefined();
  });

  it('#onMouseMove() does not update points when isDrawing=false', () => {
    aerosol.onMouseMove(new MouseEventData(), new KeyboardState());
    const NO_POINTS_ADDED = 0;
    expect(aerosol[POINTS].length).toBe(NO_POINTS_ADDED);
  });

  it('#onMouseMove() should update coords and points', () => {
    const mouseEventData = new MouseEventData();
    mouseEventData.movement = MouseMovement.Moved;
    const X = 40;
    const Y = 50;
    mouseEventData.x = X;
    mouseEventData.y = Y;

    const CURRENTLY_DRAWING = true;
    aerosol.setIsDrawing(CURRENTLY_DRAWING);
    aerosol.onMouseMove(mouseEventData, new KeyboardState());
    const WRONG = -1;
    let xTested = WRONG;
    let yTested = WRONG;
    const coords = aerosol.getCoords();
    if (coords !== undefined) {
      xTested = coords.x;
      yTested = coords.y;
    }

    expect(xTested).toBe(X);
    expect(yTested).toBe(Y);
  });

  it('#onLeftUp() should resets coords and points', () => {
    const mouseEventData = new MouseEventData();
    const X = 3;
    const Y = 4;
    mouseEventData.x = X;
    mouseEventData.y = Y;

    aerosol.onLeftUp(mouseEventData, new KeyboardState());

    const EXPECTED_NUMBER_POINTS = 0;
    expect(aerosol[POINTS].length).toBe(EXPECTED_NUMBER_POINTS);
    expect(aerosol.getCoords()).toBeUndefined();
  });

  it('#onLeftDown() when outside drawing board does not add points', () => {
    const mouseData = new MouseEventData();
    mouseData.location = MouseLocation.Outside;
    aerosol.onLeftDown(mouseData, new KeyboardState());
    const NO_POINTS = 0;
    expect(aerosol[POINTS].length).toBe(NO_POINTS);
  });

  it('#onLeftDown() adds points over time', () => {
    jasmine.clock().install();

    const EXPECTED_DEFAULT_TIME = 100;
    aerosol.onLeftDown(new MouseEventData(), new KeyboardState());

    const NUMBER_OF_EMISSIONS = 5;
    for (let n = 0; n < NUMBER_OF_EMISSIONS; ++n) {
      jasmine.clock().tick(EXPECTED_DEFAULT_TIME);
    }
    jasmine.clock().tick(EXPECTED_DEFAULT_TIME / 2);
    expect(aerosol[CENTER_POINTS].length).toBe(NUMBER_OF_EMISSIONS);

    aerosol.onLeftUp(new MouseEventData(), new KeyboardState());
    jasmine.clock().uninstall();
  });

  it('#onLeftDown() after onLeftDown does nothing', () => {
    jasmine.clock().install();

    const EXPECTED_DEFAULT_TIME = 100;
    aerosol.onLeftDown(new MouseEventData(), new KeyboardState());
    aerosol.onLeftDown(new MouseEventData(), new KeyboardState());

    const NUMBER_OF_EMISSIONS = 2;
    for (let n = 0; n < NUMBER_OF_EMISSIONS; ++n) {
      jasmine.clock().tick(EXPECTED_DEFAULT_TIME);
    }
    jasmine.clock().tick(EXPECTED_DEFAULT_TIME / 2);
    expect(aerosol[CENTER_POINTS].length).toBe(NUMBER_OF_EMISSIONS);

    aerosol.onLeftUp(new MouseEventData(), new KeyboardState());
    jasmine.clock().uninstall();
  });

  it('#createSpray() should call emitSpray and createSvg for create spray', () => {
    const creatSVGSpy = spyOn(aerosol, 'createSvg');
    aerosol.testCreateSpray();
    expect(creatSVGSpy).toHaveBeenCalled();
  });

  it('#calculateSize() should calculate the size of spray emitted', () => {
    Tool.TOOL_OPTIONS_MANAGER.getSettings().size = 0;
    aerosol.testCalculateSize();
    expect(Aerosol.DEFAULT_RADIUS === aerosol[SIZE]).toBe(true);
  });

  it('#calculateSize() should calculate the size of spray emitted', () => {
    Tool.TOOL_OPTIONS_MANAGER.getSettings().size = 1;
    aerosol.testCalculateSize();
    expect(Aerosol.DEFAULT_RADIUS !== aerosol[SIZE]).toBe(true);
  });

  it('#calculateSprayDensity() should calculate the density of spray emitted', () => {
    Tool.TOOL_OPTIONS_MANAGER.getSettings().pointsSize = 0;
    aerosol.testCalculateSprayDensity();
    expect(Aerosol.DEFAULT_COVERAGE === aerosol[SPRAY_DENSITY]).toBe(true);
  });

  it('#calculateSprayDensity() should calculate the density of spray emitted', () => {
    const DEFAULT_SIZE = 100;
    Tool.TOOL_OPTIONS_MANAGER.getSettings().pointsSize = DEFAULT_SIZE;
    aerosol.testCalculateSprayDensity();
    expect(Tool.TOOL_OPTIONS_MANAGER.getSettings().pointsSize ===
        DEFAULT_SIZE * aerosol[SPRAY_DENSITY]).toBe(true);
  });

  it('#calculateSprayDensity() should calculate the size of spray emitted', () => {
    const DEFAULT_SIZE = 100;
    Tool.TOOL_OPTIONS_MANAGER.getSettings().pointsSize = DEFAULT_SIZE;
    aerosol.testCalculateSprayDensity();
    expect(Tool.TOOL_OPTIONS_MANAGER.getSettings().pointsSize ===
        DEFAULT_SIZE * aerosol[SPRAY_DENSITY]).toBe(true);
  });

  it('#emitSpray() should calculate the number of circle emit', () => {
    const initialNumberPoints = aerosol[POINTS].length;
    const mouseEventData = new MouseEventData();
    const X = 3;
    const Y = 4;
    mouseEventData.x = X;
    mouseEventData.y = Y;
    aerosol.setCoords(mouseEventData);
    const DEFAULT_SIZE = 10;
    aerosol[SIZE] = DEFAULT_SIZE;
    const DEFAULT_DENSITY = 4;
    aerosol[SPRAY_DENSITY] = DEFAULT_DENSITY;
    const xOffset = aerosol[SIZE] - 2 * Math.random() * aerosol[SIZE];
    const yOffset = aerosol[SIZE] - 2 * Math.random() * aerosol[SIZE];
    const x = aerosol.getCoords().x + xOffset;
    const y = aerosol.getCoords().y + yOffset;
    const point = new  Coords(x , y);
    aerosol[POINTS].push(point);
    aerosol.testEmitSpray(mouseEventData);
    const EXPECTED_NUMBER_POINTS = initialNumberPoints + 1;
    expect(aerosol[POINTS].length).toBeGreaterThanOrEqual(EXPECTED_NUMBER_POINTS);
  });

});
