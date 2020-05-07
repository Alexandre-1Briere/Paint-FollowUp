
export class ImageModel {
    static UNDEFINED_ID = 'UNDEFINED';

    id: string;
    title: string;
    tags: string[];
    date: Date;
    inlineSVG: string;
    serializedSVG: string;

    static validateId(id: string): boolean {
        return id.trim().length > 0;
    }

    static validateTitle(title: string): boolean {
        return title.trim().length > 0;
    }

    static validateTags(): boolean {
        return true;
    }

    static validateDate(date: Date): boolean {
        return date < (new Date());
    }

    static validateInlineSVG(): boolean {
        return true;
    }

    static validateSerializedSVG(serializedSVG: string): boolean {
        return serializedSVG.trim().length > 0;
    }
}
