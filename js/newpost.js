const { createApp } = Vue;

const app = createApp({
  data() {
    return {
      post: {
        type: "",
        url: "",
        category: "",
      },
      url: "http://127.0.0.1:4000/",
      load: false,
      alert: false,
    };
  },
  mounted() {

  },
  methods: {
    newPost() {
      this.alert = false;
      let validate = true;
      for (let key in this.post) {
        if (this.post[key] == "") {
          this.alert = true;
          validate = false;
          return;
        }
      }
      if (validate) {
        this.load = true;
        let localUser = JSON.parse(localStorage.getItem("user"));

        this.post.author = localUser.name;
        axios
          .post(`${this.url}new-post`, this.post)
          .then(({ data }) => {
            window.location = "/frontend/views/Main.html";
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