import {Point} from '../../../../../interfaces/point';

export enum MouseButtonUsed {
  Left,
  Right,
  None,
}

enum CursorBehavior {
  Anchored,
  Dragged,
  DraggedBackToAnchor,
}

const DEFAULT_POSITION = 0;

export class CursorState {
  private anchor: Point;
  private cursor: Point;
  private cursorBehavior: CursorBehavior;
  private cursorButton: MouseButtonUsed;
  private anchorPermission: boolean;

  constructor() {
    this.anchor = {x: DEFAULT_POSITION, y: DEFAULT_POSITION};
    this.cursor = {x: DEFAULT_POSITION, y: DEFAULT_POSITION};
    this.cursorBehavior = CursorBehavior.Anchored;
    this.cursorButton = MouseButtonUsed.None;
    this.anchorPermission = true;
  }

  getCursorButton(): MouseButtonUsed {
    return this.cursorButton;
  }

  getAnchorPoint(): Point {
    return {x: this.anchor.x, y: this.anchor.y};
  }

  getCursorPosition(): Point {
    return {x: this.cursor.x, y: this.cursor.y};
  }

  getLogicalCursorPosition(): Point {
    if (this.cursorBehavior === CursorBehavior.Dragged) {
      return {x: this.cursor.x, y: this.cursor.y};
    } else {
      return {x: this.anchor.x, y: this.anchor.y};
    }
  }

  cursorIsAnchored(): boolean {
    return this.cursorBehavior === CursorBehavior.Anchored;
  }

  cursorIsDragging(): boolean {
    return this.cursorBehavior !== CursorBehavior.Anchored;
  }

  tryToSetAnchor(anchor: Point, mouseButton: MouseButtonUsed): void {
    if (this.anchorPermission) {
      this.anchor = {x: anchor.x, y: anchor.y};
      this.cursor = {x: anchor.x, y: anchor.y};
      this.cursorBehavior = CursorBehavior.Anchored;
      this.cursorButton = mouseButton;
      this.anchorPermission = false;
    }
  }

  tryToFreeAnchorPermission(mouseButton: MouseButtonUsed): void {
    if (this.cursorButton === mouseButton) {
      this.anchorPermission = true;
    }
  }

  updateCursor(point: Point): void {
    this.cursor = {x: point.x, y: point.y};
    this.updateCursorBehavior();
  }

  private updateCursorBehavior(): void {
    const MINIMUM_SIDE_DISTANCE = 3;
    if (Math.abs(this.cursor.x - this.anchor.x) < MINIMUM_SIDE_DISTANCE ||
        Math.abs(this.cursor.y - this.anchor.y) < MINIMUM_SIDE_DISTANCE) {
      if (this.cursorBehavior === CursorBehavior.Dragged) {
        this.cursorBehavior = CursorBehavior.DraggedBackToAnchor;
      }
    } else {
      this.cursorBehavior = CursorBehavior.Dragged;
    }
  }
}
