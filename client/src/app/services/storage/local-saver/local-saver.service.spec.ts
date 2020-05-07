import { TestBed } from '@angular/core/testing';
import { SvgType } from '../../../enums/svg';
import { DrawingBaseParameters } from '../../../interfaces/drawing-base-parameters';
import { DrawingInformationInterface } from '../../../interfaces/drawing-information.interface';
import { SvgBoardJson, SvgJson } from '../../../interfaces/svg-json';
import { LocalSaverService } from './local-saver.service';

describe('LocalSaverService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LocalSaverService = TestBed.get(LocalSaverService);
    expect(service).toBeTruthy();
  });
/* NB: Quand j'ai créer un mock,tout les test arrêtent de fonctionner*/
  it('saveDrawing should call saveDrawing', () => {
    const service: LocalSaverService = TestBed.get(LocalSaverService);
    const name = 'drawing';
    const backgroundColor = 'red';
    const content = 'red';
    const width = 15;
    const height = 30;
    const id = 8;
    const etiquette: string[] = [];
    const svgType: SvgType = SvgType.SvgAerosolComponent;
    const baseParameters: DrawingBaseParameters = {
      width ,
      height,
      backgroundColor,
    } as DrawingBaseParameters ;
    const   svgJson: SvgJson  = {
      svgType,
      content,
    };
    const svgBoard: SvgJson[] = [];
    svgBoard.push(svgJson);
    const svgBoardJson = { svgBoard } as unknown as SvgBoardJson;
    const drawing: DrawingInformationInterface = {
      etiquette,
      name,
      baseParameters,
      svgBoardJson,
      id,
    } as unknown as DrawingInformationInterface ;
    const addSpy = spyOn( service.storage, 'add');
    service.saveDrawing(drawing);
    expect(addSpy).toHaveBeenCalled();
  });

  it('saveCurrentDrawing should call StringifyCurrentDrawing and saveDrawing ', () => {
    const service: LocalSaverService = TestBed.get(LocalSaverService);
    const saveCurrentDrawingSpy = spyOn( service.serializationService, 'StringifyCurrentDrawing');
    const addSpy = spyOn(service.storage, 'add');
    service.saveCurrentDrawing();
    expect(addSpy).toHaveBeenCalled();
    expect(saveCurrentDrawingSpy).toHaveBeenCalled();
  });

});
