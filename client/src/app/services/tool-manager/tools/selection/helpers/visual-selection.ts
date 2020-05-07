import {Collidable} from 'src/app/logic/collisions/base-collision/collidable';
import {SvgSelectionComponent} from '../../../../../components/drawing/work-board/svg-selection/svg-selection.component';
import { SvgLayer, SvgStatus, SvgType } from '../../../../../enums/svg';
import {Point} from '../../../../../interfaces/point';
import {CircleCollidable} from '../../../../../logic/collisions/circle/circle-collidable';
import {SvgBasicProperties} from '../../../../../logic/svg/base-svg/svg-basic-properties';
import {Tool} from '../../tool/tool';

const DEFAULT_POSITION = 0;
const DEFAULT_VISIBILITY = true;
const DEFAULT_COLOR = '#000000';

export class VisualSelection {
  private cornerStart: Point;
  private cornerEnd: Point;

  private visible: boolean;
  private color: string;
  selection: SvgSelectionComponent | undefined;

  constructor(color: string = DEFAULT_COLOR) {
    this.visible = DEFAULT_VISIBILITY;
    this.color = color;
    this.reset();
    this.selection = undefined;
  }

  reset(): void {
    this.cornerStart = {x: DEFAULT_POSITION, y: DEFAULT_POSITION};
    this.cornerEnd = {x: DEFAULT_POSITION, y: DEFAULT_POSITION};
    this.clearDisplay();
  }

  hide(): void {
    this.visible = false;
    this.clearDisplay();
  }

  display(): void {
    this.visible = true;
    this.displaySelection();
  }

  startDragging(anchor: Point): void {
    this.cornerStart = {x: anchor.x, y: anchor.y};
    this.cornerEnd = {x: anchor.x, y: anchor.y};
    this.refreshDisplay();
  }

  continueDragging(point: Point): void {
    this.cornerEnd = {x: point.x, y: point.y};
    this.refreshDisplay();
  }

  setCorners(cornerStart: Point, cornerEnd: Point): void {
    this.cornerStart = {x: cornerStart.x, y: cornerStart.y};
    this.cornerEnd = {x: cornerEnd.x, y: cornerEnd.y};
    this.refreshDisplay();
  }

  getCenter(): Point {
    if (this.selection) {
      return this.selection.getCenter();
    }

    return {
      x: (this.cornerStart.x + this.cornerEnd.x) / 2,
      y: (this.cornerStart.y + this.cornerEnd.y) / 2,
    };
  }

  getComponentsInContact(): SvgBasicProperties[] {
    if (this.selection !== undefined) {
      return Tool.SVG_COLLISIONS_SERVICE.getSvgComponentsInContact(
        this.selection.getHitbox(),
      );
    }

    return [];
  }

  getHitbox(): Collidable {
    if (this.selection !== undefined) {
      return this.selection.getHitbox();
    } else {
      const UNTOUCHABLE = -1000;
      return new CircleCollidable({x: UNTOUCHABLE, y: UNTOUCHABLE}, 0);
    }
  }

  private displaySelection(): void {
    if (this.selection === undefined) {
      this.selection = Tool.SVG_COMPONENT_MANAGER.createSvgComponent({
        onTopOfLayer: true,
        svgStatus: SvgStatus.InProgress,
        svgLayer: SvgLayer.Selection,
        svgType: SvgType.SvgSelectionComponent},
        false) as SvgSelectionComponent;
    }
    if (this.selection === undefined) { return; }

    this.selection.fitExactlyInside(
      this.cornerStart.x,
      this.cornerStart.y,
      this.cornerEnd.x,
      this.cornerEnd.y,
    );
    this.selection.setPrimaryColor(this.color);
  }

  private clearDisplay(): void {
    if (this.selection !== undefined) {
      Tool.SVG_COMPONENT_MANAGER.removeSvgComponent(this.selection);
      this.selection = undefined;
    }
  }

  private refreshDisplay(): void {
    if (this.visible) {
      this.displaySelection();
    } else {
      this.clearDisplay();
    }
  }
}
