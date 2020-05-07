import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  ViewChild,
} from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { faRetweet, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs';
import { DEFAULT_BLUE_RGBA } from '../../../../constants/colors';
import { ColorPickerColor } from '../../../../enums/color-picker-color.enum';
import { ColorManipulator } from '../../../../services/color-picker/color-manipulator/color-manipulator';
import { ColorPickerService } from '../../../../services/color-picker/color-picker.service';
import {
  ColorRGBA,
  DEFAULT_COLOR_CANVAS,
  HEX_RGB_LENGTH,
  LEFT_CLICK,
  RIGHT_CLICK,
} from '../../../../services/color-picker/constant';
// tslint:disable-next-line
import { DrawingBaseParametersAccessorService } from '../../../../services/drawing-base-parameters-accessor/drawing-base-parameters-accessor.service';
import { ToolsOptionsManagerService } from '../../../../services/tool-manager/tools-options-manager/tools-options-manager.service';
import { ColorSliderComponent } from './color-slider/color-slider.component';
import { OpacityComponent } from './opacity/opacity.component';
import { PaletteSelectorComponent } from './palette-selector/palette-selector.component';

const DEFAULT_APPLY_BUTTON_COLOR = '#525252ff';

// src: https://codepen.io/amwill/pen/ZbdGeW
@Component({
  selector: 'app-color-picker',
  templateUrl: './color-picker.component.html',
  styleUrls: ['./color-picker.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ColorPickerComponent implements AfterViewInit {
  @ViewChild(ColorSliderComponent, { static: false }) colorSliderComponent: ColorSliderComponent;
  @ViewChild(OpacityComponent, { static: false }) opacitySlider: OpacityComponent;
  @ViewChild(PaletteSelectorComponent, { static: false }) paletteSelectorComponent: PaletteSelectorComponent;
  @ViewChild('canvasP', { static: false }) canvasP: ElementRef;
  @ViewChild('canvasS', { static: false }) canvasS: ElementRef;
  @ViewChild('hexInput', { static: false }) hexInput: ElementRef;

  @Input() forBackground: boolean;
  @Input() opacity: boolean;
  @Input() palette: boolean;
  @Input() colorSlider: boolean;

  readonly doubleArrows: IconDefinition;
  applyButtonColor: string;
  hexColorObs: Subscription;
  isPrimaryCanvasSelected: boolean;

  hexFormControl: FormControl = new FormControl('', [
    Validators.required,
    Validators.pattern('^#[0-9a-fA-F]{8}$'),
  ]);

  constructor(public colorPickerService: ColorPickerService,
              public toolOptionService: ToolsOptionsManagerService,
              private cdRef: ChangeDetectorRef,
              public drawingBaseParametersAccessor: DrawingBaseParametersAccessorService,
              ) {
    this.doubleArrows = faRetweet;
    this.applyButtonColor = DEFAULT_APPLY_BUTTON_COLOR;
    this.isPrimaryCanvasSelected = true;
    this.applyButtonColor = DEFAULT_APPLY_BUTTON_COLOR;
  }

  ngAfterViewInit(): void {
    this.colorPickerService.setUpService(this.canvasP.nativeElement, this.canvasS.nativeElement, this.forBackground);

    if (this.forBackground) {
      this.colorPickerService.setColor(
        ColorManipulator.RGBHexToRGBAHex(DEFAULT_COLOR_CANVAS),
        ColorPickerColor.Palette, false);
    }

    this.updateAllColorComponents();
    this.updatePrimaryAndSecondaryColors();
    this.cdRef.detectChanges();

    this.hexColorObs = this.colorPickerService.getColorUpdatedObservable().subscribe(() => {
      this.updatePrimaryAndSecondaryColors();
    });
  }

  updatePrimaryAndSecondaryColors(): void {
    let primaryColor: ColorRGBA;
    if (this.forBackground) {
      primaryColor = this.colorPickerService.getPaletteColor(false);
    } else {
      primaryColor = this.colorPickerService.getPrimaryColor(false);
    }
    this.colorPickerService.fillCanvas(
      ColorManipulator.colorRGBAToHexColor(primaryColor),
      this.canvasP.nativeElement);
    this.colorPickerService.fillCanvas(
      ColorManipulator.colorRGBAToHexColor(this.colorPickerService.getSecondaryColor(false)),
      this.canvasS.nativeElement);
  }

  updateAllColorComponents(): void {
    const colorRGBA = this.colorPickerService.getPaletteColor();
    if (this.colorSliderComponent !== undefined) {
      this.colorSliderComponent.updateGradientColor(ColorManipulator.cloneColorRGBA(colorRGBA));
    }
    this.updatePaletteSelector(true);
  }

  updatePaletteSelector(refreshCursor: boolean): void {
    const colorRGBA = this.colorPickerService.getPaletteColor();
    if (this.paletteSelectorComponent !== undefined) {
      this.paletteSelectorComponent.updateGradientColor(colorRGBA, refreshCursor);
    }
    this.updateOpacitySlider();
  }

  updateOpacitySlider(): void {
    const colorRGBA = this.colorPickerService.getPaletteColor();
    if (this.opacitySlider !== undefined) {
      this.opacitySlider.updateGradientColor(colorRGBA);
    }
  }

  updateBackground(): void {
    if (!this.hexFormControl.hasError('pattern')) {
      let backgroundColor: string;
      if (this.isPrimaryCanvasSelected) {
        backgroundColor = ColorManipulator.colorRGBAToHexColor(this.colorPickerService.getPrimaryColor(true));
      } else {
        backgroundColor = ColorManipulator.colorRGBAToHexColor(this.colorPickerService.getSecondaryColor(true));
      }
      backgroundColor = backgroundColor.toLowerCase().substring(0, HEX_RGB_LENGTH);
      this.drawingBaseParametersAccessor.changeBackgroundColour(backgroundColor);
    }
  }

  onApplyButton(): void {
    const colorToApply = this.colorPickerService.getPaletteColor();
    if (this.isPrimaryCanvasSelected) {
      this.colorPickerService.setColorRGBA(colorToApply, ColorPickerColor.Primary, false);
    } else {
      this.colorPickerService.setColorRGBA(colorToApply, ColorPickerColor.Secondary, false);
    }
    this.applyButtonColor = DEFAULT_APPLY_BUTTON_COLOR;
    this.colorPickerService.applyColorOption();
    this.updatePrimaryAndSecondaryColors();
  }

  switchColor(): void {
    this.colorPickerService.switchColor();
  }

  onHexKeyDown(event: KeyboardEvent): void {
    const hexIsValid = !this.hexFormControl.hasError('required') && !this.hexFormControl.hasError('pattern');
    if (hexIsValid) {
      if (event.key === 'Enter') {
        this.colorPickerService.setColor(this.colorPickerService.hexColor, ColorPickerColor.Palette, true);
        if (this.isPrimaryCanvasSelected && !this.forBackground) {
          this.colorPickerService.setColor(this.colorPickerService.hexColor, ColorPickerColor.Primary, true);
          this.colorPickerService.setOpacityFromRGBA(
            ColorManipulator.hexColorToColorRGBA(this.colorPickerService.hexColor), ColorPickerColor.Secondary);
        } else if (!this.isPrimaryCanvasSelected) {
          this.colorPickerService.setColor(this.colorPickerService.hexColor, ColorPickerColor.Secondary, true);
          this.colorPickerService.setOpacityFromRGBA(
            ColorManipulator.hexColorToColorRGBA(this.colorPickerService.hexColor), ColorPickerColor.Primary);
        }
        this.applyButtonColor = DEFAULT_APPLY_BUTTON_COLOR;
        this.colorPickerService.applyColorOption();
        this.updateAllColorComponents();
      }
    }
  }

  getRGBA(colorRGBA: ColorRGBA): string {
    return ColorManipulator.colorRGBAToRGBAString(colorRGBA);
  }

  getReversedColors(testEmpty: boolean = false): ColorRGBA[] {
    if (this.colorPickerService.colorUsed === undefined || testEmpty) {
      return [];
    }
    return this.colorPickerService.colorUsed.slice().reverse();
  }

  updateColorRGB(event: ColorRGBA): void {
    let color = DEFAULT_BLUE_RGBA;
    if (this.paletteSelectorComponent !== undefined) {
      this.paletteSelectorComponent.updateGradientColor(event, false);
      color = this.paletteSelectorComponent.getColor();
    }
    this.colorPickerService.setColorRGBA(color, ColorPickerColor.Palette, false);
    this.applyButtonColor = ColorManipulator.colorRGBAToHexColor(this.colorPickerService.getPaletteColor(true));
    this.updatePaletteSelector(false);
  }

  updateHue(event: ColorRGBA): void {
    this.colorPickerService.setColorRGBA(event, ColorPickerColor.Palette, false);
    this.applyButtonColor = ColorManipulator.colorRGBAToHexColor(this.colorPickerService.getPaletteColor(true));
    this.updateOpacitySlider();
  }

  updateOpacity(event: number): void {
    this.colorPickerService.setOpacity(event, ColorPickerColor.Palette);
    this.colorPickerService.setOpacity(event, ColorPickerColor.Primary);
    this.colorPickerService.setOpacity(event, ColorPickerColor.Secondary);
  }

  colorIsDefined(color: ColorRGBA): boolean {
    return !(color.blue === undefined
      || color.green === undefined
      || color.red === undefined
      || color.opacity === undefined);
  }

  onMouseDown(event: MouseEvent, color: ColorRGBA): boolean {
    if (!this.colorIsDefined(color)) {
      return false;
    }
    this.colorPickerService.setColor(ColorManipulator.colorRGBAToHexColor(color), ColorPickerColor.Palette, false);
    if (event.button === LEFT_CLICK) {
      this.isPrimaryCanvasSelected = true;
      this.colorPickerService.setColor(ColorManipulator.colorRGBAToHexColor(color), ColorPickerColor.Primary, false);
    } else if (event.button === RIGHT_CLICK) {
      this.isPrimaryCanvasSelected = false;
      this.colorPickerService.setColor(ColorManipulator.colorRGBAToHexColor(color), ColorPickerColor.Secondary, false);
    }
    this.applyButtonColor = DEFAULT_APPLY_BUTTON_COLOR;
    this.updateAllColorComponents();
    return true;
  }
}
