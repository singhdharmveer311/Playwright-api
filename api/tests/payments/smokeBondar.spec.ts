import {test} from '../../fixtures/bondar.fixture'
import {APILogger} from '../../utils/APILogger'
import { expect } from '../../utils/custom-expect'

let authToken: string; 

test.beforeAll('Get Auth Token', async({api})=>{
    const response = await api
                .path('/users/login')
                .body({"user":{"email":"rs92539@gmail.com","password":"Temp@123"}})
                .postRequest(200)
    authToken = 'Token ' + response.user.token
    console.log(authToken)
})

test('Get Test Tags', async({api})=> {
    const response = await api
                    .path('/tags')
                    .getRequest(200)
    expect(response.tags.length).toBeLessThanOrEqual(10)

})

test('Get Articles', async({api})=> {
    const response = await api
                    .path('/articles')
                    .param({limit: 10, offset: 0})
                    .getRequest(200)
    expect(response.articles.length).customShouldBeLessThanOrEqual(50)
    expect(response.articlesCount).shouldEqual(10)
})

test('Get Method Smoke test with request Handler and Fixture', async({api})=> {

    const response = await api
        // .url('https://conduit-api.bondaracademy.com/api/')
        .path('/articles')
        .param({limit:10, offset:0})
        .headers({Authorization: authToken})
        .body({"article":{"title":"fads1","description":"asdf","body":"adsfad","tagList":["asdf"]}})
        .getRequest(200)

    // console.log(response);
})

test('Post method smoke test with request handler and fixture', async({api})=>{
    const response = await api
                    .path('/articles')
                    .headers({Authorization: authToken})
                    .body({"article":{"title":"fads1111111","description":"asdf","body":"adsfad","tagList":["asdf"]}})
                    .postRequest(201)

    console.log(response)
})


test('Full Flow - Create, Modify and Delete Article', async({api})=>{

    // Create Article
    const createArticle = await api
                    .path('/articles')
                    .headers({authorization: authToken})
                    .body({"article":{"title":"Full1 1","description":"asdf","body":"adsfad","tagList":["asdf"]}})
                    .postRequest(201)

    console.log(createArticle)
    const articleSlug = createArticle.article.slug

    // Update Article
    const updateArticle = await api
                    .path(`/articles/${articleSlug}`)
                    .headers({authorization: authToken})
                    .body({"article":{"title":"Full Flow Final - Update","description":"asdf","body":"adsfad","tagList":["asdf"]}})
                    .putRequest(200)
    
    const updatedrticleSlug = updateArticle.article.slug

    // Delete Article
    const deleteArticle = await api
                    .path(`/articles/${updatedrticleSlug}`)
                    .headers({authorization: authToken})
                    .deleteRequest(204)
})


test('Custom Logger test ', ()=>{
    const logger = new APILogger();
    logger.logRequest('GET', "url", {asjdfads: "asdf"}, "{asdkf: aaa}")
    logger.logResponse(200, "{Foo: bar}")
    const logs = logger.getRecentLogs();
    console.log(logs)
})
