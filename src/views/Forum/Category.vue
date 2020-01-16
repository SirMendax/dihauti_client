<template>
    <div class="padding-20-40 min-height-vh">
                <div class="flex-column bg-white violet mg-top-10 mg-bot-10 box-shadow"
                     v-for="quest in questions" :key="quest.id">
                    <div class="flex-row mg-bot-20 size-title bg-violet white padding-10-20">
                        <h3>{{quest.title}}</h3>
                    </div>
                    <div class="padding-10-20 flex-column">
                        <div class="meta-data">
                            <div class="flex-row mg-bot-10"><i class="fas fa-user"></i>{{quest.user}}</div>
                            <div class="flex-row"><i class="fas fa-calendar-alt"></i>{{quest.created_at}}</div>
                        </div>
                        <hr style="background:rgba(45, 8, 44, 1); width: 100%;">
                        <div class="flex-row meta-data mg-top-10" v-if="quest.last_replies">
                            <p>Последний ответ от {{quest.last_replies.user}}, {{quest.last_replies.created_at}}</p>
                        </div>
                        <div class="btn align-self-start white mg-top-10">
                            <router-link :to="quest.path">присоединиться</router-link>
                        </div>
                    </div>
                </div>
    </div>
</template>

<script>
    import axios from 'axios';
    export default {
        name: "Category",
        props: ['category'],
        data(){
            return{
                questions: {},
            }
        },
        created() {
            axios.get(`https://api.dihauti.ru/api/forumCategories/${this.$route.params.slug}`)
                .then(res => {
                    this.questions = res.data.data
                })
                .catch(error => {
                    console.log(error)
                })
        }
    }
</script>

<style scoped>

</style>
