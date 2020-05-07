import { COMMA, ENTER, SPACE, TAB } from '@angular/cdk/keycodes';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocomplete } from '@angular/material';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { ImageModel } from '../../../../../../common/model/image.model';
import { Paths } from '../../../enums/paths';
import { KeyboardManagerService } from '../../../services/events/keyboard-manager.service';
import { ImagesManagerService } from '../../../services/images-manager/images-manager.service';
import { ImportService } from '../../../services/import/import.service';
import { NavigationService } from '../../../services/navigation/navigation.service';
import { ServerComService } from '../../../services/server-com/server-com.service';
import { SvgUndoRedoService } from '../../../services/undo-redo/svg-undo-redo.service';
import { ConfirmCancelDialogComponent } from '../confirm-cancel-dialog/confirm-cancel-dialog.component';

@Component({
  selector: 'app-galerie',
  templateUrl: './galerie.component.html',
  styleUrls: ['./galerie.component.scss'],
})
export class GalerieComponent implements OnInit {

  BASE_URL: string;

  isLoading: boolean;
  images: ImageModel[];
  selectedCard: ImageModel | undefined;

  selectable: boolean;
  removable: boolean;
  readonly separatorKeysCodes: number[];
  tagCtrl: FormControl;
  filteredTags: Observable<string[]>;
  oldTags: string[];
  tags: string[];
  // @ts-ignore ViewChild doesn't need the second argument
  @ViewChild('tagInput') tagInput: ElementRef<HTMLInputElement>;
  // @ts-ignore ViewChild doesn't need the second argument
  @ViewChild('auto') matAutocomplete: MatAutocomplete;

  constructor(public keyboardManagerService: KeyboardManagerService,
              public ims: ImagesManagerService,
              public importService: ImportService,
              public dialogRef: MatDialogRef<GalerieComponent>,
              public dialog: MatDialog,
              private undoRedoService: SvgUndoRedoService,
              public navigationService: NavigationService,
  ) {
    this.tagCtrl = new FormControl();

    this.dialogRef.beforeClosed().subscribe( () => {
      this.keyboardManagerService.enableShortcuts = true;
    });
    this.filteredTags = this.tagCtrl.valueChanges.pipe(
      startWith(null),
      map((tag: string | null) => tag ? this._filter(tag) : this.ims.tags.slice()),
    );

    this.BASE_URL = ServerComService.BASE_URL;

    this.isLoading = this.ims.isLoading;
    this.tags = [];

    this.images = [];
    this.ims.imagesObs.subscribe(() => {
      this.images = this.ims.images;
      this.isLoading = this.ims.isLoading;
    }, () => {
      this.images = this.ims.images;
      this.isLoading = this.ims.isLoading;
    });

    this.selectable = true;
    this.removable = true;
    this.separatorKeysCodes = [ENTER, COMMA, TAB, SPACE];
  }

  ngOnInit(): void {
    this.keyboardManagerService.enableShortcuts = false;
    this.isLoading = this.ims.isLoading;
    this.ims.getImagesByTags([]);
    this.ims.fetchTags();
  }

  chipsUpdate(): void {
    if (this.tags === this.oldTags) { return; }
    this.ims.getImagesByTags(this.tags);
    this.oldTags = [...this.tags];
  }

  setSelected(img: ImageModel): void {
    this.selectedCard = img;
  }

  importImage(): void {
    if (!this.selectedCard) { return; }

    if (this.undoRedoService.checkIfAnyUserChanges(false)) {
      const dialogOptions = new MatDialogConfig();
      dialogOptions.width = '400px';
      dialogOptions.data = 'Vous n\'avez pas sauvegardé le dessin en cours. ' +
          'En confirmant, vous ouvrez le nouveau dessin et écrasez le dessin en' +
          ' cours. Confirmez-vous l\'ouverture du nouveau dessin?';
      this.dialog.open(ConfirmCancelDialogComponent, dialogOptions)
          .afterClosed().subscribe((result: boolean) => {
            this.onConfirmCancel(result);
    });
    } else {
      this.importService.loadImage(this.selectedCard);
      this.navigationService.navigate(Paths.DRAWING);
      this.close();
    }
  }

  addTag(value: string, update?: boolean): void {
    const indexOf = this.tags.indexOf(value);
    if ((value || '').trim() && indexOf < 0) { this.tags.push(value.trim()); }
    if (update) { this.chipsUpdate(); }
  }

  getSVG(image: ImageModel): string {
    const svg = new DOMParser().parseFromString(image.inlineSVG, 'image/svg+xml').documentElement;
    if (svg) {
      svg.setAttribute('width', '100%');
      svg.setAttribute('height', '100%');
      svg.classList.add('svg-element');

      const div = document.getElementById('svg=' + image.id);
      if (div !== null) {
        div.innerHTML = '';
        div.appendChild(svg);
        return '';
      }
    }
    return 'Thumbnail failed to load';
  }

  close(): void {
    this.dialogRef.close();
    this.keyboardManagerService.enableShortcuts = true;
  }

  // AUTOCOMPLETED CHIPS
  // src: https://material.angular.io/components/chips/overview
  add(input: HTMLInputElement, value: string): void {
    this.addTag(value);
    input.value = '';

    this.tagCtrl.setValue(null);
    this.chipsUpdate();
  }

  remove(tag: string): void {
    const index = this.tags.indexOf(tag);
    if (index >= 0) { this.tags.splice(index, 1); }
    this.chipsUpdate();
  }

  selected(event: string): void {
    this.tags.push(event);
    this.tagInput.nativeElement.value = '';
    this.tagCtrl.setValue(null);
    }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.ims.tags.filter((tag) => tag.toLowerCase().indexOf(filterValue) === 0);
  }

  private onConfirmCancel(result: boolean): void {
    if (result) {
      if (!this.selectedCard) { return; }
      this.importService.loadImage(this.selectedCard);
      this.navigationService.navigate(Paths.DRAWING);
      this.close();
    }
  }

  private onConfirmDelete(result: boolean , img: ImageModel): void {
    if (result) {
      this.images.splice(this.images.indexOf(img), 1);
      this.ims.deleteImage(img.id);
    }
  }

  deleteCard(img: ImageModel): void {
    const dialogOptions = new MatDialogConfig();
    dialogOptions.width = '400px';
    dialogOptions.data = 'Confirmez-vous vouloir supprimer ce dessin?';
    this.dialog.open(ConfirmCancelDialogComponent, dialogOptions).afterClosed().subscribe((result: boolean) => {
      this.onConfirmDelete(result , img);
    });
  }

}
