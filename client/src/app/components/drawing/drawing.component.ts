import { ChangeDetectionStrategy, Component, HostListener, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MOUSE_MOVE, MOUSE_UP } from '../../constants/mouse';
import { toolsConfig } from '../../constants/tool-config';
import { KeyboardKey } from '../../enums/keyboard';
import { KeyboardManagerService } from '../../services/events/keyboard-manager.service';
import { MouseDrawingInputsService } from '../../services/events/mouse-drawing-inputs.service';
import { LocalLoaderService } from '../../services/storage/local-loader/local-loader.service';
import { ToolManagerService } from '../../services/tool-manager/tool-manager.service';
import { DownloadDialogComponent } from '../dialogs/download-dialog/download-dialog.component';
import { SaveDrawingDialogComponent } from '../dialogs/save-drawing-dialog/save-drawing-dialog.component';
import { ApplicableSettingClass, Config } from './tool-detail/applicable-setting.class';

@Component({
  selector: 'app-drawing',
  templateUrl: './drawing.component.html',
  styleUrls: ['./drawing.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DrawingComponent implements OnInit {

  static readonly DEFAULT_COMPLEMENTARY_COLOR: string = '#313131';

  currentConfig: Config = toolsConfig.pinceau;
  currentSetting: ApplicableSettingClass;
  complementaryColor: string;
  constructor(public keyboardManagerService: KeyboardManagerService,
              public dialog: MatDialog,
              public loadLocalDrawingService: LocalLoaderService,
              public mouseDrawingInputsService: MouseDrawingInputsService,
              public toolManagerService: ToolManagerService) {
    this.complementaryColor = DrawingComponent.DEFAULT_COMPLEMENTARY_COLOR;
    this.keyboardManagerService.getKeyboardStateObs().subscribe(() => {
      this.checkForKeyboardShortcuts();
    });
  }

  @HostListener('window:keydown', ['$event'])
  @HostListener('window:keyup', ['$event'])
  onKeyboardEvent(event: KeyboardEvent): void {
    if (event.ctrlKey || event.altKey) {
      event.preventDefault();
    }
    this.keyboardManagerService.receiveKeyboardEvent(event);
    this.checkForKeyboardShortcuts();
  }

  checkForKeyboardShortcuts(): void {
    if (this.keyboardManagerService.checkKeyboardShortcut([KeyboardKey.Ctrl, KeyboardKey.E], [] )) {
      this.keyboardManagerService.enableShortcuts = false;
      this.dialog.open(DownloadDialogComponent);
    }
    if (this.keyboardManagerService.checkKeyboardShortcut([KeyboardKey.Ctrl, KeyboardKey.S], [] )) {
      this.keyboardManagerService.enableShortcuts = false;
      this.dialog.open(SaveDrawingDialogComponent);
    }
  }

  ngOnInit(): void {
    this.toolManagerService.getToolObs().subscribe((tool) => {
      this.onToolChange(toolsConfig[tool.name]);
    });

    // Prevents right click menu from popping
    document.addEventListener('contextmenu', (event: MouseEvent) => this.preventDefault(event));
  }

  preventDefault(event: MouseEvent): void {
    event.preventDefault();
  }

  // Will be refactored for sprint 3
  // tslint:disable-next-line:no-any
  onToolChange(event: any): void {
    this.currentConfig = event;
  }

  onSettingChange(event: ApplicableSettingClass): void {
    this.currentSetting = event;
  }

  @HostListener(MOUSE_UP, ['$event'])
  @HostListener(MOUSE_MOVE, ['$event'])
  sendMouseEvent(event: MouseEvent): void {
    event.preventDefault();
    const FROM_DRAWING_BOARD = false;
    this.mouseDrawingInputsService.receiveMouseAction(event, FROM_DRAWING_BOARD);
  }
}
