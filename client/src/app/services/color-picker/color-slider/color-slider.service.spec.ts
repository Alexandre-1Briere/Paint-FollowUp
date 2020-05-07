import { TestBed } from '@angular/core/testing';
import { ColorSliderService } from './color-slider.service';

// tslint:disable:no-any
// Reason: allow spyOn<any>
describe('ColorSliderService', () => {
    beforeEach(() => TestBed.configureTestingModule({}));

    it('should be created', () => {
        const service: ColorSliderService = TestBed.get(ColorSliderService);
        expect(service).toBeTruthy();
    });
    it('#findVerticalPosition() should return a number between 0 and 1 with every pure color', () => {
        const service: ColorSliderService = TestBed.get(ColorSliderService);
        const red = { red: 255, blue: 0, green: 0, opacity: 1 };
        const green = { red: 0, blue: 0, green: 255, opacity: 1 };
        const blue = { red: 0, blue: 255, green: 0, opacity: 1 };
        const functName = 'findVerticalPosition';
        expect(service[functName](red)).toBeLessThanOrEqual(1);
        expect(service[functName](red)).toBeGreaterThanOrEqual(0);
        expect(service[functName](green)).toBeLessThanOrEqual(1);
        expect(service[functName](green)).toBeGreaterThanOrEqual(0);
        expect(service[functName](blue)).toBeLessThanOrEqual(1);
        expect(service[functName](blue)).toBeGreaterThanOrEqual(0);
    });
    it('#findVerticalPosition() should handle if the private function make an out of bound positive value', () => {
        const service: ColorSliderService = TestBed.get(ColorSliderService);
        const functName = 'findVerticalPosition';
        const red = { red: 255, blue: 0, green: 0, opacity: 1 };
        const BAD_VALUE = 1.5;
        spyOn<any>(service, 'relativePositionOffset').and.returnValue(BAD_VALUE);
        expect(service[functName](red)).toBeLessThanOrEqual(1);
        expect(service[functName](red)).toBeGreaterThanOrEqual(0);
    });

    it('#findVerticalPosition() should handle if the private function make an out of bound negative value', () => {
        const service: ColorSliderService = TestBed.get(ColorSliderService);
        const functName = 'findVerticalPosition';
        const red = { red: 255, blue: 0, green: 0, opacity: 1 };
        spyOn<any>(service, 'relativePositionOffset').and.returnValue(-1);
        expect(service[functName](red)).toBeLessThanOrEqual(1);
        expect(service[functName](red)).toBeGreaterThanOrEqual(0);
    });

    it('#setPositionFromColor should return instantly if the color is invalid', () => {
        const service: ColorSliderService = TestBed.get(ColorSliderService);
        const spy = spyOn<any>(service, 'setColor');
        service.setPositionFromColor({ red: 1000, green: 0, blue: -1, opacity: 0 });
        expect(spy).not.toHaveBeenCalled();
    });
});
