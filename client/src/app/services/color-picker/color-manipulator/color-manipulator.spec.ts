import { DEFAULT_BLUE_RGBA } from '../../../constants/colors';
import { ColorRGBA } from '../constant';
import { ColorManipulator } from './color-manipulator';

describe('ColorConverter', () => {
    it('should create an instance', () => {
        expect(new ColorManipulator()).toBeTruthy();
    });

    it('cleanRGBAString should return a cleaned string following the format r,g,b,a', () => {
        expect(ColorManipulator.cleaningRGBAString('rgba(100,100,100,1)')).toEqual('100,100,100,1');
    });
    it('#scale() should return a scaled value from an old interval to a new interval', () => {
        const VAL = 5;
        const FIRST_INTERVAL = 10;
        const SECOND_INTERVAL = 100;
        expect(ColorManipulator.scale(VAL, 0, FIRST_INTERVAL, 0, SECOND_INTERVAL)).toEqual(SECOND_INTERVAL / 2);
    });

    it('colorRGBAToHexColor should return an hex string valid from a color RGBA', () => {
        const color: ColorRGBA = {
            red: 255,
            green: 255,
            blue: 255,
            opacity: 1,
        };
        const correctHexString = '#ffffffff';
        expect(ColorManipulator.colorRGBAToHexColor(color)).toEqual(correctHexString);
    });

    it('colorRGBAToHexColor should return an hex string valid from a color RGBA when the component are lower than 16', () => {
        const color: ColorRGBA = {
            red: 0,
            green: 0,
            blue: 0,
            opacity: 0.5,
        };
        const correctHexString = '#00000080';
        expect(ColorManipulator.colorRGBAToHexColor(color)).toEqual(correctHexString);
    });

    it('RGBAStringToHexColor should return an hex string valid from a RGBA string', () => {
        const color = 'rgba(255,255,255,1)';
        const correctHexString = '#ffffffff';
        expect(ColorManipulator.RGBAStringToHexColor(color)).toEqual(correctHexString);
    });

    it('RGBAStringToHexColor should return an hex string valid from a RGBA string when the component are lower than 16', () => {
        const color = 'rgba(0,255,0,0)';
        const correctHexString = '#00ff0000';
        expect(ColorManipulator.RGBAStringToHexColor(color)).toEqual(correctHexString);
    });

    it('colorRGBAToRGBAString should return an rgba string valid from a color RGBA', () => {
        const color: ColorRGBA = {
            red: 255,
            green: 255,
            blue: 255,
            opacity: 1,
        };
        const rGBAString = 'rgba(255,255,255,1)';
        expect(ColorManipulator.colorRGBAToRGBAString(color)).toEqual(rGBAString);
    });

    it('colorRGBAToRGBAString should return an rgba string valid from a color RGBA when the component are lower than 16', () => {
        const color: ColorRGBA = {
            red: 0,
            green: 0,
            blue: 0,
            opacity: 0.5,
        };
        const rGBAString = 'rgba(0,0,0,0.5)';
        expect(ColorManipulator.colorRGBAToRGBAString(color)).toEqual(rGBAString);
    });

    it('RGBAStringToColorRGBA should return a color RGBA string valid from a RGBA string', () => {
        const color: ColorRGBA = {
            red: 255,
            green: 255,
            blue: 255,
            opacity: 1,
        };
        const rGBAString = 'rgba(255,255,255,1)';
        expect(ColorManipulator.RGBAStringToColorRGBA(rGBAString)).toEqual(color);
    });

    it('RGBAStringToColorRGBA should return a color RGBA string valid from a RGBA string when the component are lower than 16', () => {
        const color: ColorRGBA = {
            red: 0,
            green: 0,
            blue: 0,
            opacity: 0.5,
        };
        const rGBAString = 'rgba(0,0,0,0.5)';
        expect(ColorManipulator.RGBAStringToColorRGBA(rGBAString)).toEqual(color);
    });

    it('hexColorToColorRGBA should return a color RGBA valid from a hex string', () => {
        const color: ColorRGBA = {
            red: 255,
            green: 255,
            blue: 255,
            opacity: 1,
        };
        const hexString = '#ffffffff';
        expect(ColorManipulator.hexColorToColorRGBA(hexString)).toEqual(color);
    });

    it('hexColorToColorRGBA should return a color RGBA valid from a hex string when the component are lower than 16', () => {
        const color: ColorRGBA = {
            red: 0,
            green: 255,
            blue: 0,
            opacity: 0,
        };
        const hexString = '#00ff0000';
        expect(ColorManipulator.hexColorToColorRGBA(hexString)).toEqual(color);
    });

    it('hexColorToColorRGBA should return default blue if the color is empty', () => {
        const hexString = '#';
        expect(ColorManipulator.hexColorToColorRGBA(hexString)).toEqual(DEFAULT_BLUE_RGBA);
    });

    it('hexColorToRGBAString should return a string RGBA valid from a hex string', () => {
        const rgbaString = 'rgba(255,255,255,1)';
        const hexString = '#ffffffff';
        expect(ColorManipulator.hexColorToRGBAString(hexString)).toEqual(rgbaString);
    });

    it('hexColorToColorRGBA should return a string RGBA valid from a hex string when the component are lower than 16', () => {
        const rgbaString = 'rgba(0,255,0,0)';
        const hexString = '#00ff0000';
        expect(ColorManipulator.hexColorToRGBAString(hexString)).toEqual(rgbaString);
    });

    it('validateColor should return false if the color have a negative blue value', () => {
        const color: ColorRGBA = {
            red: 0,
            green: 0,
            blue: -1,
            opacity: 1,
        };
        expect(ColorManipulator.validateColorRGBA(color)).toEqual(false);
    });

    it('validateColor should return false if the color have a negative green value', () => {
        const color: ColorRGBA = {
            red: 0,
            green: -1,
            blue: 0,
            opacity: 1,
        };
        expect(ColorManipulator.validateColorRGBA(color)).toEqual(false);
    });

    it('validateColor should return false if the color have a negative red value', () => {
        const color: ColorRGBA = {
            red: -1,
            green: 0,
            blue: 0,
            opacity: 1,
        };
        expect(ColorManipulator.validateColorRGBA(color)).toEqual(false);
    });

    it('validateColor should return false if the color have a blue value over 255', () => {
        const color: ColorRGBA = {
            red: 0,
            green: 0,
            blue: 256,
            opacity: 1,
        };
        expect(ColorManipulator.validateColorRGBA(color)).toEqual(false);
    });

    it('validateColor should return false if the color have a green value over 255', () => {
        const color: ColorRGBA = {
            red: 0,
            green: 256,
            blue: 0,
            opacity: 1,
        };
        expect(ColorManipulator.validateColorRGBA(color)).toEqual(false);
    });

    it('validateColor should return false if the color have a red value over 255', () => {
        const color: ColorRGBA = {
            red: 256,
            green: 0,
            blue: 0,
            opacity: 1,
        };
        expect(ColorManipulator.validateColorRGBA(color)).toEqual(false);
    });

    it('validateColor should return true if the color is valid (black color)', () => {
        const color: ColorRGBA = {
            red: 0,
            green: 0,
            blue: 0,
            opacity: 1,
        };
        expect(ColorManipulator.validateColorRGBA(color)).toEqual(true);
    });

    it('validateColor should return true if the color is valid (white color)', () => {
        const color: ColorRGBA = {
            red: 255,
            green: 255,
            blue: 255,
            opacity: 1,
        };
        expect(ColorManipulator.validateColorRGBA(color)).toEqual(true);
    });

    it('CleaningRGBAString should clean an rgba string', () => {
        const colorRGBAString = 'rgba(0,0,0,1)';
        expect(ColorManipulator.cleaningRGBAString(colorRGBAString)).toEqual('0,0,0,1');
    });

    it('validateColorHex should return true if the color is valid (black color)', () => {
        const color = '#0000000F';
        expect(ColorManipulator.validateHexColor(color)).toEqual(true);
    });

    it('validateColorHex should return true if the color is valid (white color)', () => {
        const color = '#FFFFFFFF';
        expect(ColorManipulator.validateHexColor(color)).toEqual(true);
    });

    it('validateColorRGBAString should return false if the color have a negative blue value', () => {
        const color = 'rgba(0,0,-1,0)';
        expect(ColorManipulator.validateRGBAString(color)).toEqual(false);
    });

    it('validateColorRGBAString should return false if the color have a negative green value', () => {
        const color = 'rgba(0,-1,0,0)';
        expect(ColorManipulator.validateRGBAString(color)).toEqual(false);
    });

    it('validateColorRGBAString should return false if the color have a negative red value', () => {
        const color = 'rgba(-1,0,0,0)';
        expect(ColorManipulator.validateRGBAString(color)).toEqual(false);
    });

    it('validateColorRGBAString should return false if the color have a blue value over 255', () => {
        const color = 'rgba(0,0,256,0)';
        expect(ColorManipulator.validateRGBAString(color)).toEqual(false);
    });

    it('validateColorRGBAString should return false if the color have a green value over 255', () => {
        const color = 'rgba(0,256,0,0)';
        expect(ColorManipulator.validateRGBAString(color)).toEqual(false);
    });

    it('validateColorRGBAString should return false if the color have a red value over 255', () => {
        const color = 'rgba(256,0,0,0)';
        expect(ColorManipulator.validateRGBAString(color)).toEqual(false);
    });

    it('validateColorRGBAString should return true if the color is valid (black color)', () => {
        const color = 'rgba(255,255,255,1)';
        expect(ColorManipulator.validateRGBAString(color)).toEqual(true);
    });

    it('validateColorRGBAString should return true if the color is valid (white color)', () => {
        const color = 'rgba(0,0,0,1)';
        expect(ColorManipulator.validateRGBAString(color)).toEqual(true);
    });

    it('getInvertedColor should return the the inverted color for each component of a color', () => {
        const color: ColorRGBA = {
            red: 200,
            green: 55,
            blue: 100,
            opacity: 1,
        };
        expect(ColorManipulator.getInvertedColor(color)).toEqual({
            red: 55,
            green: 200,
            blue: 155,
            opacity: 1,
        });
    });

    it('getInvertedColor should return black if the color is invalid', () => {
        const color: ColorRGBA = {
            red: -200,
            green: 55,
            blue: 100,
            opacity: 1,
        };
        expect(ColorManipulator.getInvertedColor(color)).toEqual({
            red: 0,
            green: 0,
            blue: 0,
            opacity: 1,
        });
    });

    it('getPureColor red and blue to test if the color is purified', () => {
        const color = {
            red: 255,
            green: 0,
            blue: 100,
            opacity: 1,
        };
        expect(ColorManipulator.getPureColor(color)).toEqual(color);
    });

    it('getPureColor red and green to test if the color is purified', () => {
        const color = {
            red: 255,
            green: 100,
            blue: 0,
            opacity: 1,
        };
        expect(ColorManipulator.getPureColor(color)).toEqual(color);
    });

    it('getPureColor green and red if the color is purified', () => {
        const color = {
            red: 100,
            green: 255,
            blue: 0,
            opacity: 1,
        };
        expect(ColorManipulator.getPureColor(color)).toEqual(color);
    });

    it('getPureColor green and blue if the color is purified', () => {
        const color = {
            red: 0,
            green: 255,
            blue: 100,
            opacity: 1,
        };
        expect(ColorManipulator.getPureColor(color)).toEqual(color);
    });

    it('getPureColor blue and green if the color is purified', () => {
        const color = {
            red: 0,
            green: 100,
            blue: 255,
            opacity: 1,
        };
        expect(ColorManipulator.getPureColor(color)).toEqual(color);
    });

    it('getPureColor blue and red to test if the color is purified', () => {
        const color = {
            red: 100,
            green: 0,
            blue: 255,
            opacity: 1,
        };
        expect(ColorManipulator.getPureColor(color)).toEqual(color);
    });
    it('getPureColor should return 255,0,0 if the color is invalid', () => {
        const color = {
            red: 500,
            green: 0,
            blue: 255,
            opacity: 1,
        };
        const defaultColor = {
            red: 255,
            green: 0,
            blue: 0,
            opacity: 1,
        };
        expect(ColorManipulator.getPureColor(color)).toEqual(defaultColor);
    });
});
// tslint:disable:max-file-line-count
