import {test as base, Config} from '@playwright/test';
import { RequestHandler } from '../utils/request-handler';
import {APILogger} from '../utils/APILogger';
import {setCustomExpectLogger} from '../utils/custom-expect';
import {config} from '../../api-test.config';

export type TestOptions = {
    api: RequestHandler;
    config: typeof config;
}

export const test = base.extend<TestOptions>({
    api: async({request}, use)=> {
        const defaultBaseURL = 'https://conduit-api.bondaracademy.com/api';
        const logger = new APILogger();
        setCustomExpectLogger(logger);
        const requestHandler = new RequestHandler(request, defaultBaseURL, logger);
        await use(requestHandler);
    }, 
    config: async({}, use) => {
        await use(config)
    }

})

