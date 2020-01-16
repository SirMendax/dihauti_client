<template>
    <div class="padding-20-40 min-height-vh">
        <div class="box-shadow flex-column padding-10-20">
            <div class="flex-column mg-bot-10 size-text violet" v-for="user in users" :key="user.id">
                <v-user :data="user"></v-user>
                <hr class="width-10">
            </div>
        </div>
    </div>
</template>

<script>
    import axios from 'axios';
    import User from "./User";
    export default {
        name: "EditRole",
        components: {
            'v-user': User
        },
        data(){
            return {
                users: {}
            }
        },
        created() {
            axios.get('https://api.dihauti.ru/api/users')
                .then(res => {
                    this.users = res.data.data
                })
                .catch(err => {
                    console.log(err)
                })
        }
    }
</script>
