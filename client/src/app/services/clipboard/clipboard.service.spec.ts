import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import { TestBed } from '@angular/core/testing';
import {SvgRectangleComponent} from '../../components/drawing/work-board/svg-rectangle/svg-rectangle.component';
import {SvgSelectionComponent} from '../../components/drawing/work-board/svg-selection/svg-selection.component';
import {KEY_DOWN} from '../../constants/keyboard';
import {KeyboardKey} from '../../enums/keyboard';
import {SvgBasicProperties} from '../../logic/svg/base-svg/svg-basic-properties';
import {SvgRectangleProperties} from '../../logic/svg/rectangle/svg-rectangle-properties';
import {MockViewContainerRefComponent} from '../../testHelpers/svgBoard/mock-view-container-ref-component.spec';
import {TestSpeedUpgrader} from '../../testHelpers/test-speed-upgrader.spec';
import {DrawingBaseParametersAccessorService} from '../drawing-base-parameters-accessor/drawing-base-parameters-accessor.service';
import {KeyboardManagerService} from '../events/keyboard-manager.service';
import {SvgComponentsManagerService} from '../svg/svg-components-manager.service';
import {ToolManagerService} from '../tool-manager/tool-manager.service';
import {Rectangle} from '../tool-manager/tools/rectangle/rectangle';
import {Selection} from '../tool-manager/tools/selection/selection';
import {Tool} from '../tool-manager/tools/tool/tool';

import { ClipboardService } from './clipboard.service';

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [
    SvgRectangleComponent,
    SvgSelectionComponent,
    MockViewContainerRefComponent,
  ],
  entryComponents: [
    SvgRectangleComponent,
    SvgSelectionComponent,
  ],
  providers: [
    DrawingBaseParametersAccessorService,
    SvgComponentsManagerService,
    KeyboardManagerService,
    ToolManagerService,
    ClipboardService,
  ]
})
class TestModule {}

const CONTENT = 'content';
const OFFSET = 'offset';
const PASTE_CONTENT = 'pasteContent';
const TOOL_MANAGER_SERVICE = 'toolManagerService';

const BOARD_SIZE = 1000;
const EXPECTED_OFFSET = 5;

