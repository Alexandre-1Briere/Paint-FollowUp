import {BoundaryBox} from '../utils/boundary-box';
import { CircleCollidable } from './circle-collidable';

const ORIGIN = {x: 0, y: 0};
const DEFAULT_RADIUS = 2;

describe('CircleCollidable', () => {
  it('should create an instance', () => {
    expect(new CircleCollidable(ORIGIN, DEFAULT_RADIUS)).toBeTruthy();
  });

  it('#getNormals() is working as expected, by giving axis parallel to both centers', () => {
    const circle = new CircleCollidable(ORIGIN, DEFAULT_RADIUS);
    const CENTER = {x: 4, y: 4};
    const BOUNDARY = BoundaryBox.create([CENTER]);
    const normals = circle.getNormals(BOUNDARY);
    expect(normals.length).toBe(1);
    expect(normals[0]).toEqual(CENTER);
  });

  it('#getLinearProjection() is working as expected', () => {
    const circle = new CircleCollidable(ORIGIN, DEFAULT_RADIUS);
    const HORIZONTAL_AXIS = {x: 1, y: 0};
    const linearProjection = circle.getLinearProjection(HORIZONTAL_AXIS);
    expect(linearProjection.start).toBe(-DEFAULT_RADIUS);
    expect(linearProjection.end).toBe(DEFAULT_RADIUS);
  });
});
