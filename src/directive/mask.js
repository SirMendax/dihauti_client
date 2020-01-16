export default {
  bind(el,binding) {
    el.oninput = function(e) {
      var x;
      if (!e.isTrusted) {
        return;
      }
      if(binding.arg === "ru"){
        x = this.value.replace(/\D/g, '').match(/(\d{0,3})(\d{0,3})(\d{0,4})/);
      }else if(binding.arg == "uk"){
        x = this.value.replace(/\D/g, '').match(/(\d{0,2})(\d{0,3})(\d{0,4})/);
      }else if(binding.arg == "usa"){
        x = this.value.replace(/\D/g, '').match(/(\d{0,3})(\d{0,4})(\d{0,4})/);
      }else if(binding.arg == 'bel'){
        x = this.value.replace(/\D/g, '').match(/(\d{0,2})(\d{0,3})(\d{0,3})/);
      }
      this.value = !x[2] ? x[1] : '(' + x[1] + ') ' + x[2] + (x[3] ? '-' + x[3] : '');
      el.dispatchEvent(new Event('input'));
    }
  }
}
