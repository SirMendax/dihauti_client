<template>
    <div class="container padding-20-60 min-height-vh">
    <form @submit.prevent="signUp" class="padding-10-20 bg-white box-shadow flex-column width-10 mg-top-20 size-text">
        <h1 class="blue size-lead nowrap mg-bot-20 mg-top-20 align-self-center">Регистрация</h1>
        <label class="size-text violet flex-row flex-wrap width-8 mg-rl-auto" for="login_input">Введите ваш логин</label>
        <div class="flex-row mg-bot-20 mg-top-20 width-8 mg-rl-auto">
            <div class="bg-violet white input-icon padding-10">
                <i class="far fa-user" style="font-size: 22px;"></i>
            </div>
            <div class="group">
                <input id="login_input" v-model="form.name" type="text" class="width-10" required>
                <span class="highlight"></span>
                <span class="bar"></span>
            </div>
        </div>
        <label class="size-text violet flex-row flex-wrap width-8 mg-rl-auto" for="email_input">Введите ваш e'mail</label>
        <div class="flex-row mg-bot-20 mg-top-10 width-8 mg-rl-auto">
            <div class="bg-violet white input-icon padding-10">
                <i class="far fa-envelope" style="font-size: 22px;"></i>
            </div>
            <div class="group">
                <input id="email_input" v-model="form.email" type="text" class="width-10" required>
                <span class="highlight"></span>
                <span class="bar"></span>
            </div>
        </div>
        <label class="size-text violet flex-row flex-wrap width-8 mg-rl-auto" for="password_input">
            <p class="mg-r-10">Придумайте пароль</p>
            <p>{{passwordValidate(form.password)}}</p>
        </label>
        <div class="flex-row mg-bot-20 mg-top-10 width-8 mg-rl-auto">
            <div class="bg-violet white input-icon padding-10">
                <i class="fas fa-key" style="font-size: 22px;"></i>
            </div>
            <div class="group">
                <input id="password_input" v-model="form.password" type="password" class="width-10" required>
                <span class="highlight"></span>
                <span class="bar"></span>
            </div>
        </div>
        <label class="size-text violet flex-row flex-wrap width-8 mg-rl-auto" for="password_conf_input">
            <p class="mg-r-10">Повторите пароль</p>
            <p>{{validatePasswordConfirmation(form.password, form.password_confirmation)}}</p>
        </label>
        <div class="flex-row mg-bot-20 mg-top-10 width-8 mg-rl-auto">
            <div class="bg-violet white input-icon padding-10">
                <i class="fas fa-key" style="font-size: 22px;"></i>
            </div>
            <div class="group">
                <input id="password_conf_input" v-model="form.password_confirmation" type="password" class="width-10" required>
                <span class="highlight"></span>
                <span class="bar"></span>
            </div>
        </div>
        <button :disabled="!checkedInputValue" class="btn mg-top-20 mg-bot-30 align-self-center">зарегистрироваться</button>
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
                    name: null,
                    email: null,
                    password: null,
                    password_confirmation: null,
                }
            }
        },
        computed:{
            checkedInputValue(){
                return this.form.email !== null && this.form.name !== null && this.form.password !== null;
            }
        },
        methods:{
            signUp(){
                let data = {
                    name: this.form.name,
                    email: this.form.email,
                    password: this.form.password,
                    password_confirmation: this.form.password_confirmation,
                };
                axios.post('https://api.dihauti.ru/api/registration', data)
                    .then(() => {
                        swal.fire('Отлично! Вы зарегистрировались','На указанный вами email придет сообщение с кодом подтверждения и дальнейшими инструкциями','success')
                            .then(() => {
                                this.$router.push('/login');
                            })
                    })
                    .catch(() => {
                        swal.fire('Ошибка!', 'Попробуйте позднее или напишите в техническую поддержку support@dihauti.ru', 'error')
                    })
            },
            passwordValidate(password){
                const containsLetters = /^.*[a-zA-Z]+.*$/
                const minChars = /^.{8,}$/
                if(password === null || password === ''){
                    return null
                }else{
                    if(!containsLetters.test(password)){
                        return '(пароль должен содержать латинские символы)'
                    }
                    if(!minChars.test(password)){
                        return '(пароль должен содержать минимум восемь символов)'
                    } else {
                        return '(пароль надежен)'
                    }
                }
            },
            validatePasswordConfirmation(pass, pass_c){
                if(pass_c === null || pass_c === ''){
                    return null
                }else{
                    if(pass_c !== pass) {
                        return '(пароли не совпадают)'
                    }
                }
            }
        },
    }
</script>
