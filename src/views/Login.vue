<template>
    <div class="container padding-20-60 min-height-vh">
        <form @submit.prevent="login" class="padding-10-20 box-shadow flex-column width-10 mg-top-20 size-text">
            <h1 class="blue size-lead nowrap mg-bot-20 mg-top-20 align-self-center">Авторизации</h1>
            <label class="size-text violet flex-row flex-wrap width-8 mg-rl-auto">Введите e'mail</label>
            <div class="flex-row mg-bot-20 mg-top-10 width-8 mg-rl-auto">
                <div class="bg-violet white input-icon padding-10" style="font-size: 22px;">
                    <i class="far fa-envelope white"></i>
                </div>
                <div class="group">
                    <input v-model="form.email" type="text" class="width-10" required>
                    <span class="highlight"></span>
                    <span class="bar"></span>
                </div>
            </div>
            <label class="size-text violet flex-row flex-wrap width-8 mg-rl-auto green">Введите пароль</label>
            <div class="flex-row mg-bot-20 mg-top-10 width-8 mg-rl-auto">
                <div class="bg-violet white input-icon padding-10">
                    <i class="fas fa-key" style="font-size: 22px;"></i>
                </div>
                <div class="group">
                    <input v-model="form.password" type="password" class="width-10" required>
                    <span class="highlight"></span>
                    <span class="bar"></span>
                </div>
            </div>
            <input type="checkbox" class="checkbox__green" id="remember_me" v-model="form.remember_me" />
            <label for="remember_me" class="align-self-center">Запомнить меня</label>
            <button :disabled="!checkedInputValue" class="btn mg-top-20 align-self-center mg-bot-30">войти в систему</button>
        </form>
    </div>
</template>

<script>
    import axios from 'axios';
    import swal from "sweetalert2";
    export default {
        name: "Login",
        data(){
            return {
                form: {
                    email: null,
                    password: null,
                    remember_me: false,
                }
            }
        },
        computed:{
            checkedInputValue(){
                return this.form.email && this.form.password
            }
        },
        created(){
          if(this.$auth.isAuthenticated()){
              this.$router.push('/forum');
          }
        },
        methods:{
            login(){
                let data = {
                    email: this.form.email,
                    password: this.form.password,
                    remember_me: this.form.remember_me
                };
                axios.post('https://api.dihauti.ru/api/login', data)
                    .then(res => {
                        this.$auth.setToken(res.data.token, res.data.expires_at, res.data.user, res.data.id, res.data.role);
                        window.location = '/'
                    })
                    .catch(() => {
                        swal.fire('Ошибка', 'Введены неверные данные', 'error')
                    })
            }
        },
    }
</script>
