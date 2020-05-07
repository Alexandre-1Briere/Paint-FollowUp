import { Container } from 'inversify';
import { Application } from './app';
import { ImagesController } from './controllers/images.controller';
import { Server } from './server';
import { EmailExportService } from './services/emailExport/email-export.service';
import { ImagesService } from './services/images/images.service';
import Types from './types';

const container: Container = new Container();

container.bind(Types.Server).to(Server);
container.bind(Types.Application).to(Application);

container.bind(Types.ImagesController).to(ImagesController);
container.bind(Types.ImagesService).to(ImagesService);
container.bind(Types.EmailExportService).to(EmailExportService);

export { container };
