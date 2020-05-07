import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { KeyboardManagerService } from '../../../services/events/keyboard-manager.service';
import { GridManagerService } from '../../../services/grid-manager/grid-manager.service';
import { StorageService } from '../../../services/storage/storage.service';
import { SvgComponentsManagerService } from '../../../services/svg/svg-components-manager.service';

@Component({
  selector: 'app-grid-options-dialog',
  templateUrl: './grid-options-dialog.component.html',
  styleUrls: ['./grid-options-dialog.component.scss'],
})
export class GridOptionsDialogComponent implements OnInit {

  maxOpacity: number;
  minOpacity: number;
  private opacity: number;

  maxSize: number;
  minSize: number;
  private size: number;

  initialOpacity: number;
  initialSize: number;

  constructor(public dialogRef: MatDialogRef<GridOptionsDialogComponent>,
              public storage: StorageService,
              private keyboardManagerService: KeyboardManagerService,
              public gridManagerService: GridManagerService,
              public svgComponentsManagerService: SvgComponentsManagerService,
              public dialog: MatDialog,
  ) {
    this.dialogRef.beforeClosed().subscribe( () => {
      this.keyboardManagerService.enableShortcuts = true;
    });
  }

  ngOnInit(): void {
    this.keyboardManagerService.enableShortcuts = false;

    const MAX_PERCENT = 100;
    this.maxOpacity = Math.ceil(GridManagerService.MAX_OPACITY * MAX_PERCENT);
    this.minOpacity = Math.floor(GridManagerService.MIN_OPACITY * MAX_PERCENT);
    this.initialOpacity = this.gridManagerService.getPrimaryOpacity();
    this.opacity = Math.ceil(this.initialOpacity * MAX_PERCENT);

    this.maxSize = GridManagerService.MAX_SIZE;
    this.minSize = GridManagerService.MIN_SIZE;
    this.initialSize = this.gridManagerService.getSize();
    this.size = this.initialSize;

    this.gridManagerService.setIsActive(true);
  }

  update(): void {
    const MAX_PERCENT = 100;
    this.gridManagerService.setPrimaryOpacity(Math.min(this.opacity / MAX_PERCENT, 1));
    this.gridManagerService.setSize(this.size);
  }

  saveSettings(): void {
    this.dialogRef.close();
  }

  cancel(): void {
    this.gridManagerService.setPrimaryOpacity(this.initialOpacity);
    this.gridManagerService.setSize(this.initialSize);
    this.dialogRef.close();

    this.gridManagerService.refreshGrid();
  }
}
