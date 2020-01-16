import axios from 'axios'
import swal from "sweetalert2";
export default {
    state: {
        posts: {},
        post: {},
        filterPost: {}
    },
    getters: {
        getPosts(state){
            return state.posts
        },
        getPost(state){
            return state.post
        },
        getFilterPost(state){
            return state.filterPost
        }
    },
    mutations: {
        setPosts(state, posts){
            state.posts = posts
        },
        setPost(state, post){
            state.post = post
        },
        setFilterPost(state, filterPost){
            state.filterPost = filterPost
        }
    },
    actions: {
        async fetchPosts(ctx, current_page) {
            const res = await axios.get('https://api.dihauti.ru/api/posts?page=' + current_page);
            ctx.commit("setPosts", res.data.data)
        },
        async fetchPost(ctx, slug) {
            const res = await axios.get(`https://api.dihauti.ru/api/posts/${slug}`);
            ctx.commit("setPost", res.data.data)
        },
        async fetchFilterPost(ctx) {
            const res = await axios.get(`https://api.dihauti.ru/api/sortedPosts`);
            ctx.commit("setFilterPost", res.data)
        },
        async createPost(ctx, objData) {
            const res = await axios.post('https://api.dihauti.ru/api/posts', {
                'title': objData.title,
                'blog_category_id': objData.blog_category_id,
                'body': objData.body,
                'description': objData.description
            });
            if (res.status === 201) {
                swal.fire('Отлично!','Пост добавлен','success')
                    .then(() =>  {
                        window.location = '/blog'});
            } else {
                swal.fire("Ошибка", 'Попробуйте позднее или обратитесь в тех.поддежку support@dihauti.ru', 'error')
            }
        },
        async updatePost(ctx, objData) {
            const res = await axios.put(`https://api.dihauti.ru/api/posts/${objData.slug}`, {
                'title': objData.form.title,
                'body': objData.form.body,
                'description': objData.form.description
            });
            if (res.status === 202) {
                swal.fire('Отлично!','Пост обновлен','success')
                    .then(() =>  {
                        window.location = `/blog/${objData.slug}`});
            } else {
                swal.fire("Ошибка", 'Попробуйте позднее или обратитесь в тех.поддежку support@dihauti.ru', 'error')
            }
        }
    },
}
