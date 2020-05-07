const HALF_TURN_DEGREES = 180;
export class LineCoordinates {

    rotationAngle: number;
    sizeOfLine: number;

    constructor( rotationAngle: number, sizeOfLine: number) {
        this.rotationAngle = rotationAngle;
        this.sizeOfLine = sizeOfLine;
    }

    getX1(offset: number): number {
        return  offset + (this.sizeOfLine / 2) * Math.cos(-this. rotationAngle * Math.PI / HALF_TURN_DEGREES);
    }

    getY1(offset: number): number {
        return  offset + (this.sizeOfLine / 2) * Math.sin(-this.rotationAngle * Math.PI / HALF_TURN_DEGREES);
    }

    getX2(offset: number): number {
        return  offset - (this.sizeOfLine / 2) * Math.cos(-this.rotationAngle * Math.PI / HALF_TURN_DEGREES);
    }

    getY2(offset: number): number {
        return  offset  - (this.sizeOfLine / 2) * Math.sin(-this.rotationAngle * Math.PI / HALF_TURN_DEGREES);
    }

}
