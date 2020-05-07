import { SvgBrushComponent } from '../../../../components/drawing/work-board/svg-brush/svg-brush.component';
import { BrushTextures } from '../../../../components/drawing/work-board/svg-brush/textures';
import { DEFAULT_BLUE, DEFAULT_OPACITY } from '../../../../constants/colors';
import { SvgLayer, SvgStatus, SvgType } from '../../../../enums/svg';
import { KeyboardState } from '../../../../logic/events/keyboard/keyboard-state';
import { MouseEventData, MouseLocation } from '../../../../logic/events/mouse/mouse-event-data';
import { Coords } from '../coords';
import { Tool } from '../tool/tool';

export class Pinceau extends Tool {

  static readonly DEFAULT_SIZE: number = 10;
  protected isDrawing: boolean;

  protected points: Coords[] = [];
  protected coords: Coords | undefined = undefined;

  constructor() {
    super();
    super.size = Pinceau.DEFAULT_SIZE;
    this.isDrawing = false;
  }

  static getInstance(): Tool {
    const TOOL_TYPE = new Pinceau();
    return super.getInstance(TOOL_TYPE);
  }

  createSvg(status: SvgStatus = SvgStatus.InProgress): void {
    const SVG: SvgBrushComponent | undefined = Tool.SVG_COMPONENT_MANAGER
      .createSvgComponent({
        onTopOfLayer: true,
        svgStatus: status,
        svgLayer: SvgLayer.Stack,
        svgType: SvgType.SvgBrushComponent,
      }) as SvgBrushComponent;
    if (SVG === undefined) { return; }

    for (const point of this.points) { SVG.addPoint(point.x, point.y); }

    const opacity = Tool.TOOL_OPTIONS_MANAGER.getSettings().primaryOpacity;
    SVG.setPrimaryOpacity(opacity !== undefined ? opacity : DEFAULT_OPACITY);

    const color = Tool.TOOL_OPTIONS_MANAGER.getSettings().primaryColor;
    SVG.setPrimaryColor(color !== undefined ? color : DEFAULT_BLUE);

    const thickness = Tool.TOOL_OPTIONS_MANAGER.getSettings().size;
    SVG.setThickness(thickness !== undefined ? thickness : super.size);

    const brushTexture: BrushTextures | undefined = Tool.TOOL_OPTIONS_MANAGER.getSettings().brushTexture;
    if (brushTexture !== undefined) {
      SVG.setTexture(brushTexture);
    }
    SVG.status = status;
  }

  computeCoords(mouseData: MouseEventData): Coords {
    return new Coords(mouseData.x, mouseData.y);
  }

  reset(): void {
    this.points = [];
    this.coords = undefined;
  }

  cancelOnGoing(mouseData: MouseEventData, keyboardData: KeyboardState): void {
    this.reset();
  }

  onLeftDown(mouseData: MouseEventData, keyboardData: KeyboardState): void {
    if (mouseData.location === MouseLocation.Outside) { return; }

    this.coords = this.computeCoords(mouseData);
    this.points.push(this.coords);
    this.isDrawing = true;
  }

  onLeftUp(mouseData: MouseEventData, keyboardData: KeyboardState): void {
    if (!this.isDrawing) { return; }
    this.coords = this.computeCoords(mouseData);
    this.points.push(this.coords);
    this.createSvg(SvgStatus.Permanent);

    this.isDrawing = false;
    this.reset();
  }

  onMouseMove(mouseData: MouseEventData, keyboardData: KeyboardState): void {
    this.coords = this.computeCoords(mouseData);
    if (this.isDrawing) {
      this.points.push(this.coords);
      this.createSvg();
    }
  }

  onMouseLeave(mouseData: MouseEventData, keyboardData: KeyboardState): void {
    this.onLeftUp(mouseData, keyboardData);
  }
}
