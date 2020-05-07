import { Location } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { toolsConfig } from '../../../constants/tool-config';
import { ClipboardService } from '../../../services/clipboard/clipboard.service';
import { KeyboardManagerService } from '../../../services/events/keyboard-manager.service';
import { GridManagerService } from '../../../services/grid-manager/grid-manager.service';
import { SvgComponentsManagerService } from '../../../services/svg/svg-components-manager.service';
import { ToolManagerService } from '../../../services/tool-manager/tool-manager.service';
import { Tool } from '../../../services/tool-manager/tools/tool/tool';
import { tools } from '../../../services/tool-manager/tools/tools';
import { SvgUndoRedoService } from '../../../services/undo-redo/svg-undo-redo.service';
import { UseGuideService } from '../../../services/use-guide/use-guide.service';
import { DownloadDialogComponent } from '../../dialogs/download-dialog/download-dialog.component';
import { GalerieComponent } from '../../dialogs/galerie/galerie.component';
import { GridOptionsDialogComponent } from '../../dialogs/grid-options-dialog/grid-options-dialog.component';
import { SaveDrawingDialogComponent } from '../../dialogs/save-drawing-dialog/save-drawing-dialog.component';
import { Config } from '../tool-detail/applicable-setting.class';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
})
export class ToolbarComponent implements OnInit {

  @Output() selectingTool: EventEmitter<Config> = new EventEmitter();

  flattenToolsDictionary: Tool[];
  toolsDictionary: Tool[][];
  currentTool: Tool;
  toolIndex: number;

  cloudUploadEnabled: boolean;

  constructor(private clipboardService: ClipboardService,
              private toolManagerService: ToolManagerService,
              private useGuideService: UseGuideService,
              private keyboardManagerService: KeyboardManagerService,
              public gridManagerService: GridManagerService,
              public undoRedoService: SvgUndoRedoService,
              public location: Location,
              public svgComponentsManagerService: SvgComponentsManagerService,
              public dialog: MatDialog) {
    this.flattenToolsDictionary = [];
    this.gridManagerService.isActive = false;
  }

  ngOnInit(): void {
    const documented = this.useGuideService.getTools(false);
    for (const category of documented) {
      for (const document of category) {
        if (tools.has(document.name.toLowerCase())) {
          const tool = tools.get(document.name.toLowerCase());
          this.flattenToolsDictionary.push(tool);
        }
      }
    }
    this.toolIndex = 1;
    this.currentTool = this.flattenToolsDictionary[this.toolIndex];
    this.toolManagerService.setTool(this.currentTool);

    this.toolManagerService.getToolObs().subscribe(() => {
      this.setTool(this.toolManagerService.getTool());
    });

    this.createToolsDictionary();
    this.cloudUploadEnabled = true;
  }

  createToolsDictionary(): void {
    this.toolsDictionary = [];
    let lastCategory = '';

    for (const tool of this.flattenToolsDictionary) {
      if (tool.category !== lastCategory) {
        this.toolsDictionary.push([]);
      }

      const toolsDictLen = this.toolsDictionary.length;
      this.toolsDictionary[toolsDictLen - 1].push(tool);
      lastCategory = tool.category;
    }
  }

  setTool(tool: Tool): void {
    this.currentTool = tool;
    this.toolIndex = this.findCurrentToolIndex();

  }

  onToolClick(tool: Tool): void {
    this.setTool(tool);
    this.toolManagerService.setTool(this.currentTool);
    this.selectingTool.emit(toolsConfig[this.currentTool.name.toLowerCase()]);
  }

  findCurrentToolIndex(): number {
    return this.flattenToolsDictionary.indexOf(this.currentTool);
  }

  previousPage(): void {
      this.location.back();
  }

  loadPreviousPage(confirmed: boolean): void {
    if (confirmed) {
      this.svgComponentsManagerService.resetSvgComponents();
      this.location.back();
    }
  }

  cloudUpload(): void {
    this.cloudUploadEnabled = false;
    this.dialog.open(SaveDrawingDialogComponent).afterClosed().subscribe(this.onCloudUploadDialogClose);
  }

  private onCloudUploadDialogClose(): void {
    this.cloudUploadEnabled = true;
    this.undoRedoService.checkIfAnyUserChanges(true);
  }

  cloudDownload(): void {
    this.dialog.open(GalerieComponent);
  }

  undo(): void {
    this.undoRedoService.undo();
  }

  redo(): void {
    this.undoRedoService.redo();
  }

  duplicate(): void {
    const selection = this.clipboardService.getSelectionIfAvailable();
    if (!selection) { return; }
    selection.tryToDuplicateSelection();
  }

  copy(): void {
    const selection = this.clipboardService.getSelectionIfAvailable();
    if (!selection) { return; }
    selection.tryToCopySelection();
  }

  paste(): void {
    this.clipboardService.tryToPasteContent();
  }

  cut(): void {
    const selection = this.clipboardService.getSelectionIfAvailable();
    if (!selection) { return; }
    selection.tryToCutSelection();
  }

  delete(): void {
    const selection = this.clipboardService.getSelectionIfAvailable();
    if (!selection) { return; }
    selection.tryToDeleteSelection();
  }

  toggleGrid(): void {
    this.gridManagerService.toggleIsActive();
  }

  showGridOptions(): void {
    this.keyboardManagerService.enableShortcuts = false;
    this.dialog.open(GridOptionsDialogComponent);
  }

  openDownloadDialog(): void {
    this.dialog.open(DownloadDialogComponent);
  }
}
