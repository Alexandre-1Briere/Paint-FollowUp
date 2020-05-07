import { SvgEllipseComponent } from '../../../../components/drawing/work-board/svg-ellipse/svg-ellipse.component';
import { SvgLayer, SvgStatus, SvgType } from '../../../../enums/svg';
import { KeyboardState } from '../../../../logic/events/keyboard/keyboard-state';
import { MouseEventData, MouseLocation } from '../../../../logic/events/mouse/mouse-event-data';
import { ColorManipulator } from '../../../color-picker/color-manipulator/color-manipulator';
import {HEX_RGB_LENGTH} from '../../../color-picker/constant';
import { Coords } from '../coords';
import { Tool } from '../tool/tool';

export class Pipette extends Tool {

  static readonly DEFAULT_OUTER_EDGE_THICKNESS: number = 1;
  static readonly DEFAULT_INNER_EDGE_THICKNESS: number = 1;
  static readonly DEFAULT_EDGE_COLOR: string = '#000000';
  static readonly DEFAULT_EDGE_OPACITY: number = 1;
  static readonly DEFAULT_COLOR: string = '#000000';
  static readonly DEFAULT_RING_SIZE: number = 40;
  static readonly DEFAULT_RING_THICKNESS: number = 10;

  private outerRing: SvgEllipseComponent | undefined;
  private coloredRing: SvgEllipseComponent | undefined;
  private innerRing: SvgEllipseComponent | undefined;

  isInside: boolean;
  private leftIsPressed: boolean;
  private rightIsPressed: boolean;
  private coords: Coords | undefined;
  private color: string | undefined;
  private colorIsBeingFetched: boolean;

  constructor() {
    super();
    this.outerRing = undefined;
    this.coloredRing = undefined;
    this.innerRing = undefined;
    this.reset();
    this.color = undefined;
    this.colorIsBeingFetched = false;
  }

  static getInstance(): Tool {
    const TOOL_TYPE = new Pipette();
    return super.getInstance(TOOL_TYPE);
  }

  private getRing(): SvgEllipseComponent | undefined {
    const ring = Tool.SVG_COMPONENT_MANAGER
      .createSvgComponent({
        onTopOfLayer: true,
        svgStatus: SvgStatus.Temporary,
        svgLayer: SvgLayer.Visual,
        svgType: SvgType.SvgEllipseComponent,
      }) as SvgEllipseComponent;
    if (!ring) { return undefined; }

    ring.displayFill = false;
    ring.displayOutline = true;

    return ring;
  }

  private createSvg(): void {
    if (!this.outerRing) { this.outerRing = this.getRing(); }
    if (!this.coloredRing) { this.coloredRing = this.getRing(); }
    if (!this.innerRing) { this.innerRing = this.getRing(); }
    if (!this.outerRing ||
        !this.coloredRing ||
        !this.innerRing ||
        !this.coords) { return; }

    this.outerRing.setPrimaryOpacity(Pipette.DEFAULT_EDGE_OPACITY);
    this.outerRing.setSecondaryOpacity(Pipette.DEFAULT_EDGE_OPACITY);
    this.innerRing.setPrimaryOpacity(Pipette.DEFAULT_EDGE_OPACITY);
    this.innerRing.setSecondaryOpacity(Pipette.DEFAULT_EDGE_OPACITY);

    this.outerRing.setOutlineThickness(Pipette.DEFAULT_OUTER_EDGE_THICKNESS);
    this.innerRing.setOutlineThickness(Pipette.DEFAULT_INNER_EDGE_THICKNESS);
    this.coloredRing.setOutlineThickness(Pipette.DEFAULT_RING_THICKNESS);

    this.outerRing.setSecondaryColor(Pipette.DEFAULT_EDGE_COLOR);
    this.innerRing.setSecondaryColor(Pipette.DEFAULT_EDGE_COLOR);
    this.coloredRing.setSecondaryColor(this.color ? this.color : Pipette.DEFAULT_COLOR);

    let ringRadius = Pipette.DEFAULT_RING_SIZE;
    this.outerRing.centerUsing(this.coords.x, this.coords.y, ringRadius);
    ringRadius = ringRadius - Pipette.DEFAULT_OUTER_EDGE_THICKNESS;
    this.coloredRing.centerUsing(this.coords.x, this.coords.y, ringRadius);
    ringRadius = ringRadius - Pipette.DEFAULT_RING_THICKNESS;
    this.innerRing.centerUsing(this.coords.x, this.coords.y, ringRadius);
  }

