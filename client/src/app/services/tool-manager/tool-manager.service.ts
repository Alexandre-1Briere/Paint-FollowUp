import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { KeyboardKey } from '../../enums/keyboard';
import { SvgUndoRedoChange } from '../../enums/svg';
import { KeyboardState } from '../../logic/events/keyboard/keyboard-state';
import {
  MouseButton,
  MouseButtonAction,
  MouseButtonState,
  MouseEventData,
  MouseLocation,
  MouseMovement,
  MouseWheelState,
} from '../../logic/events/mouse/mouse-event-data';
import { SvgCollisionsService } from '../collisions/svg-collisions.service';
import { DrawingAccessorService } from '../current-drawing-accessor/drawing-accessor.service';
import { KeyboardManagerService } from '../events/keyboard-manager.service';
import { MouseDrawingInputsService } from '../events/mouse-drawing-inputs.service';
import { SvgTransformationService } from '../svg-transformation/svg-transformation.service';
import { SvgComponentsManagerService } from '../svg/svg-components-manager.service';
import { SvgUndoRedoService } from '../undo-redo/svg-undo-redo.service';
import { ToolsOptionsManagerService } from './tools-options-manager/tools-options-manager.service';
import { Crayon } from './tools/crayon/crayon';
import { Efface } from './tools/efface/efface';
import { Rectangle } from './tools/rectangle/rectangle';
import { Tool } from './tools/tool/tool';

@Injectable({
  providedIn: 'root',
})
export class ToolManagerService {
  private selectedTool: Tool;
  private toolObs: Subject<Tool>;

  private leftIsPressed: boolean;
  private rightIsPressed: boolean;
  private keyboardHasBeenUpdated: boolean;

  constructor(
      private drawingAccessorService: DrawingAccessorService,
      private keyboardManagerService: KeyboardManagerService,
      private keyboardState: KeyboardState,
      private mouseManagerService: MouseDrawingInputsService,
      private mouseState: MouseEventData,
      private svgCollisionsService: SvgCollisionsService,
      private svgComponentsManagerService: SvgComponentsManagerService,
      private svgTransformationService: SvgTransformationService,
      private svgUndoRedoService: SvgUndoRedoService,
      private toolsOptionsManagerService: ToolsOptionsManagerService,
  ) {
    this.toolObs = new Subject();
    this.leftIsPressed = false;
    this.rightIsPressed = false;
    this.keyboardHasBeenUpdated = false;

    this.mouseManagerService.getMouseOutputObs().subscribe(() => {
      this.updateMouseEventData();
      this.onEventLogic();
    });

    this.keyboardManagerService.getKeyboardStateObs().subscribe(() => {
      this.updateKeyboardEventData();
      this.checkForKeyboardShortcut();
      this.onEventLogic();
    });

    this.svgUndoRedoService.getStacksWillChangeObs().subscribe((svgUndoRedoChange: SvgUndoRedoChange) => {
      if (svgUndoRedoChange !== SvgUndoRedoChange.SaveCalled) {
        this.selectedTool.cancelOnGoing(
            this.mouseManagerService.getMouseOutput(),
            this.keyboardManagerService.getKeyboardState(),
        );
      }
    });

    this.svgUndoRedoService.getStacksChangedObs().subscribe((svgUndoRedoChange: SvgUndoRedoChange) => {
      if (svgUndoRedoChange !== SvgUndoRedoChange.SaveCalled) {
        this.selectedTool.onBoardChange(
            this.mouseManagerService.getMouseOutput(),
            this.keyboardManagerService.getKeyboardState(),
        );
      }
    });

    Tool.CANVAS_SERVICE = this.drawingAccessorService;
    Tool.KEYBOARD_MANAGER_SERVICE = this.keyboardManagerService;
    Tool.MOUSE_MANAGER_SERVICE = this.mouseManagerService;
    Tool.SVG_COLLISIONS_SERVICE = this.svgCollisionsService;
    Tool.SVG_COMPONENT_MANAGER = this.svgComponentsManagerService;
    Tool.SVG_TRANSFORMATION_SERVICE = this.svgTransformationService;
    Tool.TOOL_OPTIONS_MANAGER = this.toolsOptionsManagerService;
    Tool.UNDO_REDO_SERVICE = this.svgUndoRedoService;
  }

  static buttonWasClicked(button: MouseButton): boolean {
    return button.action === MouseButtonAction.Click;
  }

  static buttonWasDoubleClicked(button: MouseButton): boolean {
    return button.action === MouseButtonAction.DblClick;
  }

  static mouseEnteredCanvas(mouseData: MouseEventData): boolean {
    const mouseIsInside: boolean = mouseData.location === MouseLocation.Inside;
    return mouseIsInside && mouseData.locationHasChanged;
  }

  static mouseLeftCanvas(mouseData: MouseEventData): boolean {
    const mouseIsOutside: boolean = mouseData.location === MouseLocation.Outside;
    return mouseIsOutside && mouseData.locationHasChanged;
  }

  static mouseHasMoved(mouseData: MouseEventData): boolean {
    return mouseData.movement === MouseMovement.Moved;
  }

  private mouseWheelWasUpdated(mouseData: MouseEventData): boolean {
    return !this.keyboardHasBeenUpdated &&
      (mouseData.wheel === MouseWheelState.WheelDown || mouseData.wheel === MouseWheelState.WheelUp);
  }

  setTool(tool: Tool): void {
    if (this.selectedTool !== undefined) {
      this.onUnsettingTool();
      this.selectedTool.cancelOnGoing(this.mouseState, this.keyboardState);
    }
    this.selectedTool = tool;
    this.onSettingTool();
  }

