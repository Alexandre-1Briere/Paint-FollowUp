import { TestBed } from '@angular/core/testing';

import { DrawingAccessorService } from './drawing-accessor.service';

describe('CurrentDrawingAccessorService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DrawingAccessorService = TestBed.get(DrawingAccessorService);
    expect(service).toBeTruthy();
  });
});
