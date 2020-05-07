import { TestBed } from '@angular/core/testing';

import { PaletteSelectorService } from './palette-selector.service';

describe('BwSelectorService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PaletteSelectorService = TestBed.get(PaletteSelectorService);
    expect(service).toBeTruthy();
  });

  it('#calculatePositionBasedOnColor() should set the x position to 0 if the color give a value lower than the limit', () => {
    const service: PaletteSelectorService = TestBed.get(PaletteSelectorService);
    service.gradientColorRGBA = { red: 255, green: 0, blue: 0, opacity: 0 };
    service.drawingColorRGBA = { red: 0, green: 0, blue: 0, opacity: 0 };
    const functName = 'calculatePositionBasedOnColor';
    service[functName]();
    expect(service.position.x).toEqual(0);
  });
});
