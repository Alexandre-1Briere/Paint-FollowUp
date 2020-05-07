import { Point } from 'src/app/interfaces/point';
import { SvgStatus } from '../../../../../enums/svg';
import {SelectionScale} from '../../../../../interfaces/selection-scale';
import { CollisionDetection } from '../../../../../logic/collisions/detection/collision-detection';
import { PolygonCollidable } from '../../../../../logic/collisions/polygon/polygon-collidable';
import { BoundaryBox } from '../../../../../logic/collisions/utils/boundary-box';
import {Projection} from '../../../../../logic/collisions/utils/projection';
import { SvgBasicProperties } from '../../../../../logic/svg/base-svg/svg-basic-properties';
import {SvgUtils} from '../../../../../logic/svg/utils/svg-utils';
import { Tool } from '../../tool/tool';
import { VisualSelection } from './visual-selection';

const DEFAULT_BLACK = '#000000';

export class LogicalSelection {
  private visualSelection: VisualSelection;
  private selectedSvgComponents: SvgBasicProperties[];
  private readonly canAlterComponents: boolean;

  constructor(visible: boolean, color: string = DEFAULT_BLACK, canAlterComponents: boolean = false) {
    this.visualSelection = new VisualSelection(color);
    if (!visible) {
      this.visualSelection.hide();
    }
    this.selectedSvgComponents = [];
    this.canAlterComponents = canAlterComponents;
  }

  reset(): void {
    this.emptySelectedSvgComponents();
    this.visualSelection.reset();
  }

  getAllComponents(): SvgBasicProperties[] {
    const allComponents = this.selectedSvgComponents.slice();
    if (this.visualSelection.selection !== undefined) {
      allComponents.push(this.visualSelection.selection);
    }
    return allComponents;
  }

  selectAll(): void {
    this.emptySelectedSvgComponents();

    const allComponents = [];
    const length = Tool.SVG_COMPONENT_MANAGER.countAllSvg();
    for (let index = 0; index < length; ++index) {
      const svgComponent = Tool.SVG_COMPONENT_MANAGER.getSvgComponent(index);

      if (svgComponent !== undefined && svgComponent.status === SvgStatus.Permanent) {
        allComponents.push(svgComponent);
      }
    }
    this.addToSelectedSvgComponents(allComponents);
  }

  selectSvgComponents(svgComponents: SvgBasicProperties[]): void {
    this.emptySelectedSvgComponents();
    this.addToSelectedSvgComponents(svgComponents);
  }

  deleteSelection(): void {
    for (const component of this.selectedSvgComponents) {
      Tool.SVG_COMPONENT_MANAGER.removeSvgComponent(component);
    }
    this.selectedSvgComponents = [];
    this.reset();
  }

  replaceClipboardContent(): void {
    Tool.CLIPBOARD_SERVICE.replaceContent(this.selectedSvgComponents, this.visualSelection.getCenter());
  }

  duplicateContent(): void {
    const reference = this.visualSelection.getCenter();
    const duplicatedComponents = Tool.CLIPBOARD_SERVICE.duplicateComponents(this.selectedSvgComponents, reference);
    this.emptySelectedSvgComponents();
    this.addToSelectedSvgComponents(duplicatedComponents);
  }

  rotateClockwiseAroundCenter(degrees: number): void {
    const center = this.visualSelection.getCenter();
    const cos = Math.cos(SvgUtils.degreesToRadians(degrees));
    const sin = Math.sin(SvgUtils.degreesToRadians(degrees));
    for (const component of this.getAllComponents()) {
      const ancientPosition = component.getCenter();
      const DX = ancientPosition.x - center.x;
      const DY = ancientPosition.y - center.y;
      const newPosition = {x: DX * cos - DY * sin + center.x, y: DX * sin + DY * cos + center.y};
      const delta = {x: newPosition.x - ancientPosition.x, y: newPosition.y - ancientPosition.y};
      component.translate(delta);
      component.rotateClockwise(degrees);
    }

    if (this.selectedSvgComponents.length > 0) {
      Tool.UNDO_REDO_SERVICE.saveSvgBoard();
    }
  }

  rotateClockwiseAroundSelf(degrees: number): void {
    for (const component of this.selectedSvgComponents) {
      component.rotateClockwise(degrees);
    }
    const selection = this.visualSelection.selection;
    if (selection) {
      selection.fitAroundComponentsWithoutChangingAngle(this.selectedSvgComponents);
    }

    if (this.selectedSvgComponents.length > 0) {
      Tool.UNDO_REDO_SERVICE.saveSvgBoard();
    }
  }

  hasSelectedComponents(): boolean {
    return this.selectedSvgComponents.length > 0;
  }

  inContactWithCursor(cursor: Point): boolean {
    return CollisionDetection.checkIntersection(
      this.visualSelection.getHitbox(),
      PolygonCollidable.createCursor(cursor),
    );
  }

  enableControlPoints(active: boolean): void {
    const selection = this.visualSelection.selection;
    if (selection) {
      selection.displayControlPoints = active;
    }
  }

