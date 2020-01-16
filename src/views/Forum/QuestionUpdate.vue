<template>
    <div class="container padding-20-60">
        <form class="flex-column bg-violet width-9 mg-rl-auto box-shadow padding-20-40" @submit.prevent="submit">
            <div class="flex-row mg-bot-20 mg-top-20 width-10">
                <div class="group width-10">
                    <h3 class="size-lead white mg-bot-10 mg-top-10">Название</h3>
                    <input v-model="form.title" type="text" class="width-10">
                    <span class="highlight"></span>
                    <span class="bar"></span>
                </div>
            </div>
            <div class="flex-column mg-bot-20 mg-top-20 width-10">
                <h3 class="size-lead white mg-bot-10">Редактор</h3>
                <editor
                        class="bg-white"
                        :options="editorOptions"
                        :visible="editorVisible"
                        :html="editorHtml"
                        previewStyle="vertical"
                        v-model="form.body"
                >
                </editor>
            </div>
            <div class="flex-row flex-wrap align-self-center">
                <button id="button-order" class="btn-pink size-text align-self-center mg-top-20 mg-r-10 mg-l-10">отправить</button>
                <p class="btn-pink size-text align-self-center mg-top-20 mg-r-10 mg-l-10" @click="cancelUpdate">отменить</p>
            </div>
        </form>
    </div>
</template>

<script>
    import { Editor } from '@toast-ui/vue-editor';
    import {
        mapActions, mapGetters
    } from "vuex";
    export default {
        components: {
            'editor': Editor,
        },
        props: ['question'],
        data() {
            return {
                form: {
                    title: this.question.title,
                    body: this.question.body,
                },
                editorHtml: '',
                editorVisible: true,
                editorOptions: {
                    hideModelSwitch: false,
                    minHeight: '600px',
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
            ...mapGetters([
                'getQuestion'
            ]),
        },
        methods: {
            ...mapActions(["updateQuestion"]),
            submit() {
                this.$emit('cancel-question-update')
                this.updateQuestion({
                    form: this.form,
                    slug: this.$route.params.slug,
                })
            },
            cancelUpdate(){
                this.$emit('cancel-question-update')
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