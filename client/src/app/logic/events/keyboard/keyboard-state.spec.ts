import {KEY_DOWN, KEY_UP} from '../../../constants/keyboard';
import {KeyboardKey, KeyState} from '../../../enums/keyboard';
import {KeyboardState} from './keyboard-state';

describe('KeyboardState', () => {
  let keyboardState: KeyboardState;

  beforeEach(() => {
    keyboardState = new KeyboardState();
  });

  const updateWithEvent = (keyAction: string, key: KeyboardKey): KeyboardEvent => {
    const event = new KeyboardEvent(keyAction, {key: key.toString()});
    keyboardState.update(event);
    return event;
  };

  it('should create an instance', () => {
    expect(new KeyboardState()).toBeTruthy();
  });

  it('#update() do change lastAccess after event', () => {
    updateWithEvent(KEY_DOWN, KeyboardKey.A);
    expect(keyboardState.lastAccessedWasUpdated()).toBeTruthy();
  });

  it('#update() leaves lastAccess undefined after unknown event', () => {
    const UNKNOWN_KEY = 'special';
    const event = new KeyboardEvent(KEY_DOWN, {key: UNKNOWN_KEY});
    keyboardState.update(event);
    expect(keyboardState.lastAccessedWasUpdated()).toBeFalsy();
  });

  it('#update() leaves lastAccess undefined after garbage input event', () => {
    const KEY: KeyboardKey = KeyboardKey.LShift;
    const GARBAGE_EVENT = 'garbage';
    const event = new KeyboardEvent(GARBAGE_EVENT, {key: KEY});
    keyboardState.update(event);
    expect(keyboardState.lastAccessedWasUpdated()).toBeFalsy();
  });

  it('#lastAccessedIsInKeys() returns false by default', () => {
    expect(keyboardState.lastAccessedIsInKeys([KeyboardKey.A])).toBeFalsy();
  });

  it('#lastAccessedIsInKeys() works as expected', () => {
    const KEY = KeyboardKey.A;
    updateWithEvent(KEY_DOWN, KEY);
    expect(keyboardState.lastAccessedIsInKeys([KEY])).toBeTruthy();
    updateWithEvent(KEY_DOWN, KeyboardKey.B);
    expect(keyboardState.lastAccessedIsInKeys([KEY])).toBeFalsy();
  });

  it('#getKeyState() works with consecutive events', () => {
    const KEY: KeyboardKey = KeyboardKey.Enter;
    updateWithEvent(KEY_DOWN, KEY);
    expect(keyboardState.getKeyState(KEY)).toEqual(KeyState.Down);

    updateWithEvent(KEY_UP, KEY);
    expect(keyboardState.getKeyState(KEY)).toEqual(KeyState.Up);
  });

  it('#getKeyState() returns unknown when garbage input key is given', () => {
    const GARBAGE_INPUT = 'garbage';
    const eventDown = new KeyboardEvent(KEY_DOWN, {key: GARBAGE_INPUT});
    keyboardState.update(eventDown);
    expect(keyboardState.getKeyState(GARBAGE_INPUT as KeyboardKey)).toEqual(KeyState.Unknown);
  });

  it('#timeSinceEventMilliseconds() works as expected', () => {
    const KEY = KeyboardKey.A;
    const eventDown = new KeyboardEvent(KEY_DOWN, {key: KEY});
    const INITIAL_MS = 0;
    spyOnProperty(eventDown, 'timeStamp', 'get').and.returnValue(INITIAL_MS);

    keyboardState.update(eventDown);
    expect(keyboardState.timeSinceEventMilliseconds(KEY)).toEqual(INITIAL_MS);

    const OTHER_KEY = KeyboardKey.O;
    const FINAL_MS = 100;
    const delayedEvent = new KeyboardEvent(KEY_DOWN, {key: OTHER_KEY});
    spyOnProperty(delayedEvent, 'timeStamp', 'get').and.returnValue(FINAL_MS);

    keyboardState.update(delayedEvent);
    expect(keyboardState.timeSinceEventMilliseconds(KEY)).toEqual(FINAL_MS);
  });

  it('#timeSinceEventMilliseconds() does not return 0 when receiving duplicated events', () => {
    const KEY = KeyboardKey.A;
    const INITIAL_MS = 0;
    const DUPLICATED_EVENT_MS = 1;
    const SECOND_DUPLICATED_EVENT_MS = 3;

    const event = new KeyboardEvent(KEY_DOWN, {key: KEY});
    spyOnProperty(event, 'timeStamp', 'get').and.returnValue(INITIAL_MS);
    const duplicatedEvent = new KeyboardEvent(KEY_DOWN, {key: KEY});
    spyOnProperty(duplicatedEvent, 'timeStamp', 'get').and.returnValue(DUPLICATED_EVENT_MS);
    const secondDuplicatedEvent = new KeyboardEvent(KEY_DOWN, {key: KEY});
    spyOnProperty(secondDuplicatedEvent, 'timeStamp', 'get').and.returnValue(SECOND_DUPLICATED_EVENT_MS);

    keyboardState.update(event);
    expect(keyboardState.timeSinceEventMilliseconds(KEY)).toEqual(INITIAL_MS);
    keyboardState.update(duplicatedEvent);
    expect(keyboardState.timeSinceEventMilliseconds(KEY)).toEqual(DUPLICATED_EVENT_MS);
    keyboardState.update(secondDuplicatedEvent);
    expect(keyboardState.timeSinceEventMilliseconds(KEY)).toEqual(SECOND_DUPLICATED_EVENT_MS);
  });

  it('#timeSinceEventMilliseconds() returns 0ms when garbage input key is given', () => {
    const GARBAGE_INPUT = 'garbage';
    const NO_DELAY = 0;
    expect(keyboardState.timeSinceEventMilliseconds(GARBAGE_INPUT as KeyboardKey)).toEqual(NO_DELAY);
  });
});
