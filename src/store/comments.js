import axios from 'axios'
import swal from "sweetalert2";
export default {
    state: {
        comments: {},
    },
    getters: {
        getComments(state) {
            return state.comments
        },
    },
    mutations: {
        setComments(state, comments) {
            state.comments = comments
        },
        addComment: (state, comment) => {
            state.comments.unshift(comment);
        },
    },
    actions: {
        async fetchComments(ctx, slug) {
            const res = await axios.get(`https://api.dihauti.ru/api/posts/${slug}/comments`);
            ctx.commit("setComments", res.data.data)
        },
        async pushComment(ctx, objData) {
            const res = await axios.post(`https://api.dihauti.ru/api/posts/${objData.slug}/comments`, {
                body: objData.form.body,
            });
            if (res.status === 201) {
                swal.fire('Отлично!','Ваше комментарий  добавлен','success')
                    .then(() => {
                        window.location.reload()
                    })
            } else {
                swal.fire("Ошибка", 'Попробуйте позднее или обратитесь в тех.поддежку support@dihauti.ru', 'error')
            }
        },
        async updateComment(ctx, objData) {
            const res = await axios.put(`https://api.dihauti.ru/api/posts/${objData.slug}/comments/${objData.id}`, {
                'body': objData.form.body,
            });
            if (res.status === 202) {
                swal.fire('Отлично!','Комментарий обновлен','success')
                    .then(() => {
                        window.location = `/blog/${objData.slug}`})
            } else {
                swal.fire("Ошибка", 'Попробуйте позднее или обратитесь в тех.поддежку support@dihauti.ru', 'error')
            }
        }
    }
}
