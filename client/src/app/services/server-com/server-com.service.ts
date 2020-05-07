import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ServerComService {
  static readonly BASE_URL: string = 'http://localhost:3000';
}
