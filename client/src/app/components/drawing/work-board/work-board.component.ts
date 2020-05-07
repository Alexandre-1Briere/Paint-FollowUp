import { Component, HostListener, OnInit } from '@angular/core';
import { ScreenSizeService } from '../../../services/screen-size/screen-size.service';
import {DrawingComponent} from '../drawing.component';

@Component({
  selector: 'app-work-board',
  templateUrl: './work-board.component.html',
  styleUrls: ['./work-board.component.scss'],
})
export class WorkBoardComponent implements OnInit {

  maxSize: number;

  complementaryColor: string;
  constructor(public screenSizeService: ScreenSizeService, ) {
    this.complementaryColor = DrawingComponent.DEFAULT_COMPLEMENTARY_COLOR;
  }
  ngOnInit(): void { return; }

  @HostListener('window:resize', ['$event'])
  onResize(): void {
    this.maxSize = this.screenSizeService.getScreenWidth();
  }
}
