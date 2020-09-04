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
import { GridOptionsDialogComponent } from './components/dialogs/grid-options-dialog/grid-options-dialog.component';
import { MessageDialogComponent } from './components/dialogs/message-dialog/message-dialog.component';
import { DrawingComponent } from './components/drawing/drawing.component';
import { ToolDetailComponent } from './components/drawing/tool-detail/tool-detail.component';
import { ColorPickerComponent } from './components/drawing/toolbar/color-picker/color-picker.component';
import { ColorSliderComponent } from './components/drawing/toolbar/color-picker/color-slider/color-slider.component';
import { OpacityComponent } from './components/drawing/toolbar/color-picker/opacity/opacity.component';
import { PaletteSelectorComponent } from './components/drawing/toolbar/color-picker/palette-selector/palette-selector.component';
import { ToolbarComponent } from './components/drawing/toolbar/toolbar.component';
import { DrawingBoardComponent } from './components/drawing/work-board/drawing-board/drawing-board.component';
import { WorkBoardComponent } from './components/drawing/work-board/work-board.component';
import { EntryPointComponent } from './components/entry-point/entry-point.component';
import { SvgGridComponent } from './components/svgElement/svg-grid/svg-grid.component';
import { SvgPencilComponent } from './components/svgElement/svg-pencil/svg-pencil.component';
import { SvgRectangleComponent } from './components/svgElement/svg-rectangle/svg-rectangle.component';
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
    ColorSliderComponent,
    PaletteSelectorComponent,
    OpacityComponent,
    SvgRectangleComponent,
    ToolDetailComponent,
    SvgPencilComponent,
    SvgGridComponent,
    GridOptionsDialogComponent,
    ConfirmCancelDialogComponent,
    MessageDialogComponent,
  ],
  entryComponents: [
    EntryPointComponent,
    SvgRectangleComponent,
    SvgPencilComponent,
    SvgGridComponent,
    GridOptionsDialogComponent,
    ConfirmCancelDialogComponent,
    MessageDialogComponent,
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
