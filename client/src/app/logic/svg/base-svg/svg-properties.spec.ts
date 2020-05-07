import { SvgRectangleComponent } from '../../../components/drawing/work-board/svg-rectangle/svg-rectangle.component';
import { SvgType } from '../../../enums/svg';
import { SvgProperties } from './svg-properties';

const MOCK_TYPE = SvgType.SvgRectangleComponent;

class SvgPropertiesTestable extends SvgProperties {
  constructor() {
    super(MOCK_TYPE);
  }
}

describe('SvgProperties', () => {
  let svgProperties: SvgProperties;

  beforeEach(() => {
    svgProperties = new SvgPropertiesTestable();
  });

  it('#centerAt() assigns x and y properly', () => {
    const CENTER = {x: 1, y: 2};
    svgProperties.centerAt(CENTER);

    expect(svgProperties.getCenter()).toEqual(CENTER);
  });

  it('#rotateClockwise() does nothing', () => {
    const CENTER = {x: 1, y: 1};
    svgProperties.centerAt(CENTER);
    const QUARTER_TURN = 90;
    svgProperties.rotateClockwise(QUARTER_TURN);
    expect(svgProperties.getCenter()).toEqual(CENTER);
  });

  it('#scale() does nothing', () => {
    const CENTER = {x: 1, y: 1};
    svgProperties.centerAt(CENTER);
    svgProperties.scale(0, {x: 0, y: 0});
    expect(svgProperties.getCenter()).toEqual(CENTER);
  });

  it('#setPrimaryColor() sets color when valid input is supplied', () => {
    const COLOR = '#012abc';
    svgProperties.setPrimaryColor(COLOR);

    expect(svgProperties.getPrimaryColor()).toEqual(COLOR);
  });

  it('#setSecondaryColor() does not modify color with wrong input', () => {
    const WRONG_COLOR = '#34567';
    svgProperties.setSecondaryColor(WRONG_COLOR);

    expect(svgProperties.getSecondaryColor()).not.toEqual(WRONG_COLOR);
  });

  it('#setSecondaryColor() sets color when valid input is supplied', () => {
    const COLOR = '#345def';
    svgProperties.setSecondaryColor(COLOR);

    expect(svgProperties.getSecondaryColor()).toEqual(COLOR);
  });

  it('#setPrimaryColor() does not modify color with wrong input', () => {
    const WRONG_COLOR = '#012ab';
    svgProperties.setPrimaryColor(WRONG_COLOR);

    expect(svgProperties.getPrimaryColor()).not.toEqual(WRONG_COLOR);
  });

  it('#setPrimaryOpacity() changes opacity with valid input', () => {
    const VALID_OPACITY = 0.8;
    svgProperties.setPrimaryOpacity(VALID_OPACITY);
    expect(svgProperties.getPrimaryOpacity()).toEqual(VALID_OPACITY);
  });

  it('#setPrimaryOpacity() does not change opacity with wrong input', () => {
    const OPACITY_TOO_HIGH = 1.5;
    const OPACITY_TOO_LOW = -0.5;
    const initialOpacity = svgProperties.getPrimaryOpacity();

    svgProperties.setPrimaryOpacity(OPACITY_TOO_HIGH);
    expect(svgProperties.getPrimaryOpacity()).toEqual(initialOpacity);
    svgProperties.setPrimaryOpacity(OPACITY_TOO_LOW);
    expect(svgProperties.getPrimaryOpacity()).toEqual(initialOpacity);
  });

  it('#setSecondaryOpacity() changes opacity with valid input', () => {
    const VALID_OPACITY = 0.3;
    svgProperties.setSecondaryOpacity(VALID_OPACITY);
    expect(svgProperties.getSecondaryOpacity()).toEqual(VALID_OPACITY);
  });

  it('#setSecondaryOpacity() does not change opacity with wrong input', () => {
    const OPACITY_TOO_HIGH = 1.1;
    const OPACITY_TOO_LOW = -0.1;
    const initialOpacity = svgProperties.getSecondaryOpacity();

    svgProperties.setSecondaryOpacity(OPACITY_TOO_HIGH);
    expect(svgProperties.getSecondaryOpacity()).toEqual(initialOpacity);
    svgProperties.setSecondaryOpacity(OPACITY_TOO_LOW);
    expect(svgProperties.getSecondaryOpacity()).toEqual(initialOpacity);
  });

  it('#readFromSvgJson() does nothing with bad input', () => {
    const BAD_INPUT = {
      svgType: undefined,
      content: 'qwr{234}:"12"',
    };
    expect(svgProperties.readFromSvgJson(BAD_INPUT)).toBeFalsy();
  });

  it('#readFromSvgJson() does nothing when type is not matching', () => {
    const WRONG_TYPE_INPUT = {
      svgType: SvgType.SvgEllipseComponent,
      content: '{"x": 10}',
    };
    expect(svgProperties.readFromSvgJson(WRONG_TYPE_INPUT)).toBeFalsy();
  });

  it('#readFromSvgJson() does nothing if JSON.parse fails', () => {
    spyOn(JSON, 'parse').and.stub().and.callFake(() => { throw new Error('Fake error'); });
    const INPUT = {
      svgType: SvgType.SvgRectangleComponent,
      content: '{"type": 0, "x": 5}',
    };
    expect(svgProperties.readFromSvgJson(INPUT)).toBeFalsy();
  });

  it('#readFromSvgJson() works as intended for children classes', () => {
    const svgTypeAsNumber = SvgType.SvgRectangleComponent as number;
    const EXPECTED_VALUE = '#123456';

    const RADIX = 10;
    const INPUT = {
      svgType: SvgType.SvgRectangleComponent,
      content: '{"type": ' + svgTypeAsNumber.toString(RADIX) + `, "primaryColor": "${EXPECTED_VALUE}"}`,
    };
    const rectangle = new SvgRectangleComponent();
    rectangle.readFromSvgJson(INPUT);

    expect(rectangle.getPrimaryColor()).toBe(EXPECTED_VALUE);
  });

  it('#createSvgJson() has correct attributes', () => {
    const EXPECTED_COLOR = svgProperties.getPrimaryColor();
    const json = JSON.parse(svgProperties.createSvgJson().content);

    const COLOR_ATTRIBUTE = 'primaryColor';
    let color = '#123456';
    if (json.hasOwnProperty(COLOR_ATTRIBUTE)) {
      color = json[COLOR_ATTRIBUTE];
    }

    expect(color).toBe(EXPECTED_COLOR);
  });

  it('#getCollidables() returns []', () => {
    expect(svgProperties.getCollidables()).toEqual([]);
  });

  it('#getNegativeCollidables() returns []', () => {
    expect(svgProperties.getNegativeCollidables()).toEqual([]);
  });

  it('#getBoundary() to return point on (x,y)', () => {
    const boundary = svgProperties.getBoundary();
    expect(boundary.center).toEqual(svgProperties.getCenter());
    expect(boundary.topLeft).toEqual(boundary.bottomRight);
  });
});
