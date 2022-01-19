var $ = require('jquery');

export default {

  loading: [],
  
  setLoading (selector, loading) {
    var me = this;
    if (!me.loading[selector]) {
      me.loading[selector] = 0;
    }
    if (loading) {
      if (me.loading[selector] <= 0) {
        $(selector).LoadingOverlay('show', {zIndex: 9999});
      }
      me.loading[selector]++;
    } else {
      me.loading[selector]--;
      if (me.loading[selector] <= 0) {
        me.loading[selector] = 0;
        $(selector).LoadingOverlay('hide');
      }
    }
  },
  
  agendarAtualizacao (funcao, tempo, idUltimoTimer, callback) {
    if (idUltimoTimer) {
      clearTimeout(idUltimoTimer);
    }
    let idTimer = setTimeout(function () {
      funcao();
    }, tempo);
    callback(idTimer);
  },
  
  cancelarAtualizacao (idTimer) {
    clearTimeout(idTimer);
  }
};
