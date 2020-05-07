import { Component } from '@angular/core';
import { SvgPolygonProperties } from '../../../logic/svg/polygon/svg-polygon-properties';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'svg:svg[app-svg-polygon]',
  templateUrl: './svg-polygon.component.html',
  styleUrls: ['./svg-polygon.component.scss'],
})
export class SvgPolygonComponent extends SvgPolygonProperties {

  constructor() {  super(); }

}
