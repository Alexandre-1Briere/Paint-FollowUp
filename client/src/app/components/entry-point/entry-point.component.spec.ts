import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppModule } from '../../app.module';
import { KEY_DOWN, KEY_UP } from '../../constants/keyboard';
import { KeyboardKey } from '../../enums/keyboard';
import { KeyboardManagerService } from '../../services/events/keyboard-manager.service';
import { TestSpeedUpgrader } from '../../testHelpers/test-speed-upgrader.spec';
import { DrawingComponent } from '../drawing/drawing.component';
import { EntryPointComponent } from './entry-point.component';

describe('AppEntryPointComponent', () => {
  let component: EntryPointComponent;
  let fixture: ComponentFixture<EntryPointComponent>;

  TestSpeedUpgrader.overWriteModuleResetForSpeedGain();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        AppModule,
        RouterTestingModule.withRoutes([{ path: 'drawing', component: DrawingComponent }]),
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EntryPointComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('#continueDrawing() should check if the route exist', () => {
    const spy = spyOn(component.router, 'navigate').and.stub().and.returnValue(new Promise((resolve) => {
      return;
    }));
    spyOn(component.localLoader, 'loadDrawingToWorkspace').and.stub();
    component.continueDrawing();
    expect(spy).toHaveBeenCalled();
  });

  it('#continueDrawing() should not navigate if the route doesn\'t exist', () => {
    const spy = spyOn(component.router, 'navigate').and.stub().and.returnValue(new Promise((resolve) => {
      return;
    }));
    spyOn(component.localLoader, 'loadDrawingToWorkspace').and.stub();
    component.router.config = [];
    component.continueDrawing();
    expect(spy).not.toHaveBeenCalled();
  });

  it('#onKeyboardEvent() is called after window:keydown event', () => {
    spyOn(component, 'onKeyboardEvent');
    window.dispatchEvent(new KeyboardEvent(KEY_DOWN));
    expect(component.onKeyboardEvent).toHaveBeenCalled();
  });

  it('#onKeyboardEvent() is called after window:keyup event', () => {
    spyOn(component, 'onKeyboardEvent');
    window.dispatchEvent(new KeyboardEvent(KEY_UP));
    expect(component.onKeyboardEvent).toHaveBeenCalled();
  });

  it('#onKeyboardEvent() calls event.preventDefault when Ctrl key is pressed', () => {
    const IS_CTRL = true;
    const eventCtrl = new KeyboardEvent(KEY_DOWN, {key: KeyboardKey.Ctrl, ctrlKey: IS_CTRL});
    spyOn(eventCtrl, 'preventDefault');

    window.dispatchEvent(eventCtrl);
    expect(eventCtrl.preventDefault).toHaveBeenCalled();
  });

  it('#onKeyboardEvent() calls keyboardManagerService.receiveKeyboardEvent', () => {
    const keyboardManagerService = TestBed.get(KeyboardManagerService);
    spyOn(keyboardManagerService, 'receiveKeyboardEvent');
    window.dispatchEvent(new KeyboardEvent(KEY_UP));
    expect(keyboardManagerService.receiveKeyboardEvent).toHaveBeenCalled();
  });

  it('#openComponentDialog() calls dialog.open', () => {
    spyOn(component.dialog, 'open');
    component.openGalerieDialog();
    expect(component.dialog.open).toHaveBeenCalled();
  });

  it('#openComponentDialog() calls dialog.open', () => {
    spyOn(component.dialog, 'open');
    component.openComponentDialog();
    expect(component.dialog.open).toHaveBeenCalled();
  });
});
