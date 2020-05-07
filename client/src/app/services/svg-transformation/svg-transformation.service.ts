import { Injectable } from '@angular/core';
import {Point} from '../../interfaces/point';
import {SvgBasicProperties} from '../../logic/svg/base-svg/svg-basic-properties';
import {SvgComponentsManagerService} from '../svg/svg-components-manager.service';
import {SvgUndoRedoService} from '../undo-redo/svg-undo-redo.service';

const NO_REFERENCE = 0;
const NO_TRANSLATION = 0;

@Injectable({
  providedIn: 'root',
})
export class SvgTransformationService {

  private positionReference: Point;
  private translationVector: Point;

  private svgComponents: SvgBasicProperties[];

  constructor(private svgComponentsManagerService: SvgComponentsManagerService,
              private svgUndoRedoService: SvgUndoRedoService) {
    this.reset();
  }

  reset(): void {
    this.svgComponents = [];
    this.positionReference = {x: NO_REFERENCE, y: NO_REFERENCE};
    this.translationVector = {x: NO_TRANSLATION, y: NO_TRANSLATION};
  }

  begin(svgComponents: SvgBasicProperties[], positionReference: Point): void {
    this.reset();
    this.positionReference = positionReference;
    this.svgComponents = svgComponents;
    this.svgComponentsManagerService.saveBoardIfRequired();
  }

  translateAllTo(position: Point): void {
    const DX = position.x - (this.positionReference.x + this.translationVector.x);
    const DY = position.y - (this.positionReference.y + this.translationVector.y);
    for (const component of this.svgComponents) {
      component.translate({x: DX, y: DY});
    }
    this.translationVector.x = position.x - this.positionReference.x;
    this.translationVector.y = position.y - this.positionReference.y;
    this.ensureRefresh();
  }

  terminate(): void {
    if (this.translationVector.x !== 0 || this.translationVector.y !== 0) {
      this.svgUndoRedoService.saveSvgBoard();
    }
    this.reset();
  }

  private ensureRefresh(): void {
    for (const component of this.svgComponents) {
      this.svgComponentsManagerService.refreshSvgComponent(component);
    }
  }
}
