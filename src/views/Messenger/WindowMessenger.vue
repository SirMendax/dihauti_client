<template>
  <div class="container padding-20-40 min-height-vh">
      <div class="flex-column width-8 padding-10-20 mg-rl-auto" data-aos="fade-up" data-aos-easing="ease">
        <div class="flex-column mg-bot-20 mg-top-20 width-10">
          <h3 class="size-lead pink mg-bot-10">Пользователи</h3>
          <div class="select" v-if="contacts">
            <select class="blue width-10 box-shadow" v-model="recipient_id">
              <option v-for="item in contacts" :key="item.id"
                      :value="item.id">{{item.name}}
              </option>
            </select>
            <p class="btn mg-top-10" @click="startDialog(recipient_id)" v-if="recipient_id">написать</p>
          </div>
          <h3 class="size-lead pink mg-bot-10 mg-top-20">Диалоги</h3>
          <ul v-if="dialogs !== undefined || dialogs.length > 0" class="width-10">
            <li v-for="dialog in dialogs" :key="dialog.id" class="width-10 mg-bot-20 box-shadow">
              <router-link :to="'messages/' + dialog.id" class="font-size width-10">
                <div class="flex-column">
                  <div class="flex-column size-lead width-10 bg-violet white align-items-center justify-content-center padding-10-20">
                    <p v-if="+user_id !== +dialog.user_one.id">{{dialog.user_one.name}}</p>
                    <p v-if="+user_id !== +dialog.user_two.id">{{dialog.user_two.name}}</p>
                  </div>
                  <div class="flex-row width-10 violet size-text padding-5-10 space-between" v-if="dialog.last_message !== null">
                    <div class="flex-row padding-5-10 justify-content-start align-items-center width-7">
                      <p>{{dialog.last_message['sender']}} |</p>
                      <div class="mg-l-20">
                        {{dialog.last_message['text']}}
                      </div>
                    </div>
                    <div class="flex-row padding-5-10 justify-content-center align-items-center width-3">
                      <p>{{dialog.last_message['date']}}</p>
                    </div>
                  </div>
                  <div class="flex-row width-10 violet size-text padding-5-10 justify-content-center" v-else>
                    <p>сообщений нет</p>
                  </div>
                </div>
              </router-link>
            </li>
          </ul>
        </div>
      </div>
  </div>
</template>

<script>
  import axios from 'axios';
  export default {
    name: "WindowMessenger",
    data() {
      return {
        contacts: null,
        dialogs: null,
        recipient_id: null,
        user_id: localStorage.getItem('id'),
      }
    },
    created() {
      axios.get('https://api.dihauti.ru/api/contacts')
        .then(res => {
          this.contacts = res.data.data
        })
        .catch(err => console.log(err));

      axios.get('https://api.dihauti.ru/api/messages')
        .then(res => {
          this.dialogs = res.data.data
        })
        .catch(err => console.log(err));
    },
    methods: {
      startDialog(recipient_id){
        axios.post('https://api.dihauti.ru/api/startDialog', {
          recipient_id
        })
        .then((res) => {
          this.$router.push({ path: `/messages/${res.data.data.id}` })
        })
      }
    }
  }
</script>

<style scoped>

</style>
