import {KeyboardKey, KeyState} from '../../../../enums/keyboard';
import {KeyboardState} from '../../../../logic/events/keyboard/keyboard-state';
import {MouseEventData, MouseLocation, MouseWheelState} from '../../../../logic/events/mouse/mouse-event-data';
import {SvgBasicProperties} from '../../../../logic/svg/base-svg/svg-basic-properties';
import {Tool} from '../tool/tool';
import {CursorState, MouseButtonUsed} from './helpers/cursor-state';
import {KeyboardTranslator} from './helpers/keyboard-translator';
import {LogicalSelection} from './helpers/logical-selection';

export enum SelectionState {
  Creation,
  Manipulation,
  Nothing,
}

enum ManipulationAction {
  Inverse,
  TranslateByMouse,
  TranslateByKeyboard,
  ResizeByMouse,
  None,
}

const NORMAL_SELECTION_COLOR = '#000000';
const INVERSE_SELECTION_COLOR = '#992255';

export class Selection extends Tool {

  private state: SelectionState;
  private manipulationAction: ManipulationAction;
  private cursorState: CursorState;

  private selectionRectangle: LogicalSelection;
  private inverseSelectionRectangle: LogicalSelection;
  private cursorSelection: LogicalSelection;

  private keyboardTranslator: KeyboardTranslator;

  constructor() {
    super();
    this.cursorState = new CursorState();
    this.selectionRectangle = new LogicalSelection(true, NORMAL_SELECTION_COLOR, true);
    this.inverseSelectionRectangle = new LogicalSelection(true, INVERSE_SELECTION_COLOR);
    this.cursorSelection = new LogicalSelection(false);

    this.keyboardTranslator = new KeyboardTranslator();

    this.reset();
  }

  static getInstance(): Tool {
    const TOOL_TYPE = new Selection();
    return super.getInstance(TOOL_TYPE);
  }

  reset(): void {
    this.state = SelectionState.Nothing;
    this.manipulationAction = ManipulationAction.None;

    this.selectionRectangle.reset();
    this.inverseSelectionRectangle.reset();
    this.cursorSelection.reset();

    this.keyboardTranslator.reset();
  }

  cancelOnGoing(mouseData?: MouseEventData, keyboardData?: KeyboardState): void {
    Tool.SVG_TRANSFORMATION_SERVICE.terminate();
    this.reset();
  }

  onRemovingTool(mouseData: MouseEventData, keyboardData: KeyboardState): void {
    this.cancelOnGoing(mouseData, keyboardData);
  }

  selectSvgComponents(svgComponents: SvgBasicProperties[]): void {
    this.cancelOnGoing();
    if (svgComponents.length > 0) {
      this.selectionRectangle.selectSvgComponents(svgComponents);
      this.readyManipulationActions();
    }
  }

  onLeftDown(mouseData: MouseEventData, keyboardState: KeyboardState): void {
    if (mouseData.location === MouseLocation.Outside) { return; }

    if (this.keyboardTranslator.tryToTerminate()) {
      this.readyManipulationActions();
    }

    this.cursorState.tryToSetAnchor(mouseData, MouseButtonUsed.Left);

    if (this.cursorState.getCursorButton() === MouseButtonUsed.Left) {
      if (this.selectionRectangle.tryToGrabControlPoint(mouseData)) {
        this.tryToStartManipulationAction(ManipulationAction.ResizeByMouse);
      }

      if (this.manipulationAction === ManipulationAction.None) {
        this.tryToSelectSingleComponent(mouseData);
      }

      if (this.state === SelectionState.Nothing) {
        this.selectionRectangle.startSelectionRectangle(mouseData);
        this.state = SelectionState.Creation;
      }

      if (this.tryToStartManipulationAction(ManipulationAction.TranslateByMouse)) {
        Tool.SVG_TRANSFORMATION_SERVICE.begin(this.selectionRectangle.getAllComponents(), mouseData);
      }
    }
  }

  onRightDown(mouseData: MouseEventData, keyboardState: KeyboardState): void {
    if (mouseData.location === MouseLocation.Outside) { return; }

    if (this.keyboardTranslator.tryToTerminate()) {
      this.readyManipulationActions();
    }

    this.cursorState.tryToSetAnchor(mouseData, MouseButtonUsed.Right);

    if (this.cursorState.getCursorButton() === MouseButtonUsed.Right) {
      if (this.state === SelectionState.Nothing || this.manipulationIsAvailable()) {
        this.inverseSelectionRectangle.startSelectionRectangle(mouseData);
        this.manipulationAction = ManipulationAction.Inverse;
      }
    }
  }

