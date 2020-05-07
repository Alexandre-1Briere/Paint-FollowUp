import { Component } from '@angular/core';
import { SvgAerosolProperties } from '../../../../logic/svg/aerosol/svg-aerosol-properties';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'svg:svg[app-svg-aerosol]',
  templateUrl: './svg-aerosol.component.html',
  styleUrls: ['./svg-aerosol.component.scss'] ,
})
export class SvgAerosolComponent extends SvgAerosolProperties {

  constructor( ) { super(); }

}
