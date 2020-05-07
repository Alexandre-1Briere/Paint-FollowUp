import {BORDER, FULL} from '../../../../components/drawing/tool-detail/applicable-setting.class';
import {SvgEllipseComponent} from '../../../../components/svgElement/svg-ellipse/svg-ellipse.component';
import {SvgSelectionComponent} from '../../../../components/svgElement/svg-selection/svg-selection.component';
import {DEFAULT_BLUE, DEFAULT_OPACITY, DEFAULT_YELLOW} from '../../../../constants/colors';
import {KeyboardKey, KeyState} from '../../../../enums/keyboard';
import { SvgLayer, SvgStatus, SvgType } from '../../../../enums/svg';
import {KeyboardState} from '../../../../logic/events/keyboard/keyboard-state';
import {MouseEventData, MouseLocation} from '../../../../logic/events/mouse/mouse-event-data';
import {Coords} from '../coords';
import {Tool} from '../tool/tool';

export class Ellipse extends Tool {

  static readonly DEFAULT_SIZE: number = 4;

  origin: Coords | undefined;
  coords: Coords | undefined;
  boundingRect: SvgSelectionComponent | undefined;

  constructor() {
    super();
    super.size = Ellipse.DEFAULT_SIZE;
    this.reset();
  }

  static getInstance(): Tool {
    const TOOL_TYPE = new Ellipse();
    return super.getInstance(TOOL_TYPE);
  }

  createEllipse(status: SvgStatus = SvgStatus.InProgress): void {
    if (this.origin === undefined || this.coords === undefined) { return; }

    const svgElli: SvgEllipseComponent | undefined = Tool.SVG_COMPONENT_MANAGER
      .createSvgComponent({
        onTopOfLayer: true,
        svgStatus: status,
        svgLayer: SvgLayer.Stack,
        svgType: SvgType.SvgEllipseComponent,
      }) as SvgEllipseComponent;
    if (svgElli === undefined) { return; }

    svgElli.fitExactlyInside(this.origin.x, this.origin.y, this.coords.x, this.coords.y);

    const opacity = Tool.TOOL_OPTIONS_MANAGER.getSettings().primaryOpacity;
    svgElli.setPrimaryOpacity(opacity !== undefined ? opacity : DEFAULT_OPACITY);

    const elliType = Tool.TOOL_OPTIONS_MANAGER.getSettings().tracingType;

    svgElli.displayFill = elliType !== BORDER;
    svgElli.displayOutline = elliType !== FULL;

    const color = Tool.TOOL_OPTIONS_MANAGER.getSettings().primaryColor;
    svgElli.setPrimaryColor(color !== undefined ? color : DEFAULT_BLUE);
    const secondColor = Tool.TOOL_OPTIONS_MANAGER.getSettings().secondaryColor;
    svgElli.setSecondaryColor(secondColor !== undefined ? secondColor : DEFAULT_YELLOW);

    const borderThickness = Tool.TOOL_OPTIONS_MANAGER.getSettings().borderSize;
    svgElli.setOutlineThickness(borderThickness !== undefined ? borderThickness : Ellipse.DEFAULT_SIZE);
    svgElli.status = status;

    if (this.boundingRect) {
      Tool.SVG_COMPONENT_MANAGER.removeSvgComponent(this.boundingRect);
      this.boundingRect = undefined;
    }
    if (status !== SvgStatus.Permanent) {
      this.boundingRect = this.createBoundingRect();
    }
  }

  createBoundingRect(): SvgSelectionComponent | undefined {
    if (!this.origin || !this.coords) { return undefined; }

    const svgSelection = Tool.SVG_COMPONENT_MANAGER.createSvgComponent({
      onTopOfLayer: true,
      svgStatus: SvgStatus.Temporary,
      svgLayer: SvgLayer.Selection,
      svgType: SvgType.SvgSelectionComponent,
    }) as SvgSelectionComponent;
    if (svgSelection === undefined) { return; }

    svgSelection.fitExactlyInside(this.origin.x, this.origin.y, this.coords.x, this.coords.y);
    return svgSelection;
  }

  reset(): void {
    this.origin = undefined;
    this.coords = undefined;

    if (this.boundingRect) {
      Tool.SVG_COMPONENT_MANAGER.removeSvgComponent(this.boundingRect);
      this.boundingRect = undefined;
    }
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
    this.createEllipse(SvgStatus.Permanent);
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
      this.createEllipse(SvgStatus.Permanent);
      this.reset();
    }
  }

  onMouseMove(mouseData: MouseEventData, keyboardData: KeyboardState): void {
    if (this.origin !== undefined) {
      this.coords = this.computeCoords(mouseData);
      this.createEllipse();
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
