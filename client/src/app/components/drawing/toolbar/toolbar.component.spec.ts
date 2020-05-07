import { Component, ViewContainerRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Observable, of } from 'rxjs';
import { AppModule } from '../../../app.module';
import { KEY_DOWN } from '../../../constants/keyboard';
import { KeyboardKey } from '../../../enums/keyboard';
import { KeyboardManagerService } from '../../../services/events/keyboard-manager.service';
import { Crayon } from '../../../services/tool-manager/tools/crayon/crayon';
import { Pinceau } from '../../../services/tool-manager/tools/pinceau/pinceau';
import { SvgUndoRedoService } from '../../../services/undo-redo/svg-undo-redo.service';
import { TestSpeedUpgrader } from '../../../testHelpers/test-speed-upgrader.spec';
import { ToolbarComponent } from './toolbar.component';

// tslint:disable:max-classes-per-file
@Component({
  selector: 'app-mock-view-component',
  template: '',
})
class MockViewComponent {
  constructor(public viewContainerRef: ViewContainerRef) {
  }
}

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

describe('ToolbarComponent', () => {
  let component: ToolbarComponent;
  let fixture: ComponentFixture<ToolbarComponent>;

  TestSpeedUpgrader.overWriteModuleResetForSpeedGain();

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        AppModule,
      ],
      declarations: [MockViewComponent],
      providers: [
        SvgUndoRedoService,
        { provide: MatDialog, useValue: dialogStub },
        { provide: MatDialogRef, useValue: dialogRefStub },
        { provide: MAT_DIALOG_DATA, useValue: {} },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ToolbarComponent);
    component = fixture.componentInstance;
    component.ngOnInit();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('#onCloudUploadDialogClose() should set cloudUploadEnable to true', () => {
    const functionName = 'onCloudUploadDialogClose';
    component[functionName]();
    expect(component.cloudUploadEnabled).toBeTruthy();
  });

  it('#cloudUpload() should call dialog.open', () => {
    const spy = spyOn(component.dialog, 'open').and.callThrough();
    component.cloudUpload();
    expect(spy).toHaveBeenCalled();
  });

  it('#setTool() is called when ToolManagerService sends observable', () => {
    spyOn(component, 'setTool');
    const keyboardManagerService = TestBed.get(KeyboardManagerService);

    const KEY_W = KeyboardKey.W;
    const eventW = new KeyboardEvent(KEY_DOWN, {key: KEY_W.toString()});
    keyboardManagerService.receiveKeyboardEvent(eventW);
    fixture.detectChanges();
    expect(component.setTool).toHaveBeenCalled();
  });

  it('#onToolClick() emits toolsConfig', () => {
    spyOn(component.selectingTool, 'emit');
    component.onToolClick(Crayon.getInstance());
    expect(component.selectingTool.emit).toHaveBeenCalled();
  });

  it('#setTool() correctly sets tool', () => {
    const BRUSH = 'pinceau';
    const tool = Pinceau.getInstance();
    component.setTool(tool);
    expect(component.currentTool.name.toLowerCase()).toEqual(BRUSH);
  });

  it('#previousPage() calls location.back when drawing board is empty', () => {
    spyOn(component.location, 'back');
    component.previousPage();
    expect(component.location.back).toHaveBeenCalled();
  });

  it('#toggleGrid should call the toggleIsActive function of the grid service', () => {
    const spyToggle = spyOn(component.gridManagerService, 'toggleIsActive');
    component.toggleGrid();
    expect(spyToggle).toHaveBeenCalled();
  });

  it('#toggleGrid should call the undo function of the undoredo service', () => {
    const spyHistoric = spyOn(component.undoRedoService, 'undo');
    component.undo();
    expect(spyHistoric).toHaveBeenCalled();
  });

  it('#toggleGrid should call the redo function of the undoredo service', () => {
    const spyHistoric = spyOn(component.undoRedoService, 'redo');
    component.redo();
    expect(spyHistoric).toHaveBeenCalled();
  });

  it('#loadPreviousPage should call location.back and resetsvgComponent if the parameter is true', () => {
    const spyLocation = spyOn(component.location, 'back');
    const spyReset = spyOn(component.svgComponentsManagerService, 'resetSvgComponents');
    component.loadPreviousPage(true);
    expect(spyLocation).toHaveBeenCalled();
    expect(spyReset).toHaveBeenCalled();
  });

  it('#loadPreviousPage should not call location.back and resetsvgComponent if the parameter is false', () => {
    const spyLocation = spyOn(component.location, 'back');
    const spyReset = spyOn(component.svgComponentsManagerService, 'resetSvgComponents');
    component.loadPreviousPage(false);
    expect(spyLocation).not.toHaveBeenCalled();
    expect(spyReset).not.toHaveBeenCalled();
  });

  it('#showGridOptions should call dialog.open', () => {
    const spyDialog = spyOn(component.dialog, 'open');
    component.showGridOptions();
    expect(spyDialog).toHaveBeenCalled();
  });

  it('#openDownloadDialog should call dialog.open', () => {
    const spyDialog = spyOn(component.dialog, 'open');
    component.openDownloadDialog();
    expect(spyDialog).toHaveBeenCalled();
  });

  it('#cloudDownload should call dialog.open', () => {
    const spyDialog = spyOn(component.dialog, 'open');
    component.cloudDownload();
    expect(spyDialog).toHaveBeenCalled();
  });
});
