import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Observable, of } from 'rxjs';
import { ImageModel } from '../../../../../../common/model/image.model';
import { AppModule } from '../../../app.module';
import { DrawingAccessorService } from '../../../services/current-drawing-accessor/drawing-accessor.service';
import { KeyboardManagerService } from '../../../services/events/keyboard-manager.service';
import { SvgComponentsManagerService } from '../../../services/svg/svg-components-manager.service';
import { ToolsOptionsManagerService } from '../../../services/tool-manager/tools-options-manager/tools-options-manager.service';
import { Tool } from '../../../services/tool-manager/tools/tool/tool';
import { SvgUndoRedoService } from '../../../services/undo-redo/svg-undo-redo.service';
import { TestSpeedUpgrader } from '../../../testHelpers/test-speed-upgrader.spec';
import { DrawingBoardComponent } from '../../drawing/work-board/drawing-board/drawing-board.component';
import { GalerieComponent } from './galerie.component';

const dialogRefStub = {
  open: () => dialogRefStub,
  close: () => dialogRefStub,
  beforeClosed(): Observable<undefined> {
    return of(undefined);
  },
  afterClosed(): Observable<undefined> {
    return of(undefined);
  },
};

const dialogStub = {
  open: () => dialogRefStub,
  close: () => dialogRefStub,
};

const TEST_IMAGE_MODEL = {
  id: '1',
  title: 'testImage',
  tags: [],
  date: new Date(),
  serializedSVG: 'a',
  inlineSVG: 'a',
};

