import { DrawingBaseParameters } from '../interfaces/drawing-base-parameters';

export const DEFAULT_DRAWING_HEIGHT = 500;
export const DEFAULT_DRAWING_WIDTH = 500;
export const DEFAULT_BACKGROUND_COLOR = '#FFFFFF';
export const IMAGE_DATA_TAG = 'ImageData';

export const DEFAULT_BASE_PARAMETERS = {
    width: DEFAULT_DRAWING_WIDTH,
    height: DEFAULT_DRAWING_HEIGHT,
    backgroundColor: DEFAULT_BACKGROUND_COLOR,
} as DrawingBaseParameters;
