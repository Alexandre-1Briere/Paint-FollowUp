import { TestBed } from '@angular/core/testing';

import { KeypressService } from './keypress.service';

describe('KeypressService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: KeypressService = TestBed.get(KeypressService);
    expect(service).toBeTruthy();
  });

  it('isNumber should only accept numbers', () => {
    const service: KeypressService = TestBed.get(KeypressService);
    const KEYZ = new KeyboardEvent('keypress', {key: 'Z'});
    const KEYM = new KeyboardEvent('keypress', {key: '-'});
    const KEY1 = new KeyboardEvent('keypress', {key: '1'});
    expect(service.isNumber(KEYZ)).toBe(false);
    expect(service.isNumber(KEYM)).toBe(false);
    expect(service.isNumber(KEY1)).toBe(true);
  });

  it('rangeValidator should only accept value undex or equal to max', () => {
    const service: KeypressService = TestBed.get(KeypressService);
    const KEY1 = new KeyboardEvent('keypress', { key: '1' });
    const KEY2 = new KeyboardEvent('keypress', { key: 'A' });
    const RANGE_BOUND = 10;
    expect(service.rangeValidator(KEY1, 1, RANGE_BOUND + 1)).toBe(true);
    expect(service.rangeValidator(KEY2, 1, RANGE_BOUND)).toBe(false);
  });

});
