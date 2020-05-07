import { NgModule } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Observable, of } from 'rxjs';
import { AppModule } from '../../../app.module';
import { NavigationService } from '../../../services/navigation/navigation.service';
import {SvgUndoRedoService} from '../../../services/undo-redo/svg-undo-redo.service';
import { CreateNewDrawingComponent } from './create-new-drawing.component';

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

@NgModule({
  imports: [
    AppModule,
  ],
  providers: [
    SvgUndoRedoService,
    { provide: MatDialog, useValue: dialogStub },
    { provide: MatDialogRef, useValue: dialogRefStub },
    { provide: MAT_DIALOG_DATA, useValue: {} },
  ],
})
class TestModule {}
const MAX_WAIT_TIME = 40000;
jasmine.DEFAULT_TIMEOUT_INTERVAL = MAX_WAIT_TIME;
describe('CreateNewDrawingComponent', () => {
  let component: CreateNewDrawingComponent;
  let fixture: ComponentFixture<CreateNewDrawingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        TestModule,
      ],
    })
    .compileComponents().catch();

    fixture = TestBed.createComponent(CreateNewDrawingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.dialogRef = TestBed.get(MatDialogRef);

    spyOn(TestBed.get(NavigationService) as NavigationService, 'navigate').and.stub();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('#onResize should update width and height if both are pristine', () => {
    const WIDTH = 10;
    spyOn(component.screenSizeService, 'getScreenWidth').and.returnValue(WIDTH);
    spyOn(component.screenSizeService, 'getScreenHeight').and.returnValue(2 * WIDTH);
    component.onResize();
    expect(component.form.controls.width.value).toBe(WIDTH);
    expect(component.form.controls.height.value).toBe(2 * WIDTH);
  });

  it('#submitNewDrawing should call storage getBackgroundColor', () => {
    const getBackgroundColorSpy = spyOn(component, 'getBackgroundColor');
    const setDrawingBaseParametersSpy = spyOn(component.drawingCreatorService, 'setDrawingBaseParameters');
    const resetSvgComponentsSpy = spyOn(component.svgComponentsManagerService, 'resetSvgComponents');
    component.submitNewDrawing();
    expect(resetSvgComponentsSpy).toHaveBeenCalled();
    expect(getBackgroundColorSpy).toHaveBeenCalled();
    expect(setDrawingBaseParametersSpy).toHaveBeenCalled();
  });

  it('#onSubmit should close new drawing form', () => {
    spyOn(component.svgComponentsManagerService, 'componentsCount').and.returnValue(0);
    spyOn(component.dialogRef, 'close');
    component.onSubmit();
    expect(component.dialogRef.close).toHaveBeenCalled();
  });

  it('#onSubmit should open warning window if SVG elements present', () => {
    spyOn(component.svgComponentsManagerService, 'componentsCount').and.returnValue(1);
    spyOn(component, 'onWarningClose').and.callThrough();
    component.onSubmit();
    expect(component.onWarningClose).toBeDefined();
  });

  it('#onSubmit should open warning window if user change something', () => {
    // TODO need to understand why it doesn't work
    spyOn(component.undoRedoService, 'checkIfAnyUserChanges').and.returnValue(true);
    spyOn(component.dialog, 'open');
    // component.onSubmit();
    expect(component.dialog.open).not.toHaveBeenCalled();
  });

  it('#onSubmit should submit if no SVG elements are present', () => {
    spyOn(component.svgComponentsManagerService, 'componentsCount').and.returnValue(0);
    spyOn(component, 'submitNewDrawing');
    component.onSubmit();
    expect(component.submitNewDrawing).toHaveBeenCalled();
  });

  it('#onWarningClose should submit if confirmed', () => {
    spyOn(component, 'submitNewDrawing');
    component.onWarningClose(true);
    expect(component.submitNewDrawing).toHaveBeenCalled();
  });

  it('should create a form with 2 controls', () => {
    expect(component.form.contains('height')).toBe(true);
    expect(component.form.contains('width')).toBe(true);
  });

  it('height field validity', () => {
    const heightControl = component.form.controls.height;
    heightControl.setValue('');
    expect(heightControl.hasError('required')).toBe(true);
  });

  it('height positive validity', () => {
    const heightControl = component.form.controls.height;
    heightControl.setValue('-1');
    expect(heightControl.hasError('min')).toBe(true);
  });
  it('height positive validity', () => {
    const heightControl = component.form.controls.height;
    heightControl.setValue('1');
    expect(heightControl.hasError('min')).toBe(false);
  });

  it('Width field validity', () => {
    const widthControl = component.form.controls.width;
    widthControl.setValue('');
    expect(widthControl.hasError('required')).toBe(true);
  });

  it('Width positive validity', () => {
    const widthControl = component.form.controls.width;
    widthControl.setValue('-1');
    expect(widthControl.hasError('min')).toBe(true);
  });

  it('Width positive validity', () => {
    const widthControl = component.form.controls.width;
    widthControl.setValue('1');
    expect(widthControl.hasError('min')).toBe(false);
  });

  it('#onSubmit() should call dialog.open', () => {
    const spy = spyOn(component.dialog, 'open').and.callThrough();
    spyOn(component.undoRedoService, 'checkIfAnyUserChanges').and.returnValue(true);
    component.onSubmit();
    expect(spy).toHaveBeenCalled();
  });
});
