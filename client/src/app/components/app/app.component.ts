import { Component} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { KeyboardManagerService } from '../../services/events/keyboard-manager.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  constructor(public keyboardManagerService: KeyboardManagerService,
              public dialog: MatDialog) {
  }
}
