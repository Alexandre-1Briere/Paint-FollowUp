import { SvgType } from '../../../enums/svg';
import {Point} from '../../../interfaces/point';
import { SvgProperties } from '../base-svg/svg-properties';

const DEFAULT_DIMENSIONS = 2000;
const DEFAULT_CELL_SIZE = 50;
const DEFAULT_OPACITY = 0.5;

export class SvgGridProperties extends SvgProperties {
  protected width: number;
  protected height: number;
  protected cellSize: number;
  protected rawSvgPoints: string;

  constructor() {
    super(SvgType.SvgGridComponent);

    this.width = DEFAULT_DIMENSIONS;
    this.height = DEFAULT_DIMENSIONS;
    this.cellSize = DEFAULT_CELL_SIZE;
    this.primaryOpacity = DEFAULT_OPACITY;
    this.refreshRawSvgPoints();
  }

  centerAt(center: Point): void {
    this.x = center.x - this.width / 2;
    this.y = center.y - this.height / 2;
  }
  getCenter(): Point {
    return {x: this.x + this.width / 2, y: this.y + this.height / 2};
  }

  setCellSize(size: number): void {
    const MINIMUM_SIZE = 5;
    this.cellSize = Math.max(size, MINIMUM_SIZE);
    this.refreshRawSvgPoints();
  }
  getCellSize(): number { return this.cellSize; }

  refreshRawSvgPoints(): void {
    this.rawSvgPoints =
      '0,' + this.cellSize +
      ' ' + this.cellSize + ',' + this.cellSize +
      ' ' + this.cellSize + ',0';
  }
}
