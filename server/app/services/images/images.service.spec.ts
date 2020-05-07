/*ref : https://www.twilio.com/blog/2017/08/working-with-environment-variables-in-node-js.html
* :https://www.npmjs.com/package/mongo-unit
* */
/*.env: mongodb_uri=mongodb+srv://projet2:Ez0eK7OAH13VVTMG@cluster-projet-2-a4voy.azure.mongodb.net/database?retryWrites=true&w=majority

* */

import {ObjectID} from 'mongodb';
import { ImageModel } from '../../../../common/model/image.model';

import { ImagesService } from './images.service';
// tslint:disable-next-line:no-require-imports no-var-requires
const {expect} = require('chai');
// tslint:disable-next-line:no-require-imports no-var-requires
const mongoose = require('mongoose');
// tslint:disable-next-line:no-require-imports no-var-requires
const testData = require('./testData.json');

// tslint:disable-next-line:no-require-imports no-var-requires
const mongoUnit = require('mongo-unit');

const imagesService: ImagesService  = new ImagesService();

describe('Image service', () => {

    mongoUnit.start().then(() => {
        console.log('fake mongo is started: ', mongoUnit.getUrl());
        process.env.mongodb_uri = mongoUnit.getUrl(); // this var process.env.DATABASE_URL = will keep link to fake mongo
        run(); // this line start mocha tests
    });

    before(() =>
        mongoose.connect(process.env.mongodb_uri, { useNewUrlParser: true }),
    );
    beforeEach(() => mongoUnit.load(testData));
    afterEach(() => mongoUnit.drop());

    after(() => {
        mongoose.disconnect();
        console.log('stop');
        mongoose.disconnect();
        return mongoUnit.stop();
    });

    it('should get by id', () => {
        return imagesService.findById( new ObjectID('5e6fae5dfb0b8f0b34a0c09f'))
            .then((image: ImageModel) => {
                // tslint:disable-next-line:no-unused-expression
                expect(image).to.not.be.undefined;
            });
    });
    it('should get all tags', () => {
        return imagesService.getAllDistinctTags()
            .then((tags: []) => {
                expect(tags.length).to.equal(8);

            });
    });

    it('should get all images', () => {
        return imagesService.getAllImages()
            .then((images: ImageModel[]) => {
                expect(images.length).to.equal(9);

            });
    });

    it('find images by tag', () => {
        return imagesService.FindImagesByTag('scribbles')
            .then((images: ImageModel[]) => {
                expect(images.length).to.equal(2);

            });
    });

    it('update image', () => {
        return imagesService.getAllImages()
            .then((images: ImageModel[]) => images[0])
            .then((image: any) => {
                return imagesService.updateImage(image._id, {title: 'I have been changed'})
                    .then( () => {
                        return imagesService.getAllImages()
                            .then((images: ImageModel[]) => images[0])
                            // tslint:disable-next-line:no-shadowed-variable
                            .then((image: ImageModel) => {
                                expect(image.title).to.equal('I have been changed');
                            });
                    });
            });
    });

    it('delete image by id', () => {
        return imagesService.getAllImages()
            .then((images: ImageModel[]) => images[3])
            .then((image: any) => {
                return imagesService.deleteImageById(image._id)
                    .then( () => {
                        return imagesService.getAllImages()
                            .then((images: ImageModel[]) => {
                                expect(images.length).to.equal(8);
                            });
                    });
            });
    });

});