  onLeftClick(mouseData: MouseEventData, keyboardData: KeyboardState): void {
    if (mouseData.location === MouseLocation.Outside) { return; }

    if (this.cursorState.getCursorButton() === MouseButtonUsed.Left && this.cursorState.cursorIsAnchored()) {
      if (this.manipulationAction === ManipulationAction.None) {
        const component = this.cursorSelection.tryToSelectAtCursor(mouseData);
        if (component === undefined) {
          this.reset();
        } else {
          this.selectionRectangle.replaceWith(this.cursorSelection);
        }
      }
    }
  }

  onRightClick(mouseData: MouseEventData, keyboardData: KeyboardState): void {
    if (mouseData.location === MouseLocation.Outside) { return; }

    if (this.cursorState.getCursorButton() === MouseButtonUsed.Right && this.cursorState.cursorIsAnchored()) {
      if (this.manipulationAction === ManipulationAction.None) {
        this.cursorSelection.tryToSelectAtCursor(mouseData);
        this.selectionRectangle.tryToApplyInversionFrom(this.cursorSelection);

        if (!this.selectionRectangle.hasSelectedComponents()) {
          this.reset();
        } else {
          this.readyManipulationActions();
        }
      }
    }
  }

  onMouseMove(mouseData: MouseEventData, keyboardData: KeyboardState): void {
    this.cursorState.updateCursor(mouseData);

    if (this.state === SelectionState.Creation) {
      this.selectionRectangle.dragSelectionRectangle(mouseData);
    }
    if (this.manipulationAction === ManipulationAction.Inverse &&
        this.cursorState.getCursorButton() === MouseButtonUsed.Right) {
      this.inverseSelectionRectangle.dragSelectionRectangle(mouseData);
    }

    if (this.manipulationAction === ManipulationAction.TranslateByMouse) {
      Tool.SVG_TRANSFORMATION_SERVICE.translateAllTo(mouseData);
    }

    if (this.manipulationAction === ManipulationAction.ResizeByMouse) {
      this.selectionRectangle.tryToMoveControlPoint(mouseData);
    }
  }

  onLeftUp(mouseData: MouseEventData, keyboardState: KeyboardState): void {
    if (this.state === SelectionState.Creation && this.cursorState.getCursorButton() === MouseButtonUsed.Left) {
      this.tryToFinishSelectionRectangle(mouseData);
    }

    if (this.manipulationAction === ManipulationAction.TranslateByMouse) {
      this.readyManipulationActions();
      Tool.SVG_TRANSFORMATION_SERVICE.terminate();
    }

    if (this.manipulationAction === ManipulationAction.ResizeByMouse) {
      this.selectionRectangle.finishMovingControlPoint();
      this.readyManipulationActions();
    }

    this.cursorState.tryToFreeAnchorPermission(MouseButtonUsed.Left);
  }

  onRightUp(mouseData: MouseEventData, keyboardState: KeyboardState): void {
    if (this.manipulationAction === ManipulationAction.Inverse &&
        this.cursorState.getCursorButton() === MouseButtonUsed.Right) {
      this.tryToFinishInversionRectangle(mouseData);
    }

    this.cursorState.tryToFreeAnchorPermission(MouseButtonUsed.Right);
  }

  onWheelEvent(mouseData: MouseEventData, keyboardState: KeyboardState): void {
    if (!this.manipulationIsAvailable()) { return; }

    let angle = 15;
    if (keyboardState.getKeyState(KeyboardKey.Alt) === KeyState.Down) { angle = 1; }
    if (mouseData.wheel === MouseWheelState.WheelDown) { angle *= -1; }

    if (keyboardState.getKeyState(KeyboardKey.LShift) === KeyState.Down) {
      this.selectionRectangle.rotateClockwiseAroundSelf(angle);
    } else {
      this.selectionRectangle.rotateClockwiseAroundCenter(angle);
    }
  }

  onKeyPress(mouseData: MouseEventData, keyboardData: KeyboardState): void {
    if (this.manipulationAction === ManipulationAction.TranslateByKeyboard) {
      this.keyboardTranslator.update(keyboardData);
    }
    if ((keyboardData.getKeyState(KeyboardKey.Left) === KeyState.Down ||
         keyboardData.getKeyState(KeyboardKey.Right) === KeyState.Down ||
         keyboardData.getKeyState(KeyboardKey.Up) === KeyState.Down ||
         keyboardData.getKeyState(KeyboardKey.Down) === KeyState.Down) &&
         this.tryToStartManipulationAction(ManipulationAction.TranslateByKeyboard)) {
      this.keyboardTranslator.begin(this.selectionRectangle.getAllComponents(), keyboardData);
    }
    if (Tool.KEYBOARD_MANAGER_SERVICE.checkKeyboardShortcut([KeyboardKey.A, KeyboardKey.Ctrl], [])) {
      this.tryToSelectAll();
    }
    this.clipboardActions(mouseData, keyboardData);
  }

