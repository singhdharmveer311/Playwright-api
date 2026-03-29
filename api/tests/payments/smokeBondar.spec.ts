import {test} from '../../core/fixtures/bondar.fixture'
import { RequestHandler } from '../../core/utils/request-handler'


test('Get Method Smoke test with request Handler and Fixture', async({api})=> {

    const response = await api
        // .url('https://conduit-api.bondaracademy.com/api/')
        .path('/articles')
        .param({limit:10, offset:0})
        .headers({Authorization: 'authToken'})
        .body({"article":{"title":"fads1","description":"asdf","body":"adsfad","tagList":["asdf"]}})
        .getRequest(200)

    console.log(response);
})

test('Post method smoke test with request handler and fixture', async({api})=>{
    const response = await api
                    .path('/articles')
                    .headers({Authorization: 'authToken'})
                    .body({"article":{"title":"fads1","description":"asdf","body":"adsfad","tagList":["asdf"]}})
                    .postRequest(201)

    console.log(response)

})

