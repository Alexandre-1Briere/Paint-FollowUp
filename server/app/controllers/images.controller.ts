import * as cors from 'cors';
import { Request, Response, Router } from 'express';
import { inject, injectable } from 'inversify';
import { ObjectID } from 'mongodb';
import { EmailableImage, emailRegExp, typeRegExp } from '../../../common/model/EmailableImage';
import { ImageModel } from '../../../common/model/image.model';
import { ImageMessage } from '../../../common/model/ImageMessage';
import { Image } from '../MongooseModel/Image.schema';
import { EmailExportService } from '../services/emailExport/email-export.service';
import { ImagesService } from '../services/images/images.service';
import Types from '../types';

// const HTTP_OK = 200;
const HTTP_CREATED = 201;
const HTTP_ACCEPTED = 202;
// const HTTP_NO_CONTENT = 204;

const HTTP_NOT_ACCEPTABLE = 406;

const HTTP_SERVER_ERROR = 500;
// const HTTP_SERVICE_UNAVAILABLE = 503;

@injectable()
export class ImagesController {
    router: Router;

    constructor(@inject(Types.ImagesService) private imagesService: ImagesService,
                @inject(Types.EmailExportService) private emailExportService: EmailExportService,
                ) {
        this.configureRouter();
    }

    private configureRouter(): void {
        this.router = Router();
        this.router.use(cors());

        this.router.get('/get/id=:id/svg', (req: Request, res: Response) => {
            this.imagesService.findById(new ObjectID(req.params.id))
                .then((document: any) => {
                    const image = this.imagesService.convertDocumentToImageModel(document);
                    res.send(image.inlineSVG.replace('xlink:href="data:img/png;base64,',
                        'xlink:href="data:image/png;base64,'));
                })
                .catch(() => {
                    console.error('Failed to fetch image svg using id');
                    res.json(ImageMessage.ERROR('Failed to fetch image svg using id'));
                });
        });
        this.router.get('/get/id=:id', (req: Request, res: Response) => {
                this.imagesService.findById(new ObjectID(req.params.id))
                .then((document: any) => {
                    console.log('found one');
                    res.json(this.imagesService.convertDocumentToImageModel(document));
                })
                .catch(() => {
                    console.error('Failed to fetch image using id');
                    res.json(ImageMessage.ERROR('Failed to fetch image using id'));
                });
        });

        // return all distinct tags
        this.router.get('/get/tags', (req: Request, res: Response) => {
            // Image.distinct('tags')
            this.imagesService.getAllDistinctTags()
                .then((tags: string[]) => {
                    res.json(tags);
                })
                .catch(() => {
                    console.error('Failed to fetch tags');
                    res.json(ImageMessage.ERROR('Failed to fetch tags'));
                });
        });
        // no tags: return all images
        this.router.get('/get/tag=', (req: Request, res: Response) => {
            const images: ImageModel[] = [];
            // Image.find()
            this.imagesService.getAllImages()
                .then((documents: any) => {
                    for (const document of documents) {
                        const image = this.imagesService.convertDocumentToImageModel(document);
                        images.push(image);
                    }
                    res.json(images);
                })
                .catch(() => {
                    console.error('Failed to fetch images using no tags');
                    res.json(ImageMessage.ERROR('Failed to fetch images using no tags'));
                });
        });
        // a tag: return all images with the given tag
        this.router.get('/get/tag=:tag', (req: Request, res: Response) => {
            const images: ImageModel[] = [];
            const tag = req.params.tag.toLowerCase();
            console.log('inside tags: tag=' + tag);
            // Image.find({ tags: tag })
            this.imagesService.FindImagesByTag(tag)
                .then((documents: any) => {
                    for (const document of documents) {
                        const image = this.imagesService.convertDocumentToImageModel(document);
                        images.push(image);
                    }
                    res.json({
                        title: 'Images with tag=' + req.params.tag,
                        body: images,
                    } as ImageMessage);
                })
                .catch(() => {
                    console.error('Failed to fetch images using tags');
                    res.json(ImageMessage.ERROR('Failed to fetch images using tags'));
                });
        });

        this.router.post('/update', (req: Request, res: Response) => {
            const image: ImageModel = req.body;

            if (!(ImageModel.validateTitle(image.title) &&
                ImageModel.validateTags(image.tags))) {
                res.status(HTTP_NOT_ACCEPTABLE)
                    .json('Image is invalid.');
                return;
            }

            if (image.id !== ImageModel.UNDEFINED_ID) {
                const update = {
                    title: image.title,
                    tags: image.tags,
                    date: image.date,
                    inlineSVG: image.inlineSVG,
                    serializedSVG: image.serializedSVG,
                };
                // Image.findOneAndUpdate({ _id: image.id }, update, { new: true })
                this.imagesService.updateImage(image.id, update)
                    .then(() => {
                        console.log('Updated an image with id: ' + image.id);
                        res.status(HTTP_ACCEPTED)
                            .json(ImageMessage.SUCCESS([image]));
                    })
                    .catch(() => {
                        console.error('Failed to update the image');
                        res.status(HTTP_SERVER_ERROR)
                            .json(ImageMessage.ERROR('Failed to update the image'));
                    });
            } else {
                const imageModel = new Image({
                    title: image.title,
                    tags: image.tags,
                    date: image.date,
                    inlineSVG: image.inlineSVG,
                    serializedSVG: image.serializedSVG,
                });
                imageModel.save()
                    .then((data: any) => {
                        image.id = data._id;
                        console.log('Created an image with id: ' + imageModel._id.toString());
                        res.status(HTTP_CREATED)
                            .json(ImageMessage.SUCCESS([image]));
                    })
                    .catch(() => {
                        console.error('Failed to create the image');
                        res.status(HTTP_SERVER_ERROR)
                            .json(ImageMessage.ERROR('Failed to create the image'));
                    });
            }
        });

        this.router.post('/email', (req: Request, res: Response) => {
            const image = req.body as EmailableImage;
            if (typeRegExp.test(image.type) && emailRegExp.test(image.destination)) {
                this.emailExportService.emailImage(image).then(() => {
                    console.log('Image successfully sent to mail API');
                    res.status(HTTP_ACCEPTED).json('Success');
                }).catch((error) => {
                    console.log(error);
                    res.status(HTTP_SERVER_ERROR).json('Failure');
                });
            } else {
                console.log('Invalid image parameters');
                res.status(HTTP_NOT_ACCEPTABLE).json('Failure');
            }
        });

        this.router.delete('/id=:id', (req: Request, res: Response) => {
            const id = req.params.id;
            // Image.findOneAndDelete({ _id: id })
            this.imagesService.deleteImageById(id)
                .then((data: any) => {
                    console.log(data);
                    res.status(HTTP_ACCEPTED)
                        .json(ImageMessage.SUCCESS([]));
                }, () => {
                    console.error('Failed to delete the image');
                    res.status(HTTP_SERVER_ERROR)
                        .json(ImageMessage.ERROR('Failed to delete to image'));
                });
        });

    }
}
