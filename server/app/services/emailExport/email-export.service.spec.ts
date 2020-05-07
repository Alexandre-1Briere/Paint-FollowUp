import axios from 'axios';
import 'reflect-metadata';
// import 'mocha';
import * as sinon from 'sinon';
import { EmailableImage } from '../../../../common/model/EmailableImage';
import { EmailExportService } from './email-export.service';

// tslint:disable-next-line:no-require-imports no-var-requires
// const {expect} = require('chai');

describe('EmailExport service', () => {

    let emailExportService: EmailExportService;

    beforeEach(() => {
        emailExportService = new EmailExportService();
    });

    afterEach( () => {
        sinon.restore();
    });

    it('emailImage should call axios.post', () => {
        const image = {
            name: 'validName',
            destination: 'js.lemaire13@gmail.com',
            type: 'image/jpeg',
            dataUrl: '',
        } as EmailableImage;

        const response = 'response';
        const resolved = new Promise((r) => r({ response }));
        sinon.stub(emailExportService, 'convertToBuffer').returns(Buffer.from(''));
        sinon.stub(axios, 'post').returns(resolved);
        emailExportService.emailImage(image);
    });

    it('convertToBuffer should call splice for image/svg+xml type', () => {
        const dataUrl = '';
        const dataType = 'image/svg+xml';

        sinon.stub(Array.prototype, 'splice').returns(['1', '2', '3', '4'] );
        emailExportService.convertToBuffer(dataUrl, dataType);
    });

    it('convertToBuffer should call split for image/jpeg type', () => {
        const dataUrl = '';
        const dataType = 'image/jpeg';

        sinon.stub(String.prototype, 'split').returns(['1', '2', '3', '4'] );
        emailExportService.convertToBuffer(dataUrl, dataType);
    });

    it('convertToBuffer should call split for image/jpeg type', () => {
        const dataUrl = '';
        const dataType = 'image/png';

        sinon.stub(String.prototype, 'split').returns(['1', '2', '3', '4'] );
        emailExportService.convertToBuffer(dataUrl, dataType);
    });
});
