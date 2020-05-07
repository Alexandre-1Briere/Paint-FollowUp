import { Injectable } from '@angular/core';
import { DrawingInformationInterface } from '../../interfaces/drawing-information.interface';
import { DrawingBaseParametersAccessorService } from '../drawing-base-parameters-accessor/drawing-base-parameters-accessor.service';
import { SvgComponentsManagerService } from '../svg/svg-components-manager.service';
import {SvgUndoRedoService} from '../undo-redo/svg-undo-redo.service';

@Injectable({
  providedIn: 'root',
})
export class SerializationService {
  id: number;

  constructor(public svgManagerService: SvgComponentsManagerService,
              public undoRedoService: SvgUndoRedoService,
              public drawingBaseParametersAccessor: DrawingBaseParametersAccessorService) {
    this.id = 0;
  }

  ParseDrawingInformation(object: string): DrawingInformationInterface {
    return JSON.parse(object);
  }

  StringifyCurrentDrawing(id?: number): string {
    const data = {
      baseParameters: this.svgManagerService.drawingBaseParameters,
      svgBoard: this.svgManagerService.getSvgBoard(),
    };
    return JSON.stringify(data);
  }

  loadDrawingToWorkspace(data: DrawingInformationInterface): void {
    this.svgManagerService.loadSvgBoard(data.svgBoard);
    this.undoRedoService.loadStacks({undoStack: [data.svgBoard], redoStack: []});
    this.drawingBaseParametersAccessor
        .setDrawingBaseParameters(data.baseParameters.width,
                                  data.baseParameters.height,
                                  data.baseParameters.backgroundColor);
  }
}
