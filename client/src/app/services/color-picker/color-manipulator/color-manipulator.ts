import { DEFAULT_BLUE_RGBA } from '../../../constants/colors';
import { ColorRGBA, HEX, MAX_HEX_VALUE, RGBA_MAX_VALUE } from '../constant';

export class ColorManipulator {
  static validateColorRGBA(color: ColorRGBA): boolean {
    return !((color.opacity < 0 || color.opacity > 1) ||
      (color.red < 0 || color.red > MAX_HEX_VALUE) ||
      (color.green < 0 || color.green > MAX_HEX_VALUE) ||
      (color.blue < 0 || color.blue > MAX_HEX_VALUE));
  }

  static validateHexColor(color: string): boolean {
    const hexRegex = /^#[0-9a-fA-F]{8}$/g;
    return hexRegex.test(color) && this.validateColorRGBA(this.hexColorToColorRGBA(color));
  }

  static validateRGBAString(color: string): boolean {
    const rgbaRegex = /^rgba\(((1?[0-9]{1,2}|2[0-4][0-9]|25[0-5]),){3}[0-1](\.\d*)?\)$/g;
    return rgbaRegex.test(color) && this.validateColorRGBA(this.RGBAStringToColorRGBA(color));
  }

  static colorRGBAToHexColor(color: ColorRGBA): string {
    let colorHex = '#';
    colorHex += color.red < HEX ? '0' : '' ;
    colorHex += color.red.toString(HEX);
    colorHex += color.green < HEX ? '0' : '';
    colorHex += color.green.toString(HEX);
    colorHex += color.blue < HEX ? '0' : '';
    colorHex += color.blue.toString(HEX);
    colorHex += (color.opacity * (RGBA_MAX_VALUE - 1)) < HEX ? '0' : '';
    colorHex += (Math.round(color.opacity * (RGBA_MAX_VALUE - 1))).toString(HEX);
    return colorHex;
  }

  static colorRGBAToRGBAString(color: ColorRGBA): string {
    return `rgba(${color.red},${color.green},${color.blue},${color.opacity})`;
  }

  static RGBAStringToColorRGBA(color: string): ColorRGBA {
    color = this.cleaningRGBAString(color);
    const colorArray = color.split(',');
    const redElement = Number(colorArray[0]);
    const greenElement = Number(colorArray[1]);
    const blueElement = Number(colorArray[2]);
    // tslint:disable-next-line:no-magic-numbers
    const opacityElement = Number(colorArray[3]);
    return {
      red: redElement,
      green: greenElement,
      blue: blueElement,
      opacity: opacityElement,
    } as ColorRGBA;
  }

  static RGBAStringToHexColor(color: string): string {
    const colorRGBAElement = this.RGBAStringToColorRGBA(color);
    return this.colorRGBAToHexColor(colorRGBAElement);
  }

  static hexColorToColorRGBA(color: string): ColorRGBA {
    color = color.replace('#', '').toLowerCase();
    const colorHexaSplit = color.match(/.{2}/g);
    const NUMBER_OF_DECIMALS = 3;
    if (colorHexaSplit !== null) {
      return {
        red: parseInt(colorHexaSplit[0], HEX),
        green: parseInt(colorHexaSplit[1], HEX),
        blue: parseInt(colorHexaSplit[2], HEX),
        // tslint:disable-next-line:no-magic-numbers
        opacity: Number((parseInt(colorHexaSplit[3], HEX) / (RGBA_MAX_VALUE - 1)).toFixed(NUMBER_OF_DECIMALS)),
      } as ColorRGBA;
    }
    return DEFAULT_BLUE_RGBA;
  }

  static hexColorToRGBAString(color: string): string {
    return this.colorRGBAToRGBAString(this.hexColorToColorRGBA(color));
  }

  static RGBHexToRGBAHex(color: string): string {
    const TARGET_LENGTH = 9;
    while (color.length < TARGET_LENGTH) {
      color += 'f';
    }
    return color;
  }

  static clampOpacity(opacity: number): number {
    return Math.min(Math.max(opacity, 0), 1);
  }

  static cleaningRGBAString(color: string): string {
    color = color.replace('rgba(', '');
    color = color.replace(')', '');
    return color;
  }

  static cloneColorRGBA(color: ColorRGBA): ColorRGBA {
    return {
      red: color.red,
      green: color.green,
      blue: color.blue,
      opacity: color.opacity,
    };
  }

  static getPureColor(color: ColorRGBA): ColorRGBA {
    const pureColor = {
      red: 0,
      green: 0,
      blue: 0,
      opacity: 1,
    };

    if (!ColorManipulator.validateColorRGBA(color)) {
      pureColor.red = MAX_HEX_VALUE;
      return pureColor;
    }

    const RED = 0;
    const GREEN = 1;
    const BLUE = 2;
    const colorOrdering = [
      {value: color.blue, color: BLUE},
      {value: color.green, color: GREEN},
      {value: color.red, color: RED}
    ];
    colorOrdering.sort((colorLeft, colorRight) => {
      return colorLeft.value - colorRight.value;
    });
    const BRIGHTEST = 2;
    const INTERMEDIATE = 1;
    const DARKEST = 0;

    if (colorOrdering[BRIGHTEST].value > 0 && colorOrdering[BRIGHTEST].value > colorOrdering[DARKEST].value) {
      colorOrdering[INTERMEDIATE].value =  MAX_HEX_VALUE *
        (colorOrdering[INTERMEDIATE].value - colorOrdering[DARKEST].value) /
        (colorOrdering[BRIGHTEST].value - colorOrdering[DARKEST].value);
    }
    colorOrdering[BRIGHTEST].value = MAX_HEX_VALUE;
    colorOrdering[DARKEST].value = 0;

    for (const colorInfo of colorOrdering) {
      switch (colorInfo.color) {
        case RED:
          pureColor.red = colorInfo.value;
          break;
        case GREEN:
          pureColor.green = colorInfo.value;
          break;
        case BLUE:
          pureColor.blue = colorInfo.value;
          break;
      }
    }

    return pureColor;
  }

  static getInvertedColor(color: ColorRGBA): ColorRGBA {
    const invertedColor = {
      red: 0,
      green: 0,
      blue: 0,
      opacity: 1,
    };

    if (ColorManipulator.validateColorRGBA(color)) {
      invertedColor.red = MAX_HEX_VALUE - color.red;
      invertedColor.green = MAX_HEX_VALUE - color.green;
      invertedColor.blue = MAX_HEX_VALUE - color.blue;
    }

    return invertedColor;
  }

  static scale(
    val: number,
    oldMin: number,
    oldMax: number,
    newMin: number,
    newMax: number): number {
    const percent = (val - oldMin) / (oldMax - oldMin);
    return percent * (newMax - newMin) + newMin;
  }
}
