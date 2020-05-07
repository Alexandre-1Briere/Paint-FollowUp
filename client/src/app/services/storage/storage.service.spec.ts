import { TestBed } from '@angular/core/testing';
import { DISABLE, ERROR,
  SESSION_STORAGE, TUTORIAL} from '../../../../../common/constant/client/service/cookies/constant';
import { StorageService } from './storage.service';

describe('StorageService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
    providers: [
      StorageService,
    ],
  });
    localStorage.clear();
    sessionStorage.clear();
});

  it('should be created', () => {
    const service: StorageService = TestBed.get(StorageService);
    expect(service).toBeTruthy();
  });

  it('add should add the a value linked with a name', () => {
    const service: StorageService = TestBed.get(StorageService);
    service.add(TUTORIAL, DISABLE);
    expect(localStorage.getItem(TUTORIAL)).toMatch(DISABLE);
  });

  it('add should add the a value to sessionStorage if specified', () => {
    const service: StorageService = TestBed.get(StorageService);
    service.add(TUTORIAL, DISABLE, SESSION_STORAGE);
    expect(sessionStorage.getItem(TUTORIAL)).toMatch(DISABLE);
  });

  it('delete should delete the a value linked to its name', () => {
    const service: StorageService = TestBed.get(StorageService);
    service.add(TUTORIAL, DISABLE);
    service.delete(TUTORIAL);
    expect(localStorage.getItem(TUTORIAL)).toBeNull();
  });

  it('delete should delete the a value from sessionStorage if specified', () => {
    const service: StorageService = TestBed.get(StorageService);
    service.add(TUTORIAL, DISABLE, SESSION_STORAGE);
    service.delete(TUTORIAL, SESSION_STORAGE);
    expect(sessionStorage.getItem(TUTORIAL)).toBeNull();
  });

  it('deleteAll should delete all values in the storage', () => {
    const service: StorageService = TestBed.get(StorageService);
    service.add(TUTORIAL, DISABLE);
    service.add(DISABLE, TUTORIAL);
    expect(localStorage.getItem(TUTORIAL)).toMatch(DISABLE);
    expect(localStorage.getItem(DISABLE)).toMatch(TUTORIAL);
    service.deleteAll();
    expect(localStorage.getItem(TUTORIAL)).toBeNull();
    expect(localStorage.getItem(DISABLE)).toBeNull();
  });

  it('deleteAll should delete all values in sessionStorage if specified', () => {
    const service: StorageService = TestBed.get(StorageService);
    service.add(TUTORIAL, DISABLE, SESSION_STORAGE);
    service.add(DISABLE, TUTORIAL, SESSION_STORAGE);
    expect(sessionStorage.getItem(TUTORIAL)).toMatch(DISABLE);
    expect(sessionStorage.getItem(DISABLE)).toMatch(TUTORIAL);
    service.deleteAll(SESSION_STORAGE);
    expect(sessionStorage.getItem(TUTORIAL)).toBeNull();
    expect(sessionStorage.getItem(DISABLE)).toBeNull();
  });

  it('get should return the value linked to its name or ERROR if the name ref does not exist', () => {
    const service: StorageService = TestBed.get(StorageService);
    expect(service.get(TUTORIAL)).toMatch(ERROR);
    service.add(TUTORIAL, DISABLE);
    expect(service.get(TUTORIAL)).toMatch(DISABLE);
  });

  it('get should return the value linked to its name or ERROR from sessionStorage if specified', () => {
    const service: StorageService = TestBed.get(StorageService);
    expect(service.get(TUTORIAL, SESSION_STORAGE)).toMatch(ERROR);
    service.add(TUTORIAL, DISABLE, SESSION_STORAGE);
    expect(service.get(TUTORIAL, SESSION_STORAGE)).toMatch(DISABLE);
  });

  it('exist should return true if the name is used to store data or false otherwise', () => {
    const service: StorageService = TestBed.get(StorageService);
    expect(service.exist(TUTORIAL)).toBeFalsy();
    service.add(TUTORIAL, DISABLE);
    expect(service.exist(TUTORIAL)).toBeTruthy();
  });

  it('exist should return true if the name is used to store data or false otherwise from sessionStorage if specified', () => {
    const service: StorageService = TestBed.get(StorageService);
    expect(service.exist(TUTORIAL, SESSION_STORAGE)).toBeFalsy();
    service.add(TUTORIAL, DISABLE, SESSION_STORAGE);
    expect(service.exist(TUTORIAL, SESSION_STORAGE)).toBeTruthy();
  });

});
