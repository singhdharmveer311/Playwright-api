import {expect as baseExpect} from '@playwright/test'
import { APILogger } from './APILogger';


let apiLogger: APILogger
export function setCustomExpectLogger(logger: APILogger){
    apiLogger = logger;
}


declare global{
    namespace PlaywrightTest{
        interface Matchers<R, T> {
            shouldEqual(expected: T): R;
            customShouldBeLessThanOrEqual(expected: T): R;
        }
    }
}

export const expect = baseExpect.extend({
    shouldEqual(received: any, expected: any){
        let pass: boolean
        let logs: string = ''

        try {
            baseExpect(received).toEqual(expected);
            pass = true;
        } catch (error: any) {
            pass = false
            logs = apiLogger.getRecentLogs()
        }   

    const hint = this.isNot ? 'not' : ''
    const message  = this.utils.matcherHint("shouldEqual", undefined, undefined, { isNot: this.isNot }) +
          '\n\n' +
          `Expected: ${hint} ${this.utils.printExpected(expected)}\n` +
          `Received: ${this.utils.printReceived(received)}\n\n` +
          `Recent API Activity: \n${logs}`
    

    return {
        message: () => message,
        pass
    }
    },


    customShouldBeLessThanOrEqual(received: any, expect: any){
        let pass: boolean;
        let logs: string = ''


        try {
            baseExpect(received).toBeLessThanOrEqual(expect);
            pass = true;
        } catch (e: any) {
            pass = false;
            logs = apiLogger.getRecentLogs();
        }

        const hint = this.isNot ? 'not' : ''
        const message  = this.utils.matcherHint("shouldEqual", undefined, undefined, { isNot: this.isNot }) +
          '\n\n' +
          `Expected: ${hint} ${this.utils.printExpected(expect)}\n` +
          `Received: ${this.utils.printReceived(received)}\n\n` +
          `Recent API Activity: \n${logs}`

        return {
            message: () => message,
            pass
        }
    }
})