import { Component } from '@angular/core';

import { SvgSelectionProperties } from '../../../logic/svg/selection/svg-selection-properties';

@Component({
  // tslint:disable-next-line
  selector: 'svg:svg[app-svg-selection]',
  templateUrl: './svg-selection.component.html',
  styleUrls: ['./svg-selection.component.scss'],
})
export class SvgSelectionComponent extends SvgSelectionProperties {

  constructor() { super(); }

}
