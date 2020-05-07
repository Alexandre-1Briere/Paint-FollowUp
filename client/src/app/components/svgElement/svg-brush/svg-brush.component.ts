import { Component } from '@angular/core';

import { SvgBrushProperties } from '../../../logic/svg/brush/svg-brush-properties';

@Component({
  // tslint:disable-next-line
  selector: 'svg:svg[app-svg-brush]',
  templateUrl: './svg-brush.component.html',
  styleUrls: ['./svg-brush.component.scss'],
})
export class SvgBrushComponent extends SvgBrushProperties {

  constructor() {
    super();
  }

}
