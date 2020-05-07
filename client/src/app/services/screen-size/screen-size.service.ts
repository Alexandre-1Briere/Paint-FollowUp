import { Injectable } from '@angular/core';
import { TOOLBAR_WIDTH, TOOLDETAIL_WIDTH } from '../../constants/size';

@Injectable({
  providedIn: 'root',
})
export class ScreenSizeService {
  screenHeight: number;
  screenWidth: number;

  constructor() {
    this.queryScreenSize();
  }

  queryScreenSize(): number[] {
    this.screenHeight = window.innerHeight;
    this.screenWidth = window.innerWidth;
    return this.getScreenSize();
  }

  getScreenSize(): number[] {
    const screenSize: number[] = [];
    screenSize.push(Math.floor(this.screenWidth - TOOLBAR_WIDTH - TOOLDETAIL_WIDTH));
    screenSize.push(this.screenHeight);
    return screenSize;
  }

  getScreenWidth(): number {
    return this.queryScreenSize()[0];
  }

  getScreenHeight(): number {
    return this.queryScreenSize()[1];
  }
}
