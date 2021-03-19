const contextPath = '1.0.3-SNAPSHOT' ;
const baseUrl = process.env.NODE_ENV === 'production' ? 'http://oblmg.api.tharlo.space/'+contextPath : 'http://localhost:20100/'+contextPath ;
export default baseUrl
