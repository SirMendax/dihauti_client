<template>
  <div class="container padding-20-40 min-height-vh">
    <div class="flex-row flex-wrap justify-content-start width-10 mg-bot-20" v-if="this.$auth.isAdmin()">
      <router-link :to="{ name: 'postCreate'}" class="btn size-text align-self-start white mg-r-10 mg-bot-10">Добавить
        материалы
      </router-link>
      <router-link :to="{ name: 'blogCategoryCreate'}" class="btn size-text align-self-start white mg-r-10 mg-bot-10">
        Создать категорию
      </router-link>
    </div>
    <div v-if="items && pagination">
      <div class="flex-column mg-bot-30 box-shadow" v-for="item in items" :key="item.id" data-aos="fade-up"
           data-aos-easing="ease">
        <div class="flex-row bg-violet white padding-10-20 box-shadow">
          <h2 class="size-lead">{{item.title}}</h2>
        </div>
        <div class="flex-column padding-10-20">
          <div class="flex-column meta-data">
            <p class="size-text mg-r-20"><i class="far fa-user"></i>
              <router-link :to="{ path: `/users/${item.user_slug}`}" style="color:#5e6973">{{item.user}}</router-link>
            </p>
            <p class="size-text mg-r-20"><i class="far fa-calendar-alt"></i>{{item.created_at}}</p>
            <p class="size-text mg-r-20"><i class="far fa-bookmark"></i>{{item.category}}</p>
            <div class="flex-row">
              <p class="size-text mg-r-20"><i class="far fa-eye"></i>{{item.view_count}}</p>
              <p class="size-text mg-r-20"><i class="far fa-comments"></i>{{item.comments_count}}</p>
              <p class="size-text mg-r-20"><i class="far fa-heart"></i>{{item.like_count}}</p>
            </div>
          </div>
          <div class="flex-column mg-top-10 mg-bot-10 width-10">
            <viewer :value="item.description"></viewer>
          </div>
          <div class="flex-row flex-wrap">
            <router-link :to='item.path' class="btn size-text align-self-start mg-r-20 box-shadow">читать</router-link>
          </div>
        </div>
      </div>
      <v-pagination v-if="pagination.last_page > 1" :pagination="pagination" :offset="5" @paginate="getResults()"></v-pagination>
    </div>
  </div>
</template>

<script>
  import {Viewer} from '@toast-ui/vue-editor';
  import axios from 'axios';

  export default {
    data() {
      return {
        items: {},
        pagination: {
          current_page: 1
        },
      }
    },
    components: {
      'viewer': Viewer
    },
    methods: {
      getResults() {
        axios.get('https://api.dihauti.ru/api/posts?page=' + this.pagination.current_page)
          .then(response => {
            this.items = response.data.data.data;
            this.pagination = response.data.data.pagination;
          })
          .catch(error => {
            console.log(error.response.data);
          });
      },
    },
    mounted() {
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
