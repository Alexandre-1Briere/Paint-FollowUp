import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material';
import { Observable, of } from 'rxjs';
import { AppModule } from '../../../app.module';
import { DrawingBoardComponent } from '../../drawing/work-board/drawing-board/drawing-board.component';
import { DownloadDialogComponent } from './download-dialog.component';

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

describe('ExportDialogComponent', () => {
  let drawingBoardfixture: ComponentFixture<DrawingBoardComponent>;
  let component: DownloadDialogComponent;
  let fixture: ComponentFixture<DownloadDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        AppModule,
      ],
      providers: [
        { provide: MatDialog, useValue: dialogStub },
        { provide: MatDialogRef, useValue: dialogRefStub },
        { provide: MAT_DIALOG_DATA, useValue: {} },
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    drawingBoardfixture = TestBed.createComponent(DrawingBoardComponent);
    drawingBoardfixture.detectChanges();

    fixture = TestBed.createComponent(DownloadDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('#onSubmit() should call downloadManager.exportDrawing()', () => {
    const spy = spyOn(component.downloaderService, 'exportDrawing');
    component.onSubmit();
    expect(spy).toHaveBeenCalled();
  });

  it('#close() should close the dialog and enable shortcut again', () => {
    const spy = spyOn(component.dialogRef, 'close');
    component.close();
    expect(spy).toHaveBeenCalled();
    expect(component.keyboardManagerService.enableShortcuts).toBe(true);
  });
});
