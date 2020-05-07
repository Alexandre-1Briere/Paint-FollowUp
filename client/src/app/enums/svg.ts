export enum SvgLayer {
  Grid,
  Selection,
  Visual,
  Stack,
}

export enum SvgLayerPlacement {
  Above,
  Same,
  Under,
}

export enum SvgStatus {
  Permanent,
  InProgress,
  Temporary,
}

export enum SvgType {
  SvgRectangleComponent,
  SvgPolylineComponent,
  SvgEllipseComponent,
  SvgGridComponent,
  SvgPencilComponent,
  SvgBrushComponent,
  SvgSelectionComponent,
  SvgAerosolComponent,
  SvgPolygonComponent,
  SvgFeatherComponent,
  SvgBucketComponent,
  SvgStampComponent,
}

export enum SvgUndoRedoChange {
  UndoCalled,
  RedoCalled,
  SaveCalled,
  LoadCalled,
}
