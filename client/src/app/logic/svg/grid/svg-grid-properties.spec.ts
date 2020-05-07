import { SvgGridProperties } from './svg-grid-properties';

class SvgGridTestable extends SvgGridProperties {
  constructor() {super(); }

  getX(): number {return this.x; }
  getY(): number {return this.y; }
  getWidth(): number {return this.width; }
  getHeight(): number {return this.height; }

}

describe('SvgGridProperties', () => {
  let svgGridProperties: SvgGridTestable;

  beforeEach(() => {
    svgGridProperties = new SvgGridTestable();
  });

  it('should create an instance', () => {
    expect(new SvgGridProperties()).toBeTruthy();
  });

  it('#centerAt() works as expected', () => {
    const X = 4000;
    const Y = 5000;
    const CENTER = {x: X, y: Y};
    svgGridProperties.centerAt(CENTER);
    const DIFFERENCE = 1000;
    expect(svgGridProperties.getX()).toEqual(X - DIFFERENCE);
    expect(svgGridProperties.getY()).toEqual(Y - DIFFERENCE);
  });

  it ('#getCenter() works as expected', () => {
    const CENTER_X = svgGridProperties.getX() + svgGridProperties.getWidth() / 2;
    const CENTER_Y = svgGridProperties.getY() + svgGridProperties.getHeight() / 2;
    expect(svgGridProperties.getCenter()).toEqual({x: CENTER_X, y: CENTER_Y});
  });

  it('setCellSize should call refreshRawSvgPoints', () => {
    // tslint:disable-next-line:no-any
    const refreshRawSvgPointsSpy = spyOn<any>(svgGridProperties, 'refreshRawSvgPoints');
    const SIZE = 1;
    svgGridProperties.setCellSize(SIZE);
    expect(refreshRawSvgPointsSpy).toHaveBeenCalled();
  });

  it(' #setCellSize should return the value cellSize', () => {
    const SIZE = 50;
    svgGridProperties.setCellSize(SIZE);
    svgGridProperties.getCellSize();
    expect(svgGridProperties.getCellSize()).toEqual(SIZE);
  });

});
