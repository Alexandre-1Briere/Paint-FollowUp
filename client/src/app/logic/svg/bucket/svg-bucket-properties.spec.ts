import { PolygonCollidable } from '../../collisions/polygon/polygon-collidable';
import { BoundaryBox } from '../../collisions/utils/boundary-box';
import { SvgBucketProperties } from './svg-bucket-properties';

describe('SvgRectangleProperties', () => {
  let svgRectangleProperties: SvgBucketProperties;

  beforeEach(() => {
    svgRectangleProperties = new SvgBucketProperties();
  });

  it('should create an instance', () => {
    expect(new SvgBucketProperties()).toBeTruthy();
  });

  it('#centerAt() works as expected', () => {
    const CENTER = {x: 40, y: 50};
    svgRectangleProperties.centerAt(CENTER);
    expect(svgRectangleProperties.getCenter()).toEqual(CENTER);
  });

  it ('#getBoundary() should call correct method', () => {
    // tslint:disable-next-line:no-any
    const getBoundarySpy = spyOn<any>(BoundaryBox, 'create');
    svgRectangleProperties.getBoundary();
    expect(getBoundarySpy).toHaveBeenCalled();
  });

  it('#getCollidables() should return Collidable[]', () => {
    const items = svgRectangleProperties.getCollidables();
    items.forEach((item) => {
      expect(item instanceof PolygonCollidable).toBe(true,
          'instance of PolygonCollidable');
    });
  });

  it('#getCollidables() should return Collidable[]', () => {
    const items = svgRectangleProperties.getCollidables();
    items.forEach((item) => {
      expect(item instanceof PolygonCollidable).toBe(true,
          'instance of PolygonCollidable');
    });
  });
});
