import { Component, HostListener } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { KeyboardManagerService } from '../../services/events/keyboard-manager.service';

@Component({
  selector: 'app-entry-point',
  templateUrl: './entry-point.component.html',
  styleUrls: ['./entry-point.component.scss'],
})
export class EntryPointComponent {
  lastDrawingFound: boolean;

  constructor(public dialog: MatDialog,
              private keyboardManagerService: KeyboardManagerService,
              public router: Router) {
  }

  @HostListener('window:keydown', ['$event'])
  @HostListener('window:keyup', ['$event'])
  onKeyboardEvent(event: KeyboardEvent): void {
    if (event.ctrlKey) {
      event.preventDefault();
    }
    this.keyboardManagerService.receiveKeyboardEvent(event);
  }
}
