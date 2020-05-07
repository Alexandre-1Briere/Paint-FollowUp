import { injectable } from 'inversify';
import { ObjectID } from 'mongodb';
import 'reflect-metadata';
import { ImageModel } from '../../../../common/model/image.model';
import {Image} from '../../MongooseModel/Image.schema';

@injectable()
export class ImagesService {

    constructor() { return; }

    convertDocumentToImageModel(document: any) {
        return {
            id: document._id,
            title: document.title,
            tags: document.tags,
            date: new Date(document.date),
            inlineSVG: document.inlineSVG,
            serializedSVG: document.serializedSVG,
        } as ImageModel;
    }

    findById(id: ObjectID) {
        return Image.findById(id);
    }
    getAllDistinctTags() {
        return Image.distinct('tags');
    }

    getAllImages() {
        return Image.find();
    }

    FindImagesByTag(tag: string) {
        return Image.find({tags: tag});
    }

    updateImage(id: string, updatedImage: { title: string; tags?: string[]; date?: Date; inlineSVG?: string; serializedSVG?: string; }) {
        return Image.findOneAndUpdate({ _id: id }, updatedImage, { new: true });

    }

    deleteImageById(id: string) {
        return Image.findOneAndDelete({ _id: id });

    }
}
