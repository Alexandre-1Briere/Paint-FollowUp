import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Observable, of } from 'rxjs';
import { MessageDialogComponent } from './message-dialog.component';

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

describe('MessageDialogComponent', () => {
  let component: MessageDialogComponent;
  let fixture: ComponentFixture<MessageDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MessageDialogComponent],
      providers: [
        { provide: MatDialog, useValue: dialogStub },
        { provide: MatDialogRef, useValue: dialogRefStub },
        { provide: MAT_DIALOG_DATA, useValue: {} },
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MessageDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('1close() should call dialogRef.close()', () => {
    const spy = spyOn(component.dialogRef, 'close');
    component.close();
    expect(spy).toHaveBeenCalled();
  });
});
