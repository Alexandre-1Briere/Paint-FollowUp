import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import * as cors from 'cors';
import * as express from 'express';
import { inject, injectable } from 'inversify';
import * as logger from 'morgan';
import { ImagesController } from './controllers/images.controller';
import Types from './types';
// tslint:disable-next-line:no-require-imports
require('dotenv').config();

// @ts-ignore
import * as mongoose from 'mongoose';

@injectable()
export class Application {
    private readonly internalError: number = 500;
    app: express.Application;

    constructor(
        @inject(Types.ImagesController) private imagesController: ImagesController,
    ) {
        this.app = express();
        this.config();
        this.bindRoutes();
    }

    private config(): void {
        this.app.use((req, res, next) => {
            res.setHeader('Access-Control_Allow_Origin', '*');
            res.setHeader('Access-Control_Allow_Headers', 'Origin, X-Requested-With, Content-Type, Accept');
            res.setHeader('Access-Control_Allow_Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
            next();
        });

        this.app.use(logger('dev'));
        this.app.use(bodyParser.json({ limit: '4mb' }));
        this.app.use(bodyParser.urlencoded({ extended: true }));
        this.app.use(cookieParser());

        this.app.use(cors());

        mongoose.connect(process.env.mongodb_uri, { useNewUrlParser: true })
            .then(() => console.log('Connected to database') )
            .catch(() => console.log('Connection failed!') );
    }

    bindRoutes(): void {
        this.app.use('/api/images', this.imagesController.router);
        this.errorHandling();
    }

    private errorHandling(): void {
        // When previous handlers have not served a request: path wasn't found
        this.app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
            const err: Error = new Error('Not Found');
            next(err);
        });

        // development error handler
        // will print stacktrace
        if (this.app.get('env') === 'development') {
            // tslint:disable-next-line:no-any
            this.app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
                res.status(err.status || this.internalError);
                res.send({
                    message: err.message,
                    error: err,
                });
            });
        }

        // production error handler
        // no stacktraces leaked to user (in production env only)
        // tslint:disable-next-line:no-any
        this.app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
            res.status(err.status || this.internalError);
            res.send({
                message: err.message,
                error: {},
            });
        });
    }
}
