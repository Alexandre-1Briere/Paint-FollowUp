import {SvgLayer, SvgLayerPlacement} from '../../enums/svg';

export class LayerOrder {
  readonly layers: SvgLayer[];

  protected constructor(svgLayers: SvgLayer[]) {
    this.layers = svgLayers;
  }

  static createBottomToTop(svgLayers: SvgLayer[]): LayerOrder {
    return new LayerOrder(svgLayers);
  }

  compare(svgLayer: SvgLayer, svgLayerReference: SvgLayer): SvgLayerPlacement {
    const DEFAULT_UNDERNEATH = -1;
    let index = DEFAULT_UNDERNEATH;
    let indexReference = 0;

    for (let position = 0; position < this.layers.length; ++position) {
      if (svgLayer === this.layers[position]) {
        index = position;
      }
      if (svgLayerReference === this.layers[position]) {
        indexReference = position;
      }
    }

    if (index < indexReference) {
      return SvgLayerPlacement.Under;
    } else if (index === indexReference) {
      return SvgLayerPlacement.Same;
    } else {
      return SvgLayerPlacement.Above;
    }
  }
}
