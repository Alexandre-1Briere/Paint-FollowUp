import { TestBed } from '@angular/core/testing';
import { AppModule } from '../../../../app.module';
import { Coords } from '../coords';
import { PotDePeinture } from './pot-de-peinture';

describe('PotDePeinture', () => {
  let pot: PotDePeinture;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppModule],
    }).compileComponents();
  });

  beforeEach(() => {
    pot = new PotDePeinture();
    const canvas = document.createElement('canvas');
    const canvasSize = 10;
    canvas.width = canvasSize;
    canvas.height = canvasSize;
    pot.coords = {x: 0, y: 0} as Coords;
    const context = canvas.getContext('2d');
    if (context) {
      pot.ctx = context;
    }
  });

  it('should create an instance', () => {
    expect(pot).toBeTruthy();
  });
});
