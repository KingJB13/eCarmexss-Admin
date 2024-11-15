import axios from 'axios';

export default axios.create({
    //baseURL: 'https://ecarmexss-api-ekgrgmcpcpbjhkgw.southeastasia-01.azurewebsites.net/api/',
    baseURL: 'http://localhost:5267/api'
});