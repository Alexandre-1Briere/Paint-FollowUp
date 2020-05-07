import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import { AppModule } from '../../app.module';
import { KEY_DOWN } from '../../constants/keyboard';
import { KeyboardKey } from '../../enums/keyboard';
import { KeyboardManagerService } from '../../services/events/keyboard-manager.service';
import { ScreenSizeService } from '../../services/screen-size/screen-size.service';
import {TestSpeedUpgrader} from '../../testHelpers/test-speed-upgrader.spec';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let app: AppComponent;

  TestSpeedUpgrader.overWriteModuleResetForSpeedGain();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        AppModule,
      ],
    });

    fixture = TestBed.createComponent(AppComponent);
    app = fixture.componentInstance;
    app.keyboardManagerService = TestBed.get(KeyboardManagerService);
    fixture.detectChanges();
  }));

  it('should create the app', () => {
    expect(app).toBeTruthy();
  });

  it('App should set keyboardManagerService.enableShortcuts to false after Ctrl + O keys', () => {
    const KEY_CTRL = KeyboardKey.Ctrl;
    const eventCtrl = new KeyboardEvent(KEY_DOWN, {key: KEY_CTRL.toString()});
    app.keyboardManagerService.receiveKeyboardEvent(eventCtrl);
    const KEY_O = KeyboardKey.O;
    const eventO = new KeyboardEvent(KEY_DOWN, {key: KEY_O.toString()});
    app.keyboardManagerService.receiveKeyboardEvent(eventO);

    expect(app.keyboardManagerService.enableShortcuts).toBeFalsy();
  });

  it('App should set keyboardManagerService.enableShortcuts to false after Ctrl + G keys', () => {
    const KEY_CTRL = KeyboardKey.Ctrl;
    const eventCtrl = new KeyboardEvent(KEY_DOWN, {key: KEY_CTRL.toString()});
    app.keyboardManagerService.receiveKeyboardEvent(eventCtrl);
    const KEY_G = KeyboardKey.G;
    const eventO = new KeyboardEvent(KEY_DOWN, {key: KEY_G.toString()});
    app.keyboardManagerService.receiveKeyboardEvent(eventO);

    expect(app.keyboardManagerService.enableShortcuts).toBeFalsy();
  });

  it('#onResize() calls screenSizeService.queryScreenSize()', () => {
    const screenSizeService = TestBed.get(ScreenSizeService);
    spyOn(screenSizeService, 'queryScreenSize');
    const RESIZE_EVENT = 'resize';
    window.dispatchEvent(new Event(RESIZE_EVENT));
    expect(screenSizeService.queryScreenSize).toHaveBeenCalled();
  });
});
