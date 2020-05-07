import { ElementRef, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DrawingAccessorService {

  private trackedDrawingRef: ElementRef;
  private lastCanvasedDrawing: SVGSVGElement;
  private lastCanvas: HTMLCanvasElement;

  constructor() { return; }

  setTrackedDrawingRef(svgDrawingRef: ElementRef): void {
    this.trackedDrawingRef = svgDrawingRef;
  }

  getCurrentDrawingElement(): SVGSVGElement {
    return this.trackedDrawingRef.nativeElement.cloneNode(true) as SVGSVGElement;
  }

  async accessAsCanvas(svg: SVGSVGElement, onCanvasLoad: (canvas: HTMLCanvasElement) => void): Promise<boolean> {
    return await this.promiseAccessAsCanvas(svg, onCanvasLoad);
  }

  private async promiseAccessAsCanvas(svg: SVGSVGElement, onCanvasLoad: (canvas: HTMLCanvasElement) => void): Promise<boolean> {
    return new Promise((resolve) => {
      const drawingAlreadyCanvased = (svg.isEqualNode(this.lastCanvasedDrawing));

      const data = (new XMLSerializer()).serializeToString(svg);
      const DOMURL = window.URL;

      const svgBlob = new Blob([data], {type: 'image/svg+xml;charset=utf-8'});
      const url = DOMURL.createObjectURL(svgBlob);
      const img = new Image();

      img.onload = (event) => {
        if (!drawingAlreadyCanvased) {
          const canvas = document.createElement('canvas');
          canvas.setAttribute('width', svg.width.baseVal.valueAsString + 'px');
          canvas.setAttribute('height', svg.height.baseVal.valueAsString + 'px');
          const ctx = canvas.getContext('2d');

          if (ctx !== null) {
            ctx.drawImage(img, 0, 0);
          }

          this.lastCanvas = canvas;
          this.lastCanvasedDrawing = svg;
        }

        DOMURL.revokeObjectURL(url);
        onCanvasLoad(this.lastCanvas);
        resolve(true);
      };

      img.src = url;
    });
  }
}
