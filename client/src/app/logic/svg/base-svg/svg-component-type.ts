import { Type } from '@angular/core';

import { SvgAerosolComponent } from '../../../components/drawing/work-board/svg-aerosol/svg-aerosol.component';
import { SvgBrushComponent } from '../../../components/drawing/work-board/svg-brush/svg-brush.component';
import { SvgBucketComponent } from '../../../components/drawing/work-board/svg-bucket/svg-bucket.component';
import { SvgEllipseComponent } from '../../../components/drawing/work-board/svg-ellipse/svg-ellipse.component';
import { SvgFeatherComponent } from '../../../components/drawing/work-board/svg-feather/svg-feather.component';
import { SvgGridComponent } from '../../../components/drawing/work-board/svg-grid/svg-grid.component';
import { SvgPencilComponent } from '../../../components/drawing/work-board/svg-pencil/svg-pencil.component';
import { SvgPolygonComponent } from '../../../components/drawing/work-board/svg-polygon/svg-polygon.component';
import { SvgPolylineComponent } from '../../../components/drawing/work-board/svg-polyline/svg-polyline.component';
import { SvgRectangleComponent } from '../../../components/drawing/work-board/svg-rectangle/svg-rectangle.component';
import { SvgSelectionComponent } from '../../../components/drawing/work-board/svg-selection/svg-selection.component';
import { SvgStampComponent } from '../../../components/drawing/work-board/svg-stamp/svg-stamp.component';

export type SvgInstanceType = (
  SvgRectangleComponent |
  SvgPolylineComponent |
  SvgEllipseComponent |
  SvgGridComponent |
  SvgPencilComponent |
  SvgBrushComponent |
  SvgSelectionComponent |
  SvgAerosolComponent |
  SvgPolygonComponent |
  SvgFeatherComponent |
  SvgBucketComponent |
  SvgStampComponent
);
export type SvgComponentType = Type<SvgInstanceType>;
