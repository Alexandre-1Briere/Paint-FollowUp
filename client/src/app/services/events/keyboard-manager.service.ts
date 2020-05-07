import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

import { KeyboardKey, KeyState } from '../../enums/keyboard';
import { KeyboardState } from '../../logic/events/keyboard/keyboard-state';

const DEFAULT_SHORTCUTS_ARE_ENABLED = true;

@Injectable({
  providedIn: 'root',
})
export class KeyboardManagerService {
  private keyboardState: KeyboardState;
  private keyboardStateOutput: Subject<KeyboardState>;
  enableShortcuts: boolean;

  constructor() {
    this.keyboardState = new KeyboardState();
    this.keyboardStateOutput = new Subject();
    this.enableShortcuts = DEFAULT_SHORTCUTS_ARE_ENABLED;
  }

  receiveKeyboardEvent(event: KeyboardEvent): void {
    this.tryToSendKeyboardState(event);
  }

  getKeyboardStateObs(): Observable<KeyboardState> {
    return this.keyboardStateOutput.asObservable();
  }

  getKeyboardState(): KeyboardState {
    return this.keyboardState;
  }

  checkKeyboardShortcut(keysPressed: KeyboardKey[], keysReleased: KeyboardKey[]): boolean {
    const IS_MATCHING = true;
    let keysAreMatching = IS_MATCHING;

    for (const keyPressed of keysPressed) {
      if (this.keyboardState.getKeyState(keyPressed) !== KeyState.Down) {
        keysAreMatching = !IS_MATCHING;
        break;
      }
    }

    for (const keyReleased of keysReleased) {
      if (this.keyboardState.getKeyState(keyReleased) !== KeyState.Up) {
        keysAreMatching = !IS_MATCHING;
        break;
      }
    }

    return keysAreMatching && this.enableShortcuts && this.keyboardState.lastAccessedIsInKeys(keysPressed);
  }

  private sendKeyboardStateObs(): void {
    this.keyboardStateOutput.next(this.getKeyboardState());
  }

  private tryToSendKeyboardState(event: KeyboardEvent): void {
    this.keyboardState.update(event);
    if (this.keyboardState.lastAccessedWasUpdated()) {
      this.sendKeyboardStateObs();
    }
  }
}
