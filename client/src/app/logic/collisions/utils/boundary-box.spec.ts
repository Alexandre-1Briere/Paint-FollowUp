import {SvgRectangleProperties} from '../../svg/rectangle/svg-rectangle-properties';
import { BoundaryBox } from './boundary-box';

describe('BoundaryBox', () => {
  it('should create an instance', () => {
    expect(new BoundaryBox()).toBeTruthy();
  });

  it('#create() returns largest boundary possible', () => {
    const POINTS = [
      {x: 0, y: 0},
      {x: 5, y: -2},
      {x: -10, y: 10},
      {x: -3, y: 6},
    ];
    const EXPECTED_TOP_LEFT = {x: -10, y: -2};
    const EXPECTED_BOTTOM_RIGHT = {x: 5, y: 10};
    const EXPECTED_CENTER = {
      x: (EXPECTED_BOTTOM_RIGHT.x + EXPECTED_TOP_LEFT.x) / 2,
      y: (EXPECTED_BOTTOM_RIGHT.y + EXPECTED_TOP_LEFT.y) / 2,
    };

    const boundary = BoundaryBox.create(POINTS);
    expect(boundary.topLeft).toEqual(EXPECTED_TOP_LEFT);
    expect(boundary.bottomRight).toEqual(EXPECTED_BOTTOM_RIGHT);
    expect(boundary.center).toEqual(EXPECTED_CENTER);
  });

  it('#containing() returns fitting boundary', () => {
    const X1 = 10;
    const Y1 = 10;
    const X2 = 60;
    const Y2 = 60;

    const X3 = 20;
    const Y3 = 0;
    const X4 = 70;
    const Y4 = 50;

    const rectangle1 = new SvgRectangleProperties();
    rectangle1.fitExactlyInside(X1, Y1, X2, Y2);
    const rectangle2 = new SvgRectangleProperties();
    rectangle2.fitExactlyInside(X3, Y3, X4, Y4);

    const boundary = BoundaryBox.containing([rectangle1, rectangle2]);
    const EXPECTED_TOP_LEFT = {x: X1, y: Y3};
    const EXPECTED_BOTTOM_RIGHT = {x: X4, y: Y2};
    const WRONG = {x: -10, y: -10};
    let topLeft = WRONG;
    let bottomRight = WRONG;
    if (boundary !== undefined) {
      topLeft = boundary.topLeft;
      bottomRight = boundary.bottomRight;
    }
    expect(topLeft).toEqual(EXPECTED_TOP_LEFT);
    expect(bottomRight).toEqual(EXPECTED_BOTTOM_RIGHT);
  });

  it('#containing() returns undefined when supplied list is empty', () => {
    const boundary = BoundaryBox.containing([]);
    expect(boundary).toBeUndefined();
  });
});
