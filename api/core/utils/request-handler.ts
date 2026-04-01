import { APIRequest, APIRequestContext, request } from "playwright-core";
import { expect } from "playwright/test";
import { APILogger } from "../logger/APILogger";


// RequestHandler keeps the low-level Playwright request API in one place so tests can
// build requests fluently, execute HTTP methods, and get consistent logging/validation.
export class RequestHandler{

    // Playwright's HTTP client used to send API requests.
    private request: APIRequestContext;
    private baseURL: string; 
    // Default API host used unless a test overrides it with url().
    private defaultBaseURL: string;
    // These fields hold temporary request state while a test builds a request step by step.
    private apiPath: string = '';
    private apiParam: Record<string, string | number | boolean> = {};
    private apiHeaders: Record<string, string> = {};
    private apiBody: Record<string, unknown>  = {}
    // Shared logger used to record request/response activity for debugging.
    private logger: APILogger

    // Dependencies are injected once here so each method can reuse them instead of
    // receiving request, base URL, and logger again and again.
    constructor(request: APIRequestContext, newURL: string, logger: APILogger){
        this.request = request; 
        this.defaultBaseURL = newURL;
        this.logger = logger;
    }
    
    // Allows a test to override the default base URL when a different host is needed.
    url(url: string){
        this.baseURL = url; 
        return this; 
    }

    // Stores only the endpoint path so it can later be combined with the base URL.
    path(path: string){
        this.apiPath = path;
        return this; 
    }

    // Query params are stored first, then converted into URL text when getURL() runs.
    param(param: Record<string, string | number | boolean>){
        this.apiParam = param;
        return this;
    }

    // Headers are saved on the handler so the final request method can reuse them.
    headers(headers: Record<string, string>){
        this.apiHeaders = headers;
        return this;

    }

    // Request body is collected separately because not every HTTP method needs one.
    body(body: Record<string, unknown>){
        this.apiBody = body;
        return this; 
    }

    // Builds the final request URL from base URL + path + query params.
    // Query values are converted to strings because URLs store text, not numbers/booleans.
    getURL(): string{
        const url = new URL(`${this.baseURL ?? this.defaultBaseURL}${this.apiPath}`)
        for(const [key, value] of Object.entries(this.apiParam)){
            url.searchParams.append(key, String(value))
        }
        console.log(url.toString())
        return url.toString();
    }

    // Sends a GET request using the current handler state, logs the activity,
    // validates the status, and returns parsed JSON to the test.
    async getRequest(statusCode: number){
        const url = this.getURL();
        const response = await this.request.get(url, {
            headers: this.apiHeaders
        })
        // console.log(response); // Now using cutom logger
        this.logger.logRequest('GET', url, this.apiHeaders)

        const actualStatus = response.status();
        const responseJSON = await response.json();

        this.logger.logResponse(statusCode, responseJSON);
        this.statusCodeValidator(actualStatus, statusCode, this.getRequest)
        // expect (actualStatus).toEqual(statusCode); // we are using the custom status code validator

        return responseJSON;
    }

    // Sends a POST request with the current body, then logs and validates the response
    // so tests do not need to repeat the same transport-level code.
    async postRequest(statusCode: number){
        const url = this.getURL();
        const response = await this.request.post(url, {
            headers: this.apiHeaders,
            data: this.apiBody
        })

        this.logger.logRequest('POST', url, this.apiHeaders, this.apiBody);
        const actualStatus = response.status();

        const responseJSON = await response.json();
        this.logger.logResponse(statusCode, this.apiBody)

        this.statusCodeValidator(actualStatus, statusCode, this.getRequest)
        // expect(actualStatus).toEqual(statusCode)
        
        return responseJSON;
    }

    // PUT follows the same centralized flow as POST because update requests usually need
    // the same ingredients: URL, headers, body, logging, and status validation.
    async putRequest(statusCode: number){
        const url = this.getURL();
        const response = await this.request.put(url, {
            headers: this.apiHeaders,
            data: this.apiBody
        })

        this.logger.logRequest('PUT', url, this.apiHeaders, this.apiBody);
        const actualStatus = response.status();

        const responseJSON = await response.json();
        this.logger.logResponse(statusCode, this.apiBody)

        this.statusCodeValidator(actualStatus, statusCode, this.getRequest)
        // expect(actualStatus).toEqual(statusCode)
        
        return responseJSON;
    }

    // DELETE usually focuses on status validation instead of response content, but it still
    // goes through the same centralized request/logging path for consistency.
    async deleteRequest(statusCode: number){
        const url = this.getURL();
        const response = await this.request.delete(url, {
            headers: this.apiHeaders,
        })

        this.logger.logRequest('POST', url, this.apiHeaders, this.apiBody);
        const actualStatus = response.status();

        const responseJSON = await response.json();
        this.logger.logResponse(statusCode, this.apiBody)

        this.statusCodeValidator(actualStatus, statusCode, this.getRequest)
        // expect(actualStatus).toEqual(statusCode)
    
        // const responseJSON = await response.json();
        // return responseJSON;  // there is nothing to return in the delete
    }

    // Replaces a plain expect() with a richer error that includes recent logger output.
    // This makes failures easier to debug because the error shows the latest API activity.
    private statusCodeValidator(actualStatus: number, expectedStatus: number, callingMethod: Function){
        if(actualStatus != expectedStatus){
            const logs = this.logger.getRecentLogs()
            const error = new Error(`Expected Status from custom logger ${expectedStatus} but got ${actualStatus}\n\n Recent API Activity: \n${logs}`)
            Error.captureStackTrace(error, callingMethod)
            throw error
        }
    }

    
}
