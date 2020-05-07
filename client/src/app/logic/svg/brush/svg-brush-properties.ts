import { BrushTextures } from '../../../components/drawing/work-board/svg-brush/textures';
import { SvgType } from '../../../enums/svg';
import { SvgPencilProperties } from '../base-pencil/svg-pencil-properties';

const DEFAULT_NO_TEXTURE = 'none';
const DEFAULT_TEXTURE = BrushTextures.Diffuse;

export class SvgBrushProperties extends SvgPencilProperties {
  protected textureName: string;

  constructor() {
    super(SvgType.SvgBrushComponent);

    this.textureName = DEFAULT_NO_TEXTURE;
    this.setTexture(DEFAULT_TEXTURE);
  }

  setTexture(texture: BrushTextures): void {
    this.textureName = texture;
  }

  getTextureName(): string {
    return this.textureName;
  }
}
