import { Component, HostListener } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ERROR } from '../../../../../common/constant/client/service/cookies/constant';
import { IMAGE_DATA_TAG } from '../../constants/drawing';
import { KeyboardManagerService } from '../../services/events/keyboard-manager.service';
import { LocalLoaderService } from '../../services/storage/local-loader/local-loader.service';
import { StorageService } from '../../services/storage/storage.service';
import { CreateNewDrawingComponent } from '../dialogs/create-new-drawing/create-new-drawing.component';
import { GalerieComponent } from '../dialogs/galerie/galerie.component';

@Component({
  selector: 'app-entry-point',
  templateUrl: './entry-point.component.html',
  styleUrls: ['./entry-point.component.scss'],
})
export class EntryPointComponent {
  lastDrawingFound: boolean;

  constructor(public dialog: MatDialog,
              private keyboardManagerService: KeyboardManagerService,
              private storage: StorageService,
              public localLoader: LocalLoaderService,
              public router: Router) {
    this.lastDrawingFound = this.loadLastDrawing();
  }

  @HostListener('window:keydown', ['$event'])
  @HostListener('window:keyup', ['$event'])
  onKeyboardEvent(event: KeyboardEvent): void {
    if (event.ctrlKey) {
      event.preventDefault();
    }
    this.keyboardManagerService.receiveKeyboardEvent(event);
  }

  openComponentDialog(): void {
    this.dialog.open(CreateNewDrawingComponent);
  }

  openGalerieDialog(): void {
    this.dialog.open(GalerieComponent);
  }

  continueDrawing(): void {
    this.localLoader.loadDrawingToWorkspace();

    let routeExist = false;
    for (const elem of this.router.config) {
      if (elem.path === 'drawing') {
        routeExist = true;
      }
    }

    if (routeExist) {
      this.router.navigate(['/drawing']).then().catch();
    }
  }

  private loadLastDrawing(): boolean {
    return this.storage.get(IMAGE_DATA_TAG) !== ERROR;
  }
}
