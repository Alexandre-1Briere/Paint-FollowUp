import { Injectable } from '@angular/core';
import { ImageModel } from '../../../../../common/model/image.model';
import { DrawingAccessorService } from '../current-drawing-accessor/drawing-accessor.service';
import { ImagesManagerService } from '../images-manager/images-manager.service';
import { ImportService } from '../import/import.service';
import { SerializationService } from '../serialization/serialization.service';

@Injectable({
  providedIn: 'root',
})
export class ExportService {

  constructor(private drawingAccessorService: DrawingAccessorService,
              private importService: ImportService,
              public imagesManagerService: ImagesManagerService,
              private serializationService: SerializationService,
              ) { return; }

  createImageModel(title: string, tags: string[]): ImageModel {
    const id = this.importService.loadedImage
      ? this.importService.loadedImage.id
      : ImageModel.UNDEFINED_ID;
    return {
      id,
      title,
      tags,
      date: new Date(),
      inlineSVG: new XMLSerializer().serializeToString(this.drawingAccessorService.getCurrentDrawingElement()),
      serializedSVG: this.serializationService.StringifyCurrentDrawing(),
    } as ImageModel;
  }

  saveImage(title: string, tags: string[], saveToServer: boolean): void {
    const image = this.createImageModel(title, tags);

    if (saveToServer) {
      this.saveToServer(image);
    } else {
      this.saveToLocalStorage(image);
    }
  }

  saveToServer(image: ImageModel): void {
    this.imagesManagerService.updateImage(image);
  }

  saveToLocalStorage(image: ImageModel): void { /* TODO FOR SPRINT 3 */ }

  serverIsAvailable(): boolean {
    return this.imagesManagerService.serverIsAvailable;
  }
}
