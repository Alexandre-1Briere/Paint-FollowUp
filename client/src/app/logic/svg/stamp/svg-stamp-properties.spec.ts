import { PolygonCollidable } from '../../collisions/polygon/polygon-collidable';
import { BoundaryBox } from '../../collisions/utils/boundary-box';
import { SvgStampProperties } from './svg-stamp-properties';

const DEFAULT_SCALE = 0.1;

class SvgStampTestable extends SvgStampProperties {
    constructor() {super(); }

    getX(): number {return this.x; }
    getY(): number {return this.y; }
    getWidth(): number {return this.width; }
    getHeight(): number {return this.height; }
    getSvgShape(): string | undefined { return this.svgShape; }
}

describe('SvgStampProperties', () => {
    let svgStampProperties: SvgStampTestable;

    beforeEach(() => {
        svgStampProperties = new SvgStampTestable();
    });

    it('should create an instance', () => {
        expect(new SvgStampProperties()).toBeTruthy();
    });

    it ('#getCenter() works as expected', () => {
        const CENTER_X = svgStampProperties.getX() + svgStampProperties.getWidth() / 2;
        const CENTER_Y = svgStampProperties.getY() + svgStampProperties.getHeight() / 2;
        expect(svgStampProperties.getCenter()).toEqual({x: CENTER_X, y: CENTER_Y});
    });

    it ('#placeOnScreen() works as expected', () => {
        const X = 1;
        const Y = 2;
        const TYPE = 'assets/' + 'type' + '.svg';
        svgStampProperties.placeOnScreen(X, Y, 'type');
        expect(TYPE).toEqual(svgStampProperties.getSvgShape() as string);
        expect(svgStampProperties.getX()).toEqual(X - svgStampProperties.getWidth() / 2);
        expect(svgStampProperties.getY()).toEqual(Y - svgStampProperties.getHeight() / 2);
    });
    it('#setRotationAngle  changes rotation angle with valid input', () => {
        const VALID_ROTATION_ANGLE = 1;
        svgStampProperties.setRotationAngle(VALID_ROTATION_ANGLE);
        expect(svgStampProperties.getRotationAngle()).toEqual(VALID_ROTATION_ANGLE);
    });

    it('#setRotationAngle  does not change rotation angle with negative input', () => {
        const WRONG_ROTATION_ANGLE = -1;
        const RIGHT_ROTATION_ANGLE = svgStampProperties.getRotationAngle();
        svgStampProperties.setRotationAngle(WRONG_ROTATION_ANGLE);
        expect(svgStampProperties.getRotationAngle()).toEqual(RIGHT_ROTATION_ANGLE);
    });

    it('#setSizeOfLine()  does not change size of line  with 0 input', () => {
        const WRONG_SIZE_OF_LINE = 0;
        const RIGHT_SIZE_OF_LINE = svgStampProperties.getScaleOfStamp();
        svgStampProperties.setScaleOfStamp(WRONG_SIZE_OF_LINE);
        expect(svgStampProperties.getScaleOfStamp()).toEqual(RIGHT_SIZE_OF_LINE);
    });

    it('#setSizeOfLine() changes size of line with valid input', () => {
        const VALID_SIZE_OF_LINE = 1;
        svgStampProperties.setScaleOfStamp(VALID_SIZE_OF_LINE);
        expect(svgStampProperties.getScaleOfStamp()).toEqual(VALID_SIZE_OF_LINE);
    });

    it('#setSizeOfLine()  does not change size of line with negative input', () => {
        const WRONG_SIZE_OF_LINE = -1;
        const RIGHT_SIZE_OF_LINE = svgStampProperties.getScaleOfStamp();
        svgStampProperties.setScaleOfStamp(WRONG_SIZE_OF_LINE);
        expect(svgStampProperties.getScaleOfStamp()).toEqual(RIGHT_SIZE_OF_LINE);
    });

    it('#setSizeOfLine() does not change size of line with 0 input', () => {
        const WRONG_SIZE_OF_LINE = 0;
        const RIGHT_SIZE_OF_LINE = svgStampProperties.getScaleOfStamp();
        svgStampProperties.setScaleOfStamp(WRONG_SIZE_OF_LINE);
        expect(svgStampProperties.getScaleOfStamp()).toEqual(RIGHT_SIZE_OF_LINE);
    });

    it ('#getBoundary should call creat ', () => {
        const getBoundarySpy = spyOn(BoundaryBox, 'create');
        svgStampProperties.getBoundary();
        expect(getBoundarySpy).toHaveBeenCalled();
    });

    it('#getCollidables() should return Collidable[]', () => {
        const items = svgStampProperties.getCollidables();
        items.forEach((item) => {
            expect(item instanceof PolygonCollidable).toBe(true,
                'instance of EllipseCollidable');
        });
    });

    it('#scalingStamp() works as expected', () => {
       const SCALE_WIDTH_EXPECTED = ((svgStampProperties.getScaleOfStamp() * DEFAULT_SCALE)
           * svgStampProperties.getWidth() ) + svgStampProperties.getWidth();
       const SCALE_HEIGHT_EXPECTED = ((svgStampProperties.getScaleOfStamp() * DEFAULT_SCALE)
           * svgStampProperties.getHeight() ) + svgStampProperties.getHeight();
       svgStampProperties.scalingStamp();
       expect(svgStampProperties.getWidth()).toEqual(SCALE_WIDTH_EXPECTED);
       expect(svgStampProperties.getHeight()).toEqual(SCALE_HEIGHT_EXPECTED);
    });

});
