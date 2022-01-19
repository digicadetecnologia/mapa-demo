
import axios from 'axios';
const apiBaseUrl = process.env.PROXY;

export default {

  geocodeAxios(map) {
    return new Promise((resolve, reject) => {
      const URL = `${apiBaseUrl}/geocode/${map.formato}`
      axios.get(URL, {params: { endereco: map.logradouro} }).then(response => 
        resolve(response)
        ).catch(error => reject(error))
    })
  }
};
