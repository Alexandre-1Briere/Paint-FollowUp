import {Location} from '@angular/common';
import {Component, HostListener, OnInit} from '@angular/core';
import {Documented} from '../../interfaces/documented';
import {KeyboardManagerService} from '../../services/events/keyboard-manager.service';
import {UseGuideService} from '../../services/use-guide/use-guide.service';

@Component({
  selector: 'app-use-guide',
  templateUrl: './use-guide.component.html',
  styleUrls: ['./use-guide.component.scss'],
})
export class UseGuideComponent implements OnInit {

  toolsDictionary: Documented[][];
  flattenToolsDictionary: Documented[];
  isOpenType: boolean[];
  documented: Documented;
  toolIndex: number;

  hasNext: boolean;
  hasPrevious: boolean;

  constructor(private useGuideService: UseGuideService,
              public location: Location,
              private keyboardManagerService: KeyboardManagerService) {
    this.toolsDictionary = [];
    this.flattenToolsDictionary = [];
    this.isOpenType = [];
  }

  ngOnInit(): void {
    const DEFAULT_DRAWERS_STATE = true;

    this.toolsDictionary = this.useGuideService.getTools();
    for (const category of this.toolsDictionary) {
      this.isOpenType.push(DEFAULT_DRAWERS_STATE);
      for (const tool of category) {
        this.flattenToolsDictionary.push(tool);
      }
    }
    this.toolIndex = 0;
    this.documented = this.flattenToolsDictionary[this.toolIndex];
    this.updateToolStatus();
  }

  updateToolStatus(): void {
    this.hasPrevious = 0 <= this.toolIndex - 1;
    this.hasNext =  this.toolIndex + 1 < this.flattenToolsDictionary.length;
  }

  @HostListener('window:keydown', ['$event'])
  @HostListener('window:keyup', ['$event'])
  onKeyboardEvent(event: KeyboardEvent): void {
    this.keyboardManagerService.receiveKeyboardEvent(event);
  }

  onToolClick(tool: Documented): void {
    this.documented = tool;
    this.toolIndex = this.findCurrentToolIndex();
    this.updateToolStatus();
  }

  previousPage(): void {
    this.location.back();
  }

  findCurrentToolIndex(): number {
    return this.flattenToolsDictionary.indexOf(this.documented);
  }

  setPreviousTool(): void {
    if (!this.hasPrevious) { return; }
    this.toolIndex = this.toolIndex - 1;
    this.documented = this.flattenToolsDictionary[this.toolIndex];
    this.updateToolStatus();
  }

  setNextTool(): void {
    if (!this.hasNext) { return; }
    this.toolIndex = this.toolIndex + 1;
    this.documented = this.flattenToolsDictionary[this.toolIndex];
    this.updateToolStatus();
  }
}
