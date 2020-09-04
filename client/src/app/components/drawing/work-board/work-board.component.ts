import { Component, OnInit } from '@angular/core';
import {DrawingComponent} from '../drawing.component';

@Component({
  selector: 'app-work-board',
  templateUrl: './work-board.component.html',
  styleUrls: ['./work-board.component.scss'],
})
export class WorkBoardComponent implements OnInit {

  maxSize: number;

  complementaryColor: string;
  constructor() {
    this.complementaryColor = DrawingComponent.DEFAULT_COMPLEMENTARY_COLOR;
  }
  ngOnInit(): void { return; }
}
