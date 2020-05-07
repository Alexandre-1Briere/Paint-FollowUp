import { ComponentFixture, getTestBed, TestBed } from '@angular/core/testing';

// tslint:disable:no-any

export class TestSpeedUpgrader {
    // Src: https://kunzleigh.com/speed-up-your-angular-test-cases/
    static overWriteModuleResetForSpeedGain(): void {
        const testBedApi: any = getTestBed();
        const originReset = TestBed.resetTestingModule;
        beforeAll(() => {
            TestBed.resetTestingModule();
            (TestBed.resetTestingModule as any) = () => {
                testBedApi._activeFixtures.forEach((fixture: ComponentFixture<any>) => fixture.destroy());
                testBedApi._instantiated = false;
            };
        });
        afterAll(() => {
            TestBed.resetTestingModule = originReset;
            TestBed.resetTestingModule();
        });
    }
}
