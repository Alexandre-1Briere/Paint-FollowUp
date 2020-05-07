import { TestBed } from '@angular/core/testing';

import { ApplicableSettingClass } from '../../../components/drawing/tool-detail/applicable-setting.class';
import { DEFAULT_BLUE, DEFAULT_YELLOW } from '../../../constants/colors';
import { ColorPickerService } from '../../color-picker/color-picker.service';
import { ToolsOptionsManagerService } from './tools-options-manager.service';

describe('ToolsOptionsManagerService', () => {
  let service: ToolsOptionsManagerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ColorPickerService],
    });
    service = TestBed.get(ToolsOptionsManagerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getSettings should return the current settings for the selected tool', () => {
    const settings = new ApplicableSettingClass();
    settings.configureFromOptions();
    expect(service.getSettings().primaryOpacity).toBe(1);
  });

  it('#equals method should return true when 2 settings are equal', () => {
    const settings = new ApplicableSettingClass();
    settings.configure({
      size: 0,
      borderSize: 5,
      tracingType: 'plein',
    });
    const settings2 = new ApplicableSettingClass();
    settings2.configure({
      size: 0,
      borderSize: 5,
      tracingType: 'plein',
    });
    expect(settings2.equal(settings)).toBeTruthy();
  });

  it('#equals method should return false when 2 settings aren\'t equal', () => {
    const settings = new ApplicableSettingClass();
    settings.configure({
      size: 0,
      borderSize: 5,
      tracingType: 'plein',
    });
    const settings2 = new ApplicableSettingClass();
    settings.configure({
      size: 0,
      borderSize: 5,
      tracingType: 'contour',
    });
    expect(settings2.equal(settings)).toBeFalsy();
  });

  it('#setWidth() sets size correctly', () => {
    const SIZE = 15;
    service.setWidth(SIZE);
    expect(service.getSettings().size).toBe(SIZE);
  });

  it('#setBorderWidth() sets borderSize correctly', () => {
    const BORDER_SIZE = 25;
    service.setBorderWidth(BORDER_SIZE);
    expect(service.getSettings().borderSize).toBe(BORDER_SIZE);
  });

  it('#setPrimaryColor() works with valid 7-digits hex value', () => {
    const COLOR = '#0f1e9a';
    service.setPrimaryColor(COLOR);
    expect(service.getSettings().primaryColor).toBe(COLOR);
  });

  it('#setPrimaryColor() also sets primary color for color-picker', () => {
    const COLOR = '#00f0ff';
    const colorPickerService: ColorPickerService = TestBed.get(ColorPickerService);
    service.setPrimaryColor(COLOR);
    expect(colorPickerService.getPrimaryColor(true)).toEqual({red: 0, green: 240, blue: 255, opacity: 1});
  });

  it('#setPrimaryColor() does not set primaryColor with bad inputs', () => {
    const BAD_COLOR1 = '0f1e9a';
    service.setPrimaryColor(BAD_COLOR1);
    const BAD_COLOR2 = '#0f';
    service.setPrimaryColor(BAD_COLOR2);
    const BAD_COLOR3 = '#5566778';
    service.setPrimaryColor(BAD_COLOR3);
    const BAD_COLOR4 = '#12345';
    service.setPrimaryColor(BAD_COLOR4);
    expect(service.getSettings().primaryColor).toBe(DEFAULT_BLUE);
  });

  it('#setSecondaryColor() works with valid 7-digits hex value', () => {
    const COLOR = '#44aaff';
    service.setSecondaryColor(COLOR);
    expect(service.getSettings().secondaryColor).toBe(COLOR);
  });

  it('#setSecondaryColor() also sets secondary color for color-picker', () => {
    const COLOR = '#ff8000';
    const colorPickerService: ColorPickerService = TestBed.get(ColorPickerService);
    service.setSecondaryColor(COLOR);
    expect(colorPickerService.getSecondaryColor(true)).toEqual({red: 255, green: 128, blue: 0, opacity: 1});
  });

  it('#setSecondaryColor() does not set secondaryColor with bad inputs', () => {
    const BAD_COLOR1 = '00445';
    service.setSecondaryColor(BAD_COLOR1);
    const BAD_COLOR2 = '#0';
    service.setSecondaryColor(BAD_COLOR2);
    const BAD_COLOR3 = '#aabbccd';
    service.setSecondaryColor(BAD_COLOR3);
    const BAD_COLOR4 = '#1234';
    service.setPrimaryColor(BAD_COLOR4);
    expect(service.getSettings().secondaryColor).toBe(DEFAULT_YELLOW);
  });

  it('#setTracingType() sets tracingType correctly', () => {
    const TRACING_TYPE = 'normal';
    service.setTracingType(TRACING_TYPE);
    expect(service.getSettings().tracingType).toBe(TRACING_TYPE);
  });

  it('#setPointsSize() sets pointsSize correctly', () => {
    const POINT_SIZE = 12;
    service.setPointSize(POINT_SIZE);
    expect(service.getSettings().pointsSize).toBe(POINT_SIZE);
  });

  it('#setPointsSize() sets pointsSize to undefined when input is undefined', () => {
    service.setPointSize(undefined);
    expect(service.getSettings().pointsSize).toBeUndefined();
  });

  it('#setOpacity() should do nothing if the opacity isn\'t valid', () => {
    const VALID_OPACITY = 0.5;
    const INVALID_OPACITY = -2;
    service.setOpacity(VALID_OPACITY, true);
    expect(service.getSettings().primaryOpacity).toBe(VALID_OPACITY);
    service.setOpacity(INVALID_OPACITY, true);
    expect(service.getSettings().primaryOpacity).toBe(VALID_OPACITY);
  });
});
