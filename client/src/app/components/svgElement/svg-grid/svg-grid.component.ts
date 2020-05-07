import { Component } from '@angular/core';
import {SvgGridProperties} from '../../../logic/svg/grid/svg-grid-properties';

@Component({
  // tslint:disable-next-line
  selector: 'svg:svg[app-svg-grid]',
  templateUrl: './svg-grid.component.html',
  styleUrls: ['./svg-grid.component.scss'],
})
export class SvgGridComponent extends SvgGridProperties {

  constructor() { super(); }

}
