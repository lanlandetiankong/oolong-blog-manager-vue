const contextPath = '1.0.2-SNAPSHOT' ;
const baseUrl = process.env.NODE_ENV === 'production' ? 'http://api.oblmg.tharlo.space/'+contextPath : 'http://localhost:20100/'+contextPath ;
export default baseUrl
