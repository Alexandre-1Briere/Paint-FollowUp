import { AfterViewInit, Component, ElementRef, EventEmitter, HostListener, Output, ViewChild } from '@angular/core';
import { ColorRGBA, PALETTE_SIZE } from 'src/app/services/color-picker/constant';
import { ColorManipulator } from '../../../../../services/color-picker/color-manipulator/color-manipulator';
import { TWO_D_CANVAS } from '../../../../../services/color-picker/constant';
import { PaletteSelectorService } from '../../../../../services/color-picker/palette-selector/palette-selector.service';

@Component({
  selector: 'app-palette-selector',
  templateUrl: './palette-selector.component.html',
  styleUrls: ['./palette-selector.component.scss'],
})
export class PaletteSelectorComponent implements AfterViewInit {

  @ViewChild('canvas', {static: false}) canvas: ElementRef;
  mouseDown: boolean;
  @Output() hueChange: EventEmitter<ColorRGBA> = new EventEmitter<ColorRGBA>();

  constructor(public paletteSelectorService: PaletteSelectorService) {
    this.mouseDown = false;
  }

  ngAfterViewInit(): void {
    this.paletteSelectorService.setUpService(this.canvas.nativeElement.getContext(TWO_D_CANVAS), this.canvas);
    this.paletteSelectorService.refresh();
  }

  onMouseDown(event: MouseEvent): void {
    this.mouseDown = true;
    this.paletteSelectorService.updatePosition(event.offsetX, event.offsetY);
    this.updateDrawingColor();
  }

  @HostListener('window:mouseup', ['$event'])
  onMouseUp(): void {
    this.mouseDown = false;
  }

  @HostListener('window:mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    if (this.mouseDown) {
      this.setPosition(event);
      this.updateDrawingColor();
    }
  }

  updateGradientColor(colorRGBA: ColorRGBA, moveCursor: boolean= true): void {
    this.paletteSelectorService.setGradientFrom(colorRGBA, moveCursor);
  }

  getColor(): ColorRGBA {
    return ColorManipulator.cloneColorRGBA(this.paletteSelectorService.drawingColorRGBA);
  }

  updateDrawingColor(): void {
    this.paletteSelectorService.refresh();
    this.hueChange.emit(this.paletteSelectorService.updateColor());
  }

  private setPosition(mouseEvent: MouseEvent): void {
    const newPosition = {
      x: mouseEvent.offsetX,
      y: mouseEvent.offsetY,
    };
    if (this.canvas !== undefined && this.canvas.nativeElement !== undefined) {
      const boundingRect = this.canvas.nativeElement.getBoundingClientRect();
      const adjustRatio = this.canvas.nativeElement.height / boundingRect.height;

      newPosition.x = adjustRatio * (mouseEvent.clientX - boundingRect.x);
      newPosition.y = adjustRatio * (mouseEvent.clientY - boundingRect.y);
    }

    newPosition.x = this.clampPosition(newPosition.x);
    newPosition.y = this.clampPosition(newPosition.y);

    this.paletteSelectorService.position = newPosition;
  }

  private clampPosition(position: number): number {
    return Math.min(Math.max(0, position), PALETTE_SIZE - 1);
  }
}
