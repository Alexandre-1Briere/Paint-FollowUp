import { SvgType } from '../enums/svg';

export interface SvgJson {
  svgType: SvgType | undefined;
  content: string;
}

export interface SvgBoardJson {
  components: SvgJson[];
}
