import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AppModule } from '../../app.module';
import { KEY_DOWN, KEY_UP } from '../../constants/keyboard';
import { MOUSE_DOWN, MOUSE_MOVE, MOUSE_UP } from '../../constants/mouse';
import { toolsConfig } from '../../constants/tool-config';
import { KeyboardKey } from '../../enums/keyboard';
import { TestSpeedUpgrader } from '../../testHelpers/test-speed-upgrader.spec';
import { DrawingComponent } from './drawing.component';
import { ApplicableSettingClass } from './tool-detail/applicable-setting.class';

describe('DrawingComponent', () => {
  const OUTER_TAG = 'div';
  let component: DrawingComponent;
  let fixture: ComponentFixture<DrawingComponent>;

  TestSpeedUpgrader.overWriteModuleResetForSpeedGain();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        AppModule,
      ],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DrawingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('#onToolsChange should change the current config', () => {
    component.currentConfig = toolsConfig.crayon;
    component.onToolChange(toolsConfig.pinceau);
    expect(component.currentConfig).not.toBe(toolsConfig.crayon);
  });

  it('#onKeyboardEvent calls preventDefault on Ctrl key', () => {
    const keyEvent = new KeyboardEvent('keydown', { code: 'keyO', ctrlKey: true });
    const spy = spyOn(keyEvent, 'preventDefault');
    component.onKeyboardEvent(keyEvent);
    fixture.detectChanges();
    expect(spy).toHaveBeenCalled();
  });

  it('#onKeyboardEvent calls preventDefault on Alt key', () => {
    const keyEvent = new KeyboardEvent('keydown', { code: 'keyO', altKey: true });
    const spy = spyOn(keyEvent, 'preventDefault');
    component.onKeyboardEvent(keyEvent);
    fixture.detectChanges();
    expect(spy).toHaveBeenCalled();
  });

  it('#onSettingsChange should change the current settings', () => {
    component.currentSetting = new ApplicableSettingClass();
    component.currentSetting.configure(toolsConfig.crayon);
    const newSettings = new ApplicableSettingClass();
    newSettings.configure(toolsConfig.pinceau);
    component.onSettingChange(newSettings);
    expect(component.currentSetting.equal(newSettings)).toBe(true);
  });

  it('#onkeyboardEvent() is called after a window keydown event', () => {
    spyOn(component, 'onKeyboardEvent');
    const outerMostHtmlElement = fixture.nativeElement.querySelector(OUTER_TAG);
    const BUBBLES_REQUIRED_VALUE = true;

    outerMostHtmlElement.dispatchEvent(new KeyboardEvent(KEY_DOWN, {key: KeyboardKey.Enter, bubbles: BUBBLES_REQUIRED_VALUE}));
    fixture.detectChanges();
    expect(component.onKeyboardEvent).toHaveBeenCalled();
  });

  it('#onkeyboardEvent() calls KeyboardManagerService after a window keydown event', () => {
    spyOn(component.keyboardManagerService , 'receiveKeyboardEvent');
    const outerMostHtmlElement = fixture.nativeElement.querySelector(OUTER_TAG);
    const BUBBLES_REQUIRED_VALUE = true;

    outerMostHtmlElement.dispatchEvent(new KeyboardEvent(KEY_DOWN, {key: KeyboardKey.A, bubbles: BUBBLES_REQUIRED_VALUE}));
    fixture.detectChanges();
    expect(component.keyboardManagerService.receiveKeyboardEvent).toHaveBeenCalled();
  });

  it('#onkeyboardEvent() is called after a window keyup event', () => {
    spyOn(component, 'onKeyboardEvent');
    const outerMostHtmlElement = fixture.nativeElement.querySelector(OUTER_TAG);
    const BUBBLES_REQUIRED_VALUE = true;

    outerMostHtmlElement.dispatchEvent(new KeyboardEvent(KEY_UP, {key: KeyboardKey.B, bubbles: BUBBLES_REQUIRED_VALUE}));
    outerMostHtmlElement.dispatchEvent(new KeyboardEvent(KEY_UP, {key: KeyboardKey.Backspace, bubbles: BUBBLES_REQUIRED_VALUE}));
    fixture.detectChanges();
    const NUMBER_OF_KEYBOARD_EVENTS = 2;
    expect(component.onKeyboardEvent).toHaveBeenCalledTimes(NUMBER_OF_KEYBOARD_EVENTS);
  });

  it('#onkeyboardEvent() calls KeyboardManagerService after a window keyup event', () => {
    spyOn(component.keyboardManagerService , 'receiveKeyboardEvent');
    const outerMostHtmlElement = fixture.nativeElement.querySelector(OUTER_TAG);
    const BUBBLES_REQUIRED_VALUE = true;
    outerMostHtmlElement.dispatchEvent(new KeyboardEvent(KEY_UP, {key: KeyboardKey.C, bubbles: BUBBLES_REQUIRED_VALUE}));
    fixture.detectChanges();
    expect(component.keyboardManagerService.receiveKeyboardEvent).toHaveBeenCalled();
  });

  it('#sendMouseEvent() calls MouseDrawingInputsService after a mouseup event', () => {
    spyOn(component.mouseDrawingInputsService , 'receiveMouseAction');
    const outerMostHtmlElement = fixture.nativeElement.querySelector(OUTER_TAG);
    const BUBBLES_REQUIRED_VALUE = true;

    outerMostHtmlElement.dispatchEvent(new MouseEvent(MOUSE_UP, {bubbles: BUBBLES_REQUIRED_VALUE}));
    fixture.detectChanges();
    expect(component.mouseDrawingInputsService.receiveMouseAction).toHaveBeenCalled();
  });

  it('#sendMouseEvent() calls MouseDrawingInputsService after a mousemove event', () => {
    spyOn(component.mouseDrawingInputsService , 'receiveMouseAction');
    const outerMostHtmlElement = fixture.nativeElement.querySelector(OUTER_TAG);
    const BUBBLES_REQUIRED_VALUE = true;

    outerMostHtmlElement.dispatchEvent(new MouseEvent(MOUSE_MOVE, {bubbles: BUBBLES_REQUIRED_VALUE}));
    fixture.detectChanges();
    expect(component.mouseDrawingInputsService.receiveMouseAction).toHaveBeenCalled();
  });

  it('#sendMouseEvent() DOES NOT call MouseDrawingInputsService after a mousedown event', () => {
    spyOn(component.mouseDrawingInputsService , 'receiveMouseAction');
    const outerMostHtmlElement = fixture.nativeElement.querySelector(OUTER_TAG);
    const BUBBLES_REQUIRED_VALUE = true;

    outerMostHtmlElement.dispatchEvent(new MouseEvent(MOUSE_DOWN, {bubbles: BUBBLES_REQUIRED_VALUE}));
    fixture.detectChanges();
    expect(component.mouseDrawingInputsService.receiveMouseAction).not.toHaveBeenCalled();
  });

  it('#ngOnInit should subscribe to a tool change', () => {
    component.ngOnInit();
    const spy = spyOn(component, 'onToolChange');
    const outerMostHtmlElement = fixture.nativeElement.querySelector(OUTER_TAG);
    const BUBBLES_REQUIRED_VALUE = true;
    outerMostHtmlElement.dispatchEvent(new KeyboardEvent(KEY_DOWN, {key: KeyboardKey.C, bubbles: BUBBLES_REQUIRED_VALUE}));
    fixture.detectChanges();
    expect(spy).toHaveBeenCalled();
  });
  it('#ExportDialog should open when the user press ctrl and E', () => {
    const spy = spyOn(component.dialog, 'open');
    component.keyboardManagerService.receiveKeyboardEvent(new KeyboardEvent(KEY_DOWN, { key: KeyboardKey.Ctrl }));
    component.keyboardManagerService.receiveKeyboardEvent(new KeyboardEvent(KEY_DOWN, { key: KeyboardKey.E }));
    component.checkForKeyboardShortcuts();
    component.keyboardManagerService.receiveKeyboardEvent(new KeyboardEvent(KEY_UP, { key: KeyboardKey.Ctrl }));
    component.keyboardManagerService.receiveKeyboardEvent(new KeyboardEvent(KEY_UP, { key: KeyboardKey.E }));
    expect(spy).toHaveBeenCalled();
  });

  it('#SaveDrawingDialog should open when the user press ctrl and S', () => {
    const spy = spyOn(component.dialog, 'open');
    component.keyboardManagerService.receiveKeyboardEvent(new KeyboardEvent(KEY_DOWN, { key: KeyboardKey.Ctrl }));
    component.keyboardManagerService.receiveKeyboardEvent(new KeyboardEvent(KEY_DOWN, { key: KeyboardKey.S }));
    component.checkForKeyboardShortcuts();
    component.keyboardManagerService.receiveKeyboardEvent(new KeyboardEvent(KEY_UP, { key: KeyboardKey.Ctrl }));
    component.keyboardManagerService.receiveKeyboardEvent(new KeyboardEvent(KEY_UP, { key: KeyboardKey.S }));
    expect(spy).toHaveBeenCalled();
  });

  it('#event.preventDefault should be called', () => {
    const eventObject = new MouseEvent(MOUSE_UP, {bubbles: true});
    const spy = spyOn(eventObject, 'preventDefault');
    component.preventDefault(eventObject);
    expect(spy).toHaveBeenCalled();
  });
});
