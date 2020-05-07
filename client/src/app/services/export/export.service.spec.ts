import {ComponentFixture, TestBed} from '@angular/core/testing';

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ImageModel } from '../../../../../common/model/image.model';
import {AppModule} from '../../app.module';
import {DrawingBoardComponent} from '../../components/drawing/work-board/drawing-board/drawing-board.component';
import {TestSpeedUpgrader} from '../../testHelpers/test-speed-upgrader.spec';
import {DrawingAccessorService} from '../current-drawing-accessor/drawing-accessor.service';
import {SvgComponentsManagerService} from '../svg/svg-components-manager.service';
import {ToolsOptionsManagerService} from '../tool-manager/tools-options-manager/tools-options-manager.service';
import {Tool} from '../tool-manager/tools/tool/tool';
import {SvgUndoRedoService} from '../undo-redo/svg-undo-redo.service';
import {ExportService} from './export.service';

describe('ExportService', () => {
  let service: ExportService;
  let boardFixture: ComponentFixture<DrawingBoardComponent>;
  let drawingBoard: DrawingBoardComponent;

  TestSpeedUpgrader.overWriteModuleResetForSpeedGain();

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        AppModule,
        HttpClientTestingModule,
      ],
    });

    Tool.SVG_COMPONENT_MANAGER = TestBed.get(SvgComponentsManagerService);
    Tool.CANVAS_SERVICE = TestBed.get(DrawingAccessorService);
    Tool.TOOL_OPTIONS_MANAGER = TestBed.get(ToolsOptionsManagerService);
    Tool.UNDO_REDO_SERVICE = TestBed.get(SvgUndoRedoService);

    boardFixture = TestBed.createComponent(DrawingBoardComponent);
    drawingBoard = boardFixture.componentInstance;
    Tool.SVG_COMPONENT_MANAGER.initialiseViewContainerRef(drawingBoard.rootSvg);
    boardFixture.detectChanges();
    Tool.CANVAS_SERVICE.setTrackedDrawingRef(drawingBoard.svgElement);
    drawingBoard.ngOnInit();

    service = TestBed.get(ExportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('#createImageModel() should return a new object', () => {
    const imageModel = service.createImageModel('testTitle', ['testTag1', 'testTag2']);
    expect(imageModel).toBeTruthy();
  });

  it('#createImageModel() returns some ID when image is loaded', () => {
    const IMPORT_SERVICE = 'importService';
    service[IMPORT_SERVICE].loadedImage = new ImageModel();
    const imageModel = service.createImageModel('testTitle', ['testTag1', 'testTag2']);
    expect(imageModel.id).not.toBe(ImageModel.UNDEFINED_ID);
  });

  it('#createImageModel() returns ImageModel.UNDEFINED_ID when image is not loaded', () => {
    const imageModel = service.createImageModel('testTitle', ['testTag1', 'testTag2']);
    expect(imageModel.id).toBe(ImageModel.UNDEFINED_ID);
  });

  it('#saveToServer() should call updateImage()', () => {
    const IMAGES_MANAGER_SERVICE = 'imagesManagerService';
    const spy = spyOn(service[IMAGES_MANAGER_SERVICE], 'updateImage');
    service.saveToServer(service.createImageModel('testTitle', ['testTag1', 'testTag2']));
    expect(spy).toHaveBeenCalled();
  });

  it('#saveToLocal() should call ? (not yet determined)', () => {
    service.saveToLocalStorage(service.createImageModel('testTitle', ['testTag1', 'testTag2']));
    expect(true).toBeTruthy();
  });

  it('#saveImage() should call saveToServer() if the parameter is true', () => {
    const spy = spyOn(service, 'saveToServer');
    service.saveImage('testTitle', ['testTag1', 'testTag2'], true);
    expect(spy).toHaveBeenCalled();
  });

  it('#saveImage() should call saveToLocalStorage() if the parameter is false', () => {
    const spy = spyOn(service, 'saveToLocalStorage');
    service.saveImage('testTitle', ['testTag1', 'testTag2'], false);
    expect(spy).toHaveBeenCalled();
  });

  it('#serverIsAvailable() returns false by default', () => {
    expect(service.serverIsAvailable()).toBeFalsy();
  });
});
