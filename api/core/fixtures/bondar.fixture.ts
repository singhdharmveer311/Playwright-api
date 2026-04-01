import {test as base} from '@playwright/test'
import { RequestHandler } from '../utils/request-handler'
import {APILogger} from '../logger/APILogger'

export type TestOptions = {
    api: RequestHandler; 
    logger: APILogger;
}

export const test = base.extend<TestOptions>({
    api: async({request}, use)=> {
        const defaultBaseURL = 'https://conduit-api.bondaracademy.com/api';
        const requestHandler = new RequestHandler(request, defaultBaseURL, );
        await use(requestHandler);
    }

})