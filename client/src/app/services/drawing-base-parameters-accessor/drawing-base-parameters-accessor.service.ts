import { EventEmitter, Injectable } from '@angular/core';
import { DrawingBaseParameters } from '../../interfaces/drawing-base-parameters';

@Injectable({
  providedIn: 'root',
})
export class DrawingBaseParametersAccessorService {

  private baseParameters: DrawingBaseParameters;
  private readonly baseParametersChange: EventEmitter<DrawingBaseParameters>;
  private readonly backgroundColorChange: EventEmitter<string>;

  constructor() {
    this.baseParametersChange = new EventEmitter<DrawingBaseParameters>();
    this.backgroundColorChange = new EventEmitter<string>();
  }

  setDrawingBaseParameters(newWidth: number, newHeight: number, newBackgroundColor: string): void {
    this.baseParameters = { width: newWidth,
                            height: newHeight,
                            backgroundColor: newBackgroundColor,
                          } as DrawingBaseParameters;
    this.baseParametersChange.emit(this.baseParameters);
  }

  changeBackgroundColour(newBackGroundColor: string): void {
      this.baseParameters.backgroundColor = newBackGroundColor;
      this.backgroundColorChange.emit(this.baseParameters.backgroundColor);
  }

  getBaseParametersChangeEmitter(): EventEmitter<DrawingBaseParameters> {
    return this.baseParametersChange;
  }

  getBackgroundColorChangeEmitter(): EventEmitter<string> {
    return this.backgroundColorChange;
  }

  get width(): number {
    return this.baseParameters.width;
  }

  get height(): number {
    return this.baseParameters.height;
  }
}
