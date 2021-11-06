app.component("appheader", {
  template: /* vue-html */ `
    <div v-if="view" class="bg-white shadow-sm" style="margin-bottom: 20px;">
    <div class="p-2 d-flex justify-content-between feed-mw">
      <div class="d-flex align-items-end">
        <a href="/frontend/views/Index.html">
          <h4 class="fw-bolder text-black"><span class="text-info">U</span><span class="">Blog</span></h4>
        </a>
      </div>
      <div class="d-flex align-items-center">
          <a v-if="type == 'admin'" href="/frontend/views/Admin.html" class="text-muted mx-4"><span><i class="fas fa-user-cog"></i></span></a>
          <a v-if="type == 'admin'" href="/frontend/views/Main.html" class="text-muted"><span><i class="fas fa-home"></i></span></a>
          <a href="/frontend/views/NewPost.html" class="text-muted mx-4"><span><i class="fas fa-plus"></i></span></a>
        <div class="text-end">
          <a href="/frontend/views/UpdateProfile.html" class="d-flex align-items-center text-muted">{{ user.name }}
          </a>
          <a href="" @click="logout()">Cerrar sesión</a>
        </div>
      </div>
    </div>
  </div>
    `,
  data() {
    return {
      user: {
        name: {},
      },
      type: "user",
      view: false
    };
  },
  created() {
    let localUser = JSON.parse(localStorage.getItem("user"));
    let localType = localStorage.getItem("type");
    if (localUser == null) {
      window.location = "/frontend/views/Login.html";
    } else {
      this.user = localUser;
      this.type = localType;
      this.view = true;
    }
  },
  methods: {
    logout() {
      localStorage.removeItem("user");
      window.location = "/frontend/views/Login.html";
    },
  },
});
