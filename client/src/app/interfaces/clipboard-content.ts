import {Point} from './point';
import {SvgJson} from './svg-json';

export interface ClipboardContent {
  svgJsons: SvgJson[];
  reference: Point;
}
