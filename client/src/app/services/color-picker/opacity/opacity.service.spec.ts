import { TestBed } from '@angular/core/testing';

import { DEFAULT_BLUE_RGBA } from '../../../constants/colors';
import { OpacityService } from './opacity.service';

describe('OpacityService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: OpacityService = TestBed.get(OpacityService);
    expect(service).toBeTruthy();
  });

  it('getRGB color should be able to create a transparent color', () => {
    const service: OpacityService = TestBed.get(OpacityService);
    service.colorRGBA = DEFAULT_BLUE_RGBA;
    expect(service.getRBGcolor(false)).toBe('rgba(66,133,244,0)');
  });

  it('getRGB color should be able to create an opaque color', () => {
    const service: OpacityService = TestBed.get(OpacityService);
    service.colorRGBA = DEFAULT_BLUE_RGBA;
    expect(service.getRBGcolor(true)).toBe('rgba(66,133,244,1)');
  });
});
