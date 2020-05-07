import {SvgLayer, SvgLayerPlacement} from '../../enums/svg';
import {LayerOrder} from './layer-order';

describe('LayerOrder', () => {
  it('should create an instance', () => {
    expect(LayerOrder.createBottomToTop([])).toBeTruthy();
  });

  it('#compare() works as intended', () => {
    const layerOrder = LayerOrder.createBottomToTop([SvgLayer.Stack, SvgLayer.Grid]);

    expect(layerOrder.compare(SvgLayer.Grid, SvgLayer.Grid)).toBe(SvgLayerPlacement.Same);
    expect(layerOrder.compare(SvgLayer.Stack, SvgLayer.Grid)).toBe(SvgLayerPlacement.Under);
    expect(layerOrder.compare(SvgLayer.Grid, SvgLayer.Stack)).toBe(SvgLayerPlacement.Above);
  });
});
