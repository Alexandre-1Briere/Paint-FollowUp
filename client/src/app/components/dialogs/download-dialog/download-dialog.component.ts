import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { emailRegExp } from '../../../../../../common/model/EmailableImage';
import { Filters } from '../../../enums/filters';
import { Formats } from '../../../enums/formats';
import { DrawingAccessorService } from '../../../services/current-drawing-accessor/drawing-accessor.service';
import { DownloaderService } from '../../../services/downloader/downloader.service';
import { KeyboardManagerService } from '../../../services/events/keyboard-manager.service';

@Component({
  selector: 'app-export-dialog',
  templateUrl: './download-dialog.component.html',
  styleUrls: ['./download-dialog.component.scss'],
})
export class DownloadDialogComponent implements OnInit {
  private form: FormGroup;
  isEmailSelected: boolean;

  formats: string[] = [
    Formats.SVG,
    Formats.JPEG,
    Formats.PNG,
  ];

  filters: string[] = [
    Filters.NOFILTER,
    Filters.GRAYSCALE,
    Filters.HUEROTATE,
    Filters.BLUR,
    Filters.TURBULENCE,
    Filters.MORPH,
  ];

  constructor(public dialogRef: MatDialogRef<DownloadDialogComponent>,
              public downloaderService: DownloaderService,
              public drawingAccessorService: DrawingAccessorService,
              private formBuilder: FormBuilder,
              public keyboardManagerService: KeyboardManagerService,
  ) {
    this.dialogRef.beforeClosed().subscribe( () => {
      this.keyboardManagerService.enableShortcuts = true;
    });

    this.isEmailSelected = false;
  }

  ngOnInit(): void {
    this.keyboardManagerService.enableShortcuts = false;

    const MAX_SIZE = 128;
    this.form = this.formBuilder.group({
      format: [ Formats.SVG, [Validators.required]],
      filter: [Filters.NOFILTER],
      name: [null, [Validators.required, Validators.maxLength(MAX_SIZE)]],
      exportType: ['download'],
      email: [null],
    });

    this.updatePreview();
    this.updateIsEmailSelected();
    this.form.controls.filter.valueChanges.subscribe(() => this.updatePreview());
    this.form.controls.name.markAsTouched();
    this.form.controls.email.markAsTouched();
  }

  onSubmit(): void {
    const svg = this.drawingAccessorService.getCurrentDrawingElement();
    const name = this.form.controls.name.value;
    const format = this.form.controls.format.value;
    const filter = this.form.controls.filter.value;
    if (this.form.controls.exportType.value === 'email') {
      this.downloaderService.exportDrawing(svg, name, format, filter, this.form.controls.email.value);
    } else {
      this.downloaderService.exportDrawing(svg, name, format, filter);
    }

    this.close();
  }

  updatePreview(): void {
    const svg = this.drawingAccessorService.getCurrentDrawingElement();
    const filter = this.form.controls.filter.value;
    const filteredSvg = this.downloaderService.applyFilter(svg, filter);

    if (filteredSvg !== null) {
      filteredSvg.setAttribute('width', '100%');
      filteredSvg.setAttribute('height', '100%');
      const imagePreview = document.getElementById('imagePreview');
      if (imagePreview !== null) {
        imagePreview.innerHTML = '';
        imagePreview.appendChild(filteredSvg);
      }
    }
  }

  updateIsEmailSelected(): void {
    this.isEmailSelected = (this.form.controls.exportType.value === 'email');

    if ( this.isEmailSelected ) {
      this.form.controls.email.setValidators([Validators.required, Validators.pattern(emailRegExp)]);
    } else {
      this.form.controls.email.clearValidators();
    }

    this.form.controls.email.updateValueAndValidity();
    this.form.controls.email.markAsTouched();
  }

  close(): void {
    this.dialogRef.close();
    this.keyboardManagerService.enableShortcuts = true;
  }
}
