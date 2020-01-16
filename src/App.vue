<template>
  <div class="container bg-white">
    <v-header id="up"></v-header>
    <router-view></router-view>
    <v-footer style="height: 10vh;"></v-footer>
    <div class="upButton" v-scroll="handleScroll" v-scroll-to="'#up'">
      <i class="fas fa-arrow-up"></i>
    </div>
  </div>
</template>
<script>
  import swal from "sweetalert2";
  export default {
    created(){
      if(+window.localStorage.getItem('role') === +4){
        swal.fire("Уважаемый пользователь!", 'Вы забанены, а значит лишены всяких прав на данном портале. Напишите в поддержку support@dihauti.ru для разъяснений', 'error')
                .then(()=>{
                  window.location.reload()
                })
      }
    },
    methods: {
      handleScroll: function (evt, el) {
        if (window.scrollY > 200) {
          el.setAttribute(
                  'style',
                  'opacity: 1; transform: translate3d(0, -20px, 0)'
          )
        } else if (window.scrollY < 200) {
          el.setAttribute(
                  'style',
                  'opacity: 0; transform: translate3d(0, -80px, 0);'
          )

        }
      }
    }
  }
</script>
