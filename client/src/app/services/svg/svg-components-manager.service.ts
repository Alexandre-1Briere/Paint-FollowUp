import { Injectable, ViewContainerRef } from '@angular/core';
import { SvgLayer, SvgStatus, SvgType } from '../../enums/svg';
import { DrawingBaseParameters } from '../../interfaces/drawing-base-parameters';
import { SvgCreationParameters } from '../../interfaces/svg-creation-parameters';
import {SvgBoardJson, SvgJson} from '../../interfaces/svg-json';
import { SvgBasicProperties } from '../../logic/svg/base-svg/svg-basic-properties';
import { SvgComponentType } from '../../logic/svg/base-svg/svg-component-type';
import { SvgUndoRedoService } from '../undo-redo/svg-undo-redo.service';
import { ViewManagerService } from './view-manager.service';

@Injectable({
  providedIn: 'root',
})
export class SvgComponentsManagerService {

  private shouldSaveBoard: boolean;
  drawingBaseParameters: DrawingBaseParameters;

  constructor(public viewManager: ViewManagerService,
              private svgUndoRedo: SvgUndoRedoService) {
    this.shouldSaveBoard = false;
    this.svgUndoRedo.initialize(this);
  }

  initialiseViewContainerRef(viewContainerRef: ViewContainerRef): void {
    this.viewManager.resetSvgComponents();
    this.svgUndoRedo.reset();
    this.viewManager.viewContainerRef = viewContainerRef;
  }

  createSvgComponent(svgCreationParameters: SvgCreationParameters = {
                       onTopOfLayer: true,
                       svgStatus: SvgStatus.Permanent,
                       svgLayer: SvgLayer.Stack,
                       svgType: SvgType.SvgRectangleComponent,
                     },
                     removeInProgress: boolean = true,
                     autoSaveEnabled: boolean = true): undefined | SvgBasicProperties {

    this.beforeCreatingSvg(svgCreationParameters.svgLayer, removeInProgress);
    const svgComponent = this.viewManager.createSvgComponent(
      svgCreationParameters.onTopOfLayer,
      svgCreationParameters.svgLayer,
      svgCreationParameters.svgType,
    );
    this.beforeReturningSvg(svgComponent, svgCreationParameters.svgStatus, autoSaveEnabled);

    return svgComponent;
  }

  duplicateSvgComponent(parent: SvgBasicProperties,
                        nextToParentOtherwiseTop: boolean = true,
                        svgStatus: SvgStatus = SvgStatus.Permanent,
                        removeInProgress: boolean = true,
                        autoSaveEnabled: boolean = true): undefined | SvgBasicProperties {

    const index = this.findSvgComponentIndex(parent);
    if (index === undefined) {
      return undefined;
    }

    let clone: SvgBasicProperties | undefined;
    if (nextToParentOtherwiseTop) {
      const INSERTION_INDEX = index + 1;

      this.beforeCreatingSvg(parent.layer, removeInProgress);
      clone = this.viewManager.createSvgComponentAtIndex(
          parent.layer,
          parent.type,
          INSERTION_INDEX,
      );
      this.beforeReturningSvg(clone, svgStatus, autoSaveEnabled);
    } else {
      const creationParameters = {
        onTopOfLayer: true,
        svgStatus,
        svgLayer: parent.layer,
        svgType: parent.type,
      };
      clone = this.createSvgComponent(creationParameters, removeInProgress, autoSaveEnabled);
    }

    if (clone !== undefined) {
      const parentAttributes = parent.createSvgJson();
      clone.readFromSvgJson(parentAttributes);
      clone.status = svgStatus;
    }

    return clone;
  }

  createMultipleSvgComponents(svgJsons: SvgJson[],
                              applyBeforeSave?: (component: SvgBasicProperties) => void): SvgBasicProperties[] {
    const components = this.createComponentsFromJsons(svgJsons);
    if (applyBeforeSave !== undefined) {
      for (const component of components) {
        applyBeforeSave(component);
      }
    }
    if (components.length > 0) {
      this.svgUndoRedo.saveSvgBoard();
    }
    return components;
  }

  private beforeCreatingSvg(svgLayer: SvgLayer, removeInProgress: boolean): void {
    this.saveBoardIfRequired();

    if (removeInProgress) {
      this.removeInProgress(svgLayer);
    }
  }

