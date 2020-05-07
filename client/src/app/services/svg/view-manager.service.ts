import { ComponentFactoryResolver, ComponentRef, Injectable, ViewContainerRef } from '@angular/core';
import { svgComponentTypes } from '../../constants/svg-component-type-map';
import { SvgLayer, SvgLayerPlacement, SvgStatus, SvgType } from '../../enums/svg';
import { SvgBasicProperties } from '../../logic/svg/base-svg/svg-basic-properties';
import { LayerOrder } from './layer-order';

@Injectable({
  providedIn: 'root',
})
export class ViewManagerService {
  svgComponents: ComponentRef<SvgBasicProperties>[];
  viewContainerRef: ViewContainerRef | undefined;
  private layerOrder: LayerOrder;

  constructor(private componentFactoryResolver: ComponentFactoryResolver) {
    this.svgComponents = [];
    this.viewContainerRef = undefined;
    this.layerOrder = LayerOrder.createBottomToTop([
      SvgLayer.Stack,
      SvgLayer.Visual,
      SvgLayer.Selection,
      SvgLayer.Grid,
    ]);
  }

  initialiseViewContainerRef(viewContainerRef: ViewContainerRef): void {
    this.resetSvgComponents();
    this.viewContainerRef = viewContainerRef;
  }

  createSvgComponent(onTopOfLayer: boolean = true,
                     svgLayer: SvgLayer = SvgLayer.Stack,
                     svgType: SvgType= SvgType.SvgRectangleComponent): undefined | SvgBasicProperties {
    const INSERTION_INDEX = this.indexToInsert(svgLayer, onTopOfLayer);
    return this.createSvgComponentAtIndex(svgLayer, svgType, INSERTION_INDEX);
  }

  createSvgComponentAtIndex(svgLayer: SvgLayer = SvgLayer.Stack,
                            svgType: SvgType= SvgType.SvgRectangleComponent,
                            insertionIndex: number): undefined | SvgBasicProperties {
    if (this.viewContainerRef !== undefined) {
      const componentFactory = this.componentFactoryResolver.resolveComponentFactory(svgComponentTypes[svgType]);

      this.svgComponents.splice(insertionIndex, 0,
          this.viewContainerRef.createComponent(componentFactory, insertionIndex),
      );

      const svgComponent = this.svgComponents[insertionIndex].instance;
      svgComponent.layer = svgLayer;
      return svgComponent;
    }

    return undefined;
  }

  componentsCount(svgStatus?: SvgStatus, svgLayer?: SvgLayer): number {
    let count = 0;
    for (const svgComponent of this.svgComponents) {
      if ((svgStatus === undefined || svgComponent.instance.status === svgStatus) &&
        (svgLayer === undefined || svgComponent.instance.layer === svgLayer)) {
        count += 1;
      }
    }

    return count;
  }

  getSvgComponent(index: number): undefined | SvgBasicProperties {
    if (this.isSvgComponentIndexValid(index)) {
      return this.svgComponents[index].instance;
    }

    return undefined;
  }

  removeSvgComponent(index: number): void {
    if (this.isSvgComponentIndexValid(index)) {
      this.svgComponents[index].destroy();
      this.svgComponents.splice(index, 1);
    }
  }

  resetSvgComponents(svgLayer?: SvgLayer): void {
    if (svgLayer === undefined) {
      for (const component of this.svgComponents) {
        component.destroy();
      }

      this.svgComponents = [];
    } else {
      const INDEX_START = this.tryToGetLayerIndex(svgLayer, false);
      const INDEX_END = this.tryToGetLayerIndex(svgLayer);

      if (INDEX_START !== undefined && INDEX_END !== undefined) {
        const NUMBER_OF_DELETIONS = 1 + INDEX_END - INDEX_START;
        for (let offset = 0; offset < NUMBER_OF_DELETIONS; ++offset) {
          this.svgComponents[INDEX_START + offset].destroy();
        }
        this.svgComponents.splice(INDEX_START, NUMBER_OF_DELETIONS);
      }
    }

  }

  tryToGetLayerIndex(svgLayer: SvgLayer, topOfLayer: boolean = true): number | undefined {
    const index = this.findLayerIndex(svgLayer, topOfLayer);
    if (this.isSvgComponentIndexValid(index) && this.svgComponents[index].instance.layer === svgLayer) {
      return index;
    }
    return undefined;
  }

  indexToInsert(svgLayer: SvgLayer, topOfLayer: boolean = true): number {
    const index = this.findLayerIndex(svgLayer, topOfLayer);
    let indexTop = index;
    if (this.isSvgComponentIndexValid(index) &&
        this.layerOrder.compare(svgLayer, this.svgComponents[index].instance.layer) !== SvgLayerPlacement.Under) {
      indexTop += 1;
    }
    indexTop = Math.max(indexTop, 0);
    return topOfLayer ? indexTop : index;
  }

  private findLayerIndex(svgLayer: SvgLayer, topOfLayer: boolean = true): number {
    if (this.svgComponents.length === 0) {
      return 0;
    }

    let nextJump = Math.floor(this.svgComponents.length / 2);
    let index = nextJump;
    let direction = this.findNextDirection(index, svgLayer, topOfLayer);
    while (direction !== 0) {
      nextJump = Math.max(Math.floor(Math.abs(nextJump) / 2), 1) * direction;
      index += nextJump;
      direction = this.findNextDirection(index, svgLayer, topOfLayer);
    }

    return index;
  }

  private findNextDirection(index: number, svgLayer: SvgLayer, onTopOfLayer: boolean = true): number {
    const TOWARD_BOTTOM = -1;
    const TOWARD_TOP = 1;
    const FOUND = 0;
    const DIRECTION = onTopOfLayer ? TOWARD_TOP : TOWARD_BOTTOM;

    const NEXT_INDEX = index + DIRECTION;
    if (!this.isSvgComponentIndexValid(index) ||
        !this.isSvgComponentIndexValid(NEXT_INDEX)) {
      return FOUND;
    }

    const LAYER = this.svgComponents[index].instance.layer;
    const COMPARISON = this.layerOrder.compare(svgLayer, LAYER);
    const NEXT_LAYER = this.svgComponents[NEXT_INDEX].instance.layer;
    const NEXT_COMPARISON = this.layerOrder.compare(svgLayer, NEXT_LAYER);

    const NEXT_LAYER_PLACEMENT = onTopOfLayer ? SvgLayerPlacement.Under : SvgLayerPlacement.Above;
    if (NEXT_COMPARISON === NEXT_LAYER_PLACEMENT &&
      (COMPARISON !== NEXT_LAYER_PLACEMENT)) {
      return FOUND;
    } else if (NEXT_COMPARISON === NEXT_LAYER_PLACEMENT || COMPARISON === NEXT_LAYER_PLACEMENT) {
      return -DIRECTION;
    } else {
      return DIRECTION;
    }
  }

  private isSvgComponentIndexValid(index: number): boolean {
    return this.svgComponents.length !== 0 && index >= 0 && index < this.svgComponents.length;
  }
}
