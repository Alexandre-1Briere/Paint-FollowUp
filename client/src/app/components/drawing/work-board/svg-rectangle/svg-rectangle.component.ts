import { Component } from '@angular/core';

import { SvgRectangleProperties } from '../../../../logic/svg/rectangle/svg-rectangle-properties';

@Component({
  selector: 'svg:svg[app-svg-rectangle]',
  templateUrl: './svg-rectangle.component.html',
  styleUrls: ['./svg-rectangle.component.scss'],
})
export class SvgRectangleComponent extends SvgRectangleProperties {

  constructor() { super(); }

}
