import { Point } from 'src/app/interfaces/point';
import { SvgLayer, SvgStatus, SvgType } from '../../../enums/svg';
import {SvgJson} from '../../../interfaces/svg-json';
import {SetOfCollidables} from '../../collisions/base-collision/collidable';

export interface SvgBasicProperties extends SetOfCollidables {
  isSelected: boolean;
  status: SvgStatus;
  layer: SvgLayer;
  readonly type: SvgType;

  centerAt(center: Point): void;

  getCenter(): Point;

  translate(delta: Point): void;

  rotateClockwise(degrees: number): void;

  scale(percentage: number, direction: Point): void;

  setPrimaryColor(hexColor: string): void;

  getPrimaryColor(): string;

  setSecondaryColor(hexColor: string): void;

  getSecondaryColor(): string;

  setPrimaryOpacity(opacity: number): void;

  getPrimaryOpacity(): number;

  setSecondaryOpacity(opacity: number): void;

  getSecondaryOpacity(): number;

  readFromSvgJson(svgJson: SvgJson): void;

  createSvgJson(): SvgJson;
}