  tryToGrabControlPoint(cursor: Point): boolean {
    const selection = this.visualSelection.selection;
    if (selection) {
      return selection.tryToGrabControlPoint(cursor);
    } else {
      return false;
    }
  }

  tryToMoveControlPoint(cursor: Point): boolean {
    const selection = this.visualSelection.selection;
    if (selection) {
      const selectionScale = selection.tryToMoveControlPoint(cursor);
      this.scaleComponents(selectionScale);
      return selectionScale.success;
    } else {
      return false;
    }
  }

  private scaleComponents(selectionScale: SelectionScale): void {
    if (!selectionScale.success) { return; }

    const scale = Projection.getScaleFromPoints(selectionScale.fixedPoint, selectionScale.grabbedPoint, selectionScale.movedGrabbedPoint);
    const scaleAxis = Projection.getParallelAxis(selectionScale.grabbedPoint, selectionScale.fixedPoint);

    const normalizedScaleAxis = Projection.getParallelAxis(selectionScale.grabbedPoint, selectionScale.fixedPoint);
    const length = Math.sqrt(normalizedScaleAxis.x * normalizedScaleAxis.x + normalizedScaleAxis.y * normalizedScaleAxis.y);
    normalizedScaleAxis.x /= length;
    normalizedScaleAxis.y /= length;

    for (const component of this.selectedSvgComponents) {
      const center = component.getCenter();
      const percentage = Projection.getScaleFromPoints(selectionScale.fixedPoint, selectionScale.grabbedPoint, center);

      component.scale(scale, normalizedScaleAxis);
      component.translate({
        x: scaleAxis.x * percentage * (1 - scale),
        y: scaleAxis.y * percentage * (1 - scale),
      });
    }
  }

  finishMovingControlPoint(): void {
    const selection = this.visualSelection.selection;
    if (selection) {
      selection.releaseGrab();
      Tool.UNDO_REDO_SERVICE.saveSvgBoard();
    }
  }

  startSelectionRectangle(cursor: Point): void {
    this.emptySelectedSvgComponents();
    this.visualSelection.startDragging(cursor);
  }

  dragSelectionRectangle(cursor: Point): void {
    this.visualSelection.continueDragging(cursor);
  }

  tryToSelectRectangle(cursor: Point): void {
    this.emptySelectedSvgComponents();
    this.visualSelection.continueDragging(cursor);
    this.addToSelectedSvgComponents(this.visualSelection.getComponentsInContact());
  }

  tryToSelectAtCursor(cursor: Point): SvgBasicProperties | undefined {
    this.emptySelectedSvgComponents();
    const selectedComponent = this.getComponentAtCursor(cursor);
    const maybeComponent = selectedComponent !== undefined ? [selectedComponent] : [];
    this.addToSelectedSvgComponents(maybeComponent);
    return selectedComponent;
  }

  tryToApplyInversionFrom(logicalSelection: LogicalSelection): void {
    if (!this.canAlterComponents) { return; }

    const componentsToRemove = [];
    const componentsToAdd = [];

    for (const component of logicalSelection.selectedSvgComponents) {
      component.isSelected = !component.isSelected;
      if (component.isSelected) {
        componentsToAdd.push(component);
      } else {
        componentsToRemove.push(component);
      }
    }

    this.removeToSelectedSvgComponents(componentsToRemove);
    this.addToSelectedSvgComponents(componentsToAdd);
  }

  replaceWith(logicalSelection: LogicalSelection): void {
    this.emptySelectedSvgComponents();
    this.addToSelectedSvgComponents(logicalSelection.selectedSvgComponents);
  }

  private emptySelectedSvgComponents(): void {
    for (const component of this.selectedSvgComponents) {
      if (this.canAlterComponents) {
        component.isSelected = false;
      }
    }
    this.selectedSvgComponents = [];
  }

  private addToSelectedSvgComponents(svgComponents: SvgBasicProperties[]): void {
    for (const component of svgComponents) {
      if (this.canAlterComponents) {
        component.isSelected = true;
      }

      this.selectedSvgComponents.push(component);
    }
    this.adjustSelectionToBoundary();
  }

  private removeToSelectedSvgComponents(svgComponents: SvgBasicProperties[]): void {
    for (const component of svgComponents) {
      if (this.canAlterComponents) {
        component.isSelected = false;
      }

      const index = this.selectedSvgComponents.indexOf(component);
      if (index >= 0) {
        this.selectedSvgComponents.splice(index, 1);
      }
    }
    this.adjustSelectionToBoundary();
  }

  private adjustSelectionToBoundary(): void {
    if (!this.tryToAdjustSelectionBoundary()) {
      this.reset();
    }
  }

  private tryToAdjustSelectionBoundary(): boolean {
    const boundary = BoundaryBox.containing(this.selectedSvgComponents);
    if (boundary !== undefined) {
      this.visualSelection.setCorners(boundary.topLeft, boundary.bottomRight);
      return true;
    }

    return false;
  }

  private getComponentAtCursor(cursor: Point): SvgBasicProperties | undefined {
    return Tool.SVG_COLLISIONS_SERVICE.getTopSvgComponentInContact(
      PolygonCollidable.createCursor(cursor),
    );
  }
}
