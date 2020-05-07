import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Paths } from '../../../enums/paths';
import { DrawingInformationInterface } from '../../../interfaces/drawing-information.interface';
import { ColorManipulator } from '../../../services/color-picker/color-manipulator/color-manipulator';
import { ColorPickerService } from '../../../services/color-picker/color-picker.service';
import { HEX_RGB_LENGTH } from '../../../services/color-picker/constant';
// tslint:disable-next-line
import { DrawingBaseParametersAccessorService } from '../../../services/drawing-base-parameters-accessor/drawing-base-parameters-accessor.service';
import { KeyboardManagerService } from '../../../services/events/keyboard-manager.service';
import { ImportService } from '../../../services/import/import.service';
import { KeypressService } from '../../../services/keypress/keypress.service';
import { NavigationService } from '../../../services/navigation/navigation.service';
import { ScreenSizeService } from '../../../services/screen-size/screen-size.service';
import { LocalSaverService } from '../../../services/storage/local-saver/local-saver.service';
import { StorageService } from '../../../services/storage/storage.service';
import { SvgComponentsManagerService } from '../../../services/svg/svg-components-manager.service';
import { SvgUndoRedoService } from '../../../services/undo-redo/svg-undo-redo.service';
import { ConfirmCancelDialogComponent } from '../confirm-cancel-dialog/confirm-cancel-dialog.component';

@Component({
  selector: 'app-create-new-drawing',
  templateUrl: './create-new-drawing.component.html',
  styleUrls: ['./create-new-drawing.component.scss'],
})
export class CreateNewDrawingComponent implements OnInit {

  form: FormGroup;

  constructor(public colorPickerService: ColorPickerService,
              public dialog: MatDialog,
              public dialogRef: MatDialogRef<CreateNewDrawingComponent>,
              private formBuilder: FormBuilder,
              private importService: ImportService,
              private keyboardManagerService: KeyboardManagerService,
              public keypressService: KeypressService,
              public router: Router,
              public screenSizeService: ScreenSizeService,
              public storage: StorageService,
              public svgComponentsManagerService: SvgComponentsManagerService,
              public undoRedoService: SvgUndoRedoService,
              public drawingCreatorService: DrawingBaseParametersAccessorService,
              private localSaverService: LocalSaverService,
              private navigationService: NavigationService,
  ) {
    this.dialogRef.beforeClosed().subscribe( () => {
      this.keyboardManagerService.enableShortcuts = true;
    });
  }

  ngOnInit(): void {
    this.keyboardManagerService.enableShortcuts = false;
    const MIN_VALUE = 1;

    this.form = this.formBuilder.group({
      height: [this.screenSizeService.getScreenHeight(), [Validators.required, Validators.min(MIN_VALUE)]],
      width: [this.screenSizeService.getScreenWidth(), [Validators.required, Validators.min(MIN_VALUE)]],
    });
  }

  onSubmit(): void {
    if (this.undoRedoService.checkIfAnyUserChanges(false)) {

      const dialogOptions = new MatDialogConfig();
      dialogOptions.width = '400px';
      dialogOptions.data = 'Vous n\'avez pas sauvegardé le dessin en cours. ' +
          'En confirmant, vous créé un nouveau dessin et écrasez le dessin en' +
          ' cours. Confirmez-vous la création du nouveau dessin?';
      this.dialog.open(ConfirmCancelDialogComponent, dialogOptions).afterClosed().subscribe((confirmed) => this.onWarningClose(confirmed));
    } else {
      this.submitNewDrawing();
      this.close();
    }
  }

  onWarningClose(confirmed: boolean): void {
    if (confirmed) {
      this.svgComponentsManagerService.resetSvgComponents();
      this.importService.loadedImage = undefined;
      this.submitNewDrawing();
      this.close();
    }
  }

  submitNewDrawing(): void {
    const width = parseInt(this.form.controls.width.value, 10);
    const height = parseInt(this.form.controls.height.value, 10);
    const backgroundColor = this.getBackgroundColor();

    this.drawingCreatorService.setDrawingBaseParameters(width, height, backgroundColor);
    this.importService.loadedImage = undefined;
    this.svgComponentsManagerService.resetSvgComponents();

    const drawingInfo = {
      etiquette: [],
      name: '',
      baseParameters: {width, height, backgroundColor},
      svgBoard: {components: []},
      id: 0,
    } as DrawingInformationInterface;

    this.localSaverService.saveDrawing(drawingInfo);

    this.navigationService.navigate(Paths.DRAWING);
  }

  onResize(): void {
    if (this.form && this.form.controls.height.pristine && this.form.controls.width.pristine) {
      this.form.controls.height.setValue(this.screenSizeService.getScreenHeight());
      this.form.controls.width.setValue(this.screenSizeService.getScreenWidth());
    }
  }

  close(): void {
    this.keyboardManagerService.enableShortcuts = true;
    this.dialogRef.close();
  }

  getBackgroundColor(): string {
    const color = this.colorPickerService.getPaletteColor();
    this.colorPickerService.pushColorToUsed(color);
    return ColorManipulator.colorRGBAToHexColor(color).substring(0, HEX_RGB_LENGTH);
  }
}