  private beforeReturningSvg(svgComponent: SvgBasicProperties | undefined,
                             svgStatus: SvgStatus,
                             autoSaveEnabled: boolean): void {
    if (svgComponent !== undefined) {
      svgComponent.status = svgStatus;

      if (svgStatus === SvgStatus.Permanent && autoSaveEnabled) {
        this.shouldSaveBoard = true;
      }
    }
  }

  componentsCount(svgStatus: SvgStatus = SvgStatus.Permanent, svgLayer: SvgLayer = SvgLayer.Stack): number {
    return this.viewManager.componentsCount(svgStatus, svgLayer);
  }

  countAllSvg(): number {
    return this.viewManager.componentsCount();
  }

  getSvgComponent(index: number, svgComponentType?: SvgComponentType): undefined | SvgBasicProperties {
    const svgComponent = this.viewManager.getSvgComponent(index);

    if (svgComponent !== undefined &&
        (svgComponentType === undefined || svgComponent instanceof svgComponentType)) {
      return svgComponent;
    }

    return undefined;
  }

  getSvgBoard(): SvgBoardJson {
    const svgJsons = [];

    for (const svgReference of this.viewManager.svgComponents) {
      const svgComponent = svgReference.instance;
      if (svgComponent.status === SvgStatus.Permanent) {
        svgJsons.push(svgComponent.createSvgJson());
      }
    }

    return {components: svgJsons};
  }

  loadSvgBoard(svgBoard: SvgBoardJson): void {
    this.resetSvgComponents();
    this.createComponentsFromJsons(svgBoard.components);
  }

  private createComponentsFromJsons(svgJsons: SvgJson[]): SvgBasicProperties[] {
    const svgComponents = [];
    for (const svgJson of svgJsons) {
      if (svgJson.svgType !== undefined) {
        const svgComponent = this.createSvgComponent({
            onTopOfLayer: true,
            svgStatus: SvgStatus.Permanent,
            svgLayer: SvgLayer.Stack,
            svgType: svgJson.svgType},
          false,
          false,
        );
        if (svgComponent !== undefined) {
          svgComponent.readFromSvgJson(svgJson);
          svgComponents.push(svgComponent);
        }
      }
    }
    return svgComponents;
  }

  resetSvgComponents(svgLayer?: SvgLayer): void {
    this.saveBoardIfRequired();
    this.viewManager.resetSvgComponents(svgLayer);
  }

  removeSvgComponent(svgComponent: SvgBasicProperties): void {
    this.saveBoardIfRequired();
    const index = this.findSvgComponentIndex(svgComponent);
    if (index !== undefined) {
      this.viewManager.removeSvgComponent(index);
    }
  }

  refreshSvgComponent(svgComponent: SvgBasicProperties): void {
    const index = this.findSvgComponentIndex(svgComponent);
    if (index !== undefined) {
      this.viewManager.svgComponents[index].changeDetectorRef.detectChanges();
    }
  }

  removeInProgress(svgLayer: SvgLayer = SvgLayer.Stack): void {
    const BOTTOM_INDEX = this.viewManager.tryToGetLayerIndex(svgLayer, false);
    if (BOTTOM_INDEX !== undefined) {
      this.removeIfInProgress(BOTTOM_INDEX);
    }
    const TOP_INDEX = this.viewManager.tryToGetLayerIndex(svgLayer);
    if (TOP_INDEX !== undefined) {
      this.removeIfInProgress(TOP_INDEX);
    }
  }

  saveBoardIfRequired(): void {
    if (this.shouldSaveBoard) {
      this.shouldSaveBoard = false;
      this.svgUndoRedo.saveSvgBoard();
    }
  }

  private removeIfInProgress(index: number): void {
    const SVG = this.viewManager.getSvgComponent(index);
    if (SVG !== undefined && SVG.status === SvgStatus.InProgress) {
      this.viewManager.removeSvgComponent(index);
    }
  }

  private findSvgComponentIndex(svgComponent: SvgBasicProperties): number | undefined {
    for (let index = 0; index < this.countAllSvg(); ++index) {
      if (this.viewManager.getSvgComponent(index) === svgComponent) {
        return index;
      }
    }

    return undefined;
  }
}