describe('ClipboardService', () => {
  let service: ClipboardService;
  let mockViewComponent: MockViewContainerRefComponent;

  TestSpeedUpgrader.overWriteModuleResetForSpeedGain();

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestModule],
    });
    const toolManagerService: ToolManagerService = TestBed.get(ToolManagerService);
    toolManagerService.setTool(Rectangle.getInstance());
    service = TestBed.get(ClipboardService);
    service.initialise(toolManagerService);

    service.drawingBaseParametersService.setDrawingBaseParameters(BOARD_SIZE, BOARD_SIZE, '#000000');

    const fixture = TestBed.createComponent(MockViewContainerRefComponent);
    mockViewComponent = fixture.componentInstance;
    Tool.SVG_COMPONENT_MANAGER.initialiseViewContainerRef(mockViewComponent.viewContainerRef);
  });

  const selectSomeComponents = (): void => {
    service[TOOL_MANAGER_SERVICE].setTool(Selection.getInstance());
    const selection = service[TOOL_MANAGER_SERVICE].getTool() as Selection;
    selection.selectSvgComponents([new SvgRectangleComponent()]);
  };

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('#reset() works as expected', () => {
    service.reset();
    expect(service[CONTENT]).toEqual({svgJsons: [], reference: {x: 0, y: 0}});
    expect(service[OFFSET]).toEqual({x: 0, y: 0});
  });

  it('#replaceContent() works as expected', () => {
    service.replaceContent([new SvgRectangleProperties()], {x: 1, y: 1});
    expect(service[CONTENT]).toEqual({svgJsons: [new SvgRectangleProperties().createSvgJson()], reference: {x: 1, y: 1}});
    expect(service[OFFSET]).toEqual({x: 0, y: 0});
  });

  it('#pasteContent() is not called when ctrl + v is not available', () => {
    // tslint:disable-next-line:no-any
    const pasteSpy = spyOn<any>(service, PASTE_CONTENT).and.callThrough();
    service.keyboardManagerService.receiveKeyboardEvent(new KeyboardEvent(KEY_DOWN, {key: KeyboardKey.Ctrl}));
    service.keyboardManagerService.receiveKeyboardEvent(new KeyboardEvent(KEY_DOWN, {key: KeyboardKey.V}));
    expect(pasteSpy).not.toHaveBeenCalled();
  });

  it('#pasteContent() is called when ctrl + v is available', () => {
    // tslint:disable-next-line:no-any
    const pasteSpy = spyOn<any>(service, PASTE_CONTENT).and.callThrough();
    service.replaceContent([new SvgRectangleProperties()], {x: 1, y: 1});
    service.keyboardManagerService.receiveKeyboardEvent(new KeyboardEvent(KEY_DOWN, {key: KeyboardKey.Ctrl}));
    service.keyboardManagerService.receiveKeyboardEvent(new KeyboardEvent(KEY_DOWN, {key: KeyboardKey.V}));
    expect(pasteSpy).toHaveBeenCalled();
  });

  it('#pasteContent() handles offset correctly', () => {
    const TWO_STEPS_AWAY = EXPECTED_OFFSET * 2;
    const REFERENCE = {x: BOARD_SIZE - TWO_STEPS_AWAY, y: BOARD_SIZE - TWO_STEPS_AWAY};
    service.replaceContent([new SvgRectangleProperties()], REFERENCE);
    const NO_OFFSET_REFERENCE = new SvgRectangleProperties().getCenter().x;

    service.keyboardManagerService.receiveKeyboardEvent(new KeyboardEvent(KEY_DOWN, {key: KeyboardKey.Ctrl}));
    service.keyboardManagerService.receiveKeyboardEvent(new KeyboardEvent(KEY_DOWN, {key: KeyboardKey.V}));
    const componentWithOffset = service.svgComponentsManagerService.getSvgComponent(0) as SvgBasicProperties;
    service.keyboardManagerService.receiveKeyboardEvent(new KeyboardEvent(KEY_DOWN, {key: KeyboardKey.V}));
    const componentBackToOriginalPlace = service.svgComponentsManagerService.getSvgComponent(1) as SvgBasicProperties;

    expect(componentWithOffset.getCenter().x - NO_OFFSET_REFERENCE).toBeCloseTo(EXPECTED_OFFSET);
    expect(componentWithOffset.getCenter().x - componentBackToOriginalPlace.getCenter().x).toBeCloseTo(EXPECTED_OFFSET);
    expect(componentWithOffset.getCenter().y - componentBackToOriginalPlace.getCenter().y).toBeCloseTo(EXPECTED_OFFSET);
  });

  it('#tryToPasteContent() works as expected when selection tool is already selected', () => {
    service.replaceContent([new SvgRectangleProperties()], {x: 1, y: 1});
    service[TOOL_MANAGER_SERVICE].setTool(Selection.getInstance());

    // tslint:disable-next-line:no-any
    const pasteSpy = spyOn<any>(service, PASTE_CONTENT).and.callThrough();
    service.tryToPasteContent();
    expect(pasteSpy).toHaveBeenCalled();
  });

  it('#tryToPasteContent() works as expected when selection tool is not selected', () => {
    service.replaceContent([new SvgRectangleProperties()], {x: 1, y: 1});
    // tslint:disable-next-line:no-any
    const pasteSpy = spyOn<any>(service, PASTE_CONTENT).and.callThrough();
    service.tryToPasteContent();
    expect(pasteSpy).toHaveBeenCalled();
  });

  it('#duplicateComponents() handles offset correctly', () => {
    const TWO_STEPS_AWAY = EXPECTED_OFFSET * 2;
    const REFERENCE = {x: BOARD_SIZE - TWO_STEPS_AWAY, y: BOARD_SIZE - TWO_STEPS_AWAY};
    const NO_OFFSET_REFERENCE = new SvgRectangleProperties().getCenter().x;

    const componentWithOffset = service.duplicateComponents([new SvgRectangleProperties()], REFERENCE)[0];
    expect(componentWithOffset.getCenter().x - NO_OFFSET_REFERENCE).toBeCloseTo(EXPECTED_OFFSET);
    const componentWithoutOffset = service.duplicateComponents([componentWithOffset],
      {x: REFERENCE.x + EXPECTED_OFFSET, y: REFERENCE.y + EXPECTED_OFFSET})[0];

    expect(componentWithOffset.getCenter().x - componentWithoutOffset.getCenter().x).toBeCloseTo(0);
    expect(componentWithOffset.getCenter().y - componentWithoutOffset.getCenter().y).toBeCloseTo(0);
  });

  it('#ctrlVIsAvailable() works as expected', () => {
    expect(service.ctrlVIsAvailable()).toBeFalsy();
    service.replaceContent([new SvgRectangleProperties()], {x: 1, y: 1});
    expect(service.ctrlVIsAvailable()).toBeTruthy();
    service.reset();
    expect(service.ctrlVIsAvailable()).toBeFalsy();
  });

  it('#ctrlCIsAvailable() works as expected', () => {
    selectSomeComponents();
    expect(service.ctrlCIsAvailable()).toBeTruthy();
    service[TOOL_MANAGER_SERVICE].setTool(Rectangle.getInstance());
    expect(service.ctrlCIsAvailable()).toBeFalsy();
  });

  it('#ctrlCIsAvailable() works as expected', () => {
    selectSomeComponents();
    expect(service.ctrlCIsAvailable()).toBeTruthy();
    service[TOOL_MANAGER_SERVICE].setTool(Rectangle.getInstance());
    expect(service.ctrlCIsAvailable()).toBeFalsy();
  });

  it('#ctrlDIsAvailable() works as expected', () => {
    selectSomeComponents();
    expect(service.ctrlDIsAvailable()).toBeTruthy();
    service[TOOL_MANAGER_SERVICE].setTool(Rectangle.getInstance());
    expect(service.ctrlDIsAvailable()).toBeFalsy();
  });

  it('#ctrlXIsAvailable() works as expected', () => {
    selectSomeComponents();
    expect(service.ctrlXIsAvailable()).toBeTruthy();
    service[TOOL_MANAGER_SERVICE].setTool(Rectangle.getInstance());
    expect(service.ctrlXIsAvailable()).toBeFalsy();
  });

  it('#deleteIsAvailable() works as expected', () => {
    selectSomeComponents();
    expect(service.deleteIsAvailable()).toBeTruthy();
    service[TOOL_MANAGER_SERVICE].setTool(Rectangle.getInstance());
    expect(service.deleteIsAvailable()).toBeFalsy();
  });
});
