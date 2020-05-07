import { TestBed } from '@angular/core/testing';

import { ElementRef } from '@angular/core';
import { Filters } from '../../enums/filters';
import { Formats } from '../../enums/formats';
import { DrawingAccessorService } from '../current-drawing-accessor/drawing-accessor.service';
import { ImagesManagerService } from '../images-manager/images-manager.service';
import { DownloaderService } from './downloader.service';

// tslint:disable:no-any
// Reason: allow spyOn<any>
describe('DownloaderService', () => {
  let drawingAccessorService: DrawingAccessorService;
  let imagesManagerService: jasmine.SpyObj<ImagesManagerService>;
  let service: DownloaderService;

  beforeEach(() => {
    drawingAccessorService = new DrawingAccessorService();
    imagesManagerService = jasmine.createSpyObj('ImagesManagerService', ['emailImage']);
    drawingAccessorService.setTrackedDrawingRef(new ElementRef(document.createElement('SVG')));
    TestBed.configureTestingModule({
      providers: [
        { provide: ImagesManagerService, useValue: imagesManagerService }
      ]
    });
    service = TestBed.get(DownloaderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('#exportSVG should call triggerDownload when no email is passed', () => {
    const functName = 'exportSVG';
    const spy = spyOn<any>(service, 'triggerDownload');
    service[functName](drawingAccessorService.getCurrentDrawingElement(), '');
    expect(spy).toHaveBeenCalled();
  });

  it('#exportSVG should call triggerEmail when email is passed', () => {
    const functName = 'exportSVG';
    const spy = spyOn<any>(service, 'triggerEmail');
    service[functName](drawingAccessorService.getCurrentDrawingElement(), '', 'email');
    expect(spy).toHaveBeenCalled();
  });

  it('#exportBitMap should call accessAsCanvas when no email is passed', () => {
    const functName = 'exportBitMap';
    const spy = spyOn(service.currentDrawingAccessorService, 'accessAsCanvas').and.callThrough();
    service[functName](drawingAccessorService.getCurrentDrawingElement(), '', 'png');
    expect(spy).toHaveBeenCalled();
  });

  it('#exportBitMap should call accessAsCanvas when email is passed', () => {
    const functName = 'exportBitMap';
    const spy = spyOn(service.currentDrawingAccessorService, 'accessAsCanvas').and.callThrough();
    service[functName](drawingAccessorService.getCurrentDrawingElement(), '', 'png', 'email');
    expect(spy).toHaveBeenCalled();
  });

  it('#triggerDownload should call click', () => {
    const functName = 'triggerDownload';
    const spy = spyOn(document, 'createElement').and.callThrough();
    service[functName](new URL('http://google.com'), '');
    expect(spy).toHaveBeenCalled();
  });

  it('#exportDrawing should call nothing if the filter is null', () => {
    const spySvg = spyOn<any>(service, 'exportSVG');
    const spyBit = spyOn<any>(service, 'exportBitMap');
    service.exportDrawing(drawingAccessorService.getCurrentDrawingElement(), '', Formats.SVG, Filters.NOFILTER);
    expect(spySvg).not.toHaveBeenCalled();
    expect(spyBit).not.toHaveBeenCalled();
  });

  it('#exportFromCanvas() should call triggerDownload when no email is passed', () => {
    const functName = 'exportFromCanvas';
    const spy = spyOn<any>(service, 'triggerDownload');
    service[functName](document.createElement('canvas') as HTMLCanvasElement);
    expect(spy).toHaveBeenCalled();
  });

  it('#exportFromCanvas() should call triggerEmail when email is passed', () => {
    const functName = 'exportFromCanvas';
    const spy = spyOn<any>(service, 'triggerEmail');
    service[functName](document.createElement('canvas') as HTMLCanvasElement, 'email');
    expect(spy).toHaveBeenCalled();
  });

  it('#applyFilter should return null if the svg element got not id', () => {
    expect(service.applyFilter(drawingAccessorService.getCurrentDrawingElement(), Filters.NOFILTER)).toEqual(null);
  });

  it('#applyFilter should not return null if the svg element got an id', () => {
    const elements = document.createElement('svg');
    elements.id = 'svgDrawing';
    const child = document.createElement('g');
    child.id = 'svgDrawing';
    elements.appendChild(child);
    drawingAccessorService.setTrackedDrawingRef(new ElementRef(elements));
    expect(service.applyFilter(drawingAccessorService.getCurrentDrawingElement(), Filters.NOFILTER)).not.toEqual(null);
  });
  it('#applyFilter should not return null if the svg element got an id and a filter', () => {
    const elements = document.createElement('svg');
    elements.id = 'svgDrawing';
    const child = document.createElement('g');
    child.id = 'svgDrawing';
    elements.appendChild(child);
    drawingAccessorService.setTrackedDrawingRef(new ElementRef(elements));
    expect(service.applyFilter(drawingAccessorService.getCurrentDrawingElement(), Filters.GRAYSCALE)).not.toEqual(null);
  });

  it('#exportDrawing should call exportSVG if the type is svg', () => {
    const elements = document.createElement('svg');
    elements.id = 'svgDrawing';
    const child = document.createElement('g');
    child.id = 'svgDrawing';
    elements.appendChild(child);
    drawingAccessorService.setTrackedDrawingRef(new ElementRef(elements));
    const spy = spyOn<any>(service, 'exportSVG');
    service.exportDrawing(drawingAccessorService.getCurrentDrawingElement(), '', Formats.SVG, Filters.NOFILTER);
    expect(spy).toHaveBeenCalled();
  });
  it('#exportDrawing should call exportSVG if the type is png', () => {
    const elements = document.createElement('svg');
    elements.id = 'svgDrawing';
    const child = document.createElement('g');
    child.id = 'svgDrawing';
    elements.appendChild(child);
    drawingAccessorService.setTrackedDrawingRef(new ElementRef(elements));
    const spy = spyOn<any>(service, 'exportBitMap');
    service.exportDrawing(drawingAccessorService.getCurrentDrawingElement(), '', Formats.PNG, Filters.NOFILTER);
    expect(spy).toHaveBeenCalled();
  });
  it('#exportDrawing should call exportSVG if the type is jpeg', () => {
    const elements = document.createElement('svg');
    elements.id = 'svgDrawing';
    const child = document.createElement('g');
    child.id = 'svgDrawing';
    elements.appendChild(child);
    drawingAccessorService.setTrackedDrawingRef(new ElementRef(elements));
    const spy = spyOn<any>(service, 'exportBitMap');
    service.exportDrawing(drawingAccessorService.getCurrentDrawingElement(), '', Formats.JPEG, Filters.NOFILTER);
    expect(spy).toHaveBeenCalled();
  });

  it('#triggerEmail should call emailImage', () => {
    const functName = 'triggerEmail';
    service[functName]('url', 'type', 'name', 'email');
    expect(imagesManagerService.emailImage).toHaveBeenCalled();
  });
});
