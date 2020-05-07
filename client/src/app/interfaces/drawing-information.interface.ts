import { DrawingBaseParameters } from './drawing-base-parameters';
import { SvgBoardJson } from './svg-json';

export interface DrawingInformationInterface {
  etiquette: [];
  name: string;
  baseParameters: DrawingBaseParameters;
  svgBoard: SvgBoardJson;
  id: number;
}
