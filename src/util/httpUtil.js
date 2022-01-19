export default{
  defaultErrorCallback: (ctx, errorResponse, customCallback, defaultMsg) => {
    let finalMsg = errorResponse.data && errorResponse.data.msg ? errorResponse.data.msg : defaultMsg;
    ctx.$notify({
      group: 'geocodeMsgs',
      title: 'Erro',
      type: 'error',
      text: finalMsg,
      duration: 4000
    });
    if (customCallback) {
      customCallback();
    }
  }
};
