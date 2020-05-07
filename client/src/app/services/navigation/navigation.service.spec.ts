import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Component, NgModule } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { Router, Routes } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Paths } from '../../enums/paths';
import { BoardUtilities } from '../../testHelpers/svgBoard/board-utilities.spec';
import { TestSpeedUpgrader } from '../../testHelpers/test-speed-upgrader.spec';
import { NavigationService } from './navigation.service';

// tslint:disable:max-classes-per-file
@Component({
  template: '<router-outlet></router-outlet>',
})
class MockRouterOutletComponent {
}

@Component({
  template: '',
})
class TestComponent {
}

const fakeRoutes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: Paths.HOME, component:  TestComponent},
  { path: Paths.DRAWING , component: TestComponent },
];

@NgModule({
  imports: [
    HttpClientTestingModule,
    MatDialogModule,
    RouterTestingModule.withRoutes(fakeRoutes),
  ],
  declarations: [
    MockRouterOutletComponent,
    TestComponent,
  ],
  bootstrap: [MockRouterOutletComponent],
})
export class TestModule {
}

const ROUTER = 'router';
const INITIAL_LOCATION = 'initialLocation';
const RELOAD_LOCATION = 'reloadLocation';
const ENOUGH_TIME_FOR_ROUTER_CHANGE = 50;

// tslint:disable:no-any
// Reason: allow spyOn<any>
describe('NavigationService', () => {
  let service: NavigationService;
  let mockRouterOutletFixture: ComponentFixture<MockRouterOutletComponent>;

  TestSpeedUpgrader.overWriteModuleResetForSpeedGain();

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        TestModule,
      ],
    }).compileComponents();

    BoardUtilities.readyAllToolServices();

    service = TestBed.get(NavigationService);
    service[ROUTER] = TestBed.get(Router);

    mockRouterOutletFixture = TestBed.createComponent(MockRouterOutletComponent);
    mockRouterOutletFixture.detectChanges();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('#navigate() works as expected', async () => {
    const spyRouter = spyOn(service[ROUTER], 'navigate').and.stub().and.returnValue(Promise.resolve(true));
    spyOn<any>(service, INITIAL_LOCATION).and.returnValue('WRONG/URL');

    service.navigate(Paths.DRAWING);
    await new Promise((resolve) => setTimeout(resolve, ENOUGH_TIME_FOR_ROUTER_CHANGE));
    expect(spyRouter).toHaveBeenCalled();
  });

  it('#navigate() calls reloadLocation() when already on drawing', async () => {
    spyOn(service[ROUTER], 'navigate').and.stub().and.returnValue(Promise.resolve(true));
    spyOn<any>(service, INITIAL_LOCATION).and.callFake(() => window.location.pathname);
    const spyOnReload = spyOn<any>(service, RELOAD_LOCATION).and.stub();

    service.navigate(Paths.DRAWING);
    await new Promise((resolve) => setTimeout(resolve, ENOUGH_TIME_FOR_ROUTER_CHANGE));
    expect(spyOnReload).toHaveBeenCalled();
  });

  it('#navigate() prints error when navigation does not exist', async () => {
    spyOn(service[ROUTER], 'navigate').and.stub().and.returnValue(Promise.reject('Not found'));
    const spyError = spyOn(window, 'alert').and.stub();

    service.navigate(Paths.DRAWING);
    await new Promise((resolve) => setTimeout(resolve, ENOUGH_TIME_FOR_ROUTER_CHANGE));
    expect(spyError).toHaveBeenCalled();
  });

  it('#initialLocation() works as expected', () => {
    expect(service[INITIAL_LOCATION]()).toBe(window.location.pathname);
  });

  // Window.location.reload is not testable; spyOn does not work and calling method directly breaks tests
  /*it('#reloadLocation() works as expected', () => {
    spyOn<any>(window.location, 'reload').and.stub();
    expect(service[RELOAD_LOCATION]()).toBe(window.location.pathname);
    expect(window.location.reload).toHaveBeenCalled();
  });*/
});
