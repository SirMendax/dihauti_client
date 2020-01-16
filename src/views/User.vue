<template>
    <div class="flex-row flex-wrap space-between">
        <div class="flex-row justify-content-start">
            <p>{{data.name}}</p>
        </div>
        <div class="flex-row justify-content-start" v-if="!editing">
            <p>{{data.role}}</p>
            <p class="mg-l-10"
               style="width: 30px"
               @click="startEditing">
                <i class="fas fa-edit"></i>
            </p>
        </div>
        <div v-else>
            <form @submit.prevent="editRole" class="flex-row flex-wrap">
                <div class="select mg-r-10 mg-l-10 mg-top-10">
                    <select class="violet" v-model="role">
                        <option value="2">администратор</option>
                        <option value="3">модератор</option>
                        <option value="1">камрад</option>
                        <option value="4">забанен</option>
                    </select>
                </div>
                <button class="btn size-text mg-r-10 mg-l-10 mg-top-10">сохранить</button>
                <p class="btn size-text mg-r-10 mg-l-10 mg-top-10" @click="cancelEditing">отменить</p>
            </form>
        </div>
    </div>
</template>

<script>
    import axios from 'axios';
    export default {
        name: "User",
        props: ['data'],
        data(){
            return {
                editing: false,
                role: this.data.role,
            }
        },
        methods:{
            startEditing(){
                this.editing = true
            },
            cancelEditing(){
                this.editing = false
            },
            editRole(){
                axios.post('https://api.dihauti.ru/api/editRole', {
                    user_id: this.data.id,
                    role_id: this.role
                })
                    .then(() => {
                        this.cancelEditing()
                        window.location.reload()
                    })
            }

        }
    }
</script>

<style scoped>

</style>