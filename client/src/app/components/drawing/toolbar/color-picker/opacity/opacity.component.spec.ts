import { DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import {TestSpeedUpgrader} from '../../../../../testHelpers/test-speed-upgrader.spec';
import { OpacityComponent } from './opacity.component';

describe('OpacitySliderComponent', () => {
  let component: OpacityComponent;
  let fixture: ComponentFixture<OpacityComponent>;
  let canvas: DebugElement;

  TestSpeedUpgrader.overWriteModuleResetForSpeedGain();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OpacityComponent ],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OpacityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    canvas = fixture.debugElement.query(By.css('#canvas'));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it(' component should update opacity when clicked elsewhere', () => {
    const spy = spyOn(component.opacityChange, 'emit');
    expect(component.mouseDown).toBe(false);
    expect(component.opacityChange.emit).toHaveBeenCalledTimes(0);
    spy.calls.reset();
    canvas.triggerEventHandler('mousedown', {offsetX: 10, offsetY: 20});
    expect(component.mouseDown).toBe(true);
  });

  it(' component should not update opacity when click is released', () => {
    canvas.triggerEventHandler('mousedown', {offsetX: 0, offsetY: 0});
    canvas.triggerEventHandler('mouseup', {});
    spyOn(component.opacityChange, 'emit');
    canvas.triggerEventHandler('mousemove', {offsetX: 10, offsetY: 20});
    expect(component.mouseDown).toBe(false);
    expect(component.opacityChange.emit).toHaveBeenCalledTimes(0);
  });

  it('mousemove should emit opacity with mouse mouvement', () => {
    spyOn(component.opacityChange, 'emit');
    canvas.triggerEventHandler('mousedown', {offsetX: 0, offsetY: 0});
    window.dispatchEvent(new MouseEvent('mousemove', {clientX: 10, clientY: 20}));
    expect(component.mouseDown).toBe(true);
    expect(component.opacityChange.emit).toHaveBeenCalled();
  });

  it('mousemove should emit opacity with mouse mouvement even on incorrect value', () => {
    spyOn(component.opacityChange, 'emit');
    canvas.triggerEventHandler('mousedown', {offsetX: 0, offsetY: 0});
    window.dispatchEvent(new MouseEvent('mousemove', {clientX: 10, clientY: 1}));
    expect(component.mouseDown).toBe(true);
    expect(component.opacityService.position).toBe(0);
    expect(component.opacityChange.emit).toHaveBeenCalled();
  });

  it('updateGradientColor should update background color if color changes', () => {
    const color = {
      red: 10,
      green: 10,
      blue: 10,
      opacity: 1,
    };
    const initialCanvasBackground = component.opacityService.colorRGBA;
    component.updateGradientColor(color);
    const canvasBackground = component.opacityService.colorRGBA;
    expect(canvasBackground).not.toEqual(initialCanvasBackground);
  });

  it(' mouseDown should keep to false when leaving canvas', () => {
    component.mouseDown = false;
    canvas.triggerEventHandler('mouseleave', {offsetX: 20, offsetY: 40});
    expect(component.mouseDown).toBe(false);
  });
});
