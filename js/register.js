const { createApp } = Vue;

const app = createApp({
  data() {
    return {
      user: {
        name: "",
        gender: "",
        username: "",
        email: "",
        password: "",
      },
      url: "http://127.0.0.1:4000/",
      load: false,
      alert: false,
      alertUsername: false,
      alertPassword: false,
      alertEmail: false,
    };
  },
  mounted() {
    let localUser = JSON.parse(localStorage.getItem("user"));
    if (localUser != null) {
      window.location = "/frontend/views/Main.html";
    }
  },
  methods: {
    sendRegister() {
      this.alert = false;
      this.alertPassword = false;
      this.alertUsername = false;
      this.alertEmail = false;

      let validate = true;
      for (let key in this.user) {
        if (this.user[key] == "") {
          this.alert = true;
          validate = false;
          return;
        }
      }
      if (this.user.password.length < 8) {
        this.alertPassword = true;
        validate = false;
        return;
      }
      if (!this.user.email.includes("@") || !this.user.email.includes(".")) {
        this.alertEmail = true;
        validate = false;
        return;
      }
      if (validate) {
        this.load = true;
        axios
          .post(`${this.url}register`, this.user)
          .then(({ data }) => {
            if (data.status == 404) {
              this.alertUsername = true;
            } else {
              localStorage.setItem("user", JSON.stringify(data.user));
              window.location = "/frontend/views/Main.html";
              localStorage.setItem("type", "user");
            }
          })
          .catch(() => {
            console.log("Error");
          })
          .finally(() => {
            this.load = false;
          });
      }
    },
  },
});
app.mount("#app");
