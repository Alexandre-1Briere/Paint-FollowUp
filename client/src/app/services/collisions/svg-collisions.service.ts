import {Injectable} from '@angular/core';
import {SvgLayer, SvgStatus} from '../../enums/svg';
import {CollisionDetection} from '../../logic/collisions/detection/collision-detection';
import {PolygonCollidable} from '../../logic/collisions/polygon/polygon-collidable';
import {SvgBasicProperties} from '../../logic/svg/base-svg/svg-basic-properties';
import {SvgComponentsManagerService} from '../svg/svg-components-manager.service';

@Injectable({
  providedIn: 'root',
})
export class SvgCollisionsService {

  constructor(private svgComponentsManagerService: SvgComponentsManagerService) { }

  getSvgComponentsInContact(selection: PolygonCollidable): SvgBasicProperties[] {
    const length = this.svgComponentsManagerService.countAllSvg();
    const svgComponentsInContact = [];

    for (let index = 0; index < length; ++index) {
      const svgComponent = this.svgComponentsManagerService.getSvgComponent(index);

      if (svgComponent !== undefined && this.componentIsValid(svgComponent) &&
          CollisionDetection.checkCollidablesIntersection(svgComponent, selection)) {
        svgComponentsInContact.push(svgComponent);
      }
    }

    return svgComponentsInContact;
  }

  getTopSvgComponentInContact(cursor: PolygonCollidable): SvgBasicProperties | undefined {
    const topIndex = this.svgComponentsManagerService.countAllSvg() - 1;

    for (let index = topIndex; index >= 0; --index) {
      const svgComponent = this.svgComponentsManagerService.getSvgComponent(index);

      if (svgComponent !== undefined && this.componentIsValid(svgComponent) &&
          CollisionDetection.checkCollidablesIntersection(svgComponent, cursor)) {
        return svgComponent;
      }
    }

    return undefined;
  }

  private componentIsValid(svgComponent: SvgBasicProperties): boolean {
    return svgComponent.layer === SvgLayer.Stack && svgComponent.status === SvgStatus.Permanent;
  }
}
