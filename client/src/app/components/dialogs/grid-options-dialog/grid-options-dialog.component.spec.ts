import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormsModule } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatCardModule,
  MatDialog,
  MatDialogRef,
  MatDividerModule,
  MatSliderModule,
} from '@angular/material';
import { Observable, of } from 'rxjs';
import { TestSpeedUpgrader } from '../../../testHelpers/test-speed-upgrader.spec';
import { GridOptionsDialogComponent } from './grid-options-dialog.component';

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

describe('GridOptionsDialogComponent', () => {
  let component: GridOptionsDialogComponent;
  let fixture: ComponentFixture<GridOptionsDialogComponent>;

  TestSpeedUpgrader.overWriteModuleResetForSpeedGain();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [GridOptionsDialogComponent],
      imports: [
        MatDividerModule,
        MatCardModule,
        MatSliderModule,
        FormsModule,
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
    fixture = TestBed.createComponent(GridOptionsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Cancel() should call 4 function to reset the grid', () => {
    const spyOpacity = spyOn(component.gridManagerService, 'setPrimaryOpacity');
    const spySize = spyOn(component.gridManagerService, 'setSize');
    const spyClose = spyOn(component.dialogRef, 'close');
    const spyRefresh = spyOn(component.gridManagerService, 'refreshGrid');
    component.cancel();
    expect(spyClose).toHaveBeenCalled();
    expect(spySize).toHaveBeenCalled();
    expect(spyRefresh).toHaveBeenCalled();
    expect(spyOpacity).toHaveBeenCalled();
  });

  it('#update() should call setSize() and setPrimaryOpacity()', () => {
    const spySize = spyOn(component.gridManagerService, 'setSize');
    const spyOpaciy = spyOn(component.gridManagerService, 'setPrimaryOpacity');
    component.update();
    expect(spySize).toHaveBeenCalled();
    expect(spyOpaciy).toHaveBeenCalled();
  });

  it('#saveSettings() should call dialogref.close()', () => {
    const spy = spyOn(component.dialogRef, 'close');
    component.saveSettings();
    expect(spy).toHaveBeenCalled();
  });
});
