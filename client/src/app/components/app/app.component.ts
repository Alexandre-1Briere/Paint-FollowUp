import { Component, HostListener } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { KeyboardKey } from '../../enums/keyboard';
import { KeyboardManagerService } from '../../services/events/keyboard-manager.service';
import { ScreenSizeService } from '../../services/screen-size/screen-size.service';
import { CreateNewDrawingComponent } from '../dialogs/create-new-drawing/create-new-drawing.component';
import { GalerieComponent } from '../dialogs/galerie/galerie.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  constructor(public keyboardManagerService: KeyboardManagerService,
              public dialog: MatDialog,
              private screenSizeService: ScreenSizeService) {
    this.keyboardManagerService.getKeyboardStateObs().subscribe(() => {
      this.checkForKeyboardShortcut();
    });
  }

  private checkForKeyboardShortcut(): void {
    if (this.keyboardManagerService.checkKeyboardShortcut([KeyboardKey.Ctrl, KeyboardKey.O], [] )) {
      this.keyboardManagerService.enableShortcuts = false;
      this.dialog.open(CreateNewDrawingComponent);
    }
    if (this.keyboardManagerService.checkKeyboardShortcut([KeyboardKey.Ctrl, KeyboardKey.G], [] )) {
      this.keyboardManagerService.enableShortcuts = false;
      this.dialog.open(GalerieComponent);
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event?: Event): void {
    this.screenSizeService.queryScreenSize();
  }
}