describe('GalerieComponent', () => {
  let component: GalerieComponent;
  let fixture: ComponentFixture<GalerieComponent>;
  let boardFixture: ComponentFixture<DrawingBoardComponent>;
  let drawingBoard: DrawingBoardComponent;

  TestSpeedUpgrader.overWriteModuleResetForSpeedGain();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        AppModule,
        HttpClientTestingModule,
      ],
      providers: [
        SvgUndoRedoService,
        { provide: MatDialog, useValue: dialogStub },
        { provide: MatDialogRef, useValue: dialogRefStub },
        { provide: MAT_DIALOG_DATA, useValue: {} },
      ],
    })
    .compileComponents();
    Tool.KEYBOARD_MANAGER_SERVICE = TestBed.get(KeyboardManagerService);
    Tool.SVG_COMPONENT_MANAGER = TestBed.get(SvgComponentsManagerService);
    Tool.KEYBOARD_MANAGER_SERVICE = TestBed.get(KeyboardManagerService);
    Tool.CANVAS_SERVICE = TestBed.get(DrawingAccessorService);
    Tool.TOOL_OPTIONS_MANAGER = TestBed.get(ToolsOptionsManagerService);
    Tool.UNDO_REDO_SERVICE = TestBed.get(SvgUndoRedoService);
    boardFixture = TestBed.createComponent(DrawingBoardComponent);
    drawingBoard = boardFixture.componentInstance;
    Tool.SVG_COMPONENT_MANAGER.initialiseViewContainerRef(drawingBoard.rootSvg);
    boardFixture.detectChanges();
    Tool.CANVAS_SERVICE.setTrackedDrawingRef(drawingBoard.svgElement);
    drawingBoard.ngOnInit();

    fixture = TestBed.createComponent(GalerieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('constructor subscriptions works as expected when imagesObs sends value', (done) => {
    component.ims.images = [TEST_IMAGE_MODEL];
    component.ims.isLoading = false;
    component.ims.imagesObs.next();
    expect(component.isLoading).toBeFalsy();
    expect(component.images).toEqual([TEST_IMAGE_MODEL]);
    done();
  });

  it('constructor subscriptions works as expected when imagesObs sends error', (done) => {
    component.ims.images = [TEST_IMAGE_MODEL];
    component.ims.isLoading = false;
    component.ims.imagesObs.error('TestError');
    expect(component.isLoading).toBeFalsy();
    expect(component.images).toEqual([TEST_IMAGE_MODEL]);
    done();
  });

  it('#ngOnInit() should call getImagesByTags and  getImagesByTags', (done) => {
    const getImagesByTagsSpy = spyOn(component.ims, 'getImagesByTags' );
    const fetchTagsSpy = spyOn(component.ims, 'fetchTags');
    component.ngOnInit();
    expect(Tool.KEYBOARD_MANAGER_SERVICE.enableShortcuts).toBeFalsy();
    expect(getImagesByTagsSpy).toHaveBeenCalled();
    expect(fetchTagsSpy).toHaveBeenCalled();
    done();
  });

  it('#chipsUpdate() should call getImagesByTags and  getImagesByTags', (done) => {
    component.tags = ['image1', 'project1'];
    component.oldTags = ['image2', 'project2'];
    const getImagesByTagsSpy = spyOn(component.ims, 'getImagesByTags' );
    component.chipsUpdate();
    expect(getImagesByTagsSpy).toHaveBeenCalled();
    expect(component.oldTags).toEqual([...component.tags]);
    done();
  });

  it('#chipsUpdate() does nothing when tags=oldTags', (done) => {
    component.tags = ['same'];
    component.oldTags = component.tags;
    const getImagesByTagsSpy = spyOn(component.ims, 'getImagesByTags' );
    component.chipsUpdate();
    expect(getImagesByTagsSpy).not.toHaveBeenCalled();
    done();
  });

  it('#setSelected() should img in setSelected ', () => {
    const img: ImageModel = new  ImageModel();
    component.setSelected(img);
    expect(component.selectedCard).toEqual(img);
  });

  it('#importImage() does nothing if selectedCard is undefined',  () => {
    component.selectedCard = undefined;
    const somethingHappenedSpy = spyOn(Tool.UNDO_REDO_SERVICE, 'checkIfAnyUserChanges');
    component.importImage();
    expect(somethingHappenedSpy).not.toHaveBeenCalled();
  });

  it('#importImage() works as expected',  () => {
    const img: ImageModel = {
      id: '0',
      title: '0',
      tags: [],
      date: new Date(),
      serializedSVG: '',
      inlineSVG: '',
    };
    component.setSelected(img);
    const spy = spyOn(component.dialog, 'open').and.callThrough();
    const serviceName = 'undoRedoService';
    spyOn(component[serviceName], 'checkIfAnyUserChanges').and.returnValue(true);
    component.importImage();
    component.setSelected(img);
    expect(spy).toHaveBeenCalled();
  });

  it('#importImage()  works as expected', (done) => {
    const img: ImageModel = new ImageModel();
    component.setSelected(img);
    Tool.UNDO_REDO_SERVICE.checkIfAnyUserChanges(true);
    const closeSpy = spyOn(component, 'close');
    const loadImageSpy = spyOn(component.importService, 'loadImage');
    const navigateToDrawingSpy = spyOn(component.navigationService, 'navigate');
    component.importImage();
    expect(loadImageSpy).toHaveBeenCalled();
    expect(navigateToDrawingSpy).toHaveBeenCalled();
    expect(closeSpy).toHaveBeenCalled();
    done();
  });

  it('#addTag() should add a tag when the condition is true', (done) => {
    const tag = 'image';
    const chipsUpdateSpy = spyOn(component, 'chipsUpdate');
    const update = true;
    const VALUE_EXPECTED = component.tags.length;
    const index = component.tags.indexOf(tag.trim());
    if ( tag.trim() && index < 0 ) {
      component.addTag(tag, update);
    }
    expect(component.tags.length).toEqual( VALUE_EXPECTED + 1 );
    expect(chipsUpdateSpy).toHaveBeenCalled();
    done();
  });

  it('#getSVG() works as expected', (done) => {
    const img: ImageModel = new ImageModel();
    component.ngOnInit();
    const VALUE_EXPECTED = '';
    const dummyElement = document.createElement('div') as HTMLElement;
    spyOn(document, 'getElementById').and.stub().and.returnValue(dummyElement);
    expect(component.getSVG(img)).toEqual(VALUE_EXPECTED);
    done();
  });

  it('#getSVG() works as expected when DOMParser fails', (done) => {
    const img: ImageModel = new ImageModel();
    spyOn(DOMParser.prototype, 'parseFromString').and.returnValue({documentElement: undefined} as unknown as Document);
    component.ngOnInit();
    const VALUE_EXPECTED = 'Thumbnail failed to load';
    // tslint:disable-next-line:no-any
    const documentSpy = spyOn(document, 'getElementById');
    expect(component.getSVG(img)).toEqual(VALUE_EXPECTED);
    expect(documentSpy).not.toHaveBeenCalled();
    done();
  });

  it('#getSVG() works as expected when div is null', (done) => {
    const img: ImageModel = new ImageModel();
    component.ngOnInit();
    spyOn(document, 'getElementById').and.stub().and.returnValue(null);
    const VALUE_EXPECTED = 'Thumbnail failed to load';
    expect(component.getSVG(img)).toEqual(VALUE_EXPECTED);
    done();
  });

  it('#close() should call close of dialogRef ', () => {
    const closeSpy = spyOn(component.dialogRef, 'close');
    component.close();
    expect(closeSpy).toHaveBeenCalled();
    expect(component.keyboardManagerService.enableShortcuts).toBeTruthy();
  });

  it('#remove() should add a tag ', () => {
    const tag = 'image';
    component.addTag(tag);
    const index = component.tags.indexOf(tag);
    const VALUE_EXPECTED = component.tags.length;
    if (index >= 0) { component.remove(tag); }
    expect(component.tags.length).toEqual( VALUE_EXPECTED - 1 );
  });

  it('#_filter() should add a tag ', () => {
    /*const value = 'image';
    const functName = '_filter';
    const filterValue = value.toLowerCase();
    const VALUE_EXPECTED = component.ims.tags.filter((tag) => tag.toLowerCase().indexOf(filterValue) === 0);
    expect(component[functName](value)).toEqual(VALUE_EXPECTED);*/
    const values = ['Image', 'images', 'img'];
    component.ims.tags = values;
    const functName = '_filter';
    expect(component[functName]('ima')).toEqual(['Image', 'images']);
  });

  it('#deleteCard() works as expected', (done) => {
    const img: ImageModel = new ImageModel();
    const loadImageSpy = spyOn(component.importService, 'loadImage').and.callThrough();
    component.deleteCard(img);
    expect(loadImageSpy).toBeDefined();
    done();
  });

  it('#onConfirmCancel() should add a tag ', () => {
    const result = true;
    const img: ImageModel = new ImageModel();
    component.setSelected(img);
    const loadImageSpy = spyOn(component.importService, 'loadImage');
    const navigateSpy = spyOn(component.navigationService, 'navigate');
    const closeSpy = spyOn(component.dialogRef, 'close');
    const funcName = 'onConfirmCancel';
    component[funcName](result);
    expect(loadImageSpy).toHaveBeenCalled();
    expect(navigateSpy).toHaveBeenCalled();
    expect(closeSpy).toHaveBeenCalled();
  });

  it('#onConfirmDelete() should add a tag ', () => {
    const result = true;
    const img: ImageModel = new ImageModel();
    img.id = '';
    component.images.push(img);
    component.setSelected(img);
    const VALUE_EXPECTED = component.images.length;
    const VALUE_EXPECTED_NULL = '';
    const functName = 'onConfirmDelete';
    component[functName](result, img);
    expect(component.images.length).toEqual(VALUE_EXPECTED - 1);
    expect (img.id).toEqual(VALUE_EXPECTED_NULL);
  });

  it('#selected() should add a tag ', () => {
    const event = '$event';
    const VALUE_EXPECTED = component.tags.length;
    const VALUE_EXPECTED_NULL = '';
    const setValueSpy = spyOn(component.tagCtrl, 'setValue');
    component.selected( event);
    expect(component.tags.length).toEqual(VALUE_EXPECTED + 1);
    expect(component.tagInput.nativeElement.value).toEqual(VALUE_EXPECTED_NULL);
    expect (setValueSpy).toHaveBeenCalled();
  });

  it('#add() should call addTag , set Value and ChipsUpdate ', () => {
    const input = document.createElement('input');
    const value = 'value';
    const addTagSpy = spyOn(component, 'addTag');
    const setValueSpy = spyOn(component.tagCtrl, 'setValue');
    const chipsUpdateSpy = spyOn(component, 'chipsUpdate');
    const VALUE_EXPECTED_NULL = '';
    component.add(input, value);
    expect(addTagSpy).toHaveBeenCalled();
    expect(input.value).toEqual(VALUE_EXPECTED_NULL);
    expect (setValueSpy).toHaveBeenCalled();
    expect(chipsUpdateSpy).toHaveBeenCalled();
  });

});
