import { Type } from '@angular/core';

import { SvgType } from '../enums/svg';
import { SvgInstanceType } from '../logic/svg/base-svg/svg-component-type';

import { SvgAerosolComponent } from '../components/drawing/work-board/svg-aerosol/svg-aerosol.component';
import { SvgBrushComponent } from '../components/drawing/work-board/svg-brush/svg-brush.component';
import { SvgBucketComponent } from '../components/drawing/work-board/svg-bucket/svg-bucket.component';
import { SvgEllipseComponent } from '../components/drawing/work-board/svg-ellipse/svg-ellipse.component';
import { SvgFeatherComponent } from '../components/drawing/work-board/svg-feather/svg-feather.component';
import { SvgGridComponent } from '../components/drawing/work-board/svg-grid/svg-grid.component';
import { SvgPencilComponent } from '../components/drawing/work-board/svg-pencil/svg-pencil.component';
import { SvgPolygonComponent } from '../components/drawing/work-board/svg-polygon/svg-polygon.component';
import { SvgPolylineComponent } from '../components/drawing/work-board/svg-polyline/svg-polyline.component';
import { SvgRectangleComponent } from '../components/drawing/work-board/svg-rectangle/svg-rectangle.component';
import { SvgSelectionComponent } from '../components/drawing/work-board/svg-selection/svg-selection.component';
import { SvgStampComponent } from '../components/drawing/work-board/svg-stamp/svg-stamp.component';

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
