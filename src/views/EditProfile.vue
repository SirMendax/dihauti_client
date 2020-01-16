<template>
    <form class="flex-column bg-white width-10 mg-rl-auto box-shadow padding-20-40" @submit.prevent="submit">
        <div class="flex-column mg-bot-20 mg-top-20 width-10">
            <div class="flex-row mg-bot-20 mg-top-20 width-10 mg-rl-auto">
                <div class="group">
                    <label class="size-text violet">Имя</label>
                    <input v-model="form.first_name" type="text" class="width-10" required>
                    <span class="highlight"></span>
                    <span class="bar"></span>
                </div>
            </div>
            <div class="flex-row mg-bot-20 mg-top-20 width-10 mg-rl-auto">
                <div class="group">
                    <label class="size-text violet">Пол</label>
                    <input v-model="form.sex" type="text" class="width-10" required>
                    <span class="highlight"></span>
                    <span class="bar"></span>
                </div>
            </div>
            <div class="flex-row mg-bot-20 mg-top-20 width-10 mg-rl-auto">
                <div class="group">
                    <label class="size-text violet">Город</label>
                    <input v-model="form.city" type="text" class="width-10" required>
                    <span class="highlight"></span>
                    <span class="bar"></span>
                </div>
            </div>
            <div class="flex-row mg-bot-20 mg-top-20 width-10">
                <div class="group width-10">
                    <div class="violet mg-bot-10 mg-top-10 flex-row align-items-center size-text">
                        <h3 class="mg-r-10">Подпись профиля</h3>
                        <div v-if="form.quote !== null">
                            <p v-if="form.quote.length < 500">({{form.quote.length}}/500)</p>
                            <p v-else style="color:darkred">({{form.quote.length}}/500)</p>
                        </div>
                    </div>
                    <textarea v-model="form.quote" type="text" class="width-10"></textarea>
                </div>
            </div>
        </div>
        <div class="flex-row">
            <button id="button-order" class="btn size-text align-self-center mg-top-20 mg-r-20">сохранить</button>
            <p class="btn size-text align-self-center mg-top-20 mg-r-20" @click="cancel">отменить</p>
        </div>
    </form>
</template>

<script>
    import axios from 'axios';
    import swal from "sweetalert2";
    export default {
        name: "EditProfile",
        props: ['data'],
        data(){
            return {
                form: {
                    first_name: this.data.first_name,
                    sex: this.data.sex,
                    city: this.data.city,
                    quote: this.data.quote
                }
            }
        },
        methods:{
            submit(){
                axios.put(`https://api.dihauti.ru/api/users/update`, this.form)
                    .then(() => {
                        swal.fire("Отлично", 'Профиль обновлен', 'success')
                            .then(()=>{
                                window.location.reload()
                            })
                            .catch(err => {
                                swal.fire("Ошибка", `${err.message}`, 'error')
                            })
                    })
            },
            cancel(){
                this.$emit('cancel-profile-update')
            }
        }
    }
</script>

<style scoped>

</style>
