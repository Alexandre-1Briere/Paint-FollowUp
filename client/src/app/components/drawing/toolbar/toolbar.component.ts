import { Location } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { toolsConfig } from '../../../constants/tool-config';
import { GridManagerService } from '../../../services/grid-manager/grid-manager.service';
import { SvgComponentsManagerService } from '../../../services/svg/svg-components-manager.service';
import { ToolManagerService } from '../../../services/tool-manager/tool-manager.service';
import { Tool } from '../../../services/tool-manager/tools/tool/tool';
import { tools } from '../../../services/tool-manager/tools/tools';
import { SvgUndoRedoService } from '../../../services/undo-redo/svg-undo-redo.service';
import { UseGuideService } from '../../../services/use-guide/use-guide.service';
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

  constructor(private toolManagerService: ToolManagerService,
              private useGuideService: UseGuideService,
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

  undo(): void {
    this.undoRedoService.undo();
  }

  redo(): void {
    this.undoRedoService.redo();
  }

  toggleGrid(): void {
    this.gridManagerService.toggleIsActive();
  }
}
