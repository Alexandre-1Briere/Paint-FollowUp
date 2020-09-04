import { Type } from '@angular/core';

import { SvgType } from '../enums/svg';
import { SvgInstanceType } from '../logic/svg/base-svg/svg-component-type';

import { SvgGridComponent } from '../components/svgElement/svg-grid/svg-grid.component';
import { SvgPencilComponent } from '../components/svgElement/svg-pencil/svg-pencil.component';
import { SvgRectangleComponent } from '../components/svgElement/svg-rectangle/svg-rectangle.component';

type SvgComponentType = Type<SvgInstanceType>;

export const svgComponentTypes: Record<SvgType, SvgComponentType> = {
  [SvgType.SvgRectangleComponent]: SvgRectangleComponent,
  [SvgType.SvgGridComponent]: SvgGridComponent,
  [SvgType.SvgPencilComponent]: SvgPencilComponent,
} as const;
