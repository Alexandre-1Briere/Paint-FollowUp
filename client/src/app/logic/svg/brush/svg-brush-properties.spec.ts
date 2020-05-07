import { BrushTextures } from '../../../components/drawing/work-board/svg-brush/textures';
import { SvgBrushProperties } from './svg-brush-properties';

class SvgBrushTestable extends SvgBrushProperties {
  constructor() { super(); }

  getTextureName(): string { return this.textureName; }
}

describe('SvgBrushProperties', () => {
  let svgBrushProperties: SvgBrushTestable;

  beforeEach(() => {
    svgBrushProperties = new SvgBrushTestable();
  });

  it('should create an instance', () => {
    expect(new SvgBrushProperties()).toBeTruthy();
  });

  it('#setTexture() works as expected', () => {
    const texture = BrushTextures.Foggy;
    svgBrushProperties.setTexture(texture);
    expect(svgBrushProperties.getTextureName()).toEqual(texture);
  });
});
