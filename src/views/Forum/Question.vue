<template>
  <div class="container padding-20-60 min-height-vh">
    <div class="flex-column width-10 mg-bot-20 box-shadow bg-white" data-aos="fade-up" data-aos-easing="ease">
      <div v-if="!questionShowUpdate">
        <h2 class="size-title padding-10-20 bg-violet white">{{getQuestion.title}}</h2>
        <div class="flex-column padding-10-20" data-aos="fade-up" data-aos-easing="ease">
          <div class="flex-row align-items-center">
            <p class="size-text mg-r-10" style="color:#5e6973">Обсуждение начал </p>
            <div class="size-text mg-r-10 flex-row align-items-center" style="color:#5e6973">
              <router-link :to="{ path: `/users/${getQuestion.user_slug}`}"
                           style="color:#5e6973; margin-right: 3px">{{getQuestion.user}}
              </router-link>
              <div style="border-radius:50%; width:10px; height: 10px; background: darkred"
                   v-if="!getQuestion.online"></div>
              <div style="border-radius:50%; width:10px; height: 10px; background: green" v-else></div>
            </div>
          </div>
          <p class="size-text" style="color:#5e6973">{{getQuestion.created_at}}</p>
          <div class="mg-top-10 mg-bot-10">
            <viewer :value="getQuestion.body"></viewer>
          </div>
          <div class="padding-10-20 mg-bot-20">
            <div class="flex-row justify-content-start" v-if="showUpdate" style="float: left">
              <div class="btn mg-l-10 mg-r-10" @click="questionUpdate">
                <p>редактировать</p>
              </div>
              <div class="btn mg-l-10 mg-r-10" @click="questionDelete">
                <p>удалить</p>
              </div>
            </div>
            <div class="size-text mg-r-20 flex-row align-items-center" @click="like" style="float: right">
              <p class="size-text mg-r-20" style="color:rgba(45, 8, 4, 0.3)"><i class="far fa-eye"></i>
                {{getQuestion.view_count}}</p>
              <transition name="bounce">
                <v-like v-if="userLike" :likeColor="'rgba(223, 166, 207, 1)'"
                        :count="getQuestion.like_count"></v-like>
              </transition>
              <transition name="bounce">
                <v-like v-if="!userLike" :likeColor="'rgba(45, 8, 4, 0.3)'"
                        :count="getQuestion.like_count"></v-like>
              </transition>
            </div>
          </div>
        </div>
      </div>
      <div v-else>
        <v-question-update @cancel-question-update="cancelQuestionUpdate"
                           :question="getQuestion"></v-question-update>
      </div>
    </div>
    <div class="flex-column width-10 mg-rl-auto mg-top-30" id="startQuestion">
      <div class="flex-row justify-content-start meta-data mg-bot-10" data-aos="fade-up" data-aos-easing="ease">
        <h2 class="size-lead blue mg-r-20">Ответы</h2>
        <p class="size-lead">{{getQuestion.replies_count}}</p>
      </div>
      <v-replies v-for="reply in replies" :key="reply.id" :data="reply"></v-replies>
      <v-pagination v-if="pagination.last_page > 1" :pagination="pagination" :offset="5" @paginate="getResults()"></v-pagination>
    </div>
    <div class="flex-column width-10 mg-rl-auto mg-top-30 bg-white box-shadow" data-aos="fade-up"
         data-aos-easing="ease"
         v-if="this.$auth.isCommentator()">
      <div class="flex-column width-10 align-self-start mg-bot-20">
        <div class="flex-row padding-10-20 bg-violet white size-lead">
          <p>{{form.user}}</p>
        </div>
        <form @submit.prevent="submit" class="flex-column mg-bot-20 mg-top-20 width-10 padding-10-20">
          <editor
            :options="editorOptions"
            v-model="form.body"
            mode="wysiwyg"
          />
          <button class="btn size-text align-self-center mg-top-20">ответить</button>
        </form>
      </div>
    </div>
    <div class="flex-column width-10 mg-rl-auto mg-top-30 bg-white box-shadow" v-else>
      <p class="size-text padding-10-20">Чтобы оставить комментарий, зарегистрируйтесь и подтвердите адрес
        электронной почты</p>
    </div>
  </div>
