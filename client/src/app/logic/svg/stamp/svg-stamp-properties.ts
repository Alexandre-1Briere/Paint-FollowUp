import { SvgType } from '../../../enums/svg';
import { Point } from '../../../interfaces/point';
import { Boundary } from '../../collisions/base-collision/boundary';
import { Collidable } from '../../collisions/base-collision/collidable';
import { PolygonCollidable } from '../../collisions/polygon/polygon-collidable';
import { BoundaryBox } from '../../collisions/utils/boundary-box';
import { SvgProperties } from '../base-svg/svg-properties';

const DEFAULT_SIZE = 100;
const DEFAULT_SCALE = 0.1;
const DEFAULT_ROTATION_ANGLE = 0;
const NO_POINTS = '';

export class SvgStampProperties extends SvgProperties {
    protected width: number;
    protected height: number;
    protected scaleOfStamp: number;
    protected rotationAngle: number;
    protected svgShape: string | undefined;

    constructor() {
        super(SvgType.SvgStampComponent);
        this.width = DEFAULT_SIZE;
        this.height = DEFAULT_SIZE;
        this.rotationAngle = DEFAULT_ROTATION_ANGLE;
        this.scaleOfStamp = DEFAULT_SCALE;
        this.svgShape = NO_POINTS;
    }

    getCenter(): Point {
        return {x: this.x + this.width / 2, y: this.y + this.height / 2};
    }

    placeOnScreen(x: number, y: number, type: string | undefined): void {
        if ( type === undefined) { return; }
        this.svgShape = 'assets/' + type + '.svg';
        this.x = x - (this.height / 2);
        this.y = y - (this.width / 2);
    }

    setScaleOfStamp(scale: number): void {
        const MINIMUM_SCALE = 1;
        if (scale >= MINIMUM_SCALE) {
            this.scaleOfStamp = scale;
            this.scalingStamp();
        }
    }
    getScaleOfStamp(): number {
       return  this.scaleOfStamp;
    }

    setRotationAngle(rotationAngle: number): void {
        const MINIMUM_ANGLE = 0;
        if (rotationAngle >= MINIMUM_ANGLE) {
            this.rotationAngle = rotationAngle;
            this.scalingStamp();
        }
    }

    getRotationAngle(): number { return this.rotationAngle; }

    scalingStamp(): void {
        this.width = ((this.scaleOfStamp * DEFAULT_SCALE) * this.width ) + this.width;
        this.height = ((this.scaleOfStamp * DEFAULT_SCALE) * this.height ) + this.height;
    }

    getCollidables(): Collidable[] {
        const topLeft = {x: this.x, y: this.y};
        const topRight = {x: this.x + this.width, y: this.y};
        const bottomRight = {x: this.x + this.width, y: this.y + this.height};
        const bottomLeft = {x: this.x, y: this.y + this.height};

        return [
            new PolygonCollidable([topLeft, topRight, bottomRight, bottomLeft]),
        ];
    }

    getBoundary(): Boundary {
        const topLeft = {x: this.x, y: this.y};
        const bottomRight = {x: this.x + this.width, y: this.y + this.height};
        return BoundaryBox.create([topLeft, bottomRight]);
    }

}
