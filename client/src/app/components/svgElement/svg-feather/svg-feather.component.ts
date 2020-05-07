import { Component} from '@angular/core';
import { SvgFeatherProperties } from '../../../logic/svg/feather/svg-feather-properties';

@Component({
  selector: 'svg:svg[app-svg-feather]',
  templateUrl: './svg-feather.component.html',
  styleUrls: ['./svg-feather.component.scss']
})
export class SvgFeatherComponent extends SvgFeatherProperties {

  constructor( ) { super(); }

}
