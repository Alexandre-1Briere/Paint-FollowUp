import { Injectable } from '@angular/core';
import { KEY_DOWN, KEY_UP } from '../../../constants/keyboard';
import { KeyboardKey, KeyState } from '../../../enums/keyboard';

interface KeyInformation {
  key: KeyboardKey;
  state: KeyState;
  timeSinceEvent: number;
}

const DEFAULT_STATE = KeyState.Up;
const RESET_TIME_STAMP = 0;
const DEFAULT_NO_KEY_ACCESSED = undefined;

@Injectable({
  providedIn: 'root',
})
export class KeyboardState {
  private keys: KeyInformation[];
  private lastEventTimeStamp: number;
  private lastAccessed: KeyInformation | undefined;

  constructor() {
    this.keys = [];
    this.lastEventTimeStamp = RESET_TIME_STAMP;
    this.lastAccessed = DEFAULT_NO_KEY_ACCESSED;

    // tslint:disable-next-line
    for (const keyString in KeyboardKey) {
      const key: KeyboardKey = KeyboardKey[keyString] as KeyboardKey;
      this.keys.push({key, state: DEFAULT_STATE, timeSinceEvent: RESET_TIME_STAMP});
    }
  }

  update(event: KeyboardEvent): void {
    this.updateTimeStamps(event.timeStamp);
    let state = KeyState.Unknown;
    if (event.type === KEY_UP) {
      state = KeyState.Up;
    } else if (KEY_DOWN === event.type) {
      state = KeyState.Down;
    } else {
      return;
    }

    const keyInformation: KeyInformation | undefined = this.findByValue(event.key);
    if (keyInformation !== undefined && keyInformation.state !== state) {
      this.lastAccessed = keyInformation;
      this.lastAccessed.state = state;
      this.lastAccessed.timeSinceEvent = RESET_TIME_STAMP;
    }
  }

  lastAccessedWasUpdated(): boolean {
    if (this.lastAccessed !== undefined) {
      return this.lastAccessed.timeSinceEvent === RESET_TIME_STAMP;
    } else {
      const UNDEFINED_IS_NOT_UPDATED = false;
      return UNDEFINED_IS_NOT_UPDATED;
    }
  }

  lastAccessedIsInKeys(keys: KeyboardKey[]): boolean {
    if (this.lastAccessed === undefined) {
      return false;
    }
    for (const key of keys) {
      if (key === this.lastAccessed.key) {
        return true;
      }
    }
    return false;
  }

  getKeyState(key: KeyboardKey): KeyState {
    const keyInformation: KeyInformation | undefined = this.find(key);
    if (keyInformation !== undefined) {
      return keyInformation.state;
    } else {
      return KeyState.Unknown;
    }
  }

  timeSinceEventMilliseconds(key: KeyboardKey): number {
    const keyInformation: KeyInformation | undefined = this.find(key);
    if (keyInformation !== undefined) {
      return keyInformation.timeSinceEvent;
    } else {
      return 0;
    }
  }

  private find(key: KeyboardKey): KeyInformation | undefined {
    for (const keyInformation of this.keys) {
      if (key === keyInformation.key) {
        return keyInformation;
      }
    }
    return undefined;
  }

  private findByValue(keyString: string): KeyInformation | undefined {
    for (const keyInformation of this.keys) {
      if (keyString.toLowerCase() === keyInformation.key.valueOf().toLowerCase()) {
        return keyInformation;
      }
    }
    return undefined;
  }

  private updateTimeStamps(currentTimeStamp: number): void {
    const durationSinceLastEvent = currentTimeStamp - this.lastEventTimeStamp;
    this.lastEventTimeStamp = currentTimeStamp;
    for (const keyInformation of this.keys) {
      keyInformation.timeSinceEvent += durationSinceLastEvent;
    }
  }
}
