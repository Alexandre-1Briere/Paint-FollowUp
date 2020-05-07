import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { AppModule } from '../../../app.module';
import { ConfirmCancelDialogComponent } from './confirm-cancel-dialog.component';

const dialogMock = {
    // tslint:disable-next-line:no-empty
    close: () => {
    },
    beforeClosed: () => new Observable<boolean>(),
};

describe('ConfirmCancelDialogComponent', () => {
    let component: ConfirmCancelDialogComponent;
    let fixture: ComponentFixture<ConfirmCancelDialogComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                AppModule,
            ],
            providers: [
                { provide: MatDialogTitle, useValue: {} },
                { provide: MatDialogRef, useValue: dialogMock },
                { provide: MAT_DIALOG_DATA, useValue: [] }],
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ConfirmCancelDialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it(' confirm should result the  answer variable to true', () => {
        component.confirm();
        expect(component.getAnswer()).toBeTruthy();
    });

    it('#component.close() should call dialog.close()', () => {
        const closeSpy = spyOn(component.dialogRef, 'close');
        component.close();
        expect(closeSpy).toHaveBeenCalled();
    });
});
