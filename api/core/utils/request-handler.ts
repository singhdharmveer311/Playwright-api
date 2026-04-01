import { APIRequest, APIRequestContext, request } from "playwright-core";
import { expect } from "playwright/test";
import { APILogger } from "../logger/APILogger";


export class RequestHandler{

    private request: APIRequestContext;
    private baseURL: string; 
    private defaultBaseURL: string;
    private apiPath: string = '';
    private apiParam: Record<string, string | number | boolean> = {};
    private apiHeaders: Record<string, string> = {};
    private apiBody: Record<string, unknown>  = {}
    private logger: APILogger

    constructor(request: APIRequestContext, newURL: string, logger: APILogger){
        this.request = request; 
        this.defaultBaseURL = newURL;
        this.logger = logger;
    }
    
    url(url: string){
        this.baseURL = url; 
        return this; 
    }

    path(path: string){
        this.apiPath = path;
        return this; 
    }

    param(param: Record<string, string | number | boolean>){
        this.apiParam = param;
        return this;
    }

    headers(headers: Record<string, string>){
        this.apiHeaders = headers;
        return this;

    }

    body(body: Record<string, unknown>){
        this.apiBody = body;
        return this; 
    }

    getURL(): string{
        const url = new URL(`${this.baseURL ?? this.defaultBaseURL}${this.apiPath}`)
        for(const [key, value] of Object.entries(this.apiParam)){
            url.searchParams.append(key, String(value))
        }
        console.log(url.toString())
        return url.toString();
    }

    async getRequest(statusCode: number){
        const url = this.getURL();
        const response = await this.request.get(url, {
            headers: this.apiHeaders
        })
        // console.log(response); // Now using cutom logger
        this.logger.logRequest('GET', url, this.apiHeaders)

        const responseJSON = await response.json();
        this.logger.logResponse(statusCode, this.apiBody);
        expect (response.status()).toEqual(statusCode)
        return responseJSON;
    }

    async postRequest(statusCode: number){
        const url = this.getURL();
        const response = await this.request.post(url, {
            headers: this.apiHeaders,
            data: this.apiBody
        })

        const responseJSON = await response.json();
        return responseJSON;
    }

    async putRequest(statusCode: number){
        const url = this.getURL();
        const response = await this.request.put(url, {
            headers: this.apiHeaders,
            data: this.apiBody
        })

        const responseJSON = await response.json();
        return responseJSON;
    }

    async deleteRequest(statusCode: number){
        const url = this.getURL();
        const response = await this.request.delete(url, {
            headers: this.apiHeaders,
        })

        expect(response.status()).toEqual(statusCode)
        // const responseJSON = await response.json();
        // return responseJSON;  // there is nothing to return in the delete
    }

    
}