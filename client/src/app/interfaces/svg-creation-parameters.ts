import { SvgLayer, SvgStatus, SvgType } from '../enums/svg';

export interface SvgCreationParameters {
  onTopOfLayer: boolean;
  svgStatus: SvgStatus;
  svgLayer: SvgLayer;
  svgType: SvgType;
}
