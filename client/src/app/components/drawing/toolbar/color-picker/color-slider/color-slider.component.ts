import { AfterViewInit, Component, ElementRef, EventEmitter, HostListener, Output, ViewChild } from '@angular/core';
import { BAR_PALETTE_WIDTH, ColorRGBA, PALETTE_SIZE } from 'src/app/services/color-picker/constant';
import { ColorSliderService } from '../../../../../services/color-picker/color-slider/color-slider.service';
import { TWO_D_CANVAS } from '../../../../../services/color-picker/constant';

@Component({
  selector: 'app-color-slider',
  templateUrl: './color-slider.component.html',
  styleUrls: ['./color-slider.component.scss'],
})
export class ColorSliderComponent implements AfterViewInit {

  @ViewChild('canvas', {static: false}) canvas: ElementRef;
  mouseDown: boolean;
  @Output() colorRGBChange: EventEmitter<ColorRGBA> = new EventEmitter<ColorRGBA>();

  constructor(public colorSliderService: ColorSliderService) {
    this.mouseDown = false;
  }

  ngAfterViewInit(): void {
    this.colorSliderService.setUpService(this.canvas, this.canvas.nativeElement.getContext(TWO_D_CANVAS));
    this.colorSliderService.refresh(true);
  }

  updateGradientColor(colorRGBA: ColorRGBA): void {
    this.colorSliderService.refresh(true, colorRGBA);
    // this.updateColor();
  }

  onMouseDown(event: MouseEvent): void {
    this.mouseDown = true;
    this.colorSliderService.position.y = event.offsetY;
    this.colorSliderService.refresh();
    this.updateColor();
  }

  @HostListener('window:mouseup', ['$event'])
  onMouseUp(): void {
    this.mouseDown = false;
  }

  @HostListener('window:mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    if (this.mouseDown) {
      this.colorSliderService.position.x = this.pixelPickedX(event);
      this.colorSliderService.position.y = this.pixelPickedY(event);
      this.colorSliderService.refresh();
      this.updateColor();
    }
  }

  pixelPickedX(event: MouseEvent): number {
    let halfWidth = BAR_PALETTE_WIDTH / 2;
    if (this.canvas !== undefined && this.canvas.nativeElement !== undefined) {
      halfWidth = this.canvas.nativeElement.width / 2;
    }
    return halfWidth;
  }

  pixelPickedY(event: MouseEvent): number {
    let y = this.findVerticalPosition(event);
    const MIN_Y = 0;
    let maxY = PALETTE_SIZE - 1;
    if (this.canvas !== undefined && this.canvas.nativeElement !== undefined) {
      maxY = this.canvas.nativeElement.height - 1;
    }
    y = Math.min(Math.max(MIN_Y, y), maxY);
    return y;
  }

  private findVerticalPosition(mouseEvent: MouseEvent): number {
    if (this.canvas !== undefined && this.canvas.nativeElement !== undefined) {
      const boundingRect = this.canvas.nativeElement.getBoundingClientRect();
      const adjustRatio = this.canvas.nativeElement.height / boundingRect.height;

      return adjustRatio * (mouseEvent.clientY - boundingRect.y);
    } else {
      return mouseEvent.offsetY;
    }
  }

  private updateColor(): void {
    const color = this.colorSliderService.getColor();
    this.colorRGBChange.emit(color);
  }
}
