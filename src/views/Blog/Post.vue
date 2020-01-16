<template>
  <div class="container padding-20-60 min-height-vh">
    <div class="flex-column width-10 mg-bot-20 box-shadow" data-aos="fade-up" data-aos-easing="ease" v-if="getPost">
      <div v-if="!postShowUpdate">
        <h2 class="size-title padding-10-20 bg-violet white">{{getPost.title}}</h2>
        <div class="flex-column padding-10-20" data-aos="fade-up" data-aos-easing="ease">
          <div class="size-text mg-top-10 flex-row align-items-center" style="color:#5e6973">
            <router-link :to="{ path: `/users/${getPost.user_slug}`}" style="color:#5e6973; margin-right: 3px">
              {{getPost.user}}
            </router-link>
            <div style="border-radius:50%; width:10px; height: 10px; background: darkred" v-if="!getPost.online"></div>
            <div style="border-radius:50%; width:10px; height: 10px; background: green" v-else></div>
          </div>
          <p class="size-text mg-top-10" style="color:#5e6973">{{getPost.created_at}}</p>
          <div class="mg-top-10 mg-bot-10">
            <viewer :value="getPost.body"></viewer>
          </div>
        </div>
        <div class="padding-10-20 mg-bot-20">
          <div class="flex-row justify-content-start mg-bot-20" v-if="showUpdate" style="float: left">
            <div class="btn mg-l-10 mg-r-10" @click="postUpdate">
              <p>редактировать</p>
            </div>
            <div class="btn mg-l-10 mg-r-10" v-if="this.$auth.isAdmin()" @click="postDelete">
              <p>удалить</p>
            </div>
          </div>
          <div class="size-text mg-r-20 flex-row align-items-center" @click="like" style="float: right">
            <p class="size-text mg-r-20" style="color:rgba(45, 8, 4, 0.3)"><i class="far fa-eye"></i>
              {{getPost.view_count}}</p>
            <transition name="bounce">
              <v-like v-if="userLike" :likeColor="'rgba(223, 166, 207, 1)'" :count="getPost.like_count"></v-like>
            </transition>
            <transition name="fade">
              <v-like v-if="!userLike" :likeColor="'rgba(45, 8, 4, 0.3)'" :count="getPost.like_count"></v-like>
            </transition>
          </div>
        </div>
      </div>
      <div v-else>
        <v-post-update @cancel-post-update="cancelPostUpdate" :post="getPost"></v-post-update>
      </div>
    </div>
    <div class="flex-column width-10 mg-rl-auto mg-top-30" id="startComment">
      <div class="flex-row justify-content-start meta-data mg-bot-10" data-aos="fade-up" data-aos-easing="ease">
        <h2 class="size-lead blue mg-r-20">Комментарии</h2>
        <p class="size-lead">{{getPost.comments_count}}</p>
      </div>
      <v-comments v-for="comment in comments" :key="comment.id" :data="comment"></v-comments>
      <v-pagination v-if="pagination.last_page > 1" :pagination="pagination" :offset="5" @paginate="getResults()"></v-pagination>
    </div>
    <div class="flex-column width-10 mg-rl-auto mg-top-30 padding-10-20" data-aos="fade-up" data-aos-easing="ease"
         v-if="this.$auth.isCommentator()">
      <div class="flex-column width-10 align-self-start mg-bot-20 box-shadow">
        <div class="flex-row padding-10-20 bg-violet white size-lead">
          <p>{{form.user}}</p>
        </div>
        <form @submit.prevent="submit" class="flex-column mg-bot-20 mg-top-20 width-10 padding-10-20">
          <editor
            :options="editorOptions"
            v-model="form.body"
            mode="wysiwyg"
          />
          <button class="btn size-text align-self-center mg-top-20">оставить комментарий</button>
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
  import PostUpdate from "./PostUpdate.vue";
  import Comments from "./Comments.vue";
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
      'v-post-update': PostUpdate,
      'v-comments': Comments,
    },
    data() {
      return {
        form: {
          user_id: localStorage.getItem('id'),
          user: this.ucFirst(localStorage.getItem('user')),
          body: null,
        },
        comments: {},
        pagination: {
          current_page: 1
        },
        postShowUpdate: false,
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
        'getPost'
      ]),
      showUpdate() {
        return +window.localStorage.getItem('id') === +this.getPost.user_id || this.$auth.isEditor();
      },
      userLike() {
        return this.isLiked()
      },
    },
    methods: {
      ...mapActions(["fetchPost", "pushComment", "updatePost"]),
      getResults() {
        axios.get(`https://api.dihauti.ru/api/posts/${this.$route.params.slug}/comments?page=` + this.pagination.current_page)
          .then(response => {
            this.comments = response.data.data.data;
            this.pagination = response.data.data.pagination;
          })
          .catch(error => {
            console.log(error.response.data);
          });
      },
      isLiked() {
        if (this.getPost.likes !== undefined) {
          let user_like = this.getPost.likes.filter(like => like.user_id = +localStorage.getItem('id'));
          return user_like.length !== 0
        }
      },
      submit() {
        this.pushComment({
          form: this.form,
          slug: this.$route.params.slug,
        });
      },
      like() {
        if (this.$auth.isAuthenticated) {
          axios.post(`https://api.dihauti.ru/api/posts/${this.$route.params.slug}/like`)
            .then(res => {
              if (res.status === 201) {
                this.getPost.like_count += 1;
                this.getPost.likes.unshift({
                  user_id: this.user_id
                })
              } else {
                this.getPost.like_count -= 1;
                this.getPost.likes.splice({
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
      postUpdate() {
        this.postShowUpdate = true
      },
      cancelPostUpdate() {
        this.postShowUpdate = false
      },
      postDelete() {
        let slug = this.$route.params.slug;
        swal.fire({
          title: 'Вы уверены?',
          text: "Пост и все комментарии к нему будут полностью удалены",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Да, уверен!',
          cancelButtonText: 'Пожалуй, нет'
        }).then((result) => {
          if (result.value) {
            axios.delete(`https://api.dihauti.ru/api/posts/${slug}`)
              .then(() => {
                swal.fire('Отлично!', 'Пост удален', 'success')
                  .then(() => {
                    window.location = '/blog'
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
      this.fetchPost(this.$route.params.slug);
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
