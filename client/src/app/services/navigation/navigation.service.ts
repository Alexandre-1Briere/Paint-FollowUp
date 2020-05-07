import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Paths } from '../../enums/paths';

@Injectable({
  providedIn: 'root',
})
export class NavigationService {

  constructor(private router: Router) { }

  navigate(path: Paths): void {
    const initialLocation = this.initialLocation();

    let routeExist = false;
    for (const elem of this.router.config) {
      if (elem.path === path) {
        routeExist = true;
      }
    }

    if (routeExist) {
      this.router.navigate(['/' + path]).then((() => {
        if (initialLocation === window.location.pathname) {
          this.reloadLocation();
        }
      })).catch((err) => {
        alert(err);
      });
    }
  }

  private initialLocation(): string {
    return window.location.pathname;
  }

  private reloadLocation(): void {
    window.location.reload();
  }
}
