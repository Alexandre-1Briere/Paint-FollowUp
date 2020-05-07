import { DebugElement, ElementRef } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { MOUSE_DOWN, MOUSE_LEAVE, MOUSE_MOVE, MOUSE_UP } from '../../../../../constants/mouse';
import { ColorSliderService } from '../../../../../services/color-picker/color-slider/color-slider.service';
import {BAR_PALETTE_WIDTH} from '../../../../../services/color-picker/constant';
import {TestSpeedUpgrader} from '../../../../../testHelpers/test-speed-upgrader.spec';
import { ColorSliderComponent } from './color-slider.component';

describe('ColorSliderComponent', () => {
  let component: ColorSliderComponent;
  let fixture: ComponentFixture<ColorSliderComponent>;
  let canvas: DebugElement;
  let service: ColorSliderService;

  TestSpeedUpgrader.overWriteModuleResetForSpeedGain();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ColorSliderComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ColorSliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    canvas = fixture.debugElement.query(By.css('#canvas'));
    service = component.colorSliderService;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it(' component should emit color when clicked and also when moved', () => {
    const spy = spyOn(component.colorRGBChange, 'emit');
    expect(component.mouseDown).toBe(false);
    canvas.triggerEventHandler(MOUSE_DOWN, {offsetX: 10, offsetY: 40});
    expect(component.mouseDown).toBe(true);
    const color = service.getColor();
    expect(component.colorRGBChange.emit).toHaveBeenCalledWith(color);
    spy.calls.reset();
    window.dispatchEvent(new MouseEvent(MOUSE_MOVE, {clientX: 10, clientY: 120}));
    const newColor = service.getColor();
    expect(component.colorRGBChange.emit).toHaveBeenCalledWith(newColor);
  });

  it(' component should not update color when unclicked and moved', () => {
    const spy = spyOn(component.colorRGBChange, 'emit');
    canvas.triggerEventHandler(MOUSE_MOVE, {offsetX: 10, offsetY: 20});
    expect(component.mouseDown).toBe(false);
    expect(component.colorRGBChange.emit).toHaveBeenCalledTimes(0);
    canvas.triggerEventHandler(MOUSE_DOWN, {offsetX: 0, offsetY: 0});
    expect(component.mouseDown).toBe(true);
    spy.calls.reset();
    canvas.triggerEventHandler(MOUSE_UP, {offsetX: 0, offsetY: 0});
    canvas.triggerEventHandler(MOUSE_MOVE,  {offsetX: 10, offsetY: 70});
    expect(component.mouseDown).toBe(false);
    expect(component.colorRGBChange.emit).toHaveBeenCalledTimes(0);
  });

  it('#mouseDown() should keep to false when leaving canvas', () => {
    component.mouseDown = false;
    canvas.triggerEventHandler(MOUSE_LEAVE, {offsetX: 20, offsetY: 40});
    expect(component.mouseDown).toBe(false);
  });

  it('#pixelPickedX() returns half of palette width when canvas is undefiend', () => {
    const POSITION = BAR_PALETTE_WIDTH / 2;
    const mouseEvent = new MouseEvent(MOUSE_DOWN, {clientX: POSITION, clientY: POSITION});
    component.canvas = undefined as unknown as ElementRef;
    expect(component.pixelPickedX(mouseEvent)).toBe(POSITION);
  });

  it('#pixelPickedY() returns event.offsetY when canvas is undefiend', () => {
    const POSITION = 5;
    const mouseEvent = new MouseEvent(MOUSE_DOWN, {clientX: POSITION, clientY: POSITION});
    component.canvas = undefined as unknown as ElementRef;
    expect(component.pixelPickedY(mouseEvent)).toBe(POSITION);
  });
});
