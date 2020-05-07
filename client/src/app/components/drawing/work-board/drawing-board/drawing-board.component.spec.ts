import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DrawingBoardComponent } from './drawing-board.component';

import { ElementRef } from '@angular/core';
import { MOUSE_DOWN, MOUSE_ENTER, MOUSE_LEAVE, MOUSE_MOVE, MOUSE_UP, MOUSE_WHEEL } from '../../../../constants/mouse';
import { SvgUndoRedoChange } from '../../../../enums/svg';
import { TestSpeedUpgrader } from '../../../../testHelpers/test-speed-upgrader.spec';

describe('DrawingBoardComponent', () => {
  const OUTER_TAG = 'svg';
  let component: DrawingBoardComponent;
  let fixture: ComponentFixture<DrawingBoardComponent>;

  TestSpeedUpgrader.overWriteModuleResetForSpeedGain();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        DrawingBoardComponent,
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DrawingBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('drawingBoardElement is not undefined', () => {
    expect(component.drawingBoardElement).toBeDefined();
  });

  it('#ngAfterViewInit() correctly initializes SvgComponentsManagerService', () => {
    spyOn(component.svgComponentsManagerService, 'initialiseViewContainerRef');
    component.ngAfterViewInit();
    fixture.detectChanges();
    expect(component.svgComponentsManagerService.initialiseViewContainerRef).toHaveBeenCalled();
  });

  it('#sendMouseEvent() is called for all required mouse events', () => {
    spyOn(component, 'sendMouseEvent');
    const outerMostHtmlElement = fixture.nativeElement.querySelector(OUTER_TAG);
    const BUBBLES_REQUIRED_VALUE = true;
    outerMostHtmlElement.dispatchEvent(new Event(MOUSE_DOWN, {bubbles: BUBBLES_REQUIRED_VALUE}));
    outerMostHtmlElement.dispatchEvent(new Event(MOUSE_UP, {bubbles: BUBBLES_REQUIRED_VALUE}));
    outerMostHtmlElement.dispatchEvent(new Event(MOUSE_MOVE, {bubbles: BUBBLES_REQUIRED_VALUE}));
    outerMostHtmlElement.dispatchEvent(new Event(MOUSE_WHEEL, {bubbles: BUBBLES_REQUIRED_VALUE}));
    outerMostHtmlElement.dispatchEvent(new Event(MOUSE_ENTER, {bubbles: BUBBLES_REQUIRED_VALUE}));
    outerMostHtmlElement.dispatchEvent(new Event(MOUSE_LEAVE, {bubbles: BUBBLES_REQUIRED_VALUE}));
    fixture.detectChanges();
    const NUMBER_OF_MOUSE_EVENTS = 6;
    expect(component.sendMouseEvent).toHaveBeenCalledTimes(NUMBER_OF_MOUSE_EVENTS);
  });

  it('#sendMouseEvent() calls mouseDrawingInputsService.receiveMouseAction', () => {
    spyOn(component.mouseDrawingInputsService, 'receiveMouseAction');
    const outerMostHtmlElement = fixture.nativeElement.querySelector(OUTER_TAG);
    const BUBBLES_REQUIRED_VALUE = true;
    outerMostHtmlElement.dispatchEvent(new Event(MOUSE_DOWN, {bubbles: BUBBLES_REQUIRED_VALUE}));
    fixture.detectChanges();
    expect(component.mouseDrawingInputsService.receiveMouseAction).toHaveBeenCalled();
  });

  it('#sendMouseEvent() does not corrupt mouseservice data when drawingBoardElement is undefined', () => {
    component.drawingBoardElement = new ElementRef(undefined);
    const BUBBLES_REQUIRED_VALUE = true;
    component.sendMouseEvent(new MouseEvent(MOUSE_DOWN, {bubbles: BUBBLES_REQUIRED_VALUE}));
    const DEFAULT_VALUE = 0;
    expect(component.mouseDrawingInputsService.drawingBoardTopLeftX).toEqual(DEFAULT_VALUE);
    expect(component.mouseDrawingInputsService.drawingBoardTopLeftY).toEqual(DEFAULT_VALUE);
  });

  it('#updateBackgroundColor() should save the current drawing', () => {
    const spy = spyOn(component.localSaverService, 'saveCurrentDrawing');
    const functionName = 'updateBackgroundColor';
    component[functionName]('#ffffff');
    expect(spy).toHaveBeenCalled();
  });

  it('#save() should save the current drawing', () => {
    const spy = spyOn(component.localSaverService, 'saveCurrentDrawing');
    const functionName = 'save';
    component[functionName](SvgUndoRedoChange.SaveCalled);
    expect(spy).toHaveBeenCalled();
  });
});
