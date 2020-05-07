import { ElementRef, Injectable } from '@angular/core';
import { Point } from 'src/app/interfaces/point';
import { ColorManipulator } from '../color-manipulator/color-manipulator';
import {
    AQUA_OPAQUE,
    AQUA_POSITION,
    BAR_PALETTE_WIDTH,
    BLUE_OPAQUE,
    BLUE_POSITION,
    CANVAS_STARTING_POSITION,
    ColorRGBA,
    END_GRADIENT_POSITION,
    FUCHSIA_OPAQUE,
    FUCHSIA_POSITION,
    GREEN_OPAQUE,
    GREEN_POSITION,
    MAX_HEX_VALUE,
    PALETTE_SIZE,
    PIXEL_SIZE,
    RED_OPAQUE,
    RED_POSITION,
    SQUARE_SELECTOR_HEIGHT,
    SQUARE_SELECTOR_WIDTH,
    WHITE,
    WHITE_COLOR,
    YELLOW_OPAQUE,
    YELLOW_POSITION,
} from '../constant';

export const SLIDER_HEIGHT_OF_DEFAULT_BLUE = 118;
const NUMBER_PURE_COLORS = 3;

@Injectable({
  providedIn: 'root',
})
export class ColorSliderService {

  canvas: ElementRef;
  context: CanvasRenderingContext2D;
  private colorRGBA: ColorRGBA;
  position: Point;

  constructor() {
    this.position = {x: BAR_PALETTE_WIDTH / 2, y: SLIDER_HEIGHT_OF_DEFAULT_BLUE};
    this.colorRGBA = ColorManipulator.cloneColorRGBA(WHITE_COLOR);
  }

  setUpService(canvas: ElementRef, context: CanvasRenderingContext2D): void {
    this.canvas = canvas;
    this.context = context;
  }

  refresh(recalculatePosition: boolean = false, newColor?: ColorRGBA): void {
    if (newColor !== undefined) {
      this.setColor(newColor);
    }
    if (recalculatePosition) {
      this.setPositionFromColor(this.colorRGBA);
    }
    this.drawBackground();
    this.drawSlider();
  }

  private drawBackground(): void {
    const gradient = this.context.createLinearGradient(CANVAS_STARTING_POSITION, CANVAS_STARTING_POSITION,
                                                          CANVAS_STARTING_POSITION, PALETTE_SIZE);
    gradient.addColorStop(RED_POSITION, RED_OPAQUE);
    gradient.addColorStop(YELLOW_POSITION, YELLOW_OPAQUE);
    gradient.addColorStop(GREEN_POSITION, GREEN_OPAQUE);
    gradient.addColorStop(AQUA_POSITION, AQUA_OPAQUE);
    gradient.addColorStop(BLUE_POSITION, BLUE_OPAQUE);
    gradient.addColorStop(FUCHSIA_POSITION, FUCHSIA_OPAQUE);
    gradient.addColorStop(END_GRADIENT_POSITION, RED_OPAQUE);
    this.context.fillStyle = gradient;
    this.context.fillRect(CANVAS_STARTING_POSITION, CANVAS_STARTING_POSITION,
                              BAR_PALETTE_WIDTH, PALETTE_SIZE);
  }

  private drawSlider(): void {
    this.context.beginPath();
    this.context.strokeStyle = WHITE;
    this.context.lineWidth = SQUARE_SELECTOR_WIDTH;
    this.context.rect(CANVAS_STARTING_POSITION, this.position.y - SQUARE_SELECTOR_WIDTH,
                          this.canvas.nativeElement.width, SQUARE_SELECTOR_HEIGHT);
    this.context.stroke();
    this.context.closePath();
  }

  getColor(): ColorRGBA {
    const imageData = this.context.getImageData(this.position.x, this.position.y, PIXEL_SIZE, PIXEL_SIZE).data;
    const OPACITY_INDEX = 3;
    this.colorRGBA = {
      red: imageData[0],
      green: imageData[1],
      blue: imageData[2],
      opacity: imageData[OPACITY_INDEX] / MAX_HEX_VALUE,
    };
    return ColorManipulator.cloneColorRGBA(this.colorRGBA);
  }

  setPositionFromColor(color: ColorRGBA): void {
    if (!ColorManipulator.validateColorRGBA(color)) { return; }
    this.setColor(color);
    this.position.y = this.findVerticalPosition(this.colorRGBA) * PALETTE_SIZE;
  }

  private setColor(color: ColorRGBA): void {
    this.colorRGBA = {
      red: color.red,
      green: color.green,
      blue: color.blue,
      opacity: color.opacity,
    };
  }

  private findVerticalPosition(color: ColorRGBA): number {
    let colorBasePosition: number;
    if (color.red >= color.green && color.red >= color.blue) {
      colorBasePosition = 0;
      colorBasePosition += this.relativePositionOffset(color.green, color.blue, color.red);
    } else if (color.green >= color.red && color.green >= color.blue) {
      colorBasePosition = 1 / NUMBER_PURE_COLORS;
      colorBasePosition += this.relativePositionOffset(color.blue, color.red, color.green);
    } else {
      colorBasePosition = 2 / NUMBER_PURE_COLORS;
      colorBasePosition += this.relativePositionOffset(color.red, color.green, color.blue);
    }

    if (colorBasePosition < 0) {
      colorBasePosition += 1;
    } else if (colorBasePosition > 1) {
      colorBasePosition -= 1;
    }

    return colorBasePosition;
  }

  private relativePositionOffset(firstColorIntensity: number,
                                 secondColorIntensity: number,
                                 pureColorIntensity: number): number {
    if (pureColorIntensity === 0 || pureColorIntensity - Math.min(firstColorIntensity, secondColorIntensity) === 0) {
      return 0;
    } else if (firstColorIntensity >= secondColorIntensity) {
      return ((firstColorIntensity - secondColorIntensity) / (pureColorIntensity - secondColorIntensity))
        / (NUMBER_PURE_COLORS * 2);
    } else {
      return -((secondColorIntensity - firstColorIntensity) / (pureColorIntensity - firstColorIntensity))
        / (NUMBER_PURE_COLORS * 2);
    }
  }
}
