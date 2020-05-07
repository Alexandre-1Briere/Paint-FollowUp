import { Injectable } from '@angular/core';
import { ImageModel } from '../../../../../common/model/image.model';
import { DrawingInformationInterface } from '../../interfaces/drawing-information.interface';
import { SerializationService } from '../serialization/serialization.service';
import { LocalLoaderService } from '../storage/local-loader/local-loader.service';
import { LocalSaverService } from '../storage/local-saver/local-saver.service';

@Injectable({
  providedIn: 'root',
})

export class ImportService {

  loadedImage: ImageModel | undefined;

  constructor(private serializationService: SerializationService,
              private localLoader: LocalLoaderService,
              private localSaver: LocalSaverService) { return; }

  loadImage(image: ImageModel): void {
    this.loadedImage = image;
    this.localSaver.saveDrawing(this.serializationService.ParseDrawingInformation(image.serializedSVG) as DrawingInformationInterface);
    this.localLoader.loadDrawingToWorkspace();
  }
}
