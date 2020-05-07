import { Component } from '@angular/core';
import { SvgBucketProperties } from '../../../logic/svg/bucket/svg-bucket-properties';

@Component({
  selector: 'svg:svg[app-svg-bucket]',
  templateUrl: './svg-bucket.component.html',
  styleUrls: ['./svg-bucket.component.scss']
})
export class SvgBucketComponent extends SvgBucketProperties {

  constructor() { super(); }

}
