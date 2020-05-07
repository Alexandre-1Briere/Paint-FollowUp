import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

import { MouseEventData, MouseLocation } from '../../logic/events/mouse/mouse-event-data';
import { MouseUtilities } from '../../logic/events/mouse/mouse-utilities';

const DEFAULT_POSITION = 0;

@Injectable({
  providedIn: 'root',
})
export class MouseDrawingInputsService {
  drawingBoardTopLeftX: number;
  drawingBoardTopLeftY: number;

  private mouseEventData: MouseEventData;
  private mouseOutput: Subject<MouseEventData>;

  constructor() {
    this.drawingBoardTopLeftX = DEFAULT_POSITION;
    this.drawingBoardTopLeftY = DEFAULT_POSITION;

    this.mouseEventData = new MouseEventData();
    this.mouseOutput = new Subject();
  }

  receiveMouseAction(event: MouseEvent, fromDrawingBoard: boolean = true): void {

    MouseUtilities.updateMouseLocation(event, this.mouseEventData);
    if (fromDrawingBoard || this.mouseEventData.location === MouseLocation.Outside) {
      this.calculateMousePosition(event, fromDrawingBoard);
    }

    MouseUtilities.updateMouseButtons(event, this.mouseEventData);

    this.mouseEventData.movement = MouseUtilities.mouseMovement(event);
    this.mouseEventData.wheel = MouseUtilities.mouseWheelState(event);

    this.sendMouseOutputObs();
  }

  getMouseOutputObs(): Observable<MouseEventData> {
    return this.mouseOutput.asObservable();
  }

  getMouseOutput(): MouseEventData {
    return this.mouseEventData.clone();
  }

  private sendMouseOutputObs(): void {
    this.mouseOutput.next(this.getMouseOutput());
  }

  private calculateMousePosition(event: MouseEvent, fromDrawingBoard: boolean): void {
    if (!fromDrawingBoard) {
      this.mouseEventData.x = event.clientX - this.drawingBoardTopLeftX;
      this.mouseEventData.y = event.clientY - this.drawingBoardTopLeftY;
    } else {
      this.mouseEventData.x = event.offsetX;
      this.mouseEventData.y = event.offsetY;
    }
  }
}
