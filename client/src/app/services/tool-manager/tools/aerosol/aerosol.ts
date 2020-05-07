import { SvgAerosolComponent } from '../../../../components/svgElement/svg-aerosol/svg-aerosol.component';
import { DEFAULT_OPACITY } from '../../../../constants/colors';
import { SvgLayer, SvgStatus, SvgType } from '../../../../enums/svg';
import { KeyboardState } from '../../../../logic/events/keyboard/keyboard-state';
import { MouseEventData, MouseLocation } from '../../../../logic/events/mouse/mouse-event-data';
import { Coords } from '../coords';
import { Tool } from '../tool/tool';

export class Aerosol extends Tool {

  static readonly DEFAULT_RADIUS: number = 10;
  static readonly DEFAULT_COVERAGE: number = 0.01;
  static readonly DEFAULT_DELAY: number = 100;

  protected isDrawing: boolean;
  protected points: Coords[] = [];
  protected centerPoints: Coords[] = [];
  protected coords: Coords | undefined = undefined;
  protected sprayDensity: number;
  protected sprayDelay: number;
  protected updateSprayInterval: number;

  constructor() {
    super();
    this.size = Aerosol.DEFAULT_RADIUS;
    this.isDrawing = false;
    this.sprayDensity = Aerosol.DEFAULT_COVERAGE;
    this.sprayDelay = Aerosol.DEFAULT_DELAY;
  }

  static getInstance(): Tool {
    const TOOL_TYPE = new Aerosol();
    return super.getInstance(TOOL_TYPE);
  }

  createSvg(status: SvgStatus = SvgStatus.InProgress): void {
    const SVG: SvgAerosolComponent | undefined = Tool.SVG_COMPONENT_MANAGER
      .createSvgComponent({
        onTopOfLayer: true,
        svgStatus: status,
        svgLayer: SvgLayer.Stack,
        svgType: SvgType.SvgAerosolComponent,
      }) as SvgAerosolComponent;
    if (SVG === undefined) { return; }

    SVG.setPoints(this.points);
    SVG.setHitBox(this.centerPoints, this.size);
    SVG.setPrimaryOpacity(DEFAULT_OPACITY);

    const color = Tool.TOOL_OPTIONS_MANAGER.getSettings().primaryColor;
    SVG.setPrimaryColor(color);
    Tool.SVG_COMPONENT_MANAGER.refreshSvgComponent(SVG);
  }

  computeCoords(mouseData: MouseEventData): Coords {
    return new Coords(mouseData.x, mouseData.y);
  }

  reset(): void {
    this.points = [];
    this.centerPoints = [];
    this.coords = undefined;
  }

  cancelOnGoing(mouseData: MouseEventData, keyboardData: KeyboardState): void {
    this.reset();
  }

  protected emitSpray(mouseData: MouseEventData): void {
    this.coords = this.computeCoords(mouseData);
    this.centerPoints.push({x: this.coords.x, y: this.coords.y});
    const numberCircles = this.sprayDensity * this.size * this.size;
    for (let i = 0; i < numberCircles ; i++) {
      const xOffset = this.size - 2 * Math.random() * this.size;
      const yOffset = this.size - 2 * Math.random() * this.size;
      const x = this.coords.x + xOffset;
      const y = this.coords.y + yOffset;
      if ( xOffset * xOffset + yOffset * yOffset <= this.size * this.size) {
        const point = new  Coords(x , y);
        this.points.push(point);
      }
    }
  }

  protected createSpray(): void {
    const mouseEventData = Tool.MOUSE_MANAGER_SERVICE.getMouseOutput();
    this.emitSpray(mouseEventData);
    this.createSvg(SvgStatus.InProgress);
  }

  onLeftDown(mouseData: MouseEventData, keyboardData: KeyboardState): void {
    if (mouseData.location === MouseLocation.Outside) { return; }
    if (!this.isDrawing) {
      this.isDrawing = true;

      this.calculateSize();
      this.calculateSprayDensity();

      this.updateSprayInterval = window.setInterval( () => {
        this.createSpray();
      }, this.sprayDelay);
    }
  }

  onLeftUp(mouseData: MouseEventData, keyboardData: KeyboardState): void {
    if (!this.isDrawing) { return; }
    this.createSvg(SvgStatus.Permanent);
    clearInterval(this.updateSprayInterval);
    this.isDrawing = false;
    this.reset();
  }

  onMouseMove(mouseData: MouseEventData, keyboardData: KeyboardState): void {
    if (this.isDrawing) {
      this.createSvg();
      this.emitSpray(mouseData);
    }
  }

  onMouseLeave(mouseData: MouseEventData, keyboardData: KeyboardState): void {
    this.onLeftUp(mouseData, keyboardData);
  }

 protected calculateSize(): void {
    const size = Tool.TOOL_OPTIONS_MANAGER.getSettings().size;
    this.size = size ? size : Aerosol.DEFAULT_RADIUS;
 }

  protected calculateSprayDensity(): void {
    const coverage = Tool.TOOL_OPTIONS_MANAGER.getSettings().pointsSize;
    const DEFAULT_SIZE = 100;
    this.sprayDensity = coverage ? coverage / DEFAULT_SIZE : Aerosol.DEFAULT_COVERAGE;
  }
}
