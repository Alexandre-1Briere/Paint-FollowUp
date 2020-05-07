import { Component} from '@angular/core';
import { SvgStampProperties } from '../../../../logic/svg/stamp/svg-stamp-properties';

@Component({
  selector: 'svg:svg[app-svg-stamp]',
  templateUrl: './svg-stamp.component.html',
  styleUrls: ['./svg-stamp.component.scss']
})
export class SvgStampComponent extends SvgStampProperties {

  constructor() { super(); }

}
