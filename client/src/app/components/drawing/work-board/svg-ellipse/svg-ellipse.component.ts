import { Component } from '@angular/core';
import { SvgEllipseProperties } from '../../../../logic/svg/ellipse/svg-ellipse-properties';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'svg:svg[app-svg-ellipse]',
  templateUrl: './svg-ellipse.component.html',
  styleUrls: ['./svg-ellipse.component.scss'],
})
export class SvgEllipseComponent extends SvgEllipseProperties {

  constructor() { super(); }

  computeRX(): number {
    return this.width / 2;
  }

  computeRY(): number {
    return this.height / 2;
  }
}
