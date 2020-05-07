import * as chai from 'chai';
// tslint:disable-next-line:no-duplicate-imports
import {expect} from 'chai';
// tslint:disable-next-line:no-require-imports
import chaiHttp = require('chai-http');
import 'mocha';
/*import { Image } from '../MongooseModel/Image.schema';*/

describe('Image Controller ', ()  => {
    chai.use(chaiHttp);

    // beforeEach(  ( done)   => {
    //     // @ts-ignore
    //     Image.remove({}).then((res, err) => {
    //         console.log(res);
    //         done();
    //     });
    // });

    it('it should get all tags', async () => {
        const res = await chai.request('http://127.0.0.1:3000/api/images').get('/get/tags');
        expect(res.status).to.be.equal(200);
        expect(res.body).to.be.a('array');
    });

    it('no tags: return all images', async () => {
        const res = await chai.request('http://127.0.0.1:3000/api/images').get('/get/tag=');
        expect(res.status).to.be.equal(200);
    });

    it('a tag: return all images with the given tag', async () => {
        const res = await chai.request('http://127.0.0.1:3000/api/images').get('/get/tag=123');
        expect(res.status).to.be.equal(200);
    });

    it('a tag: return all images with the given tag', async () => {
        const res = await chai.request('http://127.0.0.1:3000/api/images').get('/get/tag=giggles');
        expect(res.status).to.be.equal(200);
    });

    it('update', async () => {
        const res = await chai.request('http://127.0.0.1:3000/api/images').post('/update').send({ id: '123' });
        expect(res.status).to.be.equal(500);
    });

    it('delete', async () => {
        const res = await chai.request('http://127.0.0.1:3000/api/images').delete('/id=123');
        expect(res.status).to.be.equal(500);
    });

});
