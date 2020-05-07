export interface EmailableImage {
    dataUrl: string;
    type: string;
    name: string;
    destination: string;
}

export const typeRegExp = new RegExp(/^image\/(jpeg|png|(svg\+xml))$/);
export const emailRegExp = new RegExp(/^[A-Z0-9._%+-]{1,32}@(?:[A-Z0-9-]{1,32}\.){1,4}[A-Z]{2,16}$/i);
