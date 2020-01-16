import axios from 'axios'
import swal from 'sweetalert2'
export default {
    state: {
        questions: {},
        question: {},
        sortedQuestionReplies: {},
        sortedQuestionCategory: {}
    },
    getters: {
        getQuestions(state){
            return state.questions
        },
        getQuestion(state){
            return state.question
        },
        getSortedQuestionCategory(state){
            return state.sortedQuestionCategory
        },
        getSortedQuestionReplies(state){
            return state.sortedQuestionReplies
        }
    },
    mutations: {
        setQuestions(state, questions){
            state.questions = questions
        },
        setQuestion(state, question){
            state.question = question
        },
        setSortedQuestionCategory(state, sortedQuestionCategory){
            state.sortedQuestionCategory = sortedQuestionCategory
        },
        setSortedQuestionReplies(state, sortedQuestionCategory){
            state.sortedQuestionReplies = sortedQuestionCategory
        }
    },
    actions: {
        async fetchQuestions(ctx) {
            const res = await axios.get("https://api.dihauti.ru/api/questions")
            ctx.commit("setQuestions", res.data.data)
        },
        async fetchQuestion(ctx, slug) {
            const res = await axios.get(`https://api.dihauti.ru/api/questions/${slug}`)
            ctx.commit("setQuestion", res.data.data)
        },
        async createQuestion(ctx, objData) {
            const res = await axios.post('https://api.dihauti.ru/api/questions', objData)
            if (res.status === 201) {
                swal.fire('Отлично!','Обсуждение создано','success')
                    .then(() =>  {
                        window.location = '/forum'});
            } else {
                swal.fire("Ошибка", 'Попробуйте позднее или обратитесь в тех.поддежку support@dihauti.ru', 'error')
            }
        },
        async updateQuestion(ctx, objData) {
            const res = await axios.put(`https://api.dihauti.ru/api/questions/${objData.slug}`, {
                'title': objData.form.title,
                'body': objData.form.body,
            });
            if (res.status === 202) {
                swal.fire('Отлично!','Обсуждение обновлено','success')
                    .then(() =>  {
                        window.location = `/forum/${objData.slug}`});
            } else {
                swal.fire("Ошибка", 'Попробуйте позднее или обратитесь в тех.поддежку support@dihauti.ru', 'error')
            }
        }
    },
}
