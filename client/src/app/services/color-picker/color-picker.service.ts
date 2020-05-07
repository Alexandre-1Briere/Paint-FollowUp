import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
// import {DEFAULT_BLUE, DEFAULT_BLUE_RGBA, DEFAULT_YELLOW, DEFAULT_YELLOW_RGBA} from '../../constants/colors';
import { DEFAULT_BLUE_RGBA, DEFAULT_YELLOW_RGBA } from '../../constants/colors';
import { ColorPickerColor } from '../../enums/color-picker-color.enum';
import { ColorPickerColors } from '../../interfaces/color-picker-colors';
import { ToolsOptionsManagerService } from '../tool-manager/tools-options-manager/tools-options-manager.service';
import { ColorManipulator } from './color-manipulator/color-manipulator';
import {
    CANVAS_STARTING_POSITION,
    COLOR_ARRAY_STARTING,
    COLOR_PREVIEW_SIZE,
    ColorRGBA,
    HEX_RGB_LENGTH,
    TWO_D_CANVAS,
} from './constant';

@Injectable({
  providedIn: 'root',
})
export class ColorPickerService {

  colors: ColorPickerColors;
  hexColor: string;
  colorUsed: ColorRGBA[];
  private colorUpdatedObs: Subject<void> = new Subject<void>();

  constructor(public toolOptionService: ToolsOptionsManagerService) {
    this.resetColors();
    this.resetColorUsed();
    this.toolOptionService.colorPickerService = this;
  }

  resetColorUsed(): void {
    this.colorUsed = COLOR_ARRAY_STARTING;
    this.setColorRGBA(DEFAULT_BLUE_RGBA, ColorPickerColor.Primary, true);
    this.setColorRGBA(DEFAULT_YELLOW_RGBA, ColorPickerColor.Secondary, true);
    this.setColorRGBA(DEFAULT_BLUE_RGBA, ColorPickerColor.Palette, true);
  }

  private resetColors(): void {
    this.colors = {
      primary: {red: 0, green: 0, blue: 0, opacity: 1},
      secondary: {red: 0, green: 0, blue: 0, opacity: 1},
      palette: {red: 0, green: 0, blue: 0, opacity: 1},
    };
  }

  getPrimaryColor(opaque: boolean = false): ColorRGBA {
    const primaryColor = ColorManipulator.cloneColorRGBA(this.colors.primary);
    this.chooseToTurnOpaque(primaryColor, opaque);
    return primaryColor;
  }

  getSecondaryColor(opaque: boolean = false): ColorRGBA {
    const secondaryColor = ColorManipulator.cloneColorRGBA(this.colors.secondary);
    this.chooseToTurnOpaque(secondaryColor, opaque);
    return secondaryColor;
  }

  getPaletteColor(opaque: boolean = false): ColorRGBA {
    const paletteColor = ColorManipulator.cloneColorRGBA(this.colors.palette);
    this.chooseToTurnOpaque(paletteColor, opaque);
    return paletteColor;
  }

  private chooseToTurnOpaque(color: ColorRGBA, opaque: boolean): void {
    if (opaque) {
      color.opacity = 1;
    }
  }

  pushColorToUsed(colorRGBA: ColorRGBA): void {
    if (!this.doesColorUsedContains(colorRGBA)) {
      const colorPushed = ColorManipulator.cloneColorRGBA(colorRGBA);
      colorPushed.opacity = 1;
      this.colorUsed.push(colorPushed);
      this.colorUsed.shift();
    }
  }

  getColorUpdatedObservable(): Observable<void> {
    return this.colorUpdatedObs.asObservable();
  }

  setColor(color: string, colorPickerColor: ColorPickerColor, modifyOpacity: boolean): void {
    if (!ColorManipulator.validateHexColor(color)) {
      return;
    }

    this.setColorRGBA(ColorManipulator.hexColorToColorRGBA(color), colorPickerColor, modifyOpacity);
  }

  setColorRGBA(colorRGBA: ColorRGBA, colorPickerColor: ColorPickerColor, modifyOpacity: boolean): void {
    if (!ColorManipulator.validateColorRGBA(colorRGBA)) {
      return;
    }

    if (colorPickerColor !== ColorPickerColor.Palette) {
      this.pushColorToUsed(colorRGBA);
    }

    const newColorRGBA = ColorManipulator.cloneColorRGBA(colorRGBA);

    if (colorPickerColor === ColorPickerColor.Primary) {
      this.changeColorRGBA(this.colors.primary, newColorRGBA, modifyOpacity);
    } else if (colorPickerColor === ColorPickerColor.Secondary) {
      this.changeColorRGBA(this.colors.secondary, newColorRGBA, modifyOpacity);
    } else {
      this.changeColorRGBA(this.colors.palette, newColorRGBA, modifyOpacity);
      this.hexColor = ColorManipulator.colorRGBAToHexColor(this.colors.palette);
    }
    this.applyColorOption();
    this.colorUpdatedObs.next();
  }

  switchColor(): void {
    const tempColor = ColorManipulator.cloneColorRGBA(this.colors.primary);
    this.colors.primary = this.colors.secondary;
    this.colors.secondary = tempColor;
    this.applyColorOption();
    this.colorUpdatedObs.next();
  }

  applyColorOption(): void {
    this.toolOptionService.setPrimaryColor(
      ColorManipulator.colorRGBAToHexColor(this.colors.primary).substring(0, HEX_RGB_LENGTH), false);
    this.toolOptionService.setSecondaryColor(
      ColorManipulator.colorRGBAToHexColor(this.colors.secondary).substring(0, HEX_RGB_LENGTH), false);

    this.toolOptionService.setOpacity(
      this.colors.primary.opacity, true);
    this.toolOptionService.setOpacity(
      this.colors.secondary.opacity, false);
  }

  private changeColorRGBA(colorToReplace: ColorRGBA, color: ColorRGBA, modifyOpacity: boolean): ColorRGBA {
    colorToReplace.red = color.red;
    colorToReplace.green = color.green;
    colorToReplace.blue = color.blue;
    if (modifyOpacity) {
      colorToReplace.opacity = color.opacity;
    }
    return colorToReplace;
  }

  setOpacityFromRGBA(colorRGBA: ColorRGBA, colorPickerColor: ColorPickerColor): void {
    this.setOpacity(colorRGBA.opacity, colorPickerColor);
  }

  setOpacity(opacity: number, colorPickerColor: ColorPickerColor): void {
    opacity = ColorManipulator.clampOpacity(opacity);

    if (colorPickerColor === ColorPickerColor.Primary) {
      this.colors.primary.opacity = opacity;
    } else if (colorPickerColor === ColorPickerColor.Secondary) {
      this.colors.secondary.opacity = opacity;
    } else {
      this.colors.palette.opacity = opacity;
      this.hexColor = ColorManipulator.colorRGBAToHexColor(this.colors.palette);
    }

    this.applyColorOption();
    this.colorUpdatedObs.next();
  }

  setUpService(canvasPrincipal: HTMLCanvasElement, canvasSecondary: HTMLCanvasElement, isBackground: boolean = false): void {
    if (isBackground) {
      this.hexColor = ColorManipulator.colorRGBAToHexColor(this.colors.primary);
    }
    this.colorUpdatedObs.next();
  }

  doesColorUsedContains(colorProvided: ColorRGBA): boolean {
    for (const color of this.colorUsed) {
      if (color.opacity !== undefined &&
          color.red === colorProvided.red &&
          color.blue === colorProvided.blue &&
          color.green === colorProvided.green) {
        return true;
      }
    }
    return false;
  }

  fillCanvas(color: string, canvas: HTMLCanvasElement): void {
    const context = canvas.getContext(TWO_D_CANVAS);
    if (context !== null) {
      context.clearRect(CANVAS_STARTING_POSITION, CANVAS_STARTING_POSITION, COLOR_PREVIEW_SIZE, COLOR_PREVIEW_SIZE);
      context.fillStyle = color;
      context.fillRect(CANVAS_STARTING_POSITION, CANVAS_STARTING_POSITION, COLOR_PREVIEW_SIZE, COLOR_PREVIEW_SIZE);
    }
  }
}
