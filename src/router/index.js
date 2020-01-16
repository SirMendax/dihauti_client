import Vue from 'vue'

import VueRouter from 'vue-router'

import Home from '../views/Home.vue'
import Forum from '../views/Forum/Forum.vue'
import Blog from '../views/Blog/Blog.vue'
import Post from '../views/Blog/Post.vue'
import Profile from '../views/Profile.vue'
import Question from '../views/Forum/Question.vue'
import Category from '../views/Forum/Category.vue'
import CategoryCreate from '../views/Forum/CategoryCreate.vue'
import BlogCategoryCreate from '../views/Blog/BlogCategoryCreate.vue'
import PostCreate from '../views/Blog/PostCreate.vue'
import QuestionCreate from '../views/Forum/QuestionCreate.vue'
import Registry from '../views/Registry.vue'
import Logout from '../views/Logout.vue'
import Login from '../views/Login.vue'
import EditRole from '../views/EditRole.vue'
import WindowMessenger from "../views/Messenger/WindowMessenger";
import Chat from "../views/Messenger/Chat";

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
  },
  {
    path: '/login',
    name: 'login',
    component: Login,
  },
  {
    path: '/blog',
    name: 'blog',
    props: true,
    component: Blog,
  },
  {
    path: '/blog/create',
    name: 'postCreate',
    props: true,
    component: PostCreate,
    meta: { requiresAuth: true, bannedUser: true  }
  },
  {
    path: '/category/:slug',
    name: 'category',
    props: true,
    component: Category,
    meta: { requiresAuth: true, bannedUser: true  }
  },
  {
    path: '/blog/:slug',
    name: 'post',
    props: true,
    component: Post,
  },
  {
    path: '/categoryCreate',
    name: 'categoryCreate',
    component: CategoryCreate,
    meta: { requiresAuth: true, bannedUser: true  }
  },
  {
    path: '/blogCategoryCreate',
    name: 'blogCategoryCreate',
    component: BlogCategoryCreate,
    meta: { requiresAuth: true, bannedUser: true  }
  },
  {
    path: '/registry',
    name: 'registry',
    component: Registry,
  },
  {
    path: '/logout',
    name: 'logout',
    component: Logout,
    meta: { requiresAuth: true, bannedUser: true  }
  },
  {
    path: '/forum',
    name: 'forum',
    component: Forum,
    props: true,
    meta: { requiresAuth: true, bannedUser: true  }
  },
  {
    path: '/editRole',
    name: 'editRole',
    component: EditRole,
    props: true,
    meta: { requiresAuth: true, bannedUser: true  }
  },
  {
    path: '/users/:slug',
    name: 'users',
    component: Profile,
    meta: { requiresAuth: true, bannedUser: true  }
  },
  {
    path: '/forum/:slug',
    name: 'Question',
    component: Question,
    meta: { requiresAuth: true, bannedUser: true  }
  },
  {
    path: '/forum/create',
    name: 'questionCreate',
    component: QuestionCreate,
    meta: { requiresAuth: true, bannedUser: true }
  },
  {
    path: '/messages',
    name: 'messenger',
    component: WindowMessenger,
    meta: { requiresAuth: true, bannedUser: true }
  },
  {
    path: '/messages/:id',
    name: 'chat',
    component: Chat,
    meta: { requiresAuth: true, bannedUser: true }
  }
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!Vue.auth.isAuthenticated()) {
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      })
    } else {
      next()
    }
  } else {
    next()
  }
});

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.bannedUser)) {
    if (Vue.auth.checkBan()) {
      next({
        path: '/',
        query: { redirect: to.fullPath }
      })
    } else {
      next()
    }
  } else {
    next()
  }
});

export default router
