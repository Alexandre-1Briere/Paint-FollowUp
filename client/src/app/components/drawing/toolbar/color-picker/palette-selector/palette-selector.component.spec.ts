import { DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DEFAULT_BLUE_RGBA } from '../../../../../constants/colors';
import { ColorManipulator } from '../../../../../services/color-picker/color-manipulator/color-manipulator';
import { PaletteSelectorService } from '../../../../../services/color-picker/palette-selector/palette-selector.service';
import { TestSpeedUpgrader } from '../../../../../testHelpers/test-speed-upgrader.spec';
import { PaletteSelectorComponent } from './palette-selector.component';

describe('paletteSelectorComponent', () => {
  let component: PaletteSelectorComponent;
  let fixture: ComponentFixture<PaletteSelectorComponent>;
  let canvas: DebugElement;
  let service: PaletteSelectorService;

  TestSpeedUpgrader.overWriteModuleResetForSpeedGain();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaletteSelectorComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaletteSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    canvas = fixture.debugElement.query(By.css('#canvas'));
    service = component.paletteSelectorService;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it(' component should emit color when clicked and also when moved', () => {
    const spy = spyOn(component.hueChange, 'emit');
    expect(component.mouseDown).toBe(false);
    canvas.triggerEventHandler('mousedown', {offsetX: 10, offsetY: 50});
    expect(component.mouseDown).toBe(true);
    const color = ColorManipulator.cloneColorRGBA(service.drawingColorRGBA);
    expect(component.hueChange.emit).toHaveBeenCalledWith(color);
    spy.calls.reset();
    window.dispatchEvent(new MouseEvent('mousemove', {clientX: 8, clientY: 150}));
    const newColor = service.drawingColorRGBA;
    expect(component.hueChange.emit).toHaveBeenCalledWith(newColor);
    expect(color).not.toEqual(newColor);
  });

  it('#getColor() should return a clone of the current color', () => {
    component.paletteSelectorService.drawingColorRGBA = DEFAULT_BLUE_RGBA;
    expect(component.getColor()).not.toBe(component.paletteSelectorService.drawingColorRGBA);
    expect(component.getColor()).toEqual(component.paletteSelectorService.drawingColorRGBA);
  });

  it('updateGradientColor should update background when color changes', () => {
    const color = {
      red: 67,
      green: 87,
      blue: 45,
      opacity: 1,
    };
    const bgColor = service.gradientColorRGBA;
    component.updateGradientColor(color);
    const newBgColor = service.gradientColorRGBA;
    expect(bgColor).not.toEqual(newBgColor);
  });

  it('mouseDown should not emit when unclicked', () => {
    const spy = spyOn(component.hueChange, 'emit');
    canvas.triggerEventHandler('mousemove', {offsetX: 10, offsetY: 20});
    expect(component.mouseDown).toBe(false);
    expect(component.hueChange.emit).toHaveBeenCalledTimes(0);
    canvas.triggerEventHandler('mousedown', {offsetX: 0, offsetY: 0});
    expect(component.mouseDown).toBe(true);
    spy.calls.reset();
    canvas.triggerEventHandler('mouseup', {});
    canvas.triggerEventHandler('mousemove',  {offsetX: 10, offsetY: 70});
    expect(component.mouseDown).toBe(false);
    expect(component.hueChange.emit).toHaveBeenCalledTimes(0);
  });

  it('mouseDown should change keep to false when leaving canvas', () => {
    component.mouseDown = false;
    canvas.triggerEventHandler('mouseleave', {offsetX: 20, offsetY: 40});
    expect(component.mouseDown).toBe(false);
  });

  it('getColor should return the value of paletteSelector.drawingColorRGBA', () => {
    const color = component.getColor();
    expect(color).toEqual(service.drawingColorRGBA);
  });

  it('getColor should be a copy paletteSelector.drawingColorRGBA', () => {
    const color = component.getColor();
    expect(color).not.toBe(service.drawingColorRGBA);
  });
});
