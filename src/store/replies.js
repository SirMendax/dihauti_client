import axios from 'axios'
import swal from "sweetalert2";
export default {
    state: {
        replies: {},
        reply: {},
    },
    getters: {
        getReplies(state) {
            return state.replies
        },
    },
    mutations: {
        setReplies(state, replies) {
            state.replies = replies
        },
        addReply: (state, reply) => {
            state.replies.unshift(reply);
        },
    },
    actions: {
        async pushReply(ctx, objData) {
            const res = await axios.post(`https://api.dihauti.ru/api/questions/${objData.slug}/replies`, {
                body: objData.form.body,
            });
            if (res.status === 201) {
                swal.fire('Отлично!','Ваше сообщение отправлено','success')
                    .then(() => {
                        window.location.reload()
                    })
            } else {
                swal.fire("Ошибка", 'Попробуйте позднее или обратитесь в тех.поддежку support@dihauti.ru', 'error')
            }
        },
        async updateReply(ctx, objData) {
            const res = await axios.put(`https://api.dihauti.ru/api/questions/${objData.slug}/replies/${objData.id}`, {
                'body': objData.form.body,
            });
            if (res.status === 202) {
                swal.fire('Отлично!','Ваше сообщение обновлено','success')
                    .then(() => {
                        window.location = `/forum/${objData.slug}`})
            } else {
                swal.fire("Ошибка", 'Попробуйте позднее или обратитесь в тех.поддежку support@dihauti.ru', 'error')
            }
        },
    }
}
