import { ComponentType } from '@angular/cdk/overlay';
import { TestBed } from '@angular/core/testing';

import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable, of } from 'rxjs';
import { ImageModel } from '../../../../../common/model/image.model';
import { MessageDialogComponent } from '../../components/dialogs/message-dialog/message-dialog.component';
import { ImportService } from '../import/import.service';
import { ServerComService } from '../server-com/server-com.service';
import { ImagesManagerService } from './images-manager.service';

const dialogRefStub = {
  open: () => dialogRefStub,
  close: () => dialogRefStub,
  beforeClosed(): Observable<undefined> {
    return of(undefined);
  },
  afterClosed(): Observable<undefined> {
    return of(undefined);
  },
};

const dialogStub = {
  open: (message: ComponentType<MessageDialogComponent>, dialogOptions: MatDialogConfig) => dialogRefStub,
  close: () => dialogRefStub,
};

const IMPORT_SERVICE = 'importService';

const BASE_IMAGE_URL = ServerComService.BASE_URL + '/api/images/';
const UPDATE = 'update';
const TAGS = 'get/tags';
const TAG = 'get/tag=';

const NUMBER_OF_TRIES = 3;
const TEST_IMAGE_NAME = 'testImage';
const TEST_IMAGE_MODEL = {
  id: '1',
  title: TEST_IMAGE_NAME,
  tags: [],
  date: new Date(),
  serializedSVG: 'a',
  inlineSVG: 'a',
};
const TEST_IMAGE_MODEL2 = {
  id: '2',
  title: TEST_IMAGE_NAME + '2',
  tags: ['tag1'],
  date: new Date(),
  serializedSVG: 'b',
  inlineSVG: 'b',
};
const TEST_IMAGE_MODEL3 = {
  id: '3',
  title: TEST_IMAGE_NAME + '3',
  tags: ['tag2'],
  date: new Date(),
  serializedSVG: 'c',
  inlineSVG: 'c',
};

describe('ImagesManagerService', () => {
  let service: ImagesManagerService;
  let httpMockClient: HttpClient;
  let httpMockController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule.withRoutes([]),
      ],
      providers: [
        ImportService,
        { provide: MatDialog, useValue: dialogStub },
        { provide: MatDialogRef, useValue: dialogRefStub },
      ],
    });

    service = TestBed.get(ImagesManagerService);
    httpMockClient = TestBed.get(HttpClient);
    httpMockController = TestBed.get(HttpTestingController);
    service.http = httpMockClient;
  });

  const testErrorHandling = (expectedURL: string, testDisplayError = true): void => {
    let displayErrorSpy;
    if (testDisplayError) {
      displayErrorSpy = spyOn(service, 'displayErrorMessage').and.stub();
    }
    const handleErrorSpy = spyOn(service, 'handleErrors').and.stub();

    for (let n = 0; n < NUMBER_OF_TRIES; ++n) {
      const requestSent = httpMockController.expectOne(expectedURL);
      requestSent.flush(null, {status: 500, statusText: 'Some server error'});
    }

    if (testDisplayError) {
      expect(displayErrorSpy).toHaveBeenCalledTimes(1);
    }
    expect(handleErrorSpy).toHaveBeenCalledTimes(1);
  };

  const cancelConstructorRequests = (): void => {
    const FETCH_URL = BASE_IMAGE_URL + TAGS;
    let requestsSent = httpMockController.match(FETCH_URL);
    for (const request of requestsSent) {
      request.flush([]);
    }

    const GET_IMAGES_URL = BASE_IMAGE_URL + TAG;
    requestsSent = httpMockController.match(GET_IMAGES_URL);
    for (const request of requestsSent) {
      request.flush([]);
    }
  };

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('#toLowerCase() should return a lower cased array', () => {
    const array = ['Abc'];
    const lowerArray = ['abc'];
    const emptyArray: string[] = [];
    expect(service.toLowerCase(array)).toEqual(lowerArray);
    expect(service.toLowerCase(emptyArray)).toEqual(emptyArray);
  });

  it('#distinct() should only return a set of distinct image', () => {
    const fixedDate1 = new Date();
    const fixedDate2 = new Date();
    const imagelist: ImageModel[] = [{
      id: '0',
      title: '0',
      tags: [],
      date: fixedDate1,
      serializedSVG: 'abc',
      inlineSVG: '',
    }, {
      id: '0',
      title: '0',
      tags: [],
      date: fixedDate1,
      serializedSVG: 'abc',
      inlineSVG: '',
    }, {
      id: '1',
      title: '1',
      tags: [],
      date: fixedDate2,
      serializedSVG: 'abcd',
      inlineSVG: 'abcd',
    }];
    const set: ImageModel[] = [
      {
        id: '0',
        title: '0',
        tags: [],
        date: fixedDate1,
        serializedSVG: 'abc',
        inlineSVG: '',
      }, {
        id: '1',
        title: '1',
        tags: [],
        date: fixedDate2,
        serializedSVG: 'abcd',
        inlineSVG: 'abcd',
      }];
    expect(service.distinct(imagelist)).toEqual(set);
  });

  it('#fetchTags() sends correct request when tags=[]', () => {
    cancelConstructorRequests();

    const EXPECTED_URL = BASE_IMAGE_URL + TAGS;
    service.fetchTags();

    const requestSent = httpMockController.expectOne(EXPECTED_URL);
    expect(requestSent.request.method).toBe('GET');

    requestSent.flush(['tag1', 'tag2']);
    expect(service.tags).toEqual(['tag1', 'tag2']);
    expect(service.serverIsAvailable).toBeTruthy();
  });

  it('#fetchTags() handles errors correctly and displays error after third try', async () => {
    cancelConstructorRequests();

    const EXPECTED_URL = BASE_IMAGE_URL + TAGS;
    service.fetchTags();
    testErrorHandling(EXPECTED_URL, false);
  });

  it('#getImagesByTags() sends correct request when tags=[]', () => {
    cancelConstructorRequests();

    const EXPECTED_URL = BASE_IMAGE_URL + TAG;
    service.getImagesByTags([]);

    const requestSent = httpMockController.expectOne(EXPECTED_URL);
    expect(requestSent.request.method).toBe('GET');

    requestSent.flush([TEST_IMAGE_MODEL]);
    expect(service.isModifying).toBeFalsy();
    expect(service.serverIsAvailable).toBeTruthy();
  });

  it('#getImagesByTags() finished request with valid state when tags has values', () => {
    cancelConstructorRequests();

    const EXPECTED_URL = BASE_IMAGE_URL + TAG;
    service.getImagesByTags(['tag1', 'tag2']);

    let requestSent = httpMockController.expectOne(EXPECTED_URL + 'tag1');
    requestSent.flush({title: 'tag1', body: [TEST_IMAGE_MODEL2]});

    requestSent = httpMockController.expectOne(EXPECTED_URL + 'tag2');
    const imagesObsSpy = spyOn(service.imagesObs, 'next').and.stub();
    const distinctSpy = spyOn(service, 'distinct').and.callThrough();
    requestSent.flush({title: 'tag2', body: [TEST_IMAGE_MODEL, TEST_IMAGE_MODEL3]});
    expect(imagesObsSpy).toHaveBeenCalled();
    expect(distinctSpy).toHaveBeenCalled();
    const COMPONENT_COUNT = 3;
    expect(service.images.length).toBe(COMPONENT_COUNT);
  });

  it('#getImagesByTags() sends information correctly after success when tags=[]', () => {
    cancelConstructorRequests();

    const EXPECTED_URL = BASE_IMAGE_URL + TAG;
    service.getImagesByTags([]);

    const requestSent = httpMockController.expectOne(EXPECTED_URL);
    const imagesObsSpy = spyOn(service.imagesObs, 'next').and.stub();
    requestSent.flush([TEST_IMAGE_MODEL]);

    expect(service.images).toEqual([TEST_IMAGE_MODEL]);
    expect(imagesObsSpy).toHaveBeenCalled();
  });

  it('#getImagesByTags() starts with correctState', () => {
    cancelConstructorRequests();

    service.getImagesByTags([]);
    expect(service.isLoading).toBeTruthy();
    expect(service.serverIsAvailable).toBeFalsy();
  });

  it('#getImagesByTags() starts with correctState when tags has values', () => {
    cancelConstructorRequests();

    service.getImagesByTags(['tag1', 'tag2']);
    expect(service.isLoading).toBeTruthy();
    expect(service.serverIsAvailable).toBeFalsy();
  });

  it('#getImagesByTags() handles errors correctly when tags=[] and displays error after third try', async () => {
    cancelConstructorRequests();

    const EXPECTED_URL = BASE_IMAGE_URL + TAG;
    service.getImagesByTags([]);

    const imagesObsSpy = spyOn(service.imagesObs, 'error').and.stub();
    testErrorHandling(EXPECTED_URL);
    expect(service.isLoading).toBeFalsy();
    expect(imagesObsSpy).toHaveBeenCalledWith([]);
  });

  it('#getImagesByTags() handles errors correctly when tags has value and displays error after third try', async () => {
    cancelConstructorRequests();

    const EXPECTED_URL = BASE_IMAGE_URL + TAG + 'tag1';
    service.getImagesByTags(['tag1']);

    const imagesObsSpy = spyOn(service.imagesObs, 'error').and.stub();
    testErrorHandling(EXPECTED_URL);
    expect(service.isLoading).toBeFalsy();
    expect(imagesObsSpy).toHaveBeenCalledWith([]);
  });

  it('#updateImage() sends correct request', () => {
    const EXPECTED_URL = BASE_IMAGE_URL + UPDATE;

    service.updateImage(TEST_IMAGE_MODEL);

    const requestSent = httpMockController.expectOne(EXPECTED_URL);
    expect(requestSent.request.method).toBe('POST');

    requestSent.flush({tile: 'Succès!', body: TEST_IMAGE_MODEL});
    expect(service.isModifying).toBeFalsy();
    expect(service.serverIsAvailable).toBeTruthy();
  });

  it('#updateImage() updates image correctly', () => {
    const EXPECTED_URL = BASE_IMAGE_URL + UPDATE;

    service.updateImage(TEST_IMAGE_MODEL);

    const saveSpy = spyOn(service.savedObs, 'next');
    const requestSent = httpMockController.expectOne(EXPECTED_URL);
    requestSent.flush({tile: 'Succès!', body: [TEST_IMAGE_MODEL]});

    const LOADED_IMAGE = service[IMPORT_SERVICE].loadedImage;
    expect(LOADED_IMAGE).toEqual(TEST_IMAGE_MODEL);
    if (LOADED_IMAGE !== undefined) {
      expect(LOADED_IMAGE.id).toEqual(TEST_IMAGE_MODEL.id);
    }
    expect(saveSpy).toHaveBeenCalled();
  });

  it('#updateImage() starts with correctState', () => {
    service.updateImage(TEST_IMAGE_MODEL);
    expect(service.isModifying).toBeTruthy();
    expect(service.serverIsAvailable).toBeFalsy();
  });

  it('#updateImage() handles errors correctly and displays error after third try', async () => {
    const EXPECTED_URL = BASE_IMAGE_URL + UPDATE;
    service.updateImage(TEST_IMAGE_MODEL);
    testErrorHandling(EXPECTED_URL);
  });

  it('#deleteImage() sends correct request', () => {
    const EXPECTED_URL = BASE_IMAGE_URL + 'id=' + TEST_IMAGE_NAME;
    service.deleteImage(TEST_IMAGE_NAME);

    const requestSent = httpMockController.expectOne(EXPECTED_URL);
    expect(requestSent.request.method).toBe('DELETE');

    requestSent.flush('Success!');
    expect(service.isModifying).toBeFalsy();
    expect(service.serverIsAvailable).toBeTruthy();
  });

  it('#deleteImage() starts with correctState', () => {
    service.deleteImage(TEST_IMAGE_NAME);
    expect(service.isModifying).toBeTruthy();
    expect(service.serverIsAvailable).toBeFalsy();
  });

  it('#deleteImage() handles errors correctly and displays error after third try', async () => {
    const EXPECTED_URL = BASE_IMAGE_URL + 'id=' + TEST_IMAGE_NAME;
    service.deleteImage(TEST_IMAGE_NAME);
    testErrorHandling(EXPECTED_URL);
  });

  it('#displayErrorMessage() sends correct information', () => {
    const DIALOG = 'dialog';
    const CONTENT = 'Some error';
    const openSpy = spyOn(service[DIALOG], 'open');
    service.displayErrorMessage(CONTENT);

    const expectedDialogOptions = new MatDialogConfig();
    expectedDialogOptions.width = '400px';
    expectedDialogOptions.data = CONTENT;
    expect(openSpy).toHaveBeenCalledWith(MessageDialogComponent, expectedDialogOptions);
  });

  it('#displayErrorMessage should open a dialog', () => {
    const spy = spyOn(service.dialog, 'open');
    service.displayErrorMessage('idk');
    expect(spy).toHaveBeenCalled();
  });
});
// tslint:disable-next-line:max-file-line-count
// since it is just a test file not a functionality file
