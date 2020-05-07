import { ElementRef, Injectable } from '@angular/core';
import { ColorManipulator } from '../color-manipulator/color-manipulator';
import {
    BAR_PALETTE_WIDTH,
    CANVAS_STARTING_POSITION,
    ColorRGBA,
    FIRST_COLOR_STOP,
    PALETTE_SIZE,
    SECOND_COLOR_STOP,
    SQUARE_SELECTOR_HEIGHT,
    SQUARE_SELECTOR_WIDTH,
    WHITE,
} from '../constant';

@Injectable({
  providedIn: 'root',
})
export class OpacityService {

  context: CanvasRenderingContext2D;
  canvas: ElementRef;
  colorRGBA: ColorRGBA;
  position: number;

  setUpService(context: CanvasRenderingContext2D, canvas: ElementRef): void {
    this.context = context;
    this.canvas = canvas;
    this.colorRGBA = {red: 66, green: 133, blue: 244, opacity: 1 } as ColorRGBA;
    this.position = CANVAS_STARTING_POSITION + SQUARE_SELECTOR_WIDTH;
  }

  refresh(recalculatePosition: boolean = false): void {
    if (recalculatePosition) {
      this.setPositionFromOpacity(this.colorRGBA.opacity);
    }
    this.drawBackground();
    this.drawSlider();
  }

  private drawBackground(): void {
    this.context.clearRect(CANVAS_STARTING_POSITION, CANVAS_STARTING_POSITION, BAR_PALETTE_WIDTH, PALETTE_SIZE);
    const colorGradient = this.context.createLinearGradient(CANVAS_STARTING_POSITION, CANVAS_STARTING_POSITION,
                                                              CANVAS_STARTING_POSITION, PALETTE_SIZE);
    colorGradient.addColorStop(FIRST_COLOR_STOP, this.getRBGcolor(true));
    colorGradient.addColorStop(SECOND_COLOR_STOP, this.getRBGcolor(false));
    this.context.fillStyle = colorGradient;
    this.context.fillRect(CANVAS_STARTING_POSITION, CANVAS_STARTING_POSITION, BAR_PALETTE_WIDTH, PALETTE_SIZE);
  }

  private drawSlider(): void {
    this.context.beginPath();
    this.context.strokeStyle = WHITE;
    this.context.lineWidth = SQUARE_SELECTOR_WIDTH;
    this.context.rect(CANVAS_STARTING_POSITION, this.position - SQUARE_SELECTOR_WIDTH,
                        this.canvas.nativeElement.width, SQUARE_SELECTOR_HEIGHT);
    this.context.stroke();
    this.context.closePath();
  }

  getRBGcolor(opaque: boolean): string {
    const color = this.colorRGBA;
    color.opacity = opaque ? 1 : 0;
    return ColorManipulator.colorRGBAToRGBAString(color);
  }

  getOpacityFromPosition(y: number): number {
    return ColorManipulator.clampOpacity(1 - ( y  / PALETTE_SIZE ));
  }

  private setPositionFromOpacity(opacity: number): void {
    opacity = ColorManipulator.clampOpacity(opacity);
    this.position = PALETTE_SIZE * (1 - opacity);
  }
}
