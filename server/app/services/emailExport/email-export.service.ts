import axios from 'axios';
import { injectable } from 'inversify';
import { EmailableImage } from '../../../../common/model/EmailableImage';

type post = 'POST';

@injectable()
export class EmailExportService {
    emailImage(image: EmailableImage): Promise<void> {
        // tslint:disable-next-line:no-require-imports
        const FormData = require('form-data');
        const buff = this.convertToBuffer(image.dataUrl, image.type);
        const formData = new FormData();

        formData.append('to', image.destination);
        formData.append('payload', buff, {
            contentType: image.type,
            filename: image.name,
            knownLength: buff.byteLength,
        });

        const headers = formData.getHeaders();
        const config = {
            hostname: 'https://log2990.step.polymtl.ca',
            path: '/email',
            method: 'POST' as post,
            headers: {
                'Content-Type': 'multipart/form-data',
                'X-Team-Key': process.env.team_key,
                ...headers,
            },
        };

        return axios.post('https://log2990.step.polymtl.ca/email', formData, config);
    }

    convertToBuffer(data: string, type: string): Buffer {
        if (type === 'image/svg+xml') {
            const svgArr = decodeURIComponent(data).split(',');
            svgArr.splice(0, 1);
            return Buffer.from(svgArr.join(','), 'utf8');
        } else {
            return Buffer.from(data.split(',')[1], 'base64');
        }
    }
}
