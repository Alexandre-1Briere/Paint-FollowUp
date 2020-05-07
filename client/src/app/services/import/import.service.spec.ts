import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Component, NgModule } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { Routes } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { DrawingBoardComponent } from '../../components/drawing/work-board/drawing-board/drawing-board.component';
import { BoardUtilities } from '../../testHelpers/svgBoard/board-utilities.spec';
import { TestSpeedUpgrader } from '../../testHelpers/test-speed-upgrader.spec';
import { DrawingBaseParametersAccessorService } from '../drawing-base-parameters-accessor/drawing-base-parameters-accessor.service';
import { ExportService } from '../export/export.service';
import { Tool } from '../tool-manager/tools/tool/tool';
import { ImportService } from './import.service';

// tslint:disable:max-classes-per-file

@Component({
  template: `
    <router-outlet></router-outlet>`,
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
  { path: 'home', component:  TestComponent},
  { path: 'drawing' , component: TestComponent },
];

@NgModule({
  imports: [
    HttpClientTestingModule,
    MatDialogModule,
    RouterTestingModule.withRoutes(fakeRoutes),
  ],
  declarations: [
    DrawingBoardComponent,
    MockRouterOutletComponent,
    TestComponent,
  ],
  bootstrap: [MockRouterOutletComponent],
})

export class TestModule {
}

describe('ImportService', () => {
  let service: ImportService;
  let boardFixture: ComponentFixture<DrawingBoardComponent>;
  let drawingBoard: DrawingBoardComponent;
  let mockRouterOutletFixture: ComponentFixture<MockRouterOutletComponent>;
  TestSpeedUpgrader.overWriteModuleResetForSpeedGain();
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        TestModule,
      ],
    }).compileComponents();
    BoardUtilities.readyAllToolServices();
    boardFixture = TestBed.createComponent(DrawingBoardComponent);
    drawingBoard = boardFixture.componentInstance;
    Tool.SVG_COMPONENT_MANAGER.initialiseViewContainerRef(drawingBoard.rootSvg);
    boardFixture.detectChanges();
    Tool.CANVAS_SERVICE.setTrackedDrawingRef(drawingBoard.svgElement);
    drawingBoard.ngOnInit();
    service = TestBed.get(ImportService);
    mockRouterOutletFixture = TestBed.createComponent(MockRouterOutletComponent);
    mockRouterOutletFixture.detectChanges();
  });
  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  it('#loadImage() changes width, height and background-color of drawing board', () => {
    const CORRECT_WIDTH = 979;
    const CORRECT_HEIGHT = 751;
    const CORRECT_BACKGROUND_COLOR = 'ab0189';
    (TestBed.get(DrawingBaseParametersAccessorService) as DrawingBaseParametersAccessorService).setDrawingBaseParameters(
        CORRECT_WIDTH, CORRECT_HEIGHT, CORRECT_BACKGROUND_COLOR,
    );
    const image = (TestBed.get(ExportService) as ExportService).createImageModel('testTitle', ['testTag1', 'testTag2']);
    drawingBoard.width = 1;
    drawingBoard.height = 1;
    drawingBoard.backgroundColor = '#013489';
    service.loadImage(image);
    expect(drawingBoard.width).toBe(CORRECT_WIDTH);
    expect(drawingBoard.height).toBe(CORRECT_HEIGHT);
    expect(drawingBoard.backgroundColor).toBe(CORRECT_BACKGROUND_COLOR);
  });
  // Window.location.reload is not testable; spyOn does not work and calling method directly breaks tests
  // it('#reloadLocation() works as expected', () => {
  //   spyOn<any>(window.location, 'reload');
  //   expect(window.location.reload).toHaveBeenCalled();
  // });
});
