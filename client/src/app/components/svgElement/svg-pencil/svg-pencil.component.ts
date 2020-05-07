import { Component } from '@angular/core';

import { SvgPencilProperties } from '../../../logic/svg/base-pencil/svg-pencil-properties';

@Component({
  // tslint:disable-next-line
  selector: 'svg:svg[app-svg-pencil]',
  templateUrl: './svg-pencil.component.html',
  styleUrls: ['./svg-pencil.component.scss'],
})
export class SvgPencilComponent extends SvgPencilProperties {

  constructor() { super(); }

}
