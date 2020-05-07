import { ElementRef } from '@angular/core';
import { Documented } from '../../../../interfaces/documented';
import { KeyboardState } from '../../../../logic/events/keyboard/keyboard-state';
import { MouseEventData } from '../../../../logic/events/mouse/mouse-event-data';
import {ClipboardService} from '../../../clipboard/clipboard.service';
import { SvgCollisionsService } from '../../../collisions/svg-collisions.service';
import { DrawingAccessorService } from '../../../current-drawing-accessor/drawing-accessor.service';
import { KeyboardManagerService } from '../../../events/keyboard-manager.service';
import { MouseDrawingInputsService } from '../../../events/mouse-drawing-inputs.service';
import { SvgTransformationService } from '../../../svg-transformation/svg-transformation.service';
import { SvgComponentsManagerService } from '../../../svg/svg-components-manager.service';
import { SvgUndoRedoService } from '../../../undo-redo/svg-undo-redo.service';
import { ToolsOptionsManagerService } from '../../tools-options-manager/tools-options-manager.service';
import { Option } from '../../tools-options-manager/tools-options/option';
import { Coords } from '../coords';

export abstract class Tool implements Documented {

  static CANVAS_SERVICE: DrawingAccessorService;
  static KEYBOARD_MANAGER_SERVICE: KeyboardManagerService;
  static MOUSE_MANAGER_SERVICE: MouseDrawingInputsService;
  static SVG_COMPONENT_MANAGER: SvgComponentsManagerService;
  static SVG_COLLISIONS_SERVICE: SvgCollisionsService;
  static SVG_TRANSFORMATION_SERVICE: SvgTransformationService;
  static CLIPBOARD_SERVICE: ClipboardService;
  static TOOL_OPTIONS_MANAGER: ToolsOptionsManagerService;
  static UNDO_REDO_SERVICE: SvgUndoRedoService;
  static TRACKED_DRAWING_REF: ElementRef;

  protected static instance: Tool;

  icon: string | undefined;
  name: string;
  category: string;
  description: string;
  usage: string;

  origin: Coords | undefined;
  primaryButton: string | undefined;

  size: number;
  angle: number;

  options: Option[];

  protected constructor() { return; }

  static getInstance(TOOL_TYPE: Tool): Tool {
    if (this.instance === undefined) {
      this.instance = TOOL_TYPE;
    }
    return this.instance;
  }

  setToolInfo(icon: string | undefined,
              category: string,
              name: string,
              description: string,
              usage: string,
              options: Option[]): void {
    this.icon = icon;
    this.category = category;
    this.name = name;
    this.description = description;
    this.usage = usage;
    this.options = options;
  }

  reset(): void {
    return;
  }

  cancelOnGoing(mouseData: MouseEventData, keyboardData: KeyboardState): void {
    return;
  }

  onSettingTool(mouseData: MouseEventData, keyboardData: KeyboardState): void {
    return;
  }

  onBoardChange(mouseData: MouseEventData, keyboardData: KeyboardState): void {
    return;
  }

  onRemovingTool(mouseData: MouseEventData, keyboardData: KeyboardState): void {
    return;
  }

  onLeftDown(mouseData: MouseEventData, keyboardData: KeyboardState): void {
    return;
  }

  onLeftUp(mouseData: MouseEventData, keyboardData: KeyboardState): void {
    return;
  }

  onLeftClick(mouseData: MouseEventData, keyboardData: KeyboardState): void {
    return;
  }

  onLeftDoubleClick(mouseData: MouseEventData, keyboardData: KeyboardState): void {
    return;
  }

  onRightDown(mouseData: MouseEventData, keyboardData: KeyboardState): void {
    return;
  }

  onRightUp(mouseData: MouseEventData, keyboardData: KeyboardState): void {
    return;
  }

  onRightClick(mouseData: MouseEventData, keyboardData: KeyboardState): void {
    return;
  }

  onMouseMove(mouseData: MouseEventData, keyboardData: KeyboardState): void { return; }

  onMouseLeave(mouseData: MouseEventData, keyboardData: KeyboardState): void { return; }
  onMouseEnter(mouseData: MouseEventData, keyboardData: KeyboardState): void { return; }

  onWheelEvent(mouseData: MouseEventData, keyboardData: KeyboardState): void { return; }

  onKeyPress(mouseData: MouseEventData, keyboardData: KeyboardState): void { return; }
  onKeyRelease(mouseData: MouseEventData, keyboardData: KeyboardState): void { return; }
}
