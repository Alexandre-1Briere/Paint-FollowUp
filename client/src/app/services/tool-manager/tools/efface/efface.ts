import { SvgRectangleComponent } from '../../../../components/svgElement/svg-rectangle/svg-rectangle.component';
import { KeyboardKey } from '../../../../enums/keyboard';
import { SvgLayer, SvgStatus, SvgType } from '../../../../enums/svg';
import { KeyboardState } from '../../../../logic/events/keyboard/keyboard-state';
import { MouseEventData, MouseLocation } from '../../../../logic/events/mouse/mouse-event-data';
import { SvgBasicProperties } from '../../../../logic/svg/base-svg/svg-basic-properties';
import { Coords } from '../coords';
import { Tool } from '../tool/tool';

export class Efface extends Tool {

  static readonly DEFAULT_SIZE: number = 8;
  static readonly DEFAULT_OUTLINE_THICKNESS: number = 1;
  static readonly DEFAULT_OUTLINE_COLOR: string = '#000000';
  static readonly DEFAULT_COLOR: string = '#FFFFFF';
  static readonly DEFAULT_OPACITY: number = 1;

  static readonly HIGHLIGHT_PRIMARY_COLOR: string = '#CC3300';
  static readonly HIGHLIGHT_SECONDARY_COLOR: string = '#CC3300';
  static readonly HIGHLIGHT_PRIMARY_OPACITY: number = 0.2;
  static readonly HIGHLIGHT_SECONDARY_OPACITY: number = 0.2;

  protected isPressed: boolean;

  protected coords: Coords | undefined = undefined;
  protected selected: Map<SvgBasicProperties, SvgBasicProperties | undefined>;

  protected eraserSquare: SvgRectangleComponent | undefined;

  constructor() {
    super();
    super.size = Efface.DEFAULT_SIZE;
    this.isPressed = false;
    this.eraserSquare = undefined;
    this.reset();
  }

  static getInstance(): Tool {
    const TOOL_TYPE = new Efface();
    return super.getInstance(TOOL_TYPE);
  }

  onSettingTool(mouseData: MouseEventData, keyboardData: KeyboardState): void {
    this.createEraserSquare();
    this.onMouseMove(mouseData, keyboardData);
  }

  onBoardChange(mouseData: MouseEventData, keyboardData: KeyboardState): void {
    this.onMouseMove(mouseData, keyboardData);
  }

  reset(): void {
    this.coords = undefined;

    if (this.selected) {
      for (const svg of this.selected.values()) {
        if (!svg) {
          continue;
        }
        Tool.SVG_COMPONENT_MANAGER.removeSvgComponent(svg);
      }
    }
    this.isPressed = false;
    this.clearSelected();
  }

  protected createSvg(): void {
    if (!this.eraserSquare) {
      this.createEraserSquare();
      if (!this.eraserSquare) { return; }
    }

    if (!this.coords) { return; }

    const tempSize = Tool.TOOL_OPTIONS_MANAGER.getSettings().size;
    this.size = tempSize ? tempSize : Efface.DEFAULT_SIZE;
    const corner1 = new Coords(this.coords.x - this.size / 2, this.coords.y - this.size / 2);
    const corner2 = new Coords(this.coords.x + this.size / 2, this.coords.y + this.size / 2);
    this.eraserSquare.fitExactlyInside(corner1.x, corner1.y, corner2.x, corner2.y);
  }

  protected computeCoords(mouseData: MouseEventData): Coords {
    return new Coords(mouseData.x, mouseData.y);
  }

  protected eraseSelected(): void {
    let atLeastOneErased = false;
    for (const SVG of this.selected.keys()) {
      Tool.SVG_COMPONENT_MANAGER.removeSvgComponent(SVG);
      const matchingSVG = this.selected.get(SVG);
      if (matchingSVG) {
        Tool.SVG_COMPONENT_MANAGER.removeSvgComponent(matchingSVG);
        atLeastOneErased = true;
      }
    }
    if (atLeastOneErased) {
      Tool.UNDO_REDO_SERVICE.saveSvgBoard();
    }
  }

  cancelOnGoing(mouseData: MouseEventData, keyboardData: KeyboardState): void {
    this.reset();
    if (this.eraserSquare) {
      Tool.SVG_COMPONENT_MANAGER.removeSvgComponent(this.eraserSquare);
    }
    this.eraserSquare = undefined;
  }

  protected createEraserSquare(): void {
    this.eraserSquare = Tool.SVG_COMPONENT_MANAGER
        .createSvgComponent({
          onTopOfLayer: true,
          svgStatus: SvgStatus.Temporary,
          svgLayer: SvgLayer.Visual,
          svgType: SvgType.SvgRectangleComponent,
        }) as SvgRectangleComponent;
    if (!this.eraserSquare) {
      return;
    }

    this.eraserSquare.setPrimaryColor(Efface.DEFAULT_COLOR);
    this.eraserSquare.setSecondaryColor(Efface.DEFAULT_OUTLINE_COLOR);
    this.eraserSquare.setOutlineThickness(Efface.DEFAULT_OUTLINE_THICKNESS);
    this.eraserSquare.setPrimaryOpacity(Efface.DEFAULT_OPACITY);
    this.eraserSquare.setSecondaryOpacity(Efface.DEFAULT_OPACITY);

    this.eraserSquare.displayOutline = true;
    this.eraserSquare.displayFill = true;
  }

