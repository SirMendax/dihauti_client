<template>
    <div class="container padding-20-40 min-height-vh">
        <div class="flex-row flex-wrap justify-content-start width-10 mg-bot-20" v-if="this.$auth.isCommentator()">
            <router-link :to="{ name: 'questionCreate'}" class="btn size-text align-self-start white mg-r-10 mg-bot-10">Создать обсуждение</router-link>
            <router-link :to="{ name: 'categoryCreate'}"
                         class="btn size-text align-self-start white mg-r-10 mg-bot-10"
                         v-if="this.$auth.isAdmin()"
            >Создать категорию</router-link>
        </div>
        <div class="flex-column width-10 mg-bot-20 padding-10-20" v-else>
            <p class="size-text align-self-start violet">Чтобы создавать темы, зарегистрируйтесь и подтвердите адрес электронной почты</p>
        </div>
        <div class="flex-column mg-bot-30 bg-white box-shadow" v-for="item in getQuestions" :key="item[0].category" data-aos="fade-up" data-aos-easing="ease">
            <div class="flex-row padding-10-20 bg-violet white box-shadow size-title">{{item[0].category}}</div>
            <div class="padding-10-20">
                <div class="flex-column bg-white violet padding-10-20 mg-top-10 mg-bot-10 box-shadow"
                     style="border-left: 10px solid rgba(45, 8, 44, 1);"
                     v-for="quest in item" :key="quest.id">
                    <div class="flex-row mg-bot-20 size-lead">
                        <h3>{{quest.title}}</h3>
                    </div>
                    <div class="meta-data">
                        <div class="flex-row mg-bot-10"><i class="fas fa-user"></i>
                            <router-link :to="{ path: `/users/${quest.user_slug}`}" style="color:#5e6973">{{quest.user}}</router-link>
                        </div>
                        <div class="flex-row mg-bot-10"><i class="fas fa-calendar-alt"></i>{{quest.created_at}}</div>
                        <div class="flex-row mg-bot-10">
                            <p class="size-text mg-r-20"><i class="far fa-eye"></i>{{quest.view_count}}</p>
                            <p class="size-text mg-r-20"><i class="far fa-comments"></i>{{quest.replies_count}}</p>
                            <p class="size-text mg-r-20"><i class="far fa-heart"></i>{{quest.like_count}}</p>
                        </div>
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
            <div class="padding-10-20 mg-bot-30 mb-top-10">
                <router-link :to="{ path: `category/${item[0].category_slug}`}" class="btn size-text">перейти к разделу</router-link>
            </div>
        </div>
    </div>
</template>

<script>
    import {
        mapGetters,
        mapActions
    } from "vuex";
    export default {
        name: "Forum",
        computed: {
            ...mapGetters(["getQuestions"]),
        },
        created() {
            if(!this.$auth.isAuthenticated()){
                this.$router.push('/login');
            }
        },
        methods: {
            ...mapActions(["fetchQuestions"]),
        },
        async mounted() {
            this.fetchQuestions();
        },
    }
</script>
<style>
    .tui-editor-contents {
        font-size: 18px;
        color: rgba(45, 8, 44, 1);
        font-family: 'Roboto', sans-serif;
    }
</style>
