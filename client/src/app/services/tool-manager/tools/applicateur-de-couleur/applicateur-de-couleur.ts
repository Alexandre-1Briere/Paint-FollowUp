import { SvgRectangleComponent } from '../../../../components/svgElement/svg-rectangle/svg-rectangle.component';
import { SvgLayer, SvgStatus, SvgType } from '../../../../enums/svg';
import { KeyboardState } from '../../../../logic/events/keyboard/keyboard-state';
import { MouseEventData, MouseLocation } from '../../../../logic/events/mouse/mouse-event-data';
import { SvgBasicProperties } from '../../../../logic/svg/base-svg/svg-basic-properties';
import { Coords } from '../coords';
import { Tool } from '../tool/tool';

export class ApplicateurDeCouleur extends Tool {

  static readonly DEFAULT_SIZE: number = 1;

  protected coords: Coords | undefined;
  protected target: SvgBasicProperties | undefined;

  constructor() {
    super();
    super.size = ApplicateurDeCouleur.DEFAULT_SIZE;
    this.reset();
  }

  static getInstance(): Tool {
    const TOOL_TYPE = new ApplicateurDeCouleur();
    return super.getInstance(TOOL_TYPE);
  }

  protected computeCoords(mouseData: MouseEventData): Coords {
    return new Coords(mouseData.x, mouseData.y);
  }

  reset(): void {
    this.coords = undefined;
    this.target = undefined;
  }

  cancelOnGoing(mouseData: MouseEventData, keyboardData: KeyboardState): void {
    this.reset();
  }

  onLeftDown(mouseData: MouseEventData, keyboardData: KeyboardState): void {
    if (mouseData.location === MouseLocation.Outside) { return; }
    if (this.target) { return; }
    this.coords = this.computeCoords(mouseData);

    const collider = this.getCollider();
    if (!collider) { return; }

    const SVGS = Tool.SVG_COLLISIONS_SERVICE.getSvgComponentsInContact(collider.getSelection());
    if (0 < SVGS.length) {
      this.target = SVGS.pop() as SvgBasicProperties;
    }

    Tool.SVG_COMPONENT_MANAGER.removeSvgComponent(collider);
  }

  onLeftUp(mouseData: MouseEventData, keyboardData: KeyboardState): void {
    if (!this.target) { return; }
    this.coords = this.computeCoords(mouseData);
    this.setPrimaryColorFirstUnder();
    this.reset();
  }

  onRightDown(mouseData: MouseEventData, keyboardData: KeyboardState): void {
    this.onLeftDown(mouseData, keyboardData);
  }

  onRightUp(mouseData: MouseEventData, keyboardData: KeyboardState): void {
    if (!this.target) { return; }
    this.coords = this.computeCoords(mouseData);
    this.setSecondaryColorFirstUnder();
    this.reset();
  }

  onMouseLeave(mouseData: MouseEventData, keyboardData: KeyboardState): void {
    this.reset();
  }

  setPrimaryColorFirstUnder(): void {
    const collider = this.getCollider();
    if (!collider || !this.target) { return; }

    const SVGS = Tool.SVG_COLLISIONS_SERVICE.getSvgComponentsInContact(collider.getSelection());
    if (0 < SVGS.length) {
      const topSvg = SVGS.pop() as SvgBasicProperties;
      if (topSvg === this.target) {
        const primaryColor = Tool.TOOL_OPTIONS_MANAGER.getSettings().primaryColor;
        if (primaryColor) {
          const previousPrimaryColor = this.target.getPrimaryColor();
          this.target.setPrimaryColor(primaryColor);
          if (previousPrimaryColor !== primaryColor) {
            Tool.UNDO_REDO_SERVICE.saveSvgBoard();
          }
        }
      }
    }

    Tool.SVG_COMPONENT_MANAGER.removeSvgComponent(collider);
  }

  setSecondaryColorFirstUnder(): void {
    const collider = this.getCollider();
    if (!collider || !this.target) { return; }

    const SVGS = Tool.SVG_COLLISIONS_SERVICE.getSvgComponentsInContact(collider.getSelection());
    if (0 < SVGS.length) {
      const topSvg = SVGS.pop() as SvgBasicProperties;
      if (topSvg === this.target) {
        const secondaryColor = Tool.TOOL_OPTIONS_MANAGER.getSettings().secondaryColor;
        if (secondaryColor) {
          const previousSecondaryColor = this.target.getSecondaryColor();
          this.target.setSecondaryColor(secondaryColor);
          if (previousSecondaryColor !== secondaryColor) {
            Tool.UNDO_REDO_SERVICE.saveSvgBoard();
          }
        }
      }
    }

    Tool.SVG_COMPONENT_MANAGER.removeSvgComponent(collider);
  }

  protected getCollider(): SvgRectangleComponent | undefined {
    const collider = Tool.SVG_COMPONENT_MANAGER
        .createSvgComponent({
          onTopOfLayer: true,
          svgStatus: SvgStatus.Temporary,
          svgLayer: SvgLayer.Visual,
          svgType: SvgType.SvgRectangleComponent,
        }) as SvgRectangleComponent;
    if (!collider || !this.coords) { return undefined; }

    const corner1 = new Coords(this.coords.x - this.size / 2, this.coords.y - this.size / 2);
    const corner2 = new Coords(this.coords.x + this.size / 2, this.coords.y + this.size / 2);
    collider.fitExactlyInside(corner1.x, corner1.y, corner2.x, corner2.y);

    collider.setPrimaryOpacity(0);
    collider.setSecondaryOpacity(0);

    return collider;
  }
}
