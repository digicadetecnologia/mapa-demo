import axios from 'axios'

export default ({ store }) => {
  axios.interceptors.request.use(config => {
    if (config.url.indexOf(process.env.API) > -1 || config.url.indexOf(process.env.PROXY) > -1) {
      config.headers.clientid = process.env.CLIENT_ID
      config.headers.common['Access-Control-Allow-Origin'] = '*'
    }
    return config
  }, error => {
    return Promise.reject(error)
  })
}