  onLeftDown(mouseData: MouseEventData, keyboardData: KeyboardState): void {
    if (mouseData.location === MouseLocation.Outside) {
      return;
    }
    this.coords = this.computeCoords(mouseData);
    this.isPressed = true;
  }

  onLeftUp(mouseData: MouseEventData, keyboardData: KeyboardState): void {
    if (!this.isPressed || !this.selected) {
      return;
    }
    this.coords = this.computeCoords(mouseData);
    this.eraseSelected();
    this.isPressed = false;
    this.reset();
  }

  onLeftClick(mouseData: MouseEventData, keyboardData: KeyboardState): void {
    if (!this.isPressed) { return; }
    this.coords = this.computeCoords(mouseData);
    this.eraseFirstUnder();
    this.isPressed = false;
    this.reset();
  }

  onMouseMove(mouseData: MouseEventData, keyboardData: KeyboardState): void {
    this.coords = this.computeCoords(mouseData);
    this.createSvg();
    if (this.isPressed) {
      this.selectAllUnder();
    } else {
      this.clearSelected();
      this.selectFirstUnder();
    }
  }

  clearSelected(): void {
    if (!this.selected) { return; }
    for (const [key, value] of this.selected.entries()) {
      if (value) {
        Tool.SVG_COMPONENT_MANAGER.removeSvgComponent(value);
      }
      this.selected.delete(key);
    }
  }

  eraseFirstUnder(): void {
    if (!this.eraserSquare) { return; }
    const SVGS = Tool.SVG_COLLISIONS_SERVICE.getSvgComponentsInContact(this.eraserSquare.getSelection());
    if (0 < SVGS.length) {
      Tool.SVG_COMPONENT_MANAGER.removeSvgComponent(SVGS.pop() as SvgBasicProperties);
      Tool.UNDO_REDO_SERVICE.saveSvgBoard();
    }
  }

  selectFirstUnder(): void {
    if (!this.eraserSquare) { return; }
    const SVGS = Tool.SVG_COLLISIONS_SERVICE
      .getSvgComponentsInContact(this.eraserSquare.getSelection());

    if (SVGS.length === 0) { return; }

    const svg = SVGS.pop() as SvgBasicProperties;
    if (!this.selected) { this.selected = new Map(); }
    if (this.selected.has(svg)) { return; }
    const svgDuplicate = this.getRedDuplicate(svg);
    if (!svgDuplicate) { return; }
    this.selected.set(svg, svgDuplicate);
  }

  getRedDuplicate(svg: SvgBasicProperties): SvgBasicProperties | undefined {
    const svgDuplicate = Tool.SVG_COMPONENT_MANAGER
        .duplicateSvgComponent(svg, true, SvgStatus.Temporary, false);
    if (!svgDuplicate) { return undefined; }

    svgDuplicate.setPrimaryColor(Efface.HIGHLIGHT_PRIMARY_COLOR);
    svgDuplicate.setSecondaryColor(Efface.HIGHLIGHT_SECONDARY_COLOR);
    svgDuplicate.setPrimaryOpacity(Efface.HIGHLIGHT_PRIMARY_OPACITY);
    svgDuplicate.setSecondaryOpacity(Efface.HIGHLIGHT_SECONDARY_OPACITY);
    return svgDuplicate;
  }

  selectAllUnder(): void {
    if (!this.eraserSquare) { return; }
    const SVGS = Tool.SVG_COLLISIONS_SERVICE
        .getSvgComponentsInContact(this.eraserSquare.getSelection());

    if (!this.selected) { this.selected = new Map(); }
    for (const svg of SVGS) {
      if (!this.selected.has(svg)) {
        const svgDuplicate = this.getRedDuplicate(svg);
        if (!svgDuplicate) { continue; }
        this.selected.set(svg, svgDuplicate);
      }
    }
  }

  onKeyPress(mouseData: MouseEventData, keyboardData: KeyboardState): void {
    if (Tool.KEYBOARD_MANAGER_SERVICE
            .checkKeyboardShortcut(
                [KeyboardKey.Esc],
                []) &&
        this.isPressed) {
      this.cancelOnGoing(mouseData, keyboardData);
      this.createEraserSquare();
      this.onMouseMove(mouseData, keyboardData);
    }
  }

  onMouseLeave(mouseData: MouseEventData, keyboardData: KeyboardState): void {
    this.onLeftUp(mouseData, keyboardData);
  }

}
