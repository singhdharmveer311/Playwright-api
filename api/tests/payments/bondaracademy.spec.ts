import {test, expect} from '@playwright/test';
import { AsyncLocalStorage } from 'async_hooks';



test('Get Test Tags', async({request})=> {
    const APIArticles = await request.get('https://conduit-api.bondaracademy.com/api/tags');
    const responseAPIArticles = await APIArticles.json();
    console.log(responseAPIArticles);
    expect(APIArticles.status()).shouldEqual(200);
})

test('Create and delete artcle', async({request})=> {
    // Step 1 is to get token. 
    let token : string;
    const login = await request.post('https://conduit-api.bondaracademy.com/api/users/login', 
        { 
            data: {"user":{"email":"rs92539@gmail.com","password":"Temp@123"}}
        }
    )

    const loginJSON = await login.json();
    token = 'Token ' + loginJSON.user.token
    console.log(token)

    // Create article using the token
    const createArticle = await request.post('https://conduit-api.bondaracademy.com/api/articles/', 
        {   
            headers: {authorization: token},
            data: {"article":{"title":"fads1","description":"asdf","body":"adsfad","tagList":["asdf"]}}
        }
    )
    const crateArticleJSON = await createArticle.json();
    console.log(crateArticleJSON);
    expect(createArticle.status()).shouldEqual(201);

    // Delete article using the article id - First get article then delete article
    const articleSlug = crateArticleJSON.article.slug;
    
    const deleteArticle = await request.delete(
        `https://conduit-api.bondaracademy.com/api/articles/${articleSlug}`,
        {
            headers: { authorization: token }
        }
    );
    
    expect(deleteArticle.status()).shouldEqual(204);
    console.log('Article deleted successfully');

})