import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Observable, Subject, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { EmailableImage } from '../../../../../common/model/EmailableImage';
import { ImageModel } from '../../../../../common/model/image.model';
import { ImageMessage } from '../../../../../common/model/ImageMessage';
import { MessageDialogComponent } from '../../components/dialogs/message-dialog/message-dialog.component';
import { ImportService } from '../import/import.service';
import { ServerComService } from '../server-com/server-com.service';

const HTTP_NOT_ACCEPTABLE = 406;

@Injectable({
  providedIn: 'root',
})
export class ImagesManagerService {

  static readonly ATTEMPTS_BEFORE_FAILURE: number = 2;

  savedObs: Subject<boolean>;

  isLoading: boolean;
  isModifying: boolean;

  serverIsAvailable: boolean;

  images: ImageModel[];
  imagesObs: Subject<ImageModel[]>;
  tags: string[];
  tagsObs: Subject<string[]>;

  constructor(public http: HttpClient,
              private importService: ImportService,
              public dialog: MatDialog) {
    this.imagesObs = new Subject<ImageModel[]>();
    this.tagsObs = new Subject<string[]>();
    this.savedObs = new Subject<boolean>();
    this.images = [];
    this.tags = [];

    this.isLoading = true;
    this.isModifying = false;
    this.serverIsAvailable = false;

    this.fetchTags();
    this.getImagesByTags([]);
  }

  fetchTags(): void {
    this.serverIsAvailable = false;
    const url = ServerComService.BASE_URL + '/api/images/get/tags';
    this.http.get<string[]>(url)
      .pipe(
        retry(ImagesManagerService.ATTEMPTS_BEFORE_FAILURE),
        catchError(this.handleErrors),
      )
      .subscribe((tags) => {
        this.tags = tags;
        this.tagsObs.next(this.tags);
        this.serverIsAvailable = true;
      }, (error) => {
        // no error dialog when loading tags
        this.handleErrors(error);
      });
  }

  getImagesByTags(tags: string[]): void {
    this.serverIsAvailable = false;
    this.isLoading = true;
    if (tags.length === 0) {
      const url = ServerComService.BASE_URL + '/api/images/get/tag=';
      this.http.get<ImageModel[]>(url)
        .pipe(
          retry(ImagesManagerService.ATTEMPTS_BEFORE_FAILURE),
          catchError(this.handleErrors),
        )
        .subscribe((data) => {
          this.isLoading = false;
          this.images = data as ImageModel[];
          this.imagesObs.next();
          this.serverIsAvailable = true;
        }, (error) => {
          this.isLoading = false;
          this.imagesObs.error(this.images);
          this.displayErrorMessage(
            'Une erreur est survenue lors de la requête des dessins.');
          this.handleErrors(error);
        });
    } else {
      tags = this.toLowerCase(tags);
      const tagsObs: Subject<number> = new Subject();
      tagsObs.subscribe((index) => {
        const url = ServerComService.BASE_URL + '/api/images/get/tag=' + tags[index];
        this.http.get<ImageMessage>(url)
          .pipe(
            retry(ImagesManagerService.ATTEMPTS_BEFORE_FAILURE),
            catchError(this.handleErrors),
          )
          .subscribe((data) => {
            if (0 === index) { this.images = []; }
            this.images = this.images.concat(data.body);
            if (index < tags.length - 1) {
              tagsObs.next(index + 1);
            } else {
              tagsObs.complete();
              this.isLoading = false;
              this.images = this.distinct(this.images);
              this.imagesObs.next();
              this.serverIsAvailable = true;
            }
          }, (error) => {
            this.isLoading = false;
            this.imagesObs.error(this.images);
            this.displayErrorMessage(
              'Une erreur est survenue lors de la requête des dessins.');
            this.handleErrors(error);
          });
      });
      tagsObs.next(0);
    }
  }

  updateImage(image: ImageModel): void {
    this.serverIsAvailable = false;
    this.isModifying = true;
    image.tags = this.toLowerCase(image.tags);
    const url = ServerComService.BASE_URL + '/api/images/update';
    this.http.post<ImageMessage>(url, image)
      .pipe(
        retry(ImagesManagerService.ATTEMPTS_BEFORE_FAILURE),
      )
      .subscribe((imageMessage: ImageMessage) => {
        this.isModifying = false;
        this.serverIsAvailable = true;
        if (imageMessage.body.length > 0) {
          this.importService.loadedImage = imageMessage.body[0];
          image.id = this.importService.loadedImage.id;
          this.savedObs.next(true);
        }
      }, (error) => {
        this.displayErrorMessage(
          'Une erreur est survenue lors de mise à jour du dessin.');
        this.handleErrors(error);
      });
  }

  deleteImage(id: string): void {
    this.serverIsAvailable = false;
    this.isModifying = true;
    const url = ServerComService.BASE_URL + '/api/images/id=' + id.toString();
    this.http.delete<ImageMessage>(url)
      .pipe(
        retry(ImagesManagerService.ATTEMPTS_BEFORE_FAILURE),
        catchError(this.handleErrors),
      )
      .subscribe((imageMessage: ImageMessage) => {
        this.isModifying = false;
        this.serverIsAvailable = true;
      }, (error) => {
        this.displayErrorMessage(
          'Une erreur est survenue lors de la supression du dessin.');
        this.handleErrors(error);
      });
  }

  distinct(images: ImageModel[]): ImageModel[] {
    const set: ImageModel[] = [];
    const map = new Map();
    for (const image of images) {
      if (!map.has(image.id)) {
        map.set(image.id, image);
        set.push(image);
      }
    }
    return set;
  }

  toLowerCase(arr: string[]): string[] {
    const newArr: string[] = [];
    for (const val of arr) {
      newArr.push(val.toLowerCase());
    }
    return newArr;
  }

  // src: https://angular.io/guide/http
  handleErrors(error: HttpErrorResponse): Observable<never> {
    /*if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
        // console.warn('An error is handled by IMS:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
        /!*console.warn(
          `Backend returned code ${error.status} to IMS, ` +
          `body was: ${error.error}`);*!/
    }*/
    // return an observable with a user-facing error message
    return throwError ('Something bad happened; please try again later.');
  }

  displayErrorMessage(content: string): void {
    const dialogOptions = new MatDialogConfig();
    dialogOptions.width = '400px';
    dialogOptions.data = content;
    this.dialog.open(MessageDialogComponent, dialogOptions);
  }

  emailImage(image: EmailableImage): void {
    this.serverIsAvailable = false;
    this.isModifying = true;
    const url = ServerComService.BASE_URL + '/api/images/email';
    this.http.post<EmailableImage>(url, image)
        .pipe(
            retry(0),
        )
        .subscribe(() => {
          this.isModifying = false;
          this.serverIsAvailable = true;
        }, (error: HttpErrorResponse) => {
          if (error.status === HTTP_NOT_ACCEPTABLE) {
            this.displayErrorMessage(
                'Mauvais paramètres. Le dessin n\'a pas pu être envoyé');
          } else {
            this.displayErrorMessage(
                'Échec. Le dessin n\'a pas pu être envoyé');
          }
          this.handleErrors(error);
        });
  }
}
