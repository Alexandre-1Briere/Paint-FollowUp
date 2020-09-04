import { Crayon } from './crayon/crayon';
import { Efface } from './efface/efface';
import { Rectangle } from './rectangle/rectangle';

export const tools = new Map()
  .set('crayon', Crayon.getInstance())
  .set('rectangle', Rectangle.getInstance())
  .set ('efface', Efface.getInstance());
