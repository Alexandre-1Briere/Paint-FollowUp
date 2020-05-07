import { Injectable } from '@angular/core';
import { ERROR } from '../../../../../../common/constant/client/service/cookies/constant';
import { IMAGE_DATA_TAG } from '../../../constants/drawing';
import { DrawingBaseParameters } from '../../../interfaces/drawing-base-parameters';
import { DrawingInformationInterface } from '../../../interfaces/drawing-information.interface';
import { DrawingBaseParametersAccessorService } from '../../drawing-base-parameters-accessor/drawing-base-parameters-accessor.service';
import { SerializationService } from '../../serialization/serialization.service';
import { StorageService } from '../storage.service';

@Injectable({
  providedIn: 'root',
})
export class LocalLoaderService {

  constructor(public storage: StorageService,
              public serializationService: SerializationService,
              public drawingBaseParametersAccessor: DrawingBaseParametersAccessorService) { }

  loadDrawingToWorkspace(): void {
    const dataString = this.storage.get(IMAGE_DATA_TAG);
    if (dataString !== ERROR) {
      const parsedData = JSON.parse(dataString) as DrawingInformationInterface;
      this.serializationService.loadDrawingToWorkspace(parsedData);
      const baseParameters = parsedData.baseParameters;
      this.drawingBaseParametersAccessor.setDrawingBaseParameters(baseParameters.width,
                                                                  baseParameters.height,
                                                                  baseParameters.backgroundColor);
    }
  }

  getBaseParameters(): DrawingBaseParameters | undefined {
    const dataString = this.storage.get(IMAGE_DATA_TAG);
    if (dataString !== ERROR) {
      const parsedData = JSON.parse(dataString) as DrawingInformationInterface;
      return parsedData.baseParameters;
    }

    return undefined;
  }
}
