<template>
    <div class="flex-row padding-20-40 bg-violet box-shadow space-between align-items-center">
        <div class="flex-column white">
            <router-link class="size-title" to="/">
                Dihauti Residence
            </router-link>
            <p class="size-text">Сообщество свободомыслящих</p>
        </div>
        <v-slide right>
            <div  class="flex-column nav width-100 size-text">
                    <router-link class="flex-row box-shadow width-9 mg-rl-auto mg-bot-10 padding-10-20 violet justify-content-center" to="/">главная</router-link>
                    <router-link class="flex-row box-shadow width-9 mg-rl-auto mg-bot-10 padding-10-20 violet justify-content-center"
                                 v-if="loggedIn"  to="/forum">форум</router-link>
                    <router-link class="flex-row box-shadow width-9 mg-rl-auto mg-bot-10 padding-10-20 violet justify-content-center" to="/blog">блог</router-link>
                    <router-link class="flex-row box-shadow width-9 mg-rl-auto mg-bot-10 padding-10-20 violet justify-content-center"
                                 v-if="loggedIn" :to='path'>профиль</router-link>
                    <router-link class="flex-row box-shadow width-9 mg-rl-auto mg-bot-10 padding-10-20 violet justify-content-center"
                           v-if="loggedIn" to="/messages">сообщения</router-link>
                    <router-link class="flex-row box-shadow width-9 mg-rl-auto mg-bot-10 padding-10-20 violet justify-content-center"
                                 v-if="!loggedIn" to="/login">авторизация</router-link>
                    <router-link class="flex-row box-shadow width-9 mg-rl-auto mg-bot-10 padding-10-20 violet justify-content-center"
                                 v-if="!loggedIn" to="/registry">регистрация</router-link>
                    <router-link class="flex-row box-shadow width-9 mg-rl-auto mg-bot-10 padding-10-20 violet justify-content-center"
                                 v-if="this.$auth.isAdmin()" to="/editRole">пользователи</router-link>
                    <router-link class="flex-row box-shadow width-9 mg-rl-auto mg-bot-10 padding-10-20 violet justify-content-center"
                                 v-if="loggedIn" to="/logout">выход</router-link>
            </div>
        </v-slide>
    </div>
</template>

<script>
    import { Slide } from 'vue-burger-menu'
    export default {
        name: "Header",
        components: {
            'v-slide': Slide
        },
        data(){
          return {
              path: `/users/${localStorage.getItem('user')}`,
              loggedIn: this.$auth.isAuthenticated(),
          }
        },
    }
</script>
