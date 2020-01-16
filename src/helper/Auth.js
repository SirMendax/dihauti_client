export default function (Vue) {
  Vue.auth = {
    setToken(token, expires, user, id, role) {
      window.localStorage.setItem('token', token);
      window.localStorage.setItem('expires', expires);
      window.localStorage.setItem('user', user);
      window.localStorage.setItem('id', id);
      window.localStorage.setItem('role', role);
    },
    getToken() {
      let token = window.localStorage.getItem('token');
      let expires = window.localStorage.getItem('expires');

      if (!token && !expires) return null;

      if (Date.now() > Date.parse(expires)) {
        console.log('destroy');
        this.destroyToken();
        window.location = '/login';
      }

      return token;
    },
    destroyToken() {
      window.localStorage.removeItem('token');
      window.localStorage.removeItem('expires');
      window.localStorage.removeItem('user');
      window.localStorage.removeItem('id');
      window.localStorage.removeItem('role');
    },
    isAuthenticated() {
      return !!this.getToken();
    },
    checkBan() {
      return +window.localStorage.getItem('role') === +4;
    },
    isAdmin() {
      let roles = JSON.parse(window.localStorage.getItem('role'));

      var i = 0;
      for(i in roles) {
        if(roles[i].name === "ROLE_ADMIN") return true;
      }

      return false
    },
    isEditor() {
      let roles = JSON.parse(window.localStorage.getItem('role'));

      var i = 0;
      for(i in roles) {
        if(roles[i].name === "ROLE_EDITOR" || this.isAdmin()) return true;
      }

      return false
    },
    isCommentator() {
      let roles = JSON.parse(window.localStorage.getItem('role'));

      var i = 0;
      for(i in roles) {
        if(roles[i].name === "ROLE_COMMENTATOR" || this.isAdmin()) return true;
      }

      return false
    }
  };
  Object.defineProperties(Vue.prototype, {
    $auth: {
      get() {
        //getter return Vue object
        return Vue.auth
      }
    }
  })
}
