import { Point } from 'src/app/interfaces/point';
import { SvgLayer, SvgStatus, SvgType } from '../../../enums/svg';
import {SvgJson} from '../../../interfaces/svg-json';
import {Boundary} from '../../collisions/base-collision/boundary';
import {Collidable} from '../../collisions/base-collision/collidable';
import {BoundaryBox} from '../../collisions/utils/boundary-box';
import {SvgUtils} from '../utils/svg-utils';
import {SvgBasicProperties} from './svg-basic-properties';

const DEFAULT_IS_SELECTED = false;
const DEFAULT_SVG_STATUS = SvgStatus.Permanent;
const DEFAULT_SVG_LAYER = SvgLayer.Stack;
const DEFAULT_POSITION = 0;
const DEFAULT_HEX_COLOR = '#000000';
const DEFAULT_OPACITY = 1;

export abstract class SvgProperties implements SvgBasicProperties {
  isSelected: boolean;
  status: SvgStatus;
  layer: SvgLayer;
  readonly type: SvgType;

  protected x: number;
  protected y: number;
  protected primaryColor: string;
  protected secondaryColor: string;
  protected primaryOpacity: number;
  protected secondaryOpacity: number;

  constructor(svgType: SvgType) {
    this.isSelected = DEFAULT_IS_SELECTED;
    this.status = DEFAULT_SVG_STATUS;
    this.layer = DEFAULT_SVG_LAYER;
    this.type = svgType;

    this.x = DEFAULT_POSITION;
    this.y = DEFAULT_POSITION;
    this.primaryColor = DEFAULT_HEX_COLOR;
    this.primaryOpacity = DEFAULT_OPACITY;
    this.secondaryColor = DEFAULT_HEX_COLOR;
    this.secondaryOpacity = DEFAULT_OPACITY;
  }

  centerAt(center: Point): void {
    this.x = center.x;
    this.y = center.y;
  }
  getCenter(): Point { return {x: this.x, y: this.y}; }

  translate(delta: Point): void {
    this.x += delta.x;
    this.y += delta.y;
  }

  rotateClockwise(degrees: number): void {
    // nothing to do
  }

  scale(percentage: number, direction: Point): void {
    // nothing to do
  }

  setPrimaryColor(hexColor: string): void {
    if (SvgUtils.isHexColorValid(hexColor)) {
      this.primaryColor = hexColor;
    }
  }
  getPrimaryColor(): string {return this.primaryColor; }

  setSecondaryColor(hexColor: string): void {
    if (SvgUtils.isHexColorValid(hexColor)) {
      this.secondaryColor = hexColor;
    }
  }
  getSecondaryColor(): string {return this.secondaryColor; }

  setPrimaryOpacity(opacity: number): void {
    if (this.isOpacityValid(opacity)) {
      this.primaryOpacity = opacity;
    }
  }
  getPrimaryOpacity(): number {return this.primaryOpacity; }

  setSecondaryOpacity(opacity: number): void {
    if (this.isOpacityValid(opacity)) {
      this.secondaryOpacity = opacity;
    }
  }
  getSecondaryOpacity(): number {return this.secondaryOpacity; }

  private isOpacityValid(opacity: number): boolean {
    const TRANSPARENT = 0;
    const OPAQUE = 1;
    return TRANSPARENT < opacity && opacity < OPAQUE;
  }

  readFromSvgJson(svgJson: SvgJson): boolean {
    const SUCCESS = true;

    if (this.type === svgJson.svgType) {
      let jsonObject;
      try {
        jsonObject = JSON.parse(svgJson.content);
      } catch (error) {
        return !SUCCESS;
      }

      Object.assign(this, jsonObject);

      return SUCCESS;
    }

    return !SUCCESS;
  }

  createSvgJson(): SvgJson {
    return {
      svgType: this.type,
      content: JSON.stringify(this),
    };
  }

  getCollidables(): Collidable[] {
    return [];
  }

  getNegativeCollidables(): Collidable[] {
    return [];
  }

  getBoundary(): Boundary {
    return BoundaryBox.create([{x: this.x, y: this.y}]);
  }
}
