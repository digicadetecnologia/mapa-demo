<template v-slot:after>
  <div 
    id="collapseOne" 
    class="panel-collapse collapse in" 
    role="tabpanel" 
    aria-labelledby="headingOne"
  >
    <div class="q-pa-md">
      <p class="text-muted">
        <small>Exemplo: podemos transformar o endereço "Rua Tomé de Souza 845, Belo Horizonte - MG" na coordenada “latitude -19.9372050629034; longitude -43.9340152021421”.</small>
      </p>
      <div class="q-gutter-md">
        <q-input
          v-model="endereco"
          label="Endereço"
        />      
      </div>
      <div class="q-pa-md q-gutter-sm">
        <q-btn 
          label="Pesquisar" 
          @click.prevent="fetchData()" 
        />
      </div>
    </div>
    <tab-mapa :features="resultadoJSON" /> 
  </div>  
</template> 


<script>
import TabMapa from '@/components/tab.mapa';
import GeocodeService from '@/services/geocodeService';

export default {
  
  components: {
    TabMapa
  },
  
  data () {
    return {
      selector: '#resultado-geocodificacao',
      resultadoJSON: [],
      retornouJson: false
    };
  },

/*  watch: {
    '$route': 'fetchData'
  },*/

  methods: {

    fetchData () {
      var me = this;
      
      me.resultadoJSON = [];
      me.resultadoXML = '';
      
      const map = {
        logradouro:  this.endereco,
        formato : 'json'
      }
      GeocodeService.geocodeAxios(map).then(response => {
          
          me.resultadoJSON = response.data;
          console.log(response);
          me.retornouJson = true;
          let jsonArray = [];
          response.data.forEach(element => {
            jsonArray.push(element);
          });
      });
      this.setLoadingFalse ();
    },
    
    setLoadingFalse () {
      alert
      var me = this;
      if (me.resultadoJSON.length === 0) {
        this.$notify({
          group: 'geocodeMsgs',
          title: 'Alerta',
          type: 'warning',
          text: 'Não foi encontrado nenhum endereço ou coordenadas para a entrada que foi enviada.',
          duration: 6000
        });
      }
    }
  }
};
</script>


<style scoped></style>
