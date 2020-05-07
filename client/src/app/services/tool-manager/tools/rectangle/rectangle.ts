import {BORDER, FULL} from '../../../../components/drawing/tool-detail/applicable-setting.class';
import {SvgRectangleComponent} from '../../../../components/svgElement/svg-rectangle/svg-rectangle.component';
import {DEFAULT_BLUE, DEFAULT_OPACITY, DEFAULT_YELLOW} from '../../../../constants/colors';
import {KeyboardKey, KeyState} from '../../../../enums/keyboard';
import { SvgLayer, SvgStatus, SvgType } from '../../../../enums/svg';
import {KeyboardState} from '../../../../logic/events/keyboard/keyboard-state';
import {MouseEventData, MouseLocation} from '../../../../logic/events/mouse/mouse-event-data';
import {Coords} from '../coords';
import {Tool} from '../tool/tool';

export class Rectangle extends Tool {

  static readonly DEFAULT_SIZE: number = 4;

  origin: Coords | undefined;
  coords: Coords | undefined;

  constructor() {
    super();
    super.size = Rectangle.DEFAULT_SIZE;
    this.reset();
  }

  static getInstance(): Tool {
    const TOOL_TYPE = new Rectangle();
    return super.getInstance(TOOL_TYPE);
  }

  createRectangle(status: SvgStatus = SvgStatus.InProgress): void {
    if (this.origin === undefined || this.coords === undefined) { return; }

    const svgRect: SvgRectangleComponent | undefined = Tool.SVG_COMPONENT_MANAGER
      .createSvgComponent({
        onTopOfLayer: true,
        svgStatus: status,
        svgLayer: SvgLayer.Stack,
        svgType: SvgType.SvgRectangleComponent,
      }) as SvgRectangleComponent;
    if (svgRect === undefined) { return; }

    svgRect.fitExactlyInside(this.origin.x, this.origin.y, this.coords.x, this.coords.y);

    const opacity = Tool.TOOL_OPTIONS_MANAGER.getSettings().primaryOpacity;
    svgRect.setPrimaryOpacity(opacity !== undefined ? opacity : DEFAULT_OPACITY);

    const rectType = Tool.TOOL_OPTIONS_MANAGER.getSettings().tracingType;

    svgRect.displayFill = rectType !== BORDER;
    svgRect.displayOutline = rectType !== FULL;

    const color = Tool.TOOL_OPTIONS_MANAGER.getSettings().primaryColor;
    svgRect.setPrimaryColor(color !== undefined ? color : DEFAULT_BLUE);
    const secondColor = Tool.TOOL_OPTIONS_MANAGER.getSettings().secondaryColor;
    svgRect.setSecondaryColor(secondColor !== undefined ? secondColor : DEFAULT_YELLOW);

    const borderThickness = Tool.TOOL_OPTIONS_MANAGER.getSettings().borderSize;
    svgRect.setOutlineThickness(borderThickness !== undefined ? borderThickness : Rectangle.DEFAULT_SIZE);
    svgRect.status = status;
  }

  reset(): void {
    this.origin = undefined;
    this.coords = undefined;
  }

  computeCoords(mouseData: MouseEventData): Coords | undefined {
    if (this.origin === undefined) {
        return undefined;
    }
    if (Tool.KEYBOARD_MANAGER_SERVICE.checkKeyboardShortcut([KeyboardKey.LShift], [])) {
      const deltaX = Math.abs(mouseData.x - this.origin.x);
      const deltaY = Math.abs(mouseData.y - this.origin.y);
      const maxDelta = Math.max(deltaX, deltaY);
      const newX = this.origin.x + (this.origin.x <= mouseData.x ? maxDelta : -maxDelta);
      const newY = this.origin.y + (this.origin.y <= mouseData.y ? maxDelta : -maxDelta);
      return new Coords(newX, newY);
    } else {
      return new Coords(mouseData.x, mouseData.y);
    }
  }

  cancelOnGoing(mouseData: MouseEventData, keyboardData: KeyboardState): void {
    this.reset();
    this.createRectangle(SvgStatus.Permanent);
  }

  onLeftDown(mouseData: MouseEventData, keyboardData: KeyboardState): void {
    if (mouseData.location === MouseLocation.Outside) { return; }

    if (this.origin === undefined) {
      this.origin = new Coords(mouseData.x, mouseData.y);
    }
  }

  onLeftUp(mouseData: MouseEventData, keyboardData: KeyboardState): void {
    if (this.origin !== undefined) {
      this.coords = this.computeCoords(mouseData);
      this.createRectangle(SvgStatus.Permanent);
      this.reset();
    }
  }

  onMouseMove(mouseData: MouseEventData, keyboardData: KeyboardState): void {
    if (this.origin !== undefined) {
      this.coords = this.computeCoords(mouseData);
      this.createRectangle();
    }
  }

  onKeyPress(mouseData: MouseEventData, keyboardData: KeyboardState): void {
    if (keyboardData.getKeyState(KeyboardKey.Esc) === KeyState.Down) {
      this.cancelOnGoing(mouseData, keyboardData);
      return;
    }

    this.onMouseMove(mouseData, keyboardData);
  }
}