  private clipboardActions(mouseData: MouseEventData, keyboardData: KeyboardState): void {
    if (Tool.KEYBOARD_MANAGER_SERVICE.checkKeyboardShortcut([KeyboardKey.Delete], [])) {
      this.tryToDeleteSelection();
    }
    if (Tool.KEYBOARD_MANAGER_SERVICE.checkKeyboardShortcut([KeyboardKey.Ctrl, KeyboardKey.C], [])) {
      this.tryToCopySelection();
    }
    if (Tool.KEYBOARD_MANAGER_SERVICE.checkKeyboardShortcut([KeyboardKey.Ctrl, KeyboardKey.X], [])) {
      this.tryToCutSelection();
    }
    if (Tool.KEYBOARD_MANAGER_SERVICE.checkKeyboardShortcut([KeyboardKey.Ctrl, KeyboardKey.D], [])) {
      this.tryToDuplicateSelection();
    }
  }

  clipboardActionsAreAvailable(): boolean {
    return this.state === SelectionState.Manipulation;
  }

  tryToDeleteSelection(): void {
    if (this.state === SelectionState.Manipulation) {
      this.selectionRectangle.deleteSelection();
      this.reset();
      Tool.UNDO_REDO_SERVICE.saveSvgBoard();
    }
  }

  tryToCopySelection(): void {
    if (this.state === SelectionState.Manipulation) {
      this.selectionRectangle.replaceClipboardContent();
    }
  }

  tryToCutSelection(): void {
    if (this.state === SelectionState.Manipulation) {
      this.selectionRectangle.replaceClipboardContent();
      this.selectionRectangle.deleteSelection();
      this.reset();
      Tool.UNDO_REDO_SERVICE.saveSvgBoard();
    }
  }

  tryToDuplicateSelection(): void {
    if (this.state === SelectionState.Manipulation) {
      this.readyManipulationActions();
      Tool.SVG_TRANSFORMATION_SERVICE.reset();
      this.selectionRectangle.duplicateContent();
    }
  }

  onKeyRelease(mouseData: MouseEventData, keyboardData: KeyboardState): void {
    if (this.manipulationAction === ManipulationAction.TranslateByKeyboard) {
      this.keyboardTranslator.update(keyboardData);
    }
  }

  private manipulationIsAvailable(): boolean {
    return this.state === SelectionState.Manipulation && this.manipulationAction === ManipulationAction.None;
  }

  private readyManipulationActions(): void {
    this.state = SelectionState.Manipulation;
    this.manipulationAction = ManipulationAction.None;
    this.selectionRectangle.enableControlPoints(true);
  }

  private tryToStartManipulationAction(manipulationAction: ManipulationAction): boolean {
    if (this.manipulationIsAvailable()) {
      this.manipulationAction = manipulationAction;
      this.selectionRectangle.enableControlPoints(false);
      return true;
    }
    return false;
  }

  private tryToSelectSingleComponent(mouseData: MouseEventData): void {
    const component = this.cursorSelection.tryToSelectAtCursor(mouseData);
    if (component === undefined) {
      if (!this.selectionRectangle.hasSelectedComponents() ||
          !this.selectionRectangle.inContactWithCursor(mouseData)) {
        this.reset();
      }
    } else if (!component.isSelected) {
      this.selectionRectangle.replaceWith(this.cursorSelection);
      this.readyManipulationActions();
    }
  }

  private tryToFinishSelectionRectangle(mouseData: MouseEventData): void {
    if (this.cursorState.cursorIsDragging()) {
      this.selectionRectangle.tryToSelectRectangle(mouseData);
    }
    if (this.selectionRectangle.hasSelectedComponents()) {
      this.readyManipulationActions();
    } else {
      this.reset();
    }
  }

  private tryToFinishInversionRectangle(mouseData: MouseEventData): void {
    if (this.cursorState.cursorIsDragging()) {
      this.inverseSelectionRectangle.tryToSelectRectangle(mouseData);
      this.selectionRectangle.tryToApplyInversionFrom(this.inverseSelectionRectangle);
    }
    this.inverseSelectionRectangle.reset();

    if (!this.selectionRectangle.hasSelectedComponents()) {
      this.reset();
    } else {
      this.readyManipulationActions();
    }
  }

  private tryToSelectAll(): void {
    if (this.manipulationIsAvailable() || this.state === SelectionState.Nothing) {
      this.cancelOnGoing();
      this.selectionRectangle.selectAll();
      if (this.selectionRectangle.hasSelectedComponents()) {
        this.readyManipulationActions();
      }
    }
  }
}
// tslint:disable:max-file-line-count
// This file is very close to 350 lines and class delegates most responsibilities to helpers
