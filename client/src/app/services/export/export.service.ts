import { Injectable } from '@angular/core';
import { ImageModel } from '../../../../../common/model/image.model';
import { DrawingAccessorService } from '../current-drawing-accessor/drawing-accessor.service';
import { SerializationService } from '../serialization/serialization.service';

@Injectable({
  providedIn: 'root',
})
export class ExportService {

  constructor(private drawingAccessorService: DrawingAccessorService,
              private serializationService: SerializationService,
              ) { return; }

  createImageModel(title: string, tags: string[]): ImageModel {
    const id = ImageModel.UNDEFINED_ID;
    return {
      id,
      title,
      tags,
      date: new Date(),
      inlineSVG: new XMLSerializer().serializeToString(this.drawingAccessorService.getCurrentDrawingElement()),
      serializedSVG: this.serializationService.StringifyCurrentDrawing(),
    } as ImageModel;
  }
}
