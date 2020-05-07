import { Component } from '@angular/core';

import { SvgPolylineProperties } from '../../../logic/svg/polyline/svg-polyline-properties';

@Component({
  // tslint:disable-next-line
  selector: 'svg:svg[app-svg-polyline]',
  templateUrl: './svg-polyline.component.html',
  styleUrls: ['./svg-polyline.component.scss'],
})
export class SvgPolylineComponent extends SvgPolylineProperties {

  constructor() { super(); }

}
