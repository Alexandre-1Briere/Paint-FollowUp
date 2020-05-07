import { ElementRef, Injectable } from '@angular/core';
import { Point } from '../../../interfaces/point';
import { ColorManipulator } from '../color-manipulator/color-manipulator';
import {
    BLACK,
    BLACK_CLEAR,
    BLACK_OPAQUE,
    CANVAS_STARTING_POSITION,
    ColorRGBA,
    FIRST_COLOR_STOP,
    MAX_ANGLE,
    MAX_HEX_VALUE,
    MIN_ANGLE,
    PALETTE_SIZE,
    PIXEL_SIZE,
    SECOND_COLOR_STOP,
    SELECTOR_RADIUS,
    SELECTOR_WIDTH,
    WHITE,
    WHITE_CLEAR,
    WHITE_OPAQUE,
} from '../constant';

@Injectable({
  providedIn: 'root',
})
export class PaletteSelectorService {

  canvas: ElementRef;
  context: CanvasRenderingContext2D;
  position: Point;
  gradientColorRGBA: ColorRGBA;
  drawingColorRGBA: ColorRGBA;

  constructor() {
    this.position = {x: PALETTE_SIZE - 1, y: 0};
  }

  setUpService(context: CanvasRenderingContext2D, canvas: ElementRef): void {
    this.context = context;
    this.canvas = canvas;
    const primaryColor = {red: 66 , green: 133, blue: 244, opacity: 1 } as ColorRGBA;
    this.setGradientFrom(primaryColor, false);
    this.drawingColorRGBA = primaryColor;
  }

  refresh(recalculatePosition: boolean = false): void {
    if (recalculatePosition) {
      this.calculatePositionBasedOnColor();
    }
    this.drawBackground();
    this.drawSelector();
  }

  private drawBackground(): void {
    this.context.fillStyle = ColorManipulator.colorRGBAToRGBAString(this.gradientColorRGBA);
    this.context.fillRect(CANVAS_STARTING_POSITION, CANVAS_STARTING_POSITION, PALETTE_SIZE, PALETTE_SIZE);
    const whiteGradient = this.context.createLinearGradient(CANVAS_STARTING_POSITION, CANVAS_STARTING_POSITION, PALETTE_SIZE, 0);
    whiteGradient.addColorStop(FIRST_COLOR_STOP, WHITE_OPAQUE);
    whiteGradient.addColorStop(SECOND_COLOR_STOP, WHITE_CLEAR);
    this.context.fillStyle = whiteGradient;
    this.context.fillRect(CANVAS_STARTING_POSITION, CANVAS_STARTING_POSITION, PALETTE_SIZE, PALETTE_SIZE);
    const blackGradient = this.context.createLinearGradient(CANVAS_STARTING_POSITION, CANVAS_STARTING_POSITION,
                                                              CANVAS_STARTING_POSITION, PALETTE_SIZE);
    blackGradient.addColorStop(FIRST_COLOR_STOP, BLACK_CLEAR);
    blackGradient.addColorStop(SECOND_COLOR_STOP, BLACK_OPAQUE);
    this.context.fillStyle = blackGradient;
    this.context.fillRect(CANVAS_STARTING_POSITION, CANVAS_STARTING_POSITION, PALETTE_SIZE, PALETTE_SIZE);
  }

  private drawSelector(): void {
    this.context.beginPath();
    this.context.strokeStyle = BLACK;
    this.context.lineWidth = SELECTOR_WIDTH + 1;
    this.context.arc(this.position.x, this.position.y, SELECTOR_RADIUS, MIN_ANGLE, MAX_ANGLE);
    this.context.stroke();
    this.context.strokeStyle = WHITE;
    this.context.lineWidth = SELECTOR_WIDTH;
    this.context.arc(this.position.x, this.position.y, SELECTOR_RADIUS, MIN_ANGLE, MAX_ANGLE);
    this.context.stroke();
    this.context.closePath();
  }

  setGradientFrom(color: ColorRGBA, moveCursor: boolean): void {
    this.gradientColorRGBA = ColorManipulator.getPureColor(color);
    if (moveCursor) {
      this.drawingColorRGBA = color;
      this.refresh(true);
    } else {
      this.refresh(false);
      this.updateColor();
    }
  }

  updateColor(): ColorRGBA {
    const imageData = this.context.getImageData(this.position.x, this.position.y, PIXEL_SIZE, PIXEL_SIZE).data;
    const OPACITY_INDEX = 3;
    const color: ColorRGBA = {
      red: imageData[0],
      green: imageData[1],
      blue: imageData[2],
      opacity: imageData[OPACITY_INDEX] / MAX_HEX_VALUE,
    } as ColorRGBA;
    this.drawingColorRGBA = color;
    return color;
  }

  updatePosition(x: number, y: number): void {
    this.position.y = y;
    this.position.x = x;
  }

  private calculatePositionBasedOnColor(): void {
    const LIGHT_VALUE = this.maxColorIntensity(this.drawingColorRGBA) / this.maxColorIntensity(this.gradientColorRGBA);
    this.position.y = PALETTE_SIZE * (1 - LIGHT_VALUE);

    const LIMIT = 0.001;
    if (LIGHT_VALUE >= LIMIT) {
      const INTENSITY_VALUE = this.minColorIntensity(this.drawingColorRGBA) /
          (LIGHT_VALUE * this.maxColorIntensity(this.gradientColorRGBA));

      this.position.x = PALETTE_SIZE * (1 - INTENSITY_VALUE);
    } else {
      this.position.x = 0;
    }
  }

  private maxColorIntensity(color: ColorRGBA): number {
    return Math.max(color.red, color.green, color.blue);
  }

  private minColorIntensity(color: ColorRGBA): number {
    return Math.min(color.red, color.green, color.blue);
  }
}
