import { DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { AppModule } from '../../../../app.module';
import { DEFAULT_BLUE_RGBA } from '../../../../constants/colors';
import { KEY_DOWN } from '../../../../constants/keyboard';
import { AT_LEAST_ONE_BUTTON_PRESSED, MOUSE_CLICK } from '../../../../constants/mouse';
import { ColorPickerColor } from '../../../../enums/color-picker-color.enum';
import { KeyboardKey } from '../../../../enums/keyboard';
import { ColorManipulator } from '../../../../services/color-picker/color-manipulator/color-manipulator';
import { ColorRGBA } from '../../../../services/color-picker/constant';
import { TestSpeedUpgrader } from '../../../../testHelpers/test-speed-upgrader.spec';
import { ColorPickerComponent } from './color-picker.component';
import { PaletteSelectorComponent } from './palette-selector/palette-selector.component';

describe('ColorPickerComponent', () => {
    let component: ColorPickerComponent;
    let fixture: ComponentFixture<ColorPickerComponent>;
    let canvasPrimary: DebugElement;
    let canvasSecondary: DebugElement;

    TestSpeedUpgrader.overWriteModuleResetForSpeedGain();

    beforeEach(async(() => {
        TestBed.configureTestingModule({

            imports: [
                AppModule,
            ],
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ColorPickerComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        canvasPrimary = fixture.debugElement.query(By.css('#Primary'));
        canvasSecondary = fixture.debugElement.query(By.css('#Secondary'));
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should update both color when switchColor() is called', () => {
        const fillSpy: jasmine.Spy = spyOn(component.colorPickerService, 'fillCanvas');
        component.switchColor();
        expect(fillSpy).toHaveBeenCalledTimes(2);
    });

    it('switchColor() should switch primary and secondary color when  is called', () => {
        const colorS = component.toolOptionService.getSettings().secondaryColor;
        const colorP = component.toolOptionService.getSettings().primaryColor;
        component.switchColor();
        expect(component.toolOptionService.getSettings().primaryColor).toEqual(colorS);
        expect(component.toolOptionService.getSettings().secondaryColor).toEqual(colorP);
    });

    it('should call switchColor() when the fa-icon #colorSwitch is clicked', (done) => {
        const colorSwitchSpy: jasmine.Spy = spyOn(component, 'switchColor');
        const buttonDiv = fixture.debugElement.query(By.css('#colorSwitchArrow'));
        buttonDiv.triggerEventHandler('click', { offsetX: 0, offsetY: 0 });
        fixture.whenStable().then(() => {
            expect(colorSwitchSpy).toHaveBeenCalled();
            done();
        });
    });

    it('onMouseDown should change the color in principal canvas in left click',
        () => {
            // const usedColorLeftClickSpy: jasmine.Spy = spyOn(component, 'applyColorOption');
            const event = new MouseEvent(MOUSE_CLICK, { button: 0, buttons: AT_LEAST_ONE_BUTTON_PRESSED });
            const color = { red: 255, green: 255, blue: 0, opacity: 1 } as ColorRGBA;
            canvasPrimary.triggerEventHandler('click', { offsetX: 199, offsetY: 0 });
            component.onMouseDown(event, color);
            expect(event.button === 0).toBe(true);
            expect(component.colorPickerService.getPrimaryColor(true)).toEqual(color);
            // expect(usedColorLeftClickSpy).toHaveBeenCalled();
        });

    it('onMouseDown should change the color in secondary canvas in right click',
        () => {
            // const usedColorRightClickSpy: jasmine.Spy = spyOn(component, 'applyColorOption');
            const event = new MouseEvent(MOUSE_CLICK, { button: 2, buttons: AT_LEAST_ONE_BUTTON_PRESSED });
            const color = { red: 255, green: 255, blue: 0, opacity: 1 } as ColorRGBA;
            canvasSecondary.triggerEventHandler('leftClick', { offsetX: 199, offsetY: 0 });
            component.onMouseDown(event, color);
            expect(event.button === 2).toBe(true);
            expect(component.colorPickerService.getSecondaryColor()).toEqual(color);
            // expect(usedColorRightClickSpy).toHaveBeenCalled();
        });

    it('onMouseDown returns false when color is undefined',
        () => {
            const event = new MouseEvent(MOUSE_CLICK);
            const UNDEFINED_COLOR = {
                red: undefined,
                green: undefined,
                blue: undefined,
                opacity: 1,
            } as unknown as ColorRGBA;
            component.onMouseDown(event, UNDEFINED_COLOR);
            expect(component.onMouseDown(event, UNDEFINED_COLOR)).toBeFalsy();
        });

    it('updateOpacity should update the opacity without consideration for other parameter',
        () => {
            const OPACITY = 0.5;
            component.updateOpacity(OPACITY);
            expect(component.colorPickerService.getPrimaryColor().opacity).toBe(OPACITY);
            expect(component.colorPickerService.getSecondaryColor().opacity).toBe(OPACITY);
            expect(component.colorPickerService.getPaletteColor().opacity).toBe(OPACITY);
        });

    it('onHexKeyDown should call updateAllColorComponents() when event key is enter ',
        () => {
            const updateSpy: jasmine.Spy = spyOn(component, 'updateAllColorComponents');
            const keyboardEvent = new KeyboardEvent(KEY_DOWN, { key: KeyboardKey.Enter });
            component.onHexKeyDown(keyboardEvent);
            expect(updateSpy).toHaveBeenCalled();
        });

    it('onHexKeyDown calls onApply when key enter is called', () => {
        spyOn(component.colorPickerService, 'applyColorOption');
        const keyboardEvent = new KeyboardEvent(KEY_DOWN, { key: KeyboardKey.Enter });
        component.onHexKeyDown(keyboardEvent);
        expect(component.colorPickerService.applyColorOption).toHaveBeenCalled();
    });

    it('onHexKeyDown calls setColor when key enter is called', () => {
        spyOn(component.colorPickerService, 'setColor');
        component.isPrimaryCanvasSelected = false;
        const keyboardEvent = new KeyboardEvent(KEY_DOWN, { key: KeyboardKey.Enter });
        component.onHexKeyDown(keyboardEvent);
        expect(component.colorPickerService.setColor).toHaveBeenCalled();
    });

    it('onApplyButton should call updatePrimaryAndSecondaryColors', () => {
        const spy = spyOn(component, 'updatePrimaryAndSecondaryColors');
        component.onApplyButton();
        expect(spy).toHaveBeenCalled();
    });
    it('onApplyButton should call updatePrimaryAndSecondaryColors when secondary canvas is selected', () => {
        const spy = spyOn(component, 'updatePrimaryAndSecondaryColors');
        component.isPrimaryCanvasSelected = false;
        component.onApplyButton();
        expect(spy).toHaveBeenCalled();
    });

    it('getReversedColors() returns empty array when testEmpty is true', () => {
        const EMPTY_ARRAY: ColorRGBA[] = [];
        const TEST_EMPTY = true;
        expect(component.getReversedColors(TEST_EMPTY)).toEqual(EMPTY_ARRAY);
    });

    it('updateBackground() calls drawingBaseParametersAccessor.changeBackgroundColour', () => {
        spyOn(component.drawingBaseParametersAccessor, 'changeBackgroundColour');
        component.updateBackground();
        expect(component.drawingBaseParametersAccessor.changeBackgroundColour).toHaveBeenCalled();
    });

    it('updateBackground() calls drawingBaseParametersAccessor.changeBackgroundColour even when secondary canvas is selected',
        () => {
            spyOn(component.drawingBaseParametersAccessor, 'changeBackgroundColour');
            component.isPrimaryCanvasSelected = false;
            component.updateBackground();
            expect(component.drawingBaseParametersAccessor.changeBackgroundColour).toHaveBeenCalled();
        });

    it('updateHue() should calls updateOpacitySlider and setColorRGBA', () => {
        const color = { red: 255, green: 255, blue: 0, opacity: 1 } as ColorRGBA;
        component.colorPickerService.setColorRGBA(color, ColorPickerColor.Palette, false);
        const updateOpacitySliderSpy = spyOn(component, 'updateOpacitySlider').and.callThrough();
        component.updateHue(color);
        expect(component.colorPickerService.hexColor)
            .toEqual(ColorManipulator.colorRGBAToHexColor(component.colorPickerService.colors.palette));
        expect(component.applyButtonColor)
            .toEqual(ColorManipulator.colorRGBAToHexColor(component.colorPickerService.getPaletteColor(true)));
        expect(updateOpacitySliderSpy).toHaveBeenCalled();
    });

    it('#updateColorRGB() should call updatePaletteSelector()', () => {
        const spyPalette = spyOn(component, 'updatePaletteSelector');
        component.updateColorRGB({ red: 0, green: 0, blue: 0, opacity: 0 });
        expect(spyPalette).toHaveBeenCalled();
    });

    it('#updateColorRGB() should call update the palette selector if it is defined', () => {
        component.paletteSelectorComponent = TestBed.createComponent(PaletteSelectorComponent).componentInstance;
        const spyPalette = spyOn(component.paletteSelectorComponent, 'updateGradientColor');
        const spyColor = spyOn(component.paletteSelectorComponent, 'getColor').and.returnValue(DEFAULT_BLUE_RGBA);
        component.updateColorRGB({ red: 0, green: 0, blue: 0, opacity: 0 });
        expect(spyPalette).toHaveBeenCalled();
        expect(spyColor).toHaveBeenCalled();
    });
});
