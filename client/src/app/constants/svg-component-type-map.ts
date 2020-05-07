import { Type } from '@angular/core';

import { SvgType } from '../enums/svg';
import { SvgInstanceType } from '../logic/svg/base-svg/svg-component-type';

import { SvgAerosolComponent } from '../components/svgElement/svg-aerosol/svg-aerosol.component';
import { SvgBrushComponent } from '../components/svgElement/svg-brush/svg-brush.component';
import { SvgBucketComponent } from '../components/svgElement/svg-bucket/svg-bucket.component';
import { SvgEllipseComponent } from '../components/svgElement/svg-ellipse/svg-ellipse.component';
import { SvgFeatherComponent } from '../components/svgElement/svg-feather/svg-feather.component';
import { SvgGridComponent } from '../components/svgElement/svg-grid/svg-grid.component';
import { SvgPencilComponent } from '../components/svgElement/svg-pencil/svg-pencil.component';
import { SvgPolygonComponent } from '../components/svgElement/svg-polygon/svg-polygon.component';
import { SvgPolylineComponent } from '../components/svgElement/svg-polyline/svg-polyline.component';
import { SvgRectangleComponent } from '../components/svgElement/svg-rectangle/svg-rectangle.component';
import { SvgSelectionComponent } from '../components/svgElement/svg-selection/svg-selection.component';
import { SvgStampComponent } from '../components/svgElement/svg-stamp/svg-stamp.component';

type SvgComponentType = Type<SvgInstanceType>;

export const svgComponentTypes: Record<SvgType, SvgComponentType> = {
  [SvgType.SvgRectangleComponent]: SvgRectangleComponent,
  [SvgType.SvgPolylineComponent]: SvgPolylineComponent,
  [SvgType.SvgEllipseComponent]: SvgEllipseComponent,
  [SvgType.SvgGridComponent]: SvgGridComponent,
  [SvgType.SvgPencilComponent]: SvgPencilComponent,
  [SvgType.SvgBrushComponent]: SvgBrushComponent,
  [SvgType.SvgSelectionComponent]: SvgSelectionComponent,
  [SvgType.SvgAerosolComponent]: SvgAerosolComponent,
  [SvgType.SvgPolygonComponent]: SvgPolygonComponent,
  [SvgType.SvgFeatherComponent]: SvgFeatherComponent,
  [SvgType.SvgBucketComponent]: SvgBucketComponent,
  [SvgType.SvgStampComponent]: SvgStampComponent,
} as const;
