import {HttpClientTestingModule} from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material';
import { Observable, of } from 'rxjs';
import { ImageModel } from '../../../../../../common/model/image.model';
import { AppModule } from '../../../app.module';
import { DrawingAccessorService } from '../../../services/current-drawing-accessor/drawing-accessor.service';
// tslint:disable-next-line
import { DrawingBaseParametersAccessorService } from '../../../services/drawing-base-parameters-accessor/drawing-base-parameters-accessor.service';
import { KeyboardManagerService } from '../../../services/events/keyboard-manager.service';
import { SvgComponentsManagerService } from '../../../services/svg/svg-components-manager.service';
import { ToolsOptionsManagerService } from '../../../services/tool-manager/tools-options-manager/tools-options-manager.service';
import { Tool } from '../../../services/tool-manager/tools/tool/tool';
import { SvgUndoRedoService } from '../../../services/undo-redo/svg-undo-redo.service';
import { TestSpeedUpgrader } from '../../../testHelpers/test-speed-upgrader.spec';
import { DrawingBoardComponent } from '../../drawing/work-board/drawing-board/drawing-board.component';
import { SaveDrawingDialogComponent } from './save-drawing-dialog.component';

const dialogRefStub = {
  open: () => dialogRefStub,
  close: () => dialogRefStub,
  beforeClosed(): Observable<undefined>  {
    return of(undefined);
  },
  afterClosed(): Observable<undefined>  {
    return of(undefined);
  },
};

const dialogStub = {
  open: () => dialogRefStub,
  close: () => dialogRefStub,
};

describe('SaveDrawingDialogComponent', () => {
  let component: SaveDrawingDialogComponent;
  let fixture: ComponentFixture<SaveDrawingDialogComponent>;
  let boardFixture: ComponentFixture<DrawingBoardComponent>;
  let drawingBoard: DrawingBoardComponent;

  TestSpeedUpgrader.overWriteModuleResetForSpeedGain();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        AppModule,
        HttpClientTestingModule,
      ],
      declarations: [ ],
      providers: [
        { provide: MatDialog, useValue: dialogStub },
        { provide: MatDialogRef, useValue: dialogRefStub },
        { provide: MAT_DIALOG_DATA, useValue: {} },
        SvgComponentsManagerService,
        KeyboardManagerService,
        DrawingAccessorService,
        DrawingBaseParametersAccessorService,
        ToolsOptionsManagerService,
        SvgUndoRedoService,
      ],
    }).compileComponents();

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

    fixture = TestBed.createComponent(SaveDrawingDialogComponent);
    component = fixture.debugElement.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', (done) => {
    expect(component).toBeTruthy();
    done();
  });

  it('#updatePreview() works as expected', (done) => {
    component.updatePreview();
    const imagePreview = Tool.CANVAS_SERVICE.getCurrentDrawingElement();
    expect(imagePreview).toBeDefined();
    done();
  });

  it('#cancel() works as expected', (done) => {
    component.ngOnInit();
    expect(Tool.KEYBOARD_MANAGER_SERVICE.enableShortcuts).toBeFalsy();
    component.cancel();
    expect(Tool.KEYBOARD_MANAGER_SERVICE.enableShortcuts).toBeTruthy();
    done();
  });

  it('#validateEntries() works as expected', (done) => {
    component.updatePreview();
    const imagePreview = Tool.CANVAS_SERVICE.getCurrentDrawingElement();
    expect(imagePreview).toBeDefined();
    component.titleFormControl.setValue('title');
    if (imagePreview) {
      expect(component.validateEntries()).toBeTruthy();
    }
    done();
  });

  it('#saveSettings() should call saveImage when server isAvailable ', () => {
    component.updatePreview();
    const imagePreview = Tool.CANVAS_SERVICE.getCurrentDrawingElement();
    expect(imagePreview).toBeDefined();
    component.addInputAsChip();
    component.titleFormControl.setValue('title');
    component.title = 'image';
    component.canSave = false;
    component.tags = ['image1', 'image4'];
    component.exportService.imagesManagerService.serverIsAvailable = true;
    const saveImageSpy = spyOn(component.exportService, 'saveImage');
    component.saveSettings();
    if (imagePreview) {
      expect(saveImageSpy).toHaveBeenCalled();
    }
  });

  it('#saveSettings() should call dialog.open server  is not Available ', () => {
    component.updatePreview();
    const imagePreview = Tool.CANVAS_SERVICE.getCurrentDrawingElement();
    expect(imagePreview).toBeDefined();
    component.addInputAsChip();
    component.titleFormControl.setValue('title');
    component.title = 'image';
    component.canSave = false;
    component.tags = ['image1', 'image4'];
    component.exportService.imagesManagerService.serverIsAvailable = false;
    const dialogOpenSpy = spyOn(component.dialog, 'open');
    component.saveSettings();
    if (imagePreview) {
      expect(dialogOpenSpy).toHaveBeenCalled();
    }
  });

  it('#addInputAsChip() should call addTag server  and setValue ', () => {
    component.updatePreview();
    const imagePreview = Tool.CANVAS_SERVICE.getCurrentDrawingElement();
    expect(imagePreview).toBeDefined();
    component.tagCtrl.setValue(true);
    const addTagSpy = spyOn(component, 'addTag');
    const setValueSpy = spyOn(component.tagCtrl, 'setValue');
    component.addInputAsChip();
    expect(addTagSpy).toHaveBeenCalled();
    expect(setValueSpy).toHaveBeenCalled();
  });

  it('#addTag() should add a tag when the  condition is true  ', () => {
    const tag = 'image';
    const VALUE_EXPECTED = component.tags.length;
    const index = component.tags.indexOf(tag.trim());
    if (ImageModel.validateTags([tag.trim()]) &&  tag.trim() && index < 0 ) {
      component.addTag(tag);
    }
    expect(component.tags.length).toEqual( VALUE_EXPECTED + 1 );
  });

  it('#remove() should add a tag   ', () => {
    const tag = 'image';
    component.addTag(tag);
    const index = component.tags.indexOf(tag);
    const VALUE_EXPECTED = component.tags.length;
    if (index >= 0) { component.remove(tag); }
    expect(component.tags.length).toEqual( VALUE_EXPECTED - 1 );
  });

  it('#selected() should add a tag   ', () => {
    const tag = 'image';
    const VALUE_EXPECTED = component.tags.length;
    component.selected(tag);
    expect(component.tags.length).toEqual( VALUE_EXPECTED + 1 );
  });

  it('#add() should add a tag   ', () => {
    const tag = 'image';
    const input = document.createElement('input');
    const spy = spyOn(component, 'addTag');
    component.add(input, tag);
    expect(spy).toHaveBeenCalled();
  });

  it('#onSave() should call close   ', () => {
    const spy = spyOn(component, 'close');
    component.onSave();
    expect(spy).toHaveBeenCalled();
  });

  it('#_filter() should add a tag ', () => {
    const value = 'image';
    const functName = '_filter';
    const VALUE_EXPECTED = component.allTags.filter((tag: string) => tag.toLowerCase().indexOf(value) === 0);
    expect(component[functName](value)).toEqual(VALUE_EXPECTED);
  });

  it('#close() should call close of dialogRef ', () => {
    const closeSpy = spyOn(component.dialogRef, 'close');
    component.close();
    expect(closeSpy).toHaveBeenCalled();
    expect(component.keyboardManagerService.enableShortcuts).toBeTruthy();
  });

});
