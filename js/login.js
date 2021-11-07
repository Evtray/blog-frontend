const { createApp } = Vue;

const app = createApp({
  data() {
    return {
      user: {
        username: "",
        password: "",
      },
      url: "https://ublog-backend.herokuapp.com/",
      load: false,
      alert: false,
      error: false,
    };
  },
  mounted() {
    let localUser = JSON.parse(localStorage.getItem("user"));
    if (localUser != null) {
      window.location = "/frontend/views/Main.html";
    }
  },
  methods: {
    sendLogin() {
      let validate = true;
      for (let key in this.user) {
        if (this.user[key] == "") {
          this.alert = true;
          validate = false;
          break;
        }
      }
      if (validate) {
        this.load = true;
        axios
          .post(`${this.url}login`, this.user)
          .then(({ data }) => {
            console.log(data);
            if (data.status == 404) {
              this.error = true;
            }
            if (data.status == 200) {
              localStorage.setItem("user", JSON.stringify(data.user));
              localStorage.setItem("type", data.type);
              window.location = `/frontend/views/${
                data.type == "admin" ? "Admin" : "Main"
              }.html`;
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
