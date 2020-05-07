import { APP_BASE_HREF } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
    MatAutocompleteModule,
    MatButtonModule,
    MatCardModule,
    MatChipsModule,
    MatDividerModule,
    MatSliderModule,
    MatSlideToggleModule,
} from '@angular/material';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './components/app/app.component';
import { ConfirmCancelDialogComponent } from './components/dialogs/confirm-cancel-dialog/confirm-cancel-dialog.component';
import { CreateNewDrawingComponent } from './components/dialogs/create-new-drawing/create-new-drawing.component';
import { DownloadDialogComponent } from './components/dialogs/download-dialog/download-dialog.component';
import { GalerieComponent } from './components/dialogs/galerie/galerie.component';
import { GridOptionsDialogComponent } from './components/dialogs/grid-options-dialog/grid-options-dialog.component';
import { MessageDialogComponent } from './components/dialogs/message-dialog/message-dialog.component';
import { SaveDrawingDialogComponent } from './components/dialogs/save-drawing-dialog/save-drawing-dialog.component';
import { DrawingComponent } from './components/drawing/drawing.component';
import { ToolDetailComponent } from './components/drawing/tool-detail/tool-detail.component';
import { ColorPickerComponent } from './components/drawing/toolbar/color-picker/color-picker.component';
import { ColorSliderComponent } from './components/drawing/toolbar/color-picker/color-slider/color-slider.component';
import { OpacityComponent } from './components/drawing/toolbar/color-picker/opacity/opacity.component';
import { PaletteSelectorComponent } from './components/drawing/toolbar/color-picker/palette-selector/palette-selector.component';
import { ToolbarComponent } from './components/drawing/toolbar/toolbar.component';
import { DrawingBoardComponent } from './components/drawing/work-board/drawing-board/drawing-board.component';
import { SvgAerosolComponent } from './components/drawing/work-board/svg-aerosol/svg-aerosol.component';
import { SvgBrushComponent } from './components/drawing/work-board/svg-brush/svg-brush.component';
import { SvgBucketComponent } from './components/drawing/work-board/svg-bucket/svg-bucket.component';
import { SvgEllipseComponent } from './components/drawing/work-board/svg-ellipse/svg-ellipse.component';
import { SvgFeatherComponent } from './components/drawing/work-board/svg-feather/svg-feather.component';
import { SvgGridComponent } from './components/drawing/work-board/svg-grid/svg-grid.component';
import { SvgPencilComponent } from './components/drawing/work-board/svg-pencil/svg-pencil.component';
import { SvgPolygonComponent } from './components/drawing/work-board/svg-polygon/svg-polygon.component';
import { SvgPolylineComponent } from './components/drawing/work-board/svg-polyline/svg-polyline.component';
import { SvgRectangleComponent } from './components/drawing/work-board/svg-rectangle/svg-rectangle.component';
import { SvgSelectionComponent } from './components/drawing/work-board/svg-selection/svg-selection.component';
import { SvgStampComponent } from './components/drawing/work-board/svg-stamp/svg-stamp.component';
import { WorkBoardComponent } from './components/drawing/work-board/work-board.component';
import { EntryPointComponent } from './components/entry-point/entry-point.component';
import { UseGuideComponent } from './components/use-guide/use-guide.component';
import { ColorPickerService } from './services/color-picker/color-picker.service';

@NgModule({
  declarations: [
    AppComponent,
    DrawingComponent,
    ToolbarComponent,
    ColorPickerComponent,
    DrawingBoardComponent,
    WorkBoardComponent,
    EntryPointComponent,
    CreateNewDrawingComponent,
    ColorSliderComponent,
    PaletteSelectorComponent,
    OpacityComponent,
    UseGuideComponent,
    SvgRectangleComponent,
    SvgPolylineComponent,
    ToolDetailComponent,
    SvgPencilComponent,
    SvgBrushComponent,
    SvgSelectionComponent,
    SvgEllipseComponent,
    DownloadDialogComponent,
    SvgAerosolComponent,
    SvgGridComponent,
    SvgPolygonComponent,
    GalerieComponent,
    GridOptionsDialogComponent,
    SaveDrawingDialogComponent,
    ConfirmCancelDialogComponent,
    MessageDialogComponent,
    SvgFeatherComponent,
    SvgBucketComponent,
    SvgStampComponent,
  ],
  entryComponents: [
    EntryPointComponent,
    CreateNewDrawingComponent,
    GalerieComponent,
    SvgPolylineComponent,
    SvgRectangleComponent,
    SvgPencilComponent,
    SvgBrushComponent,
    SvgEllipseComponent,
    SvgSelectionComponent,
    DownloadDialogComponent,
    SvgAerosolComponent,
    SvgGridComponent,
    SvgPolygonComponent,
    GridOptionsDialogComponent,
    SaveDrawingDialogComponent,
    ConfirmCancelDialogComponent,
    MessageDialogComponent,
    SvgFeatherComponent,
    SvgBucketComponent,
    SvgStampComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatDialogModule,
    MatIconModule,
    AngularSvgIconModule,
    FontAwesomeModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatRadioModule,
    FormsModule,
    MatInputModule,
    MatButtonModule,
    MatSliderModule,
    MatSelectModule,
    NoopAnimationsModule,
    MatSlideToggleModule,
    MatAutocompleteModule,
    MatChipsModule,
    MatDividerModule,
    MatCardModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    MatExpansionModule,
  ],
  providers: [
    ColorPickerService,
    {
      provide: MatDialogRef,
      useValue: {},
    },
    { provide: MAT_DIALOG_DATA, useValue: [] },
    { provide: APP_BASE_HREF, useValue: '/my/app'},
  ],

  bootstrap: [AppComponent],
})

export class AppModule {
}
