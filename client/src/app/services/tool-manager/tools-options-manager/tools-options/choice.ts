export class Choice {
  label: string | undefined;
  icon: string | undefined;
  displayLabel: boolean | undefined;

  static indexOf(choices: Choice[] | undefined, str: string | undefined): number | undefined {
    if (!choices || !str) { return undefined; }

    for (let index = 0; index < choices.length; index++) {
      if (choices[index].label === str) {
        return index;
      }
    }
    return undefined;
  }
}
