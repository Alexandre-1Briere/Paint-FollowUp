import { TestBed } from '@angular/core/testing';
import { LineCoordinates } from './line-coordinates';

const  ROTATION_ANGLE   = 45;
const  SIZE_OF_LINE = 60;
const HALF_TURN_DEGREES = 180;
describe('LineCoordinates', () => {
    let lineCoordinates: LineCoordinates;
    beforeEach(() => TestBed.configureTestingModule({}));
    beforeEach(() => {
        lineCoordinates = new LineCoordinates(ROTATION_ANGLE, SIZE_OF_LINE);
    });

    it('should be created', () => {

        expect(lineCoordinates).toBeTruthy();
    });

    it('getX1(offset) return offset + (this.sizeOfLine / 2) * Math.cos(-this. rotationAngle * Math.PI / 180) ',
        () => {
            lineCoordinates.rotationAngle = ROTATION_ANGLE;
            lineCoordinates.sizeOfLine = SIZE_OF_LINE;
            const coords = lineCoordinates.getX1(SIZE_OF_LINE);
            expect(coords).toEqual(SIZE_OF_LINE + (lineCoordinates.sizeOfLine / 2)
                * Math.cos(-lineCoordinates.rotationAngle * Math.PI / HALF_TURN_DEGREES));
        });

    it('getY1(offset) return offset + (this.sizeOfLine / 2) * Math.cos(-this. rotationAngle * Math.PI / 180) ',
        () => {
            lineCoordinates.rotationAngle = ROTATION_ANGLE;
            lineCoordinates.sizeOfLine = SIZE_OF_LINE;
            const coords = lineCoordinates.getY1(SIZE_OF_LINE);
            expect(coords).toEqual(SIZE_OF_LINE + (lineCoordinates.sizeOfLine / 2)
                * Math.sin(-lineCoordinates.rotationAngle * Math.PI / HALF_TURN_DEGREES));
        });

    it('getX2(offset) return offset + (this.sizeOfLine / 2) * Math.cos(-this. rotationAngle * Math.PI / 180) ',
        () => {
            lineCoordinates.rotationAngle = ROTATION_ANGLE;
            lineCoordinates.sizeOfLine = SIZE_OF_LINE;
            lineCoordinates = new LineCoordinates(ROTATION_ANGLE, SIZE_OF_LINE);
            const coords = lineCoordinates.getX2(SIZE_OF_LINE);
            expect(coords).toEqual(SIZE_OF_LINE - (lineCoordinates.sizeOfLine / 2)
                * Math.cos(-lineCoordinates.rotationAngle * Math.PI / HALF_TURN_DEGREES));
        });

    it('getY2(offset) return offset + (this.sizeOfLine / 2) * Math.cos(-this. rotationAngle * Math.PI / 180) ',
        () => {
            lineCoordinates.rotationAngle =  ROTATION_ANGLE;
            lineCoordinates.sizeOfLine = SIZE_OF_LINE;
            const coords = lineCoordinates.getY2(SIZE_OF_LINE);
            expect(coords).toEqual(SIZE_OF_LINE - (lineCoordinates.sizeOfLine / 2)
                * Math.sin(-lineCoordinates.rotationAngle * Math.PI / HALF_TURN_DEGREES));
        });

});
