import {test} from '../../core/fixtures/bondar.fixture'
import {Logger} from '../../core/logger/APILogger'

let authToken: string; 

test.beforeAll('Get Auth Token', async({api})=>{
    const response = await api
                .path('/users/login')
                .body({"user":{"email":"rs92539@gmail.com","password":"Temp@123"}})
                .postRequest(200)
    authToken = 'Token ' + response.user.token
    console.log(authToken)
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
                    .body({"article":{"title":"fads1","description":"asdf","body":"adsfad","tagList":["asdf"]}})
                    .postRequest(201)

    console.log(response)
})


test('Full Flow - Create, Modify and Delete Article', async({api})=>{

    // Create Article
    const createArticle = await api
                    .path('/articles')
                    .headers({authorization: authToken})
                    .body({"article":{"title":"Full Flow Final","description":"asdf","body":"adsfad","tagList":["asdf"]}})
                    .postRequest(201)

    console.log(createArticle)
    const articleSlug = createArticle.article.slug

    // Update Article
    const updateArticle = await api
                    .path(`/articles/${articleSlug}`)
                    .headers({authorization: authToken})
                    .body({"article":{"title":"Full Flow Final - Update","description":"asdf","body":"adsfad","tagList":["asdf"]}})
                    .putRequest(201)
    
    const updatedrticleSlug = updateArticle.article.slug

    // Delete Article
    const deleteArticle = await api
                    .path(`/articles/${updatedrticleSlug}`)
                    .headers({authorization: authToken})
                    .deleteRequest(204)
})


test('Custom Logger test ', ()=>{
    const logger = new Logger();
    logger.logRequest('GET', "url", {asjdfads: "asdf"}, "{asdkf: aaa}")
    logger.logResponse(200, "{Foo: bar}")
    const logs = logger.getRecentLogs();
    console.log(logs)
})
