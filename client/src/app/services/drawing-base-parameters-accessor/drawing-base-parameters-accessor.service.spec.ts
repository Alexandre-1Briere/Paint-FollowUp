import { TestBed } from '@angular/core/testing';

import { DrawingBaseParametersAccessorService } from './drawing-base-parameters-accessor.service';

let service: DrawingBaseParametersAccessorService;
describe('DrawingCreatorService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));
  beforeEach(() => {
    service = TestBed.get(DrawingBaseParametersAccessorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('#changeBackgroundColour() should emit an event', () => {
    const componentName = 'backgroundColorChange';
    const spy = spyOn(service[componentName], 'emit');
    const SIZE = 500;
    service.setDrawingBaseParameters(SIZE, SIZE, '#000000');
    service.changeBackgroundColour('#FFFFFF');
    expect(spy).toHaveBeenCalled();
  });

  it('#width property works as expected', () => {
    const SIZE = 400;
    service.setDrawingBaseParameters(SIZE, 0, '#000000');
    expect(service.width).toBe(SIZE);
  });

  it('#height property works as expected', () => {
    const SIZE = 600;
    service.setDrawingBaseParameters(0, SIZE, '#000000');
    expect(service.height).toBe(SIZE);
  });
});
