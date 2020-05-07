import { Injectable } from '@angular/core';
import { EmailableImage } from '../../../../../common/model/EmailableImage';
import { Filters } from '../../enums/filters';
import { Formats } from '../../enums/formats';
import { DrawingAccessorService } from '../current-drawing-accessor/drawing-accessor.service';
import { ImagesManagerService } from '../images-manager/images-manager.service';

@Injectable({
  providedIn: 'root',
})

export class DownloaderService {
  private currentName: string;
  private currentType: string;

  constructor(public currentDrawingAccessorService: DrawingAccessorService,
              public imagesManagerService: ImagesManagerService,
              ) {
    return;
  }

  applyFilter(svgDrawing: SVGSVGElement, filter: Filters): SVGSVGElement | null {
    const svgDrawingElements = svgDrawing.querySelector('#svgDrawing');
    if (svgDrawingElements !== null) {
      if (filter === Filters.NOFILTER) {
        svgDrawingElements.setAttribute('filter', '');
      } else {
        svgDrawingElements.setAttribute('filter', 'url(#' + filter + ')');
      }
      return svgDrawing as SVGSVGElement;
    } else {
      return null;
    }
  }

  exportDrawing(svgDrawing: SVGSVGElement, name: string, type: Formats, filter: Filters, email?: string): void {
    const filteredSvg = this.applyFilter(svgDrawing, filter);

    if (filteredSvg !== null) {
      switch (type) {
        case Formats.SVG:
          email ? this.exportSVG(filteredSvg, name, email) : this.exportSVG(filteredSvg, name);
          break;
        case Formats.JPEG:
        case Formats.PNG:
          email ? this.exportBitMap(filteredSvg, name, type, email) : this.exportBitMap(filteredSvg, name, type);
          break;
      }
    }
  }

  private exportBitMap(svg: SVGSVGElement, name: string, type: string, email?: string): void {
    this.currentName = name;
    this.currentType = type;
    email ?
    this.currentDrawingAccessorService.accessAsCanvas(svg, (canvas: HTMLCanvasElement) => this.exportFromCanvas(canvas, email)).then()
        : this.currentDrawingAccessorService.accessAsCanvas(svg, (canvas: HTMLCanvasElement) => this.exportFromCanvas(canvas)).then();
  }

  private exportFromCanvas(canvas: HTMLCanvasElement, email?: string): void {
    const imgURL = canvas.toDataURL('image/' + this.currentType);
    if (email) {
      this.triggerEmail(imgURL, 'image/' + this.currentType, this.currentName + '.' + this.currentType, email);
    } else {
      this.triggerDownload(new URL(imgURL), this.currentName + '.' + this.currentType);
    }
  }

  private exportSVG(svg: SVGSVGElement, name: string, email?: string): void {
    const data = (new XMLSerializer()).serializeToString(svg);
    const imgURL = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(data);
    if (email) {
      this.triggerEmail(imgURL, 'image/svg+xml', name + '.svg', email);
    } else {
      this.triggerDownload(new URL(imgURL), name + '.svg');
    }
  }

  private triggerDownload(imgURL: URL, imgName: string): void {
    const a = document.createElement('a');
    a.setAttribute('download', imgName);
    a.setAttribute('href', imgURL.toString());
    a.setAttribute('target', '_blank');
    a.click();
  }

  private triggerEmail(imgURL: string, imgType: string, imgName: string, destinationEmail: string): void {
    const emailableImage = {
      dataUrl: imgURL,
      type: imgType,
      name: imgName,
      destination: destinationEmail,
    } as EmailableImage;
    this.imagesManagerService.emailImage(emailableImage);
  }
}
