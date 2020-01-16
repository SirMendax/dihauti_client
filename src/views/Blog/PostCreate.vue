<template>
    <div class="container padding-20-60 min-height-vh">
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
                <h3 class="size-lead white mg-bot-10">Категория</h3>
                <div class="select">
                    <select class="blue width-10" v-model="form.blog_category_id">
                        <option v-for="item in categories" :key="item.id"
                                :value="item.id">{{item.name}}</option>
                    </select>
                </div>
            </div>
            <div class="flex-row mg-bot-20 mg-top-20 width-10">
                <div class="group width-10">
                    <h3 class="size-lead white mg-bot-10 mg-top-10">Описание</h3>
                    <textarea v-model="form.description" type="text" class="width-10"></textarea>
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
            <button id="button-order" class="btn-pink size-text align-self-center mg-top-20">отправить</button>
        </form>
    </div>
</template>

<script>
    import { Editor } from '@toast-ui/vue-editor';
    import {
        mapActions,
    } from "vuex";
    import axios from 'axios';

    export default {
        components: {
            'editor': Editor,
        },
        data() {
            return {
                form: {
                    title: null,
                    blog_category_id: null,
                    body: '',
                    description: '',
                },
                categories: null,
                editorOptions: {
                    hideModelSwitch: true,
                    minHeight: '500px',
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
        created(){
          this.getCategories()
        },
        methods: {
            ...mapActions(["createPost"]),
            submit() {
                this.createPost(this.form)
            },
            getCategories(){
                axios.get('https://api.dihauti.ru/api/blogCategories')
                    .then(res => {
                        this.categories = res.data.data
                    })
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
