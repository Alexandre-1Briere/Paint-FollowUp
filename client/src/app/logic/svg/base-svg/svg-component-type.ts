import { Type } from '@angular/core';

import { SvgGridComponent } from '../../../components/svgElement/svg-grid/svg-grid.component';
import { SvgPencilComponent } from '../../../components/svgElement/svg-pencil/svg-pencil.component';
import { SvgRectangleComponent } from '../../../components/svgElement/svg-rectangle/svg-rectangle.component';

export type SvgInstanceType = (
  SvgRectangleComponent |
  SvgGridComponent |
  SvgPencilComponent
);
export type SvgComponentType = Type<SvgInstanceType>;
