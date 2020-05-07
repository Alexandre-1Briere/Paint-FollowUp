import { Choice } from './choice';

describe('Choice', () => {
  it('should create an instance', () => {
    expect(new Choice()).toBeTruthy();
  });

  it('#indexOf() should return undefined if the choice doesn\'t exist', () => {
    const choices: Choice[] = [
      {
        label: 'test',
        icon: undefined,
        displayLabel: undefined,
      },
      {
        label: 'test2',
        icon: undefined,
        displayLabel: undefined,
      },
      {
        label: 'test3',
        icon: undefined,
        displayLabel: undefined,
      },
    ];

    expect(Choice.indexOf(choices, 'test4')).toBe(undefined);
  });

  it('1indexOf() should return undefined if the parameter are undefined', () => {

    const choices: Choice[] = [
      {
        label: 'test',
        icon: undefined,
        displayLabel: undefined,
      },
      {
        label: 'test2',
        icon: undefined,
        displayLabel: undefined,
      },
      {
        label: 'test3',
        icon: undefined,
        displayLabel: undefined,
      },
    ];
    expect(Choice.indexOf(choices, undefined)).toBe(undefined);
    expect(Choice.indexOf(undefined, 'test')).toBe(undefined);
  });
});
