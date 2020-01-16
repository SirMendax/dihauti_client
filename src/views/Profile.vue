<template>
  <div class="container padding-20-40 min-height-vh">

    <div v-if="!showVerify">
      <div class="flex-column box-shadow" data-aos="fade-up" data-aos-easing="ease" v-if="!editing">
        <div class="flex-row space-between padding-10-20 bg-violet white align-items-center"
             style="min-height: 62px">
          <h3 class="size-lead">{{profile.name}}</h3>
          <div class="flex-row" v-if="showUpdate">
            <p @click="startProfileUpdate" class="btn-pink size-text mg-r-10 mg-l-10"><i
              class="fas fa-edit"></i></p>
            <p @click="deleteProfile" class="btn-pink size-text mg-r-10 mg-l-10"><i
              class="far fa-trash-alt"></i></p>
          </div>
        </div>
        <div class="flex-column padding-10-20 size-text">
          <p class="mg-bot-10 mg-top-10">Имя: {{profile.first_name}}</p>
          <p class="mg-bot-10 mg-top-10">Пол: {{profile.sex}}</p>
          <p class="mg-bot-10 mg-top-10">Город: {{profile.city}}</p>
          <p class="mg-bot-10 mg-top-10">Подпись профиля: {{profile.quote}}</p>
        </div>

        <div class="flex-column padding-10-20" v-if="showUpdate">

          <div class="flex-row mg-bot-20">
            <div class="btn" v-if="!editingLogin" @click="startEditingLogin">изменить логин</div>
            <div v-else>
              <form @submit.prevent="editLogin" class="flex-column">
                <div class="group mg-bot-30 mg-top-20">
                  <label class="size-text">Введите новый логин</label>
                  <input v-model="new_name" type="text" class="width-10" required>
                  <span class="highlight"></span>
                  <span class="bar"></span>
                </div>
                <div class="flex-row align-items-center justify-content-start">
                  <button class="btn mg-l-10">сохранить</button>
                  <p class="btn mg-l-10" @click="cancelEditingLogin">отменить</p>
                </div>
              </form>
            </div>
          </div>

          <div class="flex-row mg-bot-20">
            <div class="btn" v-if="!editingPassword" @click="startEditingPassword">изменить пароль</div>
            <div v-else>
              <form @submit.prevent="editPassword" class="flex-column">
                <div class="group mg-bot-30 mg-top-20">
                  <label class="size-text">Введите новый пароль</label>
                  <input v-model="new_password" type="password" class="width-10" required>
                  <span class="highlight"></span>
                  <span class="bar"></span>
                </div>
                <div class="flex-row align-items-center justify-content-start">
                  <button class="btn mg-l-10">сохранить</button>
                  <p class="btn mg-l-10" @click="cancelEditingPassword">отменить</p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <v-edit-profile v-if="editing" :data="profile"
                      @cancel-profile-update="cancelProfileUpdate">
      </v-edit-profile>
    </div>


    <div v-else>
      <form @submit.prevent="verify" class="padding-10-20 flex-column">
        <div class="flex-row mg-bot-20 mg-top-20 width-8">
          <div class="bg-violet white input-icon padding-10">
            <i class="fas fa-key" style="font-size: 22px;"></i>
          </div>
          <div class="group">
            <label class="size-text">Введите ключ верификации, который был отправлен вам на почту</label>
            <input v-model="code" type="text" class="width-10" required>
            <span class="highlight"></span>
            <span class="bar"></span>
          </div>
        </div>
        <button :disabled="!code" class="btn mg-top-20 align-self-center mg-bot-30">отправить</button>
      </form>
    </div>
  </div>
</template>

<script>
  import axios from 'axios'
  import EditProfile from "./EditProfile";
  import swal from "sweetalert2";

  export default {
    name: "Profile",
    components: {
      'v-edit-profile': EditProfile,
    },
    data() {
      return {
        code: null,
        profile: {},
        editing: false,
        editingLogin: false,
        editingPassword: false,
        new_password: '',
        new_name: '',
      }
    },
    computed: {
      showUpdate() {
        return +window.localStorage.getItem('id') === +this.profile.id;
      },
      showVerify() {
        return +window.localStorage.getItem('role') === +0;
      }
    },
    created () {
      // fetch the data when the view is created and the data is
      // already being observed
      this.fetchData()
    },
    watch: {
      // call again the method if the route changes
      '$route': 'fetchData'
    },
    methods: {
      fetchData(){
        axios.get(`https://api.dihauti.ru/api/users/${this.$route.params.slug}`)
          .then(res => {
            this.profile = res.data.data;
          })
      },
      startProfileUpdate() {
        this.editing = true
      },
      verify() {
        axios.post('https://api.dihauti.ru/api/verify', {
          verification_code: this.code
        })
          .then(response => {
            window.localStorage.setItem('role', response.data.data);
            window.location.reload()
          })
          .catch(err => {
            swal.fire('Ошибка!', `${err.response.data.message}`, 'error')
          })
      },
      deleteProfile() {
        swal.fire({
          title: 'Вы уверены?',
          text: 'Нажав ок, вы полностью удалите свой профиль',
          icon: 'warning',
          showCloseButton: true,
          showCancelButton: true,
        }).then((result) => {
          if (result.value) {
            axios.delete(`https://api.dihauti.ru/api/users/delete`)
              .then(() => {
                window.location.reload()
              })
              .catch(error => {
                swal.fire('Ошибка!', `${error.message}`, 'error')
              })
          }
        })
      },
      editLogin() {
        axios.put(`https://api.dihauti.ru/api/users/loginUpdate`, {
          new_name: this.new_name
        })
          .then(() => {
            window.location.reload()
          })
          .catch(error => {
            swal.fire('Ошибка!', `${error.message}`, 'error')
          })
      },
      editPassword() {
        axios.put(`https://api.dihauti.ru/api/users/passwordUpdate`, {
          new_password: this.new_password
        })
          .then(() => {
            this.cancelEditingPassword()
          })
          .catch(error => {
            swal.fire('Ошибка!', `${error.message}`, 'error')
          })
      },
      cancelProfileUpdate() {
        this.editing = false
      },
      startEditingLogin() {
        this.editingLogin = true
      },
      startEditingPassword() {
        this.editingPassword = true
      },
      cancelEditingLogin() {
        this.editingLogin = false
      },
      cancelEditingPassword() {
        this.editingPassword = false
      }
    }
  }
</script>
