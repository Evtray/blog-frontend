const { createApp } = Vue;

const app = createApp({
  data() {
    return {
      user: {
        id: 1,
        name: "",
        gender: "",
        username: "",
        email: "",
        password: "",
      },
      url: "https://ublog-backend.herokuapp.com/",
      load: false,
      alert: false,
      alertUsername: false,
      alertPassword: false,
      alertEmail: false,
      success: false,
    };
  },
  mounted() {
    let localUser = JSON.parse(localStorage.getItem("user"));
    let typeUser = localStorage.getItem("type");
    this.user = localUser;
    if (typeUser == "admin") {
      this.load = true;
    }
  },
  methods: {
    updateProfile() {
      this.alert = false;
      this.alertPassword = false;
      this.alertUsername = false;
      this.alertEmail = false;

      let validate = true;
      for (let key in this.user) {
        if (Array.isArray(this.user[key])) {
          continue;
        }
        if (key == "posts") {
          continue;
        }
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
          .post(`${this.url}user-update`, this.user)
          .then(({ data }) => {
            if (data.status == 404) {
              this.alertUsername = true;
            } else {
              localStorage.setItem("user", JSON.stringify(this.user));
              localStorage.setItem("type", "user");
              location.reload(true);
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