  updateTool(): void {
    this.toolObs.next(this.selectedTool);
  }

  getTool(): Tool {
    return this.selectedTool;
  }

  getToolObs(): Observable<Tool> {
    return this.toolObs.asObservable();
  }

  private updateMouseEventData(): void {
    this.mouseState = this.mouseManagerService.getMouseOutput();
  }

  private updateKeyboardEventData(): void {
    this.keyboardHasBeenUpdated = true;
    this.keyboardState = this.keyboardManagerService.getKeyboardState();
  }
  // removing the ts lint error since it is due to the check keyboard shortcut, we need the 16 if to check for the 16 tools
  // tslint:disable-next-line:cyclomatic-complexity
  private checkForKeyboardShortcut(): void {
    let newTool: Tool | undefined;

    if (this.keyboardManagerService.checkKeyboardShortcut([KeyboardKey.Nbr1], [KeyboardKey.Ctrl])) {
      newTool = Rectangle.getInstance();
    }
    if (this.keyboardManagerService.checkKeyboardShortcut([KeyboardKey.C], [KeyboardKey.Ctrl])) {
      newTool = Crayon.getInstance();
    }
    if (this.keyboardManagerService.checkKeyboardShortcut([KeyboardKey.E], [KeyboardKey.Ctrl])) {
      newTool = Efface.getInstance();
    }
    if (newTool !== undefined) {
      this.setTool(newTool);
      this.updateTool();
    }
  }

  private onEventLogic(): void {
    if (this.mouseState === undefined) { return; }

    if (ToolManagerService.mouseHasMoved(this.mouseState)) {
      this.onMouseMove();
    }
    if (this.buttonWasPressed(this.mouseState.leftButton, this.leftIsPressed)) {
      this.leftIsPressed = true;
      this.onLeftDown();
    }
    if (this.buttonWasReleased(this.mouseState.leftButton, this.leftIsPressed)) {
      this.leftIsPressed = false;
      this.onLeftUp();
    }
    if (this.buttonWasPressed(this.mouseState.rightButton, this.rightIsPressed)) {
      this.rightIsPressed = true;
      this.onRightDown();
    }
    if (this.buttonWasReleased(this.mouseState.rightButton, this.rightIsPressed)) {
      this.rightIsPressed = false;
      this.onRightUp();
    }
    if (ToolManagerService.buttonWasClicked(this.mouseState.leftButton)) {
      this.onLeftClick();
    }
    if (ToolManagerService.buttonWasDoubleClicked(this.mouseState.leftButton)) {
      this.onLeftDoubleClick();
    }
    if (ToolManagerService.buttonWasClicked(this.mouseState.rightButton)) {
      this.onRightClick();
    }
    if (ToolManagerService.mouseLeftCanvas(this.mouseState)) {
      this.onMouseLeave();
    }
    if (ToolManagerService.mouseEnteredCanvas(this.mouseState)) {
      this.onMouseEnter();
    }
    if (this.mouseWheelWasUpdated(this.mouseState)) {
      this.onWheelEvent();
    }
    if (this.keyboardHasBeenUpdated) {
      this.onKeyPress();
      this.onKeyRelease();
      this.keyboardHasBeenUpdated = false;
    }
  }

  private buttonWasPressed(button: MouseButton, btnIsPressed: boolean): boolean {
    const isPressed: boolean = button.state === MouseButtonState.Pressed;
    return isPressed && button.stateHasChanged && !btnIsPressed;
  }

  private buttonWasReleased(button: MouseButton, btnIsPressed: boolean): boolean {
    const isReleased: boolean = button.state === MouseButtonState.Released;
    return isReleased && button.stateHasChanged && btnIsPressed;
  }

  private onSettingTool(): void {
    this.toolsOptionsManagerService.configureOptions(this.selectedTool.options);
    this.selectedTool.onSettingTool(this.mouseState, this.keyboardState);
  }
  private onUnsettingTool(): void {
    this.selectedTool.onRemovingTool(this.mouseState, this.keyboardState);
    this.selectedTool.options = this.toolsOptionsManagerService.getOptions();
  }
  private onLeftDown(): void { this.selectedTool.onLeftDown(this.mouseState, this.keyboardState); }
  private onLeftUp(): void { this.selectedTool.onLeftUp(this.mouseState, this.keyboardState); }
  private onLeftClick(): void { this.selectedTool.onLeftClick(this.mouseState, this.keyboardState); }
  private onLeftDoubleClick(): void { this.selectedTool.onLeftDoubleClick(this.mouseState, this.keyboardState); }
  private onRightDown(): void { this.selectedTool.onRightDown(this.mouseState, this.keyboardState); }
  private onRightUp(): void { this.selectedTool.onRightUp(this.mouseState, this.keyboardState); }
  private onRightClick(): void { this.selectedTool.onRightClick(this.mouseState, this.keyboardState); }
  private onMouseMove(): void { this.selectedTool.onMouseMove(this.mouseState, this.keyboardState); }
  private onMouseLeave(): void { this.selectedTool.onMouseLeave(this.mouseState, this.keyboardState); }
  private onMouseEnter(): void { this.selectedTool.onMouseEnter(this.mouseState, this.keyboardState); }
  private onWheelEvent(): void { this.selectedTool.onWheelEvent(this.mouseState, this.keyboardState); }
  private onKeyPress(): void { this.selectedTool.onKeyPress(this.mouseState, this.keyboardState); }
  private onKeyRelease(): void { this.selectedTool.onKeyRelease(this.mouseState, this.keyboardState); }
}
