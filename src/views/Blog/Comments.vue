<template>
  <div class="container">
    <div class="flex-column width-10 align-self-start mg-bot-20 box-shadow" data-aos="fade-up" data-aos-easing="ease"
         v-if="!editing && !data.length > 0">
      <div class="flex-row flex-wrap space-between blue width-10 padding-10-20 align-items-center">
        <div class="flex-column">
          <div class="flex-row size-lead violet align-items-center">
            <h2 class="lead">
              <router-link :to="{ path: `/users/${data.user_slug}`}" style="margin-right: 3px">{{data.user}}
              </router-link>
            </h2>
            <div style="border-radius:50%; width:10px; height: 10px; background: darkred" v-if="!data.online"></div>
            <div style="border-radius:50%; width:10px; height: 10px; background: green" v-else></div>
          </div>
          <v-role></v-role>
        </div>
        <div class="flex-row align-items-center size-text" v-if="showUpdate">
          <div class="btn mg-l-10 mg-r-10" @click="startUpdate">
            <p>редактировать</p>
          </div>
          <div class="btn mg-l-10 mg-r-10" @click="commentDelete">
            <p>удалить</p>
          </div>
        </div>
      </div>
      <div class="padding-10-20">
        <div class="flex-column width-10">
          <viewer :value="data.body"></viewer>
        </div>
        <hr class="width-10">
        <div class="flex-row space-between align-items-center">
          <p class="size-text mg-top-10">
            {{data.created_at}}
          </p>
          <div class="size-text flex-row align-items-center" @click="like">
            <transition name="bounce">
              <v-like v-if="userLike" :likeColor="'rgba(223, 166, 207, 1)'" :count="data.like_count"></v-like>
            </transition>
            <transition name="bounce">
              <v-like v-if="!userLike" :likeColor="'rgba(45, 8, 4, 0.3)'" :count="data.like_count"></v-like>
            </transition>
          </div>
        </div>
      </div>
    </div>
    <form class="flex-column bg-violet width-9 mg-rl-auto box-shadow padding-20-40" @submit.prevent="submit" v-else>
      <div class="flex-column mg-bot-20 mg-top-20 width-10">
        <h3 class="size-lead white mg-bot-10">Редактор</h3>
        <editor
          :options="editorOptions"
          v-model="form.body"
          mode="wysiwyg"
        />
      </div>
      <button id="button-order" class="btn-pink size-text align-self-center mg-top-20">сохранить</button>
      <p class="btn-pink size-text align-self-center mg-top-20" @click="cancelUpdate">отменить</p>
    </form>
  </div>
</template>

<script>
  import {Editor} from '@toast-ui/vue-editor';
  import {Viewer} from '@toast-ui/vue-editor';
  import axios from 'axios';
  import swal from "sweetalert2";
  import {
    mapActions
  } from "vuex";

  export default {
    props: ['data'],
    components: {
      'editor': Editor,
      'viewer': Viewer,
    },
    data() {
      return {
        form: {
          body: this.data.body,
        },
        editing: false,
        editorOptions: {
          hideModelSwitch: false,
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
            'image',
            'link',
            'code',
            'codeblock'
          ]
        }
      }
    },
    computed: {
      showUpdate() {
        return +window.localStorage.getItem('id') === +this.data.user_id || this.$auth.isEditor();
      },
      userLike() {
        return this.isLiked()
      },
    },
    methods: {
      ...mapActions(["updateComment"]),
      isLiked() {
        if (this.data.likes !== undefined) {
          let user_like = this.data.likes.filter(like => like.user_id = +localStorage.getItem('id'));
          return user_like.length !== 0
        }
      },
      submit() {
        this.updateComment({
          id: this.data.id,
          form: this.form,
          slug: this.$route.params.slug,
        })
      },
      commentDelete() {
        if (+window.localStorage.getItem('id') === +this.data.user_id || this.$auth.isEditor()) {
          axios.delete(`https://api.dihauti.ru/api/posts/${this.$route.params.slug}/comments/${this.data.id}`)
            .then(() => {
              swal.fire('Отлично!', 'Комментарий удален', 'success')
                .then(function () {
                  window.location.reload()
                })
            })
            .catch(() => {
              swal.fire("Ошибка", 'Попробуйте позднее или обратитесь в тех.поддежку support@dihauti.ru', 'error')
            });
        }
      },
      like() {
        if (this.$auth.isCommentator()) {
          axios.post(`https://api.dihauti.ru/api/posts/${this.$route.params.slug}/comments/${this.data.id}/like`)
            .then(res => {
              if (res.status === 201) {
                this.data.like_count += 1;
                this.data.likes.unshift({
                  user_id: this.user_id
                })
              } else {
                this.data.like_count -= 1;
                this.data.likes.splice({
                  user_id: this.user_id
                })
              }
            })
        }
      },
      cancelUpdate() {
        this.editing = false
      },
      startUpdate() {
        this.editing = true
      }
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
