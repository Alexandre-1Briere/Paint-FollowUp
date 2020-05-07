import { TestBed } from '@angular/core/testing';

import { SerializationService } from './serialization.service';

describe('SerializationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SerializationService = TestBed.get(SerializationService);
    expect(service).toBeTruthy();
  });

  it('ParseDrawingInformation should return the object as a json that was initialy stringify', () => {
    const service: SerializationService = TestBed.get(SerializationService);
    const testObject = {
      etiquette: [],
      name: 'test',
      svgBoard: {},
      id: service.id,
    };
    const newObject = service.ParseDrawingInformation(JSON.stringify(testObject));
    expect(testObject).toEqual(newObject);
  });

  it('StringifyCurrentDrawing should transform the current board information to a string', () => {
    const service: SerializationService = TestBed.get(SerializationService);
    const spySVG = spyOn(service.svgManagerService, 'getSvgBoard');
    service.StringifyCurrentDrawing();
    expect(spySVG).toHaveBeenCalled();
  });

  it('StringifyCurrentDrawing should transform the current board information to a string witha  specific id', () => {
    const service: SerializationService = TestBed.get(SerializationService);
    const spySVG = spyOn(service.svgManagerService, 'getSvgBoard');
    service.StringifyCurrentDrawing(2);
    expect(spySVG).toHaveBeenCalled();
  });
});