</template>

<script>
  import {Editor} from '@toast-ui/vue-editor';
  import {Viewer} from '@toast-ui/vue-editor';
  import QuestionUpdate from "./QuestionUpdate.vue";
  import Replies from "./Replies.vue";
  import axios from 'axios';
  import swal from "sweetalert2";
  import {
    mapGetters,
    mapActions,
  } from "vuex";

  export default {
    components: {
      'editor': Editor,
      'viewer': Viewer,
      'v-question-update': QuestionUpdate,
      'v-replies': Replies,
    },
    data() {
      return {
        form: {
          user_id: localStorage.getItem('id'),
          user: this.ucFirst(localStorage.getItem('user')),
          body: null,
        },
        replies: {},
        pagination: {
          current_page: 1
        },
        questionShowUpdate: false,
        editorOptions: {
          hideModelSwitch: true,
          minHeight: '300px',
          useCommandShortcut: true,
          useDefaultHTMLSanitizer: true,
          usageStatistics: true,
          toolbarItems: [
            'heading',
            'bold',
            'italic',
            'strike',
            'divider',
            'hr',
            'quote',
            'divider',
            'ul',
            'ol',
            'task',
            'indent',
            'outdent',
            'divider',
            'table',
            'image',
            'link',
            'divider',
            'code',
            'codeblock'
          ]
        }
      }
    },
    computed: {
      ...mapGetters([
        'getReplies',
        'getQuestion'
      ]),
      showUpdate() {
        return +window.localStorage.getItem('id') === +this.getQuestion.user_id || this.$auth.isEditor();
      },
      userLike() {
        return this.isLiked()
      }
    },
    methods: {
      ...mapActions(["fetchQuestion", "pushReply", "questionUpdate", "lastReply"]),
      getResults() {
        axios.get(`https://api.dihauti.ru/api/questions/${this.$route.params.slug}/replies?page=` + this.pagination.current_page)
          .then(response => {
            this.replies = response.data.data.data;
            this.pagination = response.data.data.pagination;
          })
          .catch(error => {
            console.log(error.response.data);
          });
      },
      isLiked() {
        if (this.getQuestion.likes !== undefined) {
          let user_like = this.getQuestion.likes.filter(like => like.user_id = +localStorage.getItem('id'));
          return user_like.length !== 0
        }
      },
      submit() {
        this.pushReply({
          form: this.form,
          slug: this.$route.params.slug,
        });
      },
      like() {
        if (this.$auth.isAuthenticated) {
          axios.post(`https://api.dihauti.ru/api/questions/${this.$route.params.slug}/like`)
            .then(res => {
              if (res.status === 201) {
                this.getQuestion.like_count += 1;
                this.getQuestion.likes.unshift({
                  user_id: this.user_id
                })
              } else {
                this.getQuestion.like_count -= 1;
                this.getQuestion.likes.splice({
                  user_id: this.user_id
                })
              }
            })
        }
      },
      ucFirst(str) {
        if (!str) return str;

        return str[0].toUpperCase() + str.slice(1);
      },
      questionUpdate() {
        this.questionShowUpdate = true
      },
      cancelQuestionUpdate() {
        this.questionShowUpdate = false
      },
      questionDelete() {
        let slug = this.$route.params.slug;
        swal.fire({
          title: 'Вы уверены?',
          text: "Обсуждение и все комментарии к нему будут полностью удалены",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Да, уверен!',
          cancelButtonText: 'Пожалуй, нет'
        }).then((result) => {
          if (result.value) {
            axios.delete(`https://api.dihauti.ru/api/questions/${slug}`)
              .then(() => {
                swal.fire('Отлично!', 'Обсуждение удалено', 'success')
                  .then(() => {
                    window.location = '/forum'
                  })
              })
              .catch(() => {
                swal.fire('Ошибка!', `Попробуйте позднее или обратитесь в тех.поддежку support@dihauti.ru`, 'error')
              })
          }
        })
      },
    },
    async mounted() {
      this.fetchQuestion(this.$route.params.slug);
      this.getResults();
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
