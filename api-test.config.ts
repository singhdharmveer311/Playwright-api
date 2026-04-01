const processENV = process.env.TEST_ENV
const env = processENV || 'dev'
console.log('Test enviroment is ' + env)


const config = {
    apiURL: "https://conduit-api.bondaracademy.com/api", 
    userEmail: 'rs92539@gmail.com',
    userPassword: 'Temp@123'
}


if(env == 'qa'){
    config.userEmail = 'rs92539@gmail.com',
    config.userPassword = 'Temp@123'
}
if(env == 'prod'){
    config.userEmail = '',
    config.userPassword = ''
}


export {config}