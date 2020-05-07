import { KeyboardKey, KeyState } from '../../../../../enums/keyboard';
import { Point } from '../../../../../interfaces/point';
import { KeyboardState } from '../../../../../logic/events/keyboard/keyboard-state';
import { SvgBasicProperties } from '../../../../../logic/svg/base-svg/svg-basic-properties';
import { Tool } from '../../tool/tool';

const DEFAULT_POSITION = 0;
const NOT_ACTIVE = false;

const TRANSLATE_AMOUNT = 3;
const INITIAL_DELAY_MS = 500;
const SUBSEQUENT_DELAY_MS = 100;

enum ARROW_DIRECTION {
  POSITIVE,
  NEGATIVE,
  NONE,
}

interface ArrowsState {
  upActive: boolean;
  downActive: boolean;
  leftActive: boolean;
  rightActive: boolean;
  atLeastOneActive: boolean;
  horizontalDirection: ARROW_DIRECTION;
  verticalDirection: ARROW_DIRECTION;
}

export class KeyboardTranslator {
  protected arrowsState: ArrowsState;
  protected isActive: boolean;
  protected translationTimer: number;
  protected translationPoint: Point;

  reset(): void {
    this.arrowsState = {
      upActive: NOT_ACTIVE,
      downActive: NOT_ACTIVE,
      leftActive: NOT_ACTIVE,
      rightActive: NOT_ACTIVE,
      atLeastOneActive: NOT_ACTIVE,
      horizontalDirection: ARROW_DIRECTION.NONE,
      verticalDirection: ARROW_DIRECTION.NONE,
    };
    this.isActive = false;
    this.translationPoint = {x: DEFAULT_POSITION, y: DEFAULT_POSITION};
    clearTimeout(this.translationTimer);
  }

  constructor() {
    this.reset();
  }

  private translationTimerEvent = () => {
    this.onTimerTranslation();
    if (this.arrowsState.atLeastOneActive) {
      this.continueTranslationTimer();
    }
  }

  begin(svgComponents: SvgBasicProperties[], keyboardState: KeyboardState): void {
    this.reset();
    this.isActive = true;
    Tool.SVG_TRANSFORMATION_SERVICE.begin(svgComponents, {x: this.translationPoint.x, y: this.translationPoint.y});
    this.update(keyboardState);
  }

  update(keyboardState: KeyboardState): void {
    const previousState = this.cloneArrowsState();

    this.arrowsState.upActive = keyboardState.getKeyState(KeyboardKey.Up) === KeyState.Down;
    this.arrowsState.downActive = keyboardState.getKeyState(KeyboardKey.Down) === KeyState.Down;
    this.arrowsState.leftActive = keyboardState.getKeyState(KeyboardKey.Left) === KeyState.Down;
    this.arrowsState.rightActive = keyboardState.getKeyState(KeyboardKey.Right) === KeyState.Down;

    this.chooseHorizontalDirection(previousState);
    this.chooseVerticalDirection(previousState);
    this.updateIsActive();

    this.onPressedTranslation(previousState);
    if (this.arrowsState.atLeastOneActive && !previousState.atLeastOneActive) {
      this.startTranslationTimer();
    } else if (!this.arrowsState.atLeastOneActive && previousState.atLeastOneActive) {
      clearTimeout(this.translationTimer);
    }
  }

  isInUse(): boolean {
    return this.arrowsState.atLeastOneActive && this.isActive;
  }

  terminate(): void {
    Tool.SVG_TRANSFORMATION_SERVICE.terminate();
    this.reset();
  }

  tryToTerminate(): boolean {
    if (!this.isInUse()) {
      this.terminate();
      return true;
    }
    return false;
  }

  private startTranslationTimer(): void {
    this.translationTimer = window.setTimeout(
      this.translationTimerEvent,
      INITIAL_DELAY_MS,
    );
  }

  private continueTranslationTimer(): void {
    this.translationTimer = window.setTimeout(
      this.translationTimerEvent,
      SUBSEQUENT_DELAY_MS,
    );
  }

  private onPressedTranslation(previousState: ArrowsState): void {
    let dx = 0;
    if (this.arrowsState.leftActive && !previousState.leftActive) {
      dx -= TRANSLATE_AMOUNT;
    }
    if (this.arrowsState.rightActive && !previousState.rightActive) {
      dx += TRANSLATE_AMOUNT;
    }
    let dy = 0;
    if (this.arrowsState.upActive && !previousState.upActive) {
      dy -= TRANSLATE_AMOUNT;
    }
    if (this.arrowsState.downActive && !previousState.downActive) {
      dy += TRANSLATE_AMOUNT;
    }

    this.applyTranslation(dx, dy);
  }

  private onTimerTranslation(): void {
    let dx = 0;
    if (this.arrowsState.horizontalDirection === ARROW_DIRECTION.NEGATIVE) {
      dx = -TRANSLATE_AMOUNT;
    } else if (this.arrowsState.horizontalDirection === ARROW_DIRECTION.POSITIVE) {
      dx = TRANSLATE_AMOUNT;
    }
    let dy = 0;
    if (this.arrowsState.verticalDirection === ARROW_DIRECTION.NEGATIVE) {
      dy = -TRANSLATE_AMOUNT;
    } else if (this.arrowsState.verticalDirection === ARROW_DIRECTION.POSITIVE) {
      dy = TRANSLATE_AMOUNT;
    }

    this.applyTranslation(dx, dy);
  }

  private applyTranslation(dx: number, dy: number): void {
    if (dx !== 0 || dy !== 0) {
      this.translationPoint.x += dx;
      this.translationPoint.y += dy;
      Tool.SVG_TRANSFORMATION_SERVICE.translateAllTo(this.translationPoint);
    }
  }

  private chooseHorizontalDirection(previousState: ArrowsState): void {
    if (this.arrowsState.leftActive && !previousState.leftActive) {
      this.arrowsState.horizontalDirection = ARROW_DIRECTION.NEGATIVE;
    } else if (this.arrowsState.rightActive && !previousState.rightActive) {
      this.arrowsState.horizontalDirection = ARROW_DIRECTION.POSITIVE;
    } else if (this.arrowsState.leftActive && !this.arrowsState.rightActive) {
      this.arrowsState.horizontalDirection = ARROW_DIRECTION.NEGATIVE;
    } else if (this.arrowsState.rightActive && !this.arrowsState.leftActive) {
      this.arrowsState.horizontalDirection = ARROW_DIRECTION.POSITIVE;
    }

    if (!this.arrowsState.leftActive && !this.arrowsState.rightActive) {
      this.arrowsState.horizontalDirection = ARROW_DIRECTION.NONE;
    }
  }

  private chooseVerticalDirection(previousState: ArrowsState): void {
    if (this.arrowsState.upActive && !previousState.upActive) {
      this.arrowsState.verticalDirection = ARROW_DIRECTION.NEGATIVE;
    } else if (this.arrowsState.downActive && !previousState.downActive) {
      this.arrowsState.verticalDirection = ARROW_DIRECTION.POSITIVE;
    } else if (this.arrowsState.upActive && !this.arrowsState.downActive) {
      this.arrowsState.verticalDirection = ARROW_DIRECTION.NEGATIVE;
    } else if (this.arrowsState.downActive && !this.arrowsState.upActive) {
      this.arrowsState.verticalDirection = ARROW_DIRECTION.POSITIVE;
    }

    if (!this.arrowsState.upActive && !this.arrowsState.downActive) {
      this.arrowsState.verticalDirection = ARROW_DIRECTION.NONE;
    }
  }

  private updateIsActive(): void {
    this.arrowsState.atLeastOneActive =
      this.arrowsState.upActive ||
      this.arrowsState.downActive ||
      this.arrowsState.leftActive ||
      this.arrowsState.rightActive;
  }

  private cloneArrowsState(): ArrowsState {
    return {
      upActive: this.arrowsState.upActive,
      downActive: this.arrowsState.downActive,
      leftActive: this.arrowsState.leftActive,
      rightActive: this.arrowsState.rightActive,
      atLeastOneActive: this.arrowsState.atLeastOneActive,
      horizontalDirection: this.arrowsState.horizontalDirection,
      verticalDirection: this.arrowsState.verticalDirection,
    };
  }
}
