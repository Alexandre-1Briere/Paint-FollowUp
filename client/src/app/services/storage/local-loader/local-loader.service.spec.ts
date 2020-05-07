import { TestBed } from '@angular/core/testing';
import { ERROR } from '../../../../../../common/constant/client/service/cookies/constant';
import { StorageService } from '../storage.service';
import { LocalLoaderService } from './local-loader.service';

let data: string = ERROR;
const mockStorage = {
    get: () => data,
};

describe('LocalLoaderService', () => {
    let service: LocalLoaderService;

    beforeEach(() => TestBed.configureTestingModule({
        providers: [
            { provide: StorageService, useValue: mockStorage },
        ],
    }));
    beforeEach(() => {
        service = TestBed.get(LocalLoaderService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('loadDrawingToWorkspace should not call any function when dataString is undefined', () => {
        data = ERROR;
        const loadSavedDrawingSpy = spyOn(service.serializationService, 'loadDrawingToWorkspace').and.callThrough();
        const setDrawingBaseParametersSpy = spyOn(service.drawingBaseParametersAccessor, 'setDrawingBaseParameters').and.callThrough();
        service.loadDrawingToWorkspace();
        expect(loadSavedDrawingSpy).not.toHaveBeenCalled();
        expect(setDrawingBaseParametersSpy).not.toHaveBeenCalled();
    });
    it('loadDrawingToWorkspace should call functions when dataString is defined', () => {
        data = JSON.stringify({
            undoStack: [],
            redoStack: [],
            etiquette: [],
            name: 'test',
            baseParameters: {
                width: 500,
                height: 500,
                backgroundColor: '#ffffff',
            },
            svgBoard: {
                components: [],
            },
            id: 0,
        });
        const loadSavedDrawingSpy = spyOn(service.serializationService, 'loadDrawingToWorkspace').and.callThrough();
        const setDrawingBaseParametersSpy = spyOn(service.drawingBaseParametersAccessor, 'setDrawingBaseParameters').and.callThrough();
        service.loadDrawingToWorkspace();
        expect(loadSavedDrawingSpy).toHaveBeenCalled();
        expect(setDrawingBaseParametersSpy).toHaveBeenCalled();
    });
});
