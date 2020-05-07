import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { ApplicableSettingClass, Config } from '../../../components/drawing/tool-detail/applicable-setting.class';
import { DEFAULT_BLUE, DEFAULT_YELLOW } from '../../../constants/colors';
import { ColorPickerColor } from '../../../enums/color-picker-color.enum';
import { ColorManipulator } from '../../color-picker/color-manipulator/color-manipulator';
import { ColorPickerService } from '../../color-picker/color-picker.service';
import { Option } from './tools-options/option';

@Injectable({
  providedIn: 'root',
})
export class ToolsOptionsManagerService {

  currentSettings: ApplicableSettingClass;
  private currentSettingsObs: Subject<Option[]>;
  colorPickerService: ColorPickerService | undefined;

  constructor() {
    this.currentSettings = new ApplicableSettingClass();
    this.currentSettingsObs = new Subject<Option[]>();
    this.colorPickerService = undefined;
    this.setPrimaryColor(DEFAULT_BLUE);
    this.setSecondaryColor(DEFAULT_YELLOW);
    this.setOpacity(1, true);
    this.setOpacity(1, false);
  }

  configure(config: Config): void {
    this.currentSettings.configure(config);
  }

  configureOptions(options: Option[]): void {
    this.currentSettings.configureOptions(options);
    this.currentSettingsObs.next(this.getOptions());
  }

  configureFromOptions(): void {
    this.currentSettings.configureFromOptions();
  }

  getOptions(): Option[] {
    return this.currentSettings.options;
  }

  getOptionsObs(): Observable<Option[]> {
    return this.currentSettingsObs.asObservable();
  }

  /**
   * OLD
   */
  setWidth(size: number): void {
    this.currentSettings.setSize(size.toString());
  }
  setBorderWidth(size: number): void {
    this.currentSettings.setBorderSize(size.toString());
  }

  setPrimaryColor(color: string, updateColorPicker: boolean = true): void {
    const colorRegex = /^#[0-9a-fA-F]{6}$/i;
    this.currentSettings.primaryColor = colorRegex.test(color) ? color : DEFAULT_BLUE;
    if (this.colorPickerService !== undefined && updateColorPicker) {
      this.colorPickerService.setColor(
        ColorManipulator.RGBHexToRGBAHex(this.currentSettings.primaryColor),
        ColorPickerColor.Primary, false);
    }
  }

  setSecondaryColor(color: string, updateColorPicker: boolean = true): void {
    const colorRegex = /^#[0-9a-fA-F]{6}$/i;
    this.currentSettings.secondaryColor = colorRegex.test(color) ? color : DEFAULT_YELLOW;
    if (this.colorPickerService !== undefined && updateColorPicker) {
      this.colorPickerService.setColor(
        ColorManipulator.RGBHexToRGBAHex(this.currentSettings.secondaryColor),
        ColorPickerColor.Secondary, false);
    }
  }

  setTracingType(name: string): void {
    this.currentSettings.tracingType = name;
  }

  setPointSize(size: number | undefined): void {
    if (size !== undefined) {
      this.currentSettings.setPointSize(size.toString());
    } else {
      this.currentSettings.pointsSize = undefined;
    }
  }

  setOpacity(opacity: number, isPrimary: boolean): void {
    if (opacity < 0 || opacity > 1) {
      return;
    }
    if (isPrimary) {
      this.currentSettings.primaryOpacity = opacity;
    } else {
      this.currentSettings.secondaryOpacity = opacity;
    }
  }

  getSettings(): ApplicableSettingClass {
    return this.currentSettings;
  }
}
