const contextPath = '1.0.2-SNAPSHOT' ;
const baseUrl = process.env.NODE_ENV === 'production' ? 'http://47.99.160.215:20100/'+contextPath : 'http://localhost:20100/'+contextPath ;
export default baseUrl
