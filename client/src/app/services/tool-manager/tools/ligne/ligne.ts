import {SvgPolylineComponent} from '../../../../components/drawing/work-board/svg-polyline/svg-polyline.component';
import {DEFAULT_BLUE, DEFAULT_OPACITY} from '../../../../constants/colors';
import {KeyboardKey} from '../../../../enums/keyboard';
import {SvgLayer, SvgStatus, SvgType} from '../../../../enums/svg';
import {KeyboardState} from '../../../../logic/events/keyboard/keyboard-state';
import {MouseEventData, MouseLocation} from '../../../../logic/events/mouse/mouse-event-data';
import {Coords} from '../coords';
import {Tool} from '../tool/tool';

export class Ligne extends Tool {

  static readonly DEFAULT_SIZE: number = 10;
  static readonly DISTANCE_TO_CLOSE_FORM: number = 3;

  static readonly X: number = 0;
  static readonly Y: number = 1;

  protected points: Coords[];
  protected coords: Coords | undefined;
  private svgLigne: SvgPolylineComponent | undefined;

  constructor() {
    super();
    super.size = Ligne.DEFAULT_SIZE;
    this.points = [];
    this.coords = undefined;
    this.svgLigne = undefined;
  }

  static getInstance(): Tool {
    const TOOL_TYPE = new Ligne();
    return super.getInstance(TOOL_TYPE);
  }

  private createLigne(points: Coords[], status: SvgStatus = SvgStatus.InProgress): void {
    this.svgLigne = Tool.SVG_COMPONENT_MANAGER
      .createSvgComponent({
        onTopOfLayer: true,
        svgStatus: status,
        svgLayer: SvgLayer.Stack,
        svgType: SvgType.SvgPolylineComponent,
      }) as SvgPolylineComponent;
    if (this.svgLigne === undefined) { return; }

    for (const point of points) { this.svgLigne.addPoint(point.x, point.y); }

    const opacity = Tool.TOOL_OPTIONS_MANAGER.getSettings().primaryOpacity;
    this.svgLigne.setPrimaryOpacity(opacity !== undefined ? opacity : DEFAULT_OPACITY);

    const color = Tool.TOOL_OPTIONS_MANAGER.getSettings().primaryColor;
    this.svgLigne.setPrimaryColor(color !== undefined ? color : DEFAULT_BLUE);

    const size = Tool.TOOL_OPTIONS_MANAGER.getSettings().size;
    this.svgLigne.setThickness(size !== undefined ? size : Ligne.DEFAULT_SIZE);

    const junctionRadius = Tool.TOOL_OPTIONS_MANAGER.getSettings().pointsSize;
    this.svgLigne.setJunctionRadius(junctionRadius !== undefined ? junctionRadius : 0);
    this.svgLigne.status = status;
  }

  reset(): void {
    this.points = [];
    this.coords = undefined;
    if (this.svgLigne && this.svgLigne.status !== SvgStatus.Permanent) {
      Tool.SVG_COMPONENT_MANAGER.removeSvgComponent(this.svgLigne);
    }
    this.svgLigne = undefined;
  }

  onRemovingTool(mouseData: MouseEventData, keyboardData: KeyboardState): void {
    this.reset();
  }

  private computeCoords(mouseData: MouseEventData): Coords | undefined {
    if (mouseData.location === MouseLocation.Outside) {
      return undefined;
    }

    const AT_LEAST_ONE_POINT = 1;
    if (Tool.KEYBOARD_MANAGER_SERVICE.checkKeyboardShortcut([KeyboardKey.LShift], []) &&
        this.points.length >= AT_LEAST_ONE_POINT) {
      const lastPoint = this.points[this.points.length - 1];
      const deltaX = Math.abs(mouseData.x - lastPoint.x);
      const deltaY = Math.abs(mouseData.y - lastPoint.y);
      const angle = Math.atan(deltaY / deltaX);
      const STEP = 8;
      const MAX_STEP = 3;
      const MIN_ANGLE = Math.PI / STEP;
      const MAX_ANGLE = MAX_STEP * Math.PI / STEP;
      if (MAX_ANGLE <= angle) {
        return new Coords(lastPoint.x, mouseData.y);
      } else if (angle < MIN_ANGLE) {
        return new Coords(mouseData.x, lastPoint.y);
      } else {
        const signOfX = Math.sign(mouseData.x - lastPoint.x);
        const signOfY = Math.sign(mouseData.y - lastPoint.y);

        const alpha = (deltaX + deltaY) / 2;
        const newX = lastPoint.x + signOfX * alpha;
        const newY = lastPoint.y + signOfY * alpha;

        return new Coords(newX, newY);
      }
    }
    return new Coords(mouseData.x, mouseData.y);
  }

  cancelOnGoing(mouseData: MouseEventData, keyboardData: KeyboardState): void {
    this.reset();
  }

  onMouseMove(mouseData: MouseEventData, keyboardData: KeyboardState): void {
    this.coords = this.computeCoords(mouseData);
    if (this.coords !== undefined) {
      this.points.push(this.coords);
      this.createLigne(this.points);
      this.points.pop();
    }
  }

  onLeftClick(mouseData: MouseEventData, keyboardData: KeyboardState): void {
    this.coords = this.computeCoords(mouseData);
    if (this.coords !== undefined && mouseData.location === MouseLocation.Inside) {
      this.points.push(this.coords);
      this.createLigne(this.points);
    }
  }

  onLeftDoubleClick(mouseData: MouseEventData, keyboardData: KeyboardState): void {
    this.coords = this.computeCoords(mouseData);
    if (this.coords !== undefined) {
      // We need to pop this point, because it
      // is placed before it knows it's a double click.
      this.points.pop();

      const pointsCopy: Coords[] = this.points.slice();

      const lastPoint = this.points[this.points.length - 1];
      if (lastPoint === undefined) { return; }

      if (this.maxAxisDistance(this.points[0], this.coords) <= Ligne.DISTANCE_TO_CLOSE_FORM) {
        pointsCopy.push(this.points[0]);
      }

      this.createLigne(pointsCopy, SvgStatus.Permanent);
      this.reset();
    }
    return;
  }

  maxAxisDistance(p1: Coords, p2: Coords): number {
    const distX = Math.abs(p1.x - p2.x);
    const distY = Math.abs(p1.y - p2.y);
    return Math.max(distX, distY);
  }

  onKeyPress(mouseData: MouseEventData, keyboardData: KeyboardState): void {
    if (Tool.KEYBOARD_MANAGER_SERVICE.checkKeyboardShortcut([KeyboardKey.Esc], [])) {
      this.cancelOnGoing(mouseData, keyboardData);
      return;
    }

    if (Tool.KEYBOARD_MANAGER_SERVICE.checkKeyboardShortcut([KeyboardKey.Backspace], [])) {
      if (this.points.length > 1) {
        this.points.pop();
      }
    }

    this.onMouseMove(mouseData, keyboardData);
  }
}