  deleteSvg(): void {
    if (this.outerRing) {
      Tool.SVG_COMPONENT_MANAGER.removeSvgComponent(this.outerRing);
      this.outerRing = undefined;
    }
    if (this.coloredRing) {
      Tool.SVG_COMPONENT_MANAGER.removeSvgComponent(this.coloredRing);
      this.coloredRing = undefined;
    }
    if (this.innerRing) {
      Tool.SVG_COMPONENT_MANAGER.removeSvgComponent(this.innerRing);
      this.innerRing = undefined;
    }
  }

  private computeCoords(mouseData: MouseEventData): Coords {
    return new Coords(mouseData.x, mouseData.y);
  }

  reset(): void {
    this.coords = undefined;
    this.leftIsPressed = false;
    this.rightIsPressed = false;
    this.isInside = true;
  }

  cancelOnGoing(mouseData: MouseEventData, keyboardData: KeyboardState): void {
    this.reset();
    this.deleteSvg();
  }

  onBoardChange(mouseData: MouseEventData, keyboardData: KeyboardState): void {
    this.onMouseMove(mouseData, keyboardData);
  }

  onLeftDown(mouseData: MouseEventData, keyboardData: KeyboardState): void {
    if (mouseData.location === MouseLocation.Outside) {
      return;
    }
    this.coords = this.computeCoords(mouseData);
    this.createSvg();
    this.leftIsPressed = true;
  }

  onLeftUp(mouseData: MouseEventData, keyboardData: KeyboardState): void {
    if (!this.leftIsPressed) {
      return;
    }
    this.coords = this.computeCoords(mouseData);
    this.setPrimaryColor(mouseData);

    this.leftIsPressed = false;
    this.reset();
  }

  onMouseMove(mouseData: MouseEventData, keyboardData: KeyboardState): void {
    this.coords = this.computeCoords(mouseData);
    this.getColorUnderCursor(mouseData).then(() => {
      if (this.isInside) {
        this.createSvg();
      } else {
        this.deleteSvg();
      }
    });
  }

  onMouseEnter(mouseData: MouseEventData, keyboardData: KeyboardState): void {
    this.onMouseMove(mouseData, keyboardData);
    this.isInside = true;
  }

  onMouseLeave(mouseData: MouseEventData, keyboardData: KeyboardState): void {
    this.onLeftUp(mouseData, keyboardData);
    this.onRightUp(mouseData, keyboardData);
    this.isInside = false;
    this.onMouseMove(mouseData, keyboardData);
  }

  onRightDown(mouseData: MouseEventData, keyboardData: KeyboardState): void {
    if (mouseData.location === MouseLocation.Outside) { return; }
    this.coords = this.computeCoords(mouseData);
    this.createSvg();
    this.rightIsPressed = true;
  }

  onRightUp(mouseData: MouseEventData, keyboardData: KeyboardState): void {
    if (!this.rightIsPressed) { return; }
    this.coords = this.computeCoords(mouseData);
    this.setSecondaryColor(mouseData);

    this.rightIsPressed = false;
    this.reset();
  }

  setPrimaryColor(mouseData: MouseEventData): void {
    this.getColorUnderCursor(mouseData).then(() => {
      if (!this.color) { return; }
      Tool.TOOL_OPTIONS_MANAGER.setPrimaryColor(this.color);
    });
  }

  setSecondaryColor(mouseData: MouseEventData): void {
    this.getColorUnderCursor(mouseData).then(() => {
      if (!this.color) { return; }
      Tool.TOOL_OPTIONS_MANAGER.setSecondaryColor(this.color);
    });
  }

  async getColorUnderCursor(mouseData: MouseEventData): Promise<boolean> {
    if (!this.colorIsBeingFetched) {
      this.colorIsBeingFetched = true;
      return Tool.CANVAS_SERVICE.accessAsCanvas(
        Tool.CANVAS_SERVICE.getCurrentDrawingElement(),
        (canvas) => {
          const ctx = canvas.getContext('2d');
          if (ctx) {
            const data = Array.from(ctx.getImageData(mouseData.x, mouseData.y, 1, 1).data);
            data.pop(); // removing the opacity (always 1)
            this.color = ColorManipulator.RGBAStringToHexColor(data.join(',')).substr(0, HEX_RGB_LENGTH);
          }
          this.colorIsBeingFetched = false;
        });
    } else {
      return Promise.resolve(false);
    }
  }
}
