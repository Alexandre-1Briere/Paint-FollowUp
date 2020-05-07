import { TestBed } from '@angular/core/testing';
import { Subscription } from 'rxjs';

import { KEY_DOWN, KEY_UP } from '../../constants/keyboard';
import { KeyboardKey, KeyState } from '../../enums/keyboard';
import { KeyboardState } from '../../logic/events/keyboard/keyboard-state';
import { KeyboardManagerService } from './keyboard-manager.service';

const NO_EVENT_INITIALLY = 0;
class MockComponent {
  subscription: Subscription;
  keyboardState: KeyboardState;
  howManyEvents: number = NO_EVENT_INITIALLY;
}

describe('KeyboardManagerService', () => {
  let keyboardManagerService: KeyboardManagerService;
  let mockComponent: MockComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    keyboardManagerService = TestBed.get(KeyboardManagerService);

    mockComponent = new MockComponent();
    mockComponent.subscription = keyboardManagerService.getKeyboardStateObs().subscribe((keyboardState) => {
      mockComponent.keyboardState = keyboardState;
      mockComponent.howManyEvents += 1;
    });
  });

  it('should be created', () => {
    const service: KeyboardManagerService = TestBed.get(KeyboardManagerService);
    expect(service).toBeTruthy();
  });

  it('#receiveKeyboardEvent() sends correct observable data after keyboardEvent', () => {
    const KEY = KeyboardKey.Ctrl;
    const event = new KeyboardEvent(KEY_DOWN, {key: KEY.toString()});
    keyboardManagerService.receiveKeyboardEvent(event);
    const keyStateChanged = mockComponent.keyboardState.getKeyState(KEY) === KeyState.Down;
    expect(keyStateChanged).toBeTruthy();
  });

  it('#sendKeyboardStateObs() is not triggered multiple times for duplicated events', () => {
    const KEY = KeyboardKey.A;
    const INITIAL_MS = 0;
    const DUPLICATED_EVENT_MS = 1;
    const event = new KeyboardEvent(KEY_DOWN, {key: KEY.toString()});
    spyOnProperty(event, 'timeStamp', 'get').and.returnValue(INITIAL_MS);
    const duplicatedEvent = new KeyboardEvent(KEY_DOWN, {key: KEY.toString()});
    spyOnProperty(duplicatedEvent, 'timeStamp', 'get').and.returnValue(DUPLICATED_EVENT_MS);

    keyboardManagerService.receiveKeyboardEvent(event);
    const ONLY_FIRST_TIME = 1;
    expect(mockComponent.howManyEvents).toEqual(ONLY_FIRST_TIME);

    keyboardManagerService.receiveKeyboardEvent(duplicatedEvent);
    keyboardManagerService.receiveKeyboardEvent(duplicatedEvent);
    expect(mockComponent.howManyEvents).toEqual(ONLY_FIRST_TIME);
  });

  it('#getKeyboardState() returns correct data after keyboardEvent', () => {
    const KEY = KeyboardKey.A;
    const event = new KeyboardEvent(KEY_UP, {key: KEY.toString()});
    keyboardManagerService.receiveKeyboardEvent(event);
    const keyStateChanged = keyboardManagerService.getKeyboardState().getKeyState(KEY) === KeyState.Up;
    expect(keyStateChanged).toBeTruthy();
  });

  it('#getKeyboardState() does not return KeyState.Down when no keyboardEvent was received', () => {
    const KEY = KeyboardKey.A;
    const keyStateNotDown = keyboardManagerService.getKeyboardState().getKeyState(KEY) !== KeyState.Down;
    expect(keyStateNotDown).toBeTruthy();
  });

  it('#checkKeyboardShortcut() works as expected with multiple pressed keys', () => {
    const KEY1 = KeyboardKey.A;
    let event = new KeyboardEvent(KEY_DOWN, {key: KEY1.toString()});
    keyboardManagerService.receiveKeyboardEvent(event);

    const KEY2 = KeyboardKey.B;
    event = new KeyboardEvent(KEY_DOWN, {key: KEY2.toString()});
    keyboardManagerService.receiveKeyboardEvent(event);

    expect(
      keyboardManagerService.checkKeyboardShortcut([KEY1, KEY2], []),
    ).toBeTruthy();
  });

  it('#checkKeyboardShortcut() works as expected with multiple pressed keys and released keys', () => {
    const KEY_PRESSED1 = KeyboardKey.A;
    let event = new KeyboardEvent(KEY_DOWN, {key: KEY_PRESSED1.toString()});
    keyboardManagerService.receiveKeyboardEvent(event);

    const KEY_PRESSED2 = KeyboardKey.B;
    event = new KeyboardEvent(KEY_DOWN, {key: KEY_PRESSED2.toString()});
    keyboardManagerService.receiveKeyboardEvent(event);

    const KEY_RELEASED1 = KeyboardKey.LShift;
    event = new KeyboardEvent(KEY_UP, {key: KEY_RELEASED1.toString()});
    keyboardManagerService.receiveKeyboardEvent(event);

    const KEY_RELEASED2 = KeyboardKey.Ctrl;
    event = new KeyboardEvent(KEY_UP, {key: KEY_RELEASED2.toString()});
    keyboardManagerService.receiveKeyboardEvent(event);

    expect(keyboardManagerService.checkKeyboardShortcut(
      [KEY_PRESSED1, KEY_PRESSED2], [KEY_RELEASED1, KEY_RELEASED2]),
    ).toBeTruthy();
  });

  it('#checkKeyboardShortcut() returns false when keys are not matching', () => {
    const KEY_PRESSED1 = KeyboardKey.A;
    let event = new KeyboardEvent(KEY_DOWN, {key: KEY_PRESSED1.toString()});
    keyboardManagerService.receiveKeyboardEvent(event);

    const KEY_PRESSED2 = KeyboardKey.B;

    const KEY_RELEASED1 = KeyboardKey.LShift;
    event = new KeyboardEvent(KEY_UP, {key: KEY_RELEASED1.toString()});
    keyboardManagerService.receiveKeyboardEvent(event);

    const KEY_RELEASED2 = KeyboardKey.Ctrl;

    expect(keyboardManagerService.checkKeyboardShortcut(
      [KEY_PRESSED1, KEY_PRESSED2], [KEY_RELEASED1, KEY_RELEASED2]),
    ).toBeFalsy();
  });

  it('#checkKeyboardShortcut() returns false when pressed key is expected to be released', () => {
    const KEY = KeyboardKey.A;
    const event = new KeyboardEvent(KEY_DOWN, {key: KEY.toString()});
    keyboardManagerService.receiveKeyboardEvent(event);

    expect(keyboardManagerService.checkKeyboardShortcut(
      [], [KEY]),
    ).toBeFalsy();
  });

  it('#checkKeyboardShortcut() returns false when enableShortcuts is false', () => {
    const NO_SHORTCUTS = false;
    keyboardManagerService.enableShortcuts = NO_SHORTCUTS;
    expect(keyboardManagerService.checkKeyboardShortcut([], [])).toBeFalsy();
  });
});
