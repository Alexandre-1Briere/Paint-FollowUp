import { COMMA, ENTER, SPACE, TAB } from '@angular/cdk/keycodes';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { ImageModel } from '../../../../../../common/model/image.model';
import { DrawingAccessorService } from '../../../services/current-drawing-accessor/drawing-accessor.service';
import { KeyboardManagerService } from '../../../services/events/keyboard-manager.service';
import { ExportService } from '../../../services/export/export.service';
import { ImagesManagerService } from '../../../services/images-manager/images-manager.service';
import { ImportService } from '../../../services/import/import.service';
import { StorageService } from '../../../services/storage/storage.service';
import { MessageDialogComponent } from '../message-dialog/message-dialog.component';

@Component({
  selector: 'app-save-drawing-dialog',
  templateUrl: './save-drawing-dialog.component.html',
  styleUrls: ['./save-drawing-dialog.component.scss'],
})
export class SaveDrawingDialogComponent implements OnInit {

  static readonly DEFAULT_SAVE_TO_SERVER: boolean = true;
  static readonly DEFAULT_CAN_SAVE: boolean = true;
  static readonly IMAGE_PREVIEW: string = 'imagePreview';
  readonly separatorKeysCodes: number[] = [ENTER, COMMA, SPACE, TAB];

  canSave: boolean;

  title: string | undefined;
  tags: string[];
  saveToServer: boolean;

  selectable: boolean;
  removable: boolean;
  filteredTags: Observable<string[]>;
  allTags: string[];
  // @ts-ignore ViewChild doesn't need the second argument
  @ViewChild('tagInput') tagInput: ElementRef<HTMLInputElement>;
  // @ts-ignore ViewChild doesn't need the second argument
  @ViewChild('auto') matAutocomplete: MatAutocomplete;

  tagCtrl: FormControl;
  titleFormControl: FormControl;

  constructor(public dialogRef: MatDialogRef<SaveDrawingDialogComponent>,
              public storage: StorageService,
              public exportService: ExportService,
              private importService: ImportService,
              private imagesManagerService: ImagesManagerService,
              public keyboardManagerService: KeyboardManagerService,
              private drawingAccessorService: DrawingAccessorService,
              public dialog: MatDialog,
  ) {
    this.tagCtrl = new FormControl();
    this.titleFormControl = new FormControl('', [Validators.required]);

    this.dialogRef.beforeClosed().subscribe( () => {
      this.keyboardManagerService.enableShortcuts = true;
    });
    this.imagesManagerService.savedObs.subscribe(() => { this.onSave(); });
    this.filteredTags = this.tagCtrl.valueChanges.pipe(
      startWith(null),
      map((tag: string | null) => tag ? this._filter(tag) : this.allTags.slice()));

    this.canSave = SaveDrawingDialogComponent.DEFAULT_CAN_SAVE;
    this.tags = [];
    this.allTags = this.imagesManagerService.tags;
    this.saveToServer = SaveDrawingDialogComponent.DEFAULT_SAVE_TO_SERVER;
    this.selectable = true;
    this.removable = true;
  }

  onSave(): void {
    this.canSave = true;
    this.close();
  }

  ngOnInit(): void {
    this.keyboardManagerService.enableShortcuts = false;
    this.title = this.importService.loadedImage ? this.importService.loadedImage.title : '';
    this.tags = this.importService.loadedImage ? this.importService.loadedImage.tags : [];

    this.updatePreview();
  }

  validateEntries(): boolean {
    return !this.titleFormControl.hasError('required') &&
      ImageModel.validateTags(this.tags) &&
      ImageModel.validateTitle(this.title ? this.title : '');
  }

  updatePreview(): void {
    const svg = this.drawingAccessorService.getCurrentDrawingElement();

    if (svg !== null) {
      svg.setAttribute('width', '100%');
      svg.setAttribute('height', '100%');
      const imagePreview = document.getElementById(SaveDrawingDialogComponent.IMAGE_PREVIEW);
      if (imagePreview !== null) {
        imagePreview.innerHTML = '';
        imagePreview.appendChild(svg);
      }
    }
  }

  saveSettings(): void {
    this.addInputAsChip();
    if (!this.title || this.tags === []) { return; }
    if (!this.exportService.serverIsAvailable()) {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.width = '400px';
      dialogConfig.data = 'Il est présentement impossible de communiquer avec le serveur.';
      this.dialog.open(MessageDialogComponent, dialogConfig);
      return;
    }
    this.canSave = false;
    this.exportService.saveImage(this.title, this.tags, this.saveToServer);
  }

  cancel(): void {
    this.close();
  }

  close(): void {
    this.dialogRef.close();
    this.keyboardManagerService.enableShortcuts = true;
  }

  // AUTOCOMPLETED CHIPS
  // src: https://material.angular.io/components/chips/overview
  add(input: HTMLInputElement, value: string): void {
    this.addTag(value);
    if (input) { input.value = ''; }

    this.tagCtrl.setValue(null);
  }

  addInputAsChip(): void {
    if (!this.tagCtrl.value) { return; }
    this.addTag(this.tagCtrl.value);
    this.tagCtrl.setValue(null);
  }

  addTag(value: string): void {
    const index = this.tags.indexOf(value.trim());
    if (ImageModel.validateTags([value.trim()]) &&
        ((value || '').trim()) &&
        index < 0) { this.tags.push(value.trim()); }
  }

  remove(tag: string): void {
    const index = this.tags.indexOf(tag);
    if (index >= 0) { this.tags.splice(index, 1); }
  }

  selected(event: string): void {
    this.tags.push(event);
    this.tagInput.nativeElement.value = '';
    this.tagCtrl.setValue(null);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toString().toLowerCase();
    return this.allTags.filter((tag) => tag.toLowerCase().indexOf(filterValue) === 0);
  }
}
