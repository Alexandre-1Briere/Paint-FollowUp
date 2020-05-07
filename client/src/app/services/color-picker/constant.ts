export interface ColorRGBA {
  red: number;
  green: number;
  blue: number;
  opacity: number;
}

export const COLOR_ARRAY_STARTING = [
  {} as ColorRGBA,
  {} as ColorRGBA,
  {} as ColorRGBA,
  {} as ColorRGBA,
  {} as ColorRGBA,
  {} as ColorRGBA,
  {} as ColorRGBA,
  {} as ColorRGBA,
  {} as ColorRGBA,
  {} as ColorRGBA,
];

export const RGBA_MAX_VALUE = 256;
export const MAX_HEX_VALUE = 255;
export const CANVAS_STARTING_POSITION = 0;
export const PIXEL_SIZE = 1;
export const RIGHT_CLICK = 2;
export const LEFT_CLICK = 0;
export const COLOR_PREVIEW_SIZE = 30;
export const PALETTE_SIZE = 200;
export const RED_POSITION = 0;
export const YELLOW_POSITION = 0.17;
export const GREEN_POSITION = 0.34;
export const AQUA_POSITION = 0.51;
export const BLUE_POSITION = 0.68;
export const FUCHSIA_POSITION = 0.85;
export const END_GRADIENT_POSITION = 1;
export const SELECTOR_RADIUS = 5;
export const SELECTOR_WIDTH = 3;
export const SQUARE_SELECTOR_WIDTH = 5;
export const SQUARE_SELECTOR_HEIGHT = 10;
export const MIN_ANGLE = 0;
export const MAX_ANGLE = 2 * Math.PI;
export const MIN_ANGLE_DEGREES = 0;
export const MAX_ANGLE_DEGREES = 360;
export const FIRST_COLOR_STOP = 0;
export const SECOND_COLOR_STOP = 1;
export const BAR_PALETTE_WIDTH = 20;

export const PRIMARY_CANVAS = 'primaryCanvas';
export const SECONDARY_CANVAS = 'secondaryCanvas';
export const TWO_D_CANVAS = '2d';

export const HEX_RGB_LENGTH = 7;
export const HEX = 16;

export const WHITE_OPAQUE = 'rgba(255,255,255,1)';
export const WHITE_CLEAR = 'rgba(255,255,255,0)';
export const BLACK_OPAQUE = 'rgba(0,0,0,1)';
export const BLACK_CLEAR = 'rgba(0,0,0,0)';
export const RED_OPAQUE = 'rgba(255, 0, 0, 1)';
export const YELLOW_OPAQUE = 'rgba(255, 255, 0, 1)';
export const GREEN_OPAQUE = 'rgba(0, 255, 0, 1)';
export const AQUA_OPAQUE = 'rgba(0, 255, 255, 1)';
export const BLUE_OPAQUE = 'rgba(0, 0, 255, 1)';
export const FUCHSIA_OPAQUE = 'rgba(255, 0, 255, 1)';

export const DEFAULT_COLOR_CANVAS = '#FFFFFF';
export const WHITE = 'white';
export const BLACK = 'black';

export const WHITE_COLOR = {red: 255, green: 255, blue: 255, opacity: 1} as ColorRGBA;
