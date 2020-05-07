import {TestBed} from '@angular/core/testing';
import {KEY_DOWN, KEY_UP} from '../../../../../constants/keyboard';
import {KeyboardKey} from '../../../../../enums/keyboard';
import {KeyboardState} from '../../../../../logic/events/keyboard/keyboard-state';
import {SvgRectangleProperties} from '../../../../../logic/svg/rectangle/svg-rectangle-properties';
import {SvgTransformationService} from '../../../../svg-transformation/svg-transformation.service';
import {Tool} from '../../tool/tool';
import {KeyboardTranslator} from './keyboard-translator';

const EXPECTED_TRANSLATION_STEP = 3;
const EXPECTED_INITIAL_DELAY = 500;
const EXPECTED_SUBSEQUENT_DELAY = 100;

describe('KeyboardTranslator', () => {
  let keyboardTranslator: KeyboardTranslator;
  let keyboardState: KeyboardState;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SvgTransformationService],
    }).compileComponents();

    keyboardTranslator = new KeyboardTranslator();
    keyboardState = new KeyboardState();

    Tool.SVG_TRANSFORMATION_SERVICE = TestBed.get(SvgTransformationService);
  });

  afterEach(() => {
    keyboardTranslator.terminate();
  });

  const updateKeyboardKey = (keyboardKey: KeyboardKey, newKeyState: string): void => {
    const keyEvent = new KeyboardEvent(newKeyState, {key: keyboardKey.toString()});
    keyboardState.update(keyEvent);
    keyboardTranslator.update(keyboardState);
  };

  const getMockComponent = (): SvgRectangleProperties => {
    const svgRectangleProperties = new SvgRectangleProperties();
    svgRectangleProperties.fitExactlyInside(0, 0, 0, 0);
    return svgRectangleProperties;
  };

  const beginMultipleTranslations = (keyboardKey: KeyboardKey,
                                     howManySubsequentTranslations: number): SvgRectangleProperties => {
    jasmine.clock().install();

    const mockComponent = getMockComponent();
    keyboardTranslator.begin([mockComponent], keyboardState);
    updateKeyboardKey(keyboardKey, KEY_DOWN);
    keyboardTranslator.update(keyboardState);

    jasmine.clock().tick(EXPECTED_INITIAL_DELAY);
    for (let index = 0; index < howManySubsequentTranslations; ++index) {
      jasmine.clock().tick(EXPECTED_SUBSEQUENT_DELAY);
    }
    jasmine.clock().uninstall();

    return mockComponent;
  };

  it('should create an instance', () => {
    expect(keyboardTranslator).toBeTruthy();
  });

  it('#isInUse() returns false before begin()', () => {
    expect(keyboardTranslator.isInUse()).toBeFalsy();
  });

  it('#begin() calls reset to prevent faulty behavior', () => {
    spyOn(keyboardTranslator, 'reset');
    keyboardTranslator.begin([], keyboardState);
    expect(keyboardTranslator.reset).toHaveBeenCalled();
  });

  it('#begin() applies initial translation with left arrow', () => {
    updateKeyboardKey(KeyboardKey.Left, KEY_DOWN);
    const mockComponent = getMockComponent();
    keyboardTranslator.begin([mockComponent], keyboardState);
    expect(mockComponent.getCenter().x).toBe(-EXPECTED_TRANSLATION_STEP);
    expect(mockComponent.getCenter().y).toBe(0);
  });

  it('#begin() applies initial translation with right arrow', () => {
    updateKeyboardKey(KeyboardKey.Right, KEY_DOWN);
    const mockComponent = getMockComponent();
    keyboardTranslator.begin([mockComponent], keyboardState);
    expect(mockComponent.getCenter().x).toBe(EXPECTED_TRANSLATION_STEP);
    expect(mockComponent.getCenter().y).toBe(0);
  });

  it('#begin() applies initial translation with up arrow', () => {
    updateKeyboardKey(KeyboardKey.Up, KEY_DOWN);
    const mockComponent = getMockComponent();
    keyboardTranslator.begin([mockComponent], keyboardState);
    expect(mockComponent.getCenter().x).toBe(0);
    expect(mockComponent.getCenter().y).toBe(-EXPECTED_TRANSLATION_STEP);
  });

  it('#begin() applies initial translation with down arrow', () => {
    updateKeyboardKey(KeyboardKey.Down, KEY_DOWN);
    const mockComponent = getMockComponent();
    keyboardTranslator.begin([mockComponent], keyboardState);
    expect(mockComponent.getCenter().x).toBe(0);
    expect(mockComponent.getCenter().y).toBe(EXPECTED_TRANSLATION_STEP);
  });

  it('#update() applies initial translation with left arrow', () => {
    const mockComponent = getMockComponent();
    keyboardTranslator.begin([mockComponent], keyboardState);
    updateKeyboardKey(KeyboardKey.Left, KEY_DOWN);
    keyboardTranslator.update(keyboardState);
    expect(mockComponent.getCenter().x).toBe(-EXPECTED_TRANSLATION_STEP);
    expect(mockComponent.getCenter().y).toBe(0);
  });

  it('#update() applies initial translation with right arrow', () => {
    const mockComponent = getMockComponent();
    keyboardTranslator.begin([mockComponent], keyboardState);
    updateKeyboardKey(KeyboardKey.Right, KEY_DOWN);
    keyboardTranslator.update(keyboardState);
    expect(mockComponent.getCenter().x).toBe(EXPECTED_TRANSLATION_STEP);
    expect(mockComponent.getCenter().y).toBe(0);
  });

  it('#update() applies initial translation with up arrow', () => {
    const mockComponent = getMockComponent();
    keyboardTranslator.begin([mockComponent], keyboardState);
    updateKeyboardKey(KeyboardKey.Up, KEY_DOWN);
    keyboardTranslator.update(keyboardState);
    expect(mockComponent.getCenter().x).toBe(0);
    expect(mockComponent.getCenter().y).toBe(-EXPECTED_TRANSLATION_STEP);
  });

  it('#update() applies initial translation with down arrow', () => {
    const mockComponent = getMockComponent();
    keyboardTranslator.begin([mockComponent], keyboardState);
    updateKeyboardKey(KeyboardKey.Down, KEY_DOWN);
    keyboardTranslator.update(keyboardState);
    expect(mockComponent.getCenter().x).toBe(0);
    expect(mockComponent.getCenter().y).toBe(EXPECTED_TRANSLATION_STEP);
  });

  it('#update() applies timer translations with left arrow properly', () => {
    const SUBSEQUENT_TRANSLATIONS = 2;
    const mockComponent = beginMultipleTranslations(KeyboardKey.Left, SUBSEQUENT_TRANSLATIONS);
    const EXPECTED_TOTAL_TRANSLATION = -EXPECTED_TRANSLATION_STEP * (2 + SUBSEQUENT_TRANSLATIONS);
    expect(mockComponent.getCenter().x).toBe(EXPECTED_TOTAL_TRANSLATION);
    expect(mockComponent.getCenter().y).toBe(0);
  });

  it('#update() applies timer translations with right arrow properly', () => {
    const SUBSEQUENT_TRANSLATIONS = 2;
    const mockComponent = beginMultipleTranslations(KeyboardKey.Right, SUBSEQUENT_TRANSLATIONS);
    const EXPECTED_TOTAL_TRANSLATION = EXPECTED_TRANSLATION_STEP * (2 + SUBSEQUENT_TRANSLATIONS);
    expect(mockComponent.getCenter().x).toBe(EXPECTED_TOTAL_TRANSLATION);
    expect(mockComponent.getCenter().y).toBe(0);
  });

  it('#update() applies timer translations with up arrow properly', () => {
    const SUBSEQUENT_TRANSLATIONS = 2;
    const mockComponent = beginMultipleTranslations(KeyboardKey.Up, SUBSEQUENT_TRANSLATIONS);
    const EXPECTED_TOTAL_TRANSLATION = -EXPECTED_TRANSLATION_STEP * (2 + SUBSEQUENT_TRANSLATIONS);
    expect(mockComponent.getCenter().x).toBe(0);
    expect(mockComponent.getCenter().y).toBe(EXPECTED_TOTAL_TRANSLATION);
  });

  it('#update() applies timer translations with down arrow properly', () => {
    const SUBSEQUENT_TRANSLATIONS = 2;
    const mockComponent = beginMultipleTranslations(KeyboardKey.Down, SUBSEQUENT_TRANSLATIONS);
    const EXPECTED_TOTAL_TRANSLATION = EXPECTED_TRANSLATION_STEP * (2 + SUBSEQUENT_TRANSLATIONS);
    expect(mockComponent.getCenter().x).toBe(0);
    expect(mockComponent.getCenter().y).toBe(EXPECTED_TOTAL_TRANSLATION);
  });

  it('#update() cancels further translations when keys are no longer pressed', () => {
    jasmine.clock().install();

    const mockComponent = getMockComponent();
    keyboardTranslator.begin([mockComponent], keyboardState);
    updateKeyboardKey(KeyboardKey.Right, KEY_DOWN);

    jasmine.clock().tick(EXPECTED_INITIAL_DELAY);
    jasmine.clock().tick(EXPECTED_SUBSEQUENT_DELAY);
    updateKeyboardKey(KeyboardKey.Right, KEY_UP);

    jasmine.clock().tick(EXPECTED_SUBSEQUENT_DELAY);
    jasmine.clock().tick(EXPECTED_SUBSEQUENT_DELAY);

    const EXPECTED_TOTAL_TRANSLATION = EXPECTED_TRANSLATION_STEP * (2 + 1);
    expect(mockComponent.getCenter().x).toBe(EXPECTED_TOTAL_TRANSLATION);
    expect(mockComponent.getCenter().y).toBe(0);

    jasmine.clock().uninstall();
  });

  it('#tryToTerminate() cancels further translations', () => {
    jasmine.clock().install();

    const mockComponent = getMockComponent();
    keyboardTranslator.begin([mockComponent], keyboardState);
    updateKeyboardKey(KeyboardKey.Left, KEY_DOWN);

    jasmine.clock().tick(EXPECTED_INITIAL_DELAY);
    jasmine.clock().tick(EXPECTED_SUBSEQUENT_DELAY);
    updateKeyboardKey(KeyboardKey.Left, KEY_UP);
    expect(keyboardTranslator.tryToTerminate()).toBeTruthy();

    jasmine.clock().tick(EXPECTED_SUBSEQUENT_DELAY);
    jasmine.clock().tick(EXPECTED_SUBSEQUENT_DELAY);

    const EXPECTED_TOTAL_TRANSLATION = -EXPECTED_TRANSLATION_STEP * (2 + 1);
    expect(mockComponent.getCenter().x).toBe(EXPECTED_TOTAL_TRANSLATION);
    expect(mockComponent.getCenter().y).toBe(0);

    jasmine.clock().uninstall();
  });

  it('#tryToTerminate() returns true before begin', () => {
    const mockComponent = getMockComponent();

    expect(keyboardTranslator.tryToTerminate()).toBeTruthy();
    keyboardTranslator.begin([mockComponent], keyboardState);
    expect(keyboardTranslator.tryToTerminate()).toBeTruthy();
  });

  it('#tryToTerminate() returns false when arrow is active', () => {
    const mockComponent = getMockComponent();

    keyboardTranslator.begin([mockComponent], keyboardState);
    updateKeyboardKey(KeyboardKey.Left, KEY_DOWN);
    expect(keyboardTranslator.tryToTerminate()).toBeFalsy();
    updateKeyboardKey(KeyboardKey.Left, KEY_UP);
    expect(keyboardTranslator.tryToTerminate()).toBeTruthy();
  });

  it('#translationTimerEvent() does not call continueTranslation when atLeastOneActive=false', () => {
    const TRANSLATION_TIMER_EVENT = 'translationTimerEvent';
    const CONTINUE_TRANSLATION_TIMER = 'continueTranslationTimer';
    // tslint:disable-next-line:no-any
    spyOn<any>(keyboardTranslator, CONTINUE_TRANSLATION_TIMER);
    keyboardTranslator[TRANSLATION_TIMER_EVENT]();
    expect(keyboardTranslator[CONTINUE_TRANSLATION_TIMER]).not.toHaveBeenCalled();
  });
});
