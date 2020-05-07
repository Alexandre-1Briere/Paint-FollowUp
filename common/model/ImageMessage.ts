import { ImageModel } from './image.model';

export class ImageMessage {
    title: string;
    body: ImageModel[];

    static SUCCESS(images: ImageModel[], options ?: string) {
        return {
            title: 'SUCCESS' + (options !== undefined ? options : ''),
            body: images,
        } as ImageMessage;
    }

    static ERROR(options?: string) {
        return {
            title: 'ERROR' + (options !== undefined ? ' - ' + options : ''),
            body: [],
        };
    }
}
