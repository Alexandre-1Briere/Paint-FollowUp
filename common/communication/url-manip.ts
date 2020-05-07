import { ImageModel } from '../model/image.model';

export class MURL {

  static readonly AND = '/';
  static readonly MORE = ' ';

  static fromImage(image: ImageModel): string {
    let str = '';
    str += 'id=' + image.id;
    str += MURL.AND + 'titre=' + image.title;
    str += MURL.AND + 'tags=' + MURL.fromArray(image.tags);
    str += MURL.AND + 'date=' + MURL.fromDate(image.date);
    str += MURL.AND + 'svg=' + image.serializedSVG;
    return str;
  }

  static toImage(image: string): ImageModel {
    const data = image.split(MURL.AND);
    return {
        id: Number(data[0].substr(data[0].lastIndexOf('=') + 1)),
        title: data[1].substr(data[1].lastIndexOf('=') + 1),
        tags: MURL.toArray(data[2].substr(data[2].lastIndexOf('=') + 1)),
        date: MURL.toDate(data[3].substr(data[3].lastIndexOf('=') + 1)),
        serializedSVG: data[4].substr(data[4].lastIndexOf('=') + 1),
    } as ImageModel;
  }

  static fromArray(arr: string[]): string {
    return arr.join(MURL.MORE);
  }

  static toArray(str: string): string[] {
    return str.toLowerCase().split(MURL.MORE);
  }

  static fromDate(date: Date): string {
    return date.toString();
  }

  static toDate(date: string): Date {
      return new Date(date);
  }
}
