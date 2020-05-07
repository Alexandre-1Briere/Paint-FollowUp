import { TestBed } from '@angular/core/testing';
import { ColorPickerColor } from '../../enums/color-picker-color.enum';
import { ColorPickerService } from './color-picker.service';
import { COLOR_ARRAY_STARTING, ColorRGBA } from './constant';

describe('ColorService', () => {
    beforeEach(() => TestBed.configureTestingModule({}));

    it('should be created', () => {
        const service: ColorPickerService = TestBed.get(ColorPickerService);
        expect(service).toBeTruthy();
    });

    it('setColor should return if the color is invalid', () => {
        const service: ColorPickerService = TestBed.get(ColorPickerService);
        const spy = spyOn(service, 'applyColorOption');
        service.setColor('#GGGGGG', ColorPickerColor.Primary, false);
        expect(spy).not.toHaveBeenCalled();
    });

    it('setColorRGBA should return if the color is invalid', () => {
        const service: ColorPickerService = TestBed.get(ColorPickerService);
        const spy = spyOn(service, 'applyColorOption');
        service.setColorRGBA({ red: -2, blue: 256, green: 0, opacity: 0 }, ColorPickerColor.Primary, false);
        expect(spy).not.toHaveBeenCalled();
    });

    it('doesUsedColorContains should return false when the at least one component is different in the parameter and one of the used color',
        () => {
            const service: ColorPickerService = TestBed.get(ColorPickerService);
            const colorRGBA = { red: 0, green: 0, blue: 0, opacity: 1 } as ColorRGBA;
            service.colorUsed = COLOR_ARRAY_STARTING;
            expect(service.doesColorUsedContains(colorRGBA)).toBe(false);
        });
    it('doesUsedColorContains should return true when the all component is the same in the parameter and one of the used color',
        () => {
            const service: ColorPickerService = TestBed.get(ColorPickerService);
            const colorRGBA = { red: 66, green: 133, blue: 244, opacity: 1 } as ColorRGBA;
            service.colorUsed = COLOR_ARRAY_STARTING;
            expect(service.doesColorUsedContains(colorRGBA)).toBe(true);
        });
});
