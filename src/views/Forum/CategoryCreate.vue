<template>
    <div class="container padding-20-60 min-height-vh">
        <form @submit.prevent="submit" class="padding-10-20 bg-violet box-shadow flex-column width-10 mg-top-20 size-text">
            <div class="flex-row mg-bot-20 mg-top-20 width-8 mg-rl-auto">
                <div class="group">
                    <label class="size-text">Название категории</label>
                    <input v-model="name" type="text" class="width-10" required>
                    <span class="highlight"></span>
                    <span class="bar"></span>
                </div>
            </div>
            <button :disabled="!name" class="btn mg-top-20 align-self-center mg-bot-30">создать</button>
        </form>
    </div>
</template>

<script>
    import axios from 'axios';
    import swal from "sweetalert2";
    export default {
        name: "CategoryCreate",
        data(){
            return {
                name: null,
            }
        },
        methods: {
            submit(){
                axios.post('https://api.dihauti.ru/api/forumCategories', {
                    name: this.name
                }).then(() => {
                    swal.fire('Отлично!','Новый раздел форума создан','success')
                        .then(() => {
                            this.$router.push('/forum');
                        })
                })
            }
        }
    }
</script>

<style scoped>

</style>
