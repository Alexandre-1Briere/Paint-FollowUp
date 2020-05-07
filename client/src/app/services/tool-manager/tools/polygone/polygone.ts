import {BORDER, FULL} from '../../../../components/drawing/tool-detail/applicable-setting.class';
import {SvgPolygonComponent} from '../../../../components/svgElement/svg-polygon/svg-polygon.component';
import {SvgSelectionComponent} from '../../../../components/svgElement/svg-selection/svg-selection.component';
import { SvgLayer, SvgStatus, SvgType } from '../../../../enums/svg';
import {KeyboardState} from '../../../../logic/events/keyboard/keyboard-state';
import {MouseEventData, MouseLocation} from '../../../../logic/events/mouse/mouse-event-data';
import {Coords} from '../coords';
import {Tool} from '../tool/tool';

export class Polygone extends Tool {
  static readonly DEFAULT_NUMBER_OF_SIDES: number = 7;
  static readonly DEFAULT_BORDER_THICKNESS: number = 1;

  latestPolygon: SvgPolygonComponent | undefined;
  boundingRect: SvgSelectionComponent | undefined;

  origin: Coords | undefined;
  coords: Coords | undefined;

  constructor() {
    super();
    super.size = Polygone.DEFAULT_NUMBER_OF_SIDES;
    this.reset();
  }

  static getInstance(): Tool {
    const TOOL_TYPE = new Polygone();
    return super.getInstance(TOOL_TYPE);
  }

  createPolygon(status: SvgStatus = SvgStatus.InProgress): void {
    if (this.origin === undefined || this.coords === undefined) { return; }

    this.latestPolygon = Tool.SVG_COMPONENT_MANAGER
      .createSvgComponent({
        onTopOfLayer: true,
        svgStatus: status,
        svgLayer: SvgLayer.Stack,
        svgType: SvgType.SvgPolygonComponent,
        }) as SvgPolygonComponent;
    if (this.latestPolygon === undefined) { return; }

    const size = Tool.TOOL_OPTIONS_MANAGER.getSettings().size;
    const numberOfSides = size !== undefined ? size : Polygone.DEFAULT_NUMBER_OF_SIDES;

    const polygonType = Tool.TOOL_OPTIONS_MANAGER.getSettings().tracingType;
    this.latestPolygon.displayFill = polygonType !== BORDER;
    this.latestPolygon.displayOutline = polygonType !== FULL;

    const opacity = Tool.TOOL_OPTIONS_MANAGER.getSettings().primaryOpacity;
    this.latestPolygon.setPrimaryOpacity(opacity);

    const color = Tool.TOOL_OPTIONS_MANAGER.getSettings().primaryColor;
    this.latestPolygon.setPrimaryColor(color);
    const secondColor = Tool.TOOL_OPTIONS_MANAGER.getSettings().secondaryColor;
    this.latestPolygon.setSecondaryColor(secondColor);

    const borderThickness = Tool.TOOL_OPTIONS_MANAGER.getSettings().borderSize;
    this.latestPolygon.setOutlineThickness(borderThickness ? borderThickness : Polygone.DEFAULT_BORDER_THICKNESS);

    this.latestPolygon.createRegularPolygonFromMouse(numberOfSides, this.origin, this.coords);

    if (this.boundingRect) {
      Tool.SVG_COMPONENT_MANAGER.removeSvgComponent(this.boundingRect);
      this.boundingRect = undefined;
    }
    if (status !== SvgStatus.Permanent) {
      this.boundingRect = this.createBoundingRect();
    }
  }

  createBoundingRect(): SvgSelectionComponent | undefined {
    if (!this.origin || !this.coords || !this.latestPolygon) { return undefined; }

    const svgSelection = Tool.SVG_COMPONENT_MANAGER.createSvgComponent({
      onTopOfLayer: true,
      svgStatus: SvgStatus.Temporary,
      svgLayer: SvgLayer.Visual,
      svgType: SvgType.SvgSelectionComponent,
    }) as SvgSelectionComponent;
    if (svgSelection === undefined) { return; }

    const boundary = this.latestPolygon.getBoundary();
    svgSelection.fitExactlyInside(boundary.topLeft.x, boundary.topLeft.y, boundary.bottomRight.x, boundary.bottomRight.y);
    return svgSelection;
  }

  reset(): void {
    this.origin = undefined;
    this.coords = undefined;

    this.latestPolygon = undefined;
    if (this.boundingRect) {
      Tool.SVG_COMPONENT_MANAGER.removeSvgComponent(this.boundingRect);
      this.boundingRect = undefined;
    }
  }

  computeCoords(mouseData: MouseEventData): Coords | undefined {
    if (!this.origin) { return undefined; }

    return new Coords(mouseData.x, mouseData.y);
  }

  cancelOnGoing(mouseData: MouseEventData, keyboardData: KeyboardState): void {
    if (!this.coords) {return; }
    this.createPolygon(SvgStatus.Permanent);
    this.reset();
  }

  onLeftDown(mouseData: MouseEventData, keyboardData: KeyboardState): void {
    if (mouseData.location === MouseLocation.Outside) { return; }
    if (this.origin === undefined) {
      this.origin = new Coords(mouseData.x, mouseData.y);
    }
  }

  onLeftUp(mouseData: MouseEventData, keyboardData: KeyboardState): void {
      this.coords = this.computeCoords(mouseData);
      if (this.coords !== undefined) {
        this.createPolygon(SvgStatus.Permanent);
        this.reset();
      }
  }

  onMouseMove(mouseData: MouseEventData, keyboardData: KeyboardState): void {
    this.coords = this.computeCoords(mouseData);
    if ( this.coords !== undefined && this.origin !== undefined) {
      this.createPolygon(SvgStatus.InProgress);
    }
  }
}
