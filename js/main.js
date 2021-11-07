const { createApp } = Vue;

const app = createApp({
  data() {
    return {
      posts: [],
      url: "http://127.0.0.1:5000/",
      load: false,
      loadLike: false,
      user: {
        id: 1,
      },
    };
  },
  mounted() {
    let localUser = JSON.parse(localStorage.getItem("user"));
    this.user = localUser;
    this.getPosts();
  },
  methods: {
    getPosts() {
      this.load = true;
      axios
        .get(`${this.url}posts`)
        .then(({ data }) => {
          this.posts = data;
        })
        .catch(() => {
          console.log("Error");
        })
        .finally(() => {
          this.load = false;
        });
    },
    likePost(id, status) {
      this.loadLike = true;
      axios
        .post(`${this.url}like-post`, {
          userId: this.user.id,
          postId: id,
          status: status ? 1 : 0,
        })
        .then(({ data }) => {
          this.posts = data;
        })
        .catch(() => {
          console.log("Error");
        })
        .finally(() => {
          this.loadLike = false;
        });
    },
    getUrlVideo(url) {
      return `${url.slice(0, 24)}embed/${url.slice(24)}`;
    },
  },
});
