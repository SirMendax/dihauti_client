<template>
  <div class="container bg-white">
    <div class="flex-column bg-white width-8 mg-rl-auto dialog-window" id="dialog" data-aos="fade-up" data-aos-easing="ease" v-if="messages">

      <div v-for="message in messages" :key="message.id" class="box-shadow mg-top-10 mg-r-10 mg-l-10 padding-10-20" style="border-radius: 5px"
           :class="{'bg-white': myMessage(message), 'align-self-start': myMessage(message), 'bg-violet': !myMessage(message), 'white': !myMessage(message), 'align-self-end': !myMessage(message) }"
      >
        <div class="flex-row padding-5-10 size-text justify-content-start">
          {{message.sender}}
        </div>
        <div class="flex-row padding-5-10 size-text">
          {{message.text}}
        </div>
        <div class="flex-row padding-5-10 size-text justify-content-end">
          {{message.date}}
        </div>
      </div>
      <hr>
    </div>
    <form @submit.prevent="submit" class="mg-bot-10 mg-top-20 width-8 mg-rl-auto" v-if="messages">
      <textarea v-model="form.text" class="box-shadow bg-white"></textarea>
      <button class="btn size-text align-self-start white mg-top-10 mg-bot-10">ответить</button>
    </form>
  </div>
</template>

<script>
  import axios from "axios";

  export default {
    name: "Chat",
    data() {
      return {
        messages: null,
        dialog: null,
        user_id: localStorage.getItem('id'),
        form: {
          text: null,
        },
        myMessageClass: 'bg-white',
        notMyMessageClass: 'bg-opacity'
      }
    },
    mounted() {
      setTimeout(() => {
        this.scrollChat()
      }, 400);
      window.Echo.private(`dialog.${this.$route.params.id}`)
        .listen('MessageEvent', (data) => {
          this.messages.push(JSON.parse(data.data))
          this.scrollChat()
        });
    },
    methods: {
      submit() {
        axios.post(`https://api.dihauti.ru/api/messages/${this.$route.params.id}/send`, {
          recipient_id: this.recipient(this.dialog),
          dialog_id: this.$route.params.id,
          text: this.form.text,
        }).then(() => {
          this.form.text = null
            setTimeout(() => {
              this.scrollChat()
            }, 200)
        })
      },
      recipient(dialog) {
        if (+this.user_id !== +dialog.user_one.id) return dialog.user_one.id
        if (+this.user_id !== +dialog.user_two.id) return dialog.user_two.id
      },
      myMessage(message){
        return +message.sender_id === +this.user_id;
      },
      ucFirst(str) {
        if (!str) return str;
        return str[0].toUpperCase() + str.slice(1);
      },
      scrollChat(){
        let block = document.getElementById("dialog");
        block.scrollTop = block.scrollHeight;
      }
    },
    created() {
      axios.get(`https://api.dihauti.ru/api/messages/${this.$route.params.id}`)
        .then(res => this.messages = res.data.data)
        .catch(err => console.log(err));
      axios.get(`https://api.dihauti.ru/api/dialog/${this.$route.params.id}`)
        .then(res => this.dialog = res.data.data)
        .catch(err => console.log(err));
    }
  }
</script>

<style scoped>

</style>
