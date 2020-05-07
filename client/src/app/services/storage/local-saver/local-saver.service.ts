import { Injectable } from '@angular/core';
import { IMAGE_DATA_TAG } from '../../../constants/drawing';
import { DrawingInformationInterface } from '../../../interfaces/drawing-information.interface';
import { SerializationService } from '../../serialization/serialization.service';
import { StorageService } from '../storage.service';

@Injectable({
  providedIn: 'root',
})
export class LocalSaverService {

  constructor(public storage: StorageService,
              public serializationService: SerializationService) { }

  saveCurrentDrawing(): void {
    const drawing = this.serializationService.StringifyCurrentDrawing();
    this.storage.add(IMAGE_DATA_TAG, drawing);
  }

  saveDrawing(drawing: DrawingInformationInterface): void {
    this.storage.add(IMAGE_DATA_TAG, JSON.stringify(drawing));
  }
}
