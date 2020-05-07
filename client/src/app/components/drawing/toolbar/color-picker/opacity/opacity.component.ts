import { AfterViewInit, Component, ElementRef, EventEmitter, HostListener, Output, ViewChild } from '@angular/core';
import { ColorRGBA, PALETTE_SIZE } from 'src/app/services/color-picker/constant';
import { TWO_D_CANVAS } from '../../../../../services/color-picker/constant';
import { OpacityService } from '../../../../../services/color-picker/opacity/opacity.service';

@Component({
  selector: 'app-opacity-slider',
  templateUrl: './opacity.component.html',
  styleUrls: ['./opacity.component.scss'],
})
export class OpacityComponent implements AfterViewInit {

  @ViewChild('canvas', {static: false}) canvas: ElementRef;
  mouseDown: boolean;
  @Output() opacityChange: EventEmitter<number> = new EventEmitter<number>();

  constructor(public opacityService: OpacityService) {
    this.mouseDown = false;
  }

  ngAfterViewInit(): void {
    this.opacityService.setUpService(this.canvas.nativeElement.getContext(TWO_D_CANVAS), this.canvas);
    this.opacityService.refresh();
  }

  updateGradientColor(colorRGBA: ColorRGBA): void {
    this.opacityService.colorRGBA = colorRGBA;
    this.opacityService.refresh(true);
  }

  onMouseDown(event: MouseEvent): void {
    this.mouseDown = true;
    this.opacityService.position = event.offsetY;
    this.opacityService.refresh();
    this.updateOpacity(event.offsetY);
  }

  @HostListener('window:mouseup', ['$event'])
  onMouseUp(): void {
    this.mouseDown = false;
  }

  @HostListener('window:mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    if (this.mouseDown) {
      this.setPosition(event);
      this.opacityService.refresh();
      this.updateOpacity(this.opacityService.position);
    }
  }

  private setPosition(mouseEvent: MouseEvent): void {
    let newY = mouseEvent.offsetY;

    if (this.canvas !== undefined && this.canvas.nativeElement !== undefined) {
      const boundingRect = this.canvas.nativeElement.getBoundingClientRect();
      const adjustRatio = this.canvas.nativeElement.height / boundingRect.height;

      newY = adjustRatio * (mouseEvent.clientY - boundingRect.y);
    }

    newY = this.clampPosition(newY);

    this.opacityService.position = newY;
  }

  private updateOpacity(y: number): void {
    const opacity = this.opacityService.getOpacityFromPosition(y);
    this.opacityChange.emit(opacity);
  }

  private clampPosition(position: number): number {
    return Math.min(Math.max(0, position), PALETTE_SIZE);
  }
}
