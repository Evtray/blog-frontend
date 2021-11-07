const { createApp } = Vue;

const app = createApp({
  data() {
    return {
      user: {
        name: "",
      },
      users: [],
      posts: [],
      type: "",
      view: false,
      loadUsers: false,
      loadPosts: false,
      loadDelete: false,
      loadUpdate: false,
      loadLoad: false,
      url: "https://ublog-backend.herokuapp.com/",
      typeDelete: "post",
      itemDelete: 0,

      typeUpdate: "post",
      itemUpdate: 0,
      item: {},
      alert: false,
      alertUsername: false,
      alertPassword: false,
      alertEmail: false,
      success: false,
      typeLoad: false,
      fileLoad: null,
      dataMassive: [],
      chartdata: {
        labels: ["January", "February"],
        datasets: [
          {
            label: "Data One",
            backgroundColor: "#f87979",
            data: [40, 20],
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
      },
      myChartUsers: null,
      myChartPosts: null,
    };
  },
  mounted() {
    let localType = localStorage.getItem("type");
    if (localType == "user") {
      window.location = "/views/Main.html";
    } else {
      this.view = true;
      this.getUsers();
      this.getPosts();
    }
  },
  methods: {
    getUsers() {
      this.loadUsers = true;
      axios
        .get(`${this.url}users`)
        .then(({ data }) => {
          this.users = data;
          this.users.splice(0, 1);

          const values = this.users
            .sort((a, b) => b.posts - a.posts)
            .slice(0, 5);
          this.makeChartUsers(
            values.map((value) => {
              return value.name;
            }),
            values.map((value) => {
              return value.posts;
            })
          );
        })
        .catch(() => {
          console.log("Error");
        })
        .finally(() => {
          this.loadUsers = false;
        });
    },
    getPosts() {
      this.loadPosts = true;
      axios
        .get(`${this.url}posts`)
        .then(({ data }) => {
          this.posts = data;
          let values = data
            .sort((a, b) => b.likes.length - a.likes.length)
            .slice(0, 5);

          this.makeChartPosts(
            values.map((value) => {
              return `${value.author}-${value.category}`;
            }),
            values.map((value) => {
              return value.likes.length;
            })
          );
        })
        .catch(() => {
          console.log("Error");
        })
        .finally(() => {
          this.loadPosts = false;
        });
    },
    prepareDelete(type, index) {
      this.typeDelete = type;
      this.itemDelete = index;
    },
    prepareUpdate(type, item, index) {
      this.typeUpdate = type;
      this.itemUpdate = index;
      this.item = item;
    },
    makeChartUsers(labels, data) {
      const ctx = document.getElementById("chartUsers").getContext("2d");
      const myChartUsers = new Chart(ctx, {
        type: "doughnut",
        data: {
          labels: labels,
          datasets: [
            {
              label: "My First Dataset",
              data: data,
              backgroundColor: [
                "rgb(255, 99, 132)",
                "rgb(54, 162, 235)",
                "rgb(255, 205, 86)",
              ],
              hoverOffset: 4,
            },
          ],
        },
      });
    },
    makeChartPosts(labels, data) {
      const ctx = document.getElementById("chartPosts").getContext("2d");
      const myChartPosts = new Chart(ctx, {
        type: "bar",
        data: {
          labels: labels,
          datasets: [
            {
              label: "# Posts con mas likes",
              data: data,
              backgroundColor: [
                "rgba(255, 99, 132, 0.2)",
                "rgba(54, 162, 235, 0.2)",
                "rgba(255, 206, 86, 0.2)",
                "rgba(75, 192, 192, 0.2)",
                "rgba(75, 192, 192, 0.2)",
              ],
              borderColor: [
                "rgba(255, 99, 132, 1)",
                "rgba(54, 162, 235, 1)",
                "rgba(255, 206, 86, 1)",
                "rgba(75, 192, 192, 1)",
                "rgba(153, 102, 255, 1)",
              ],
              borderWidth: 1,
            },
          ],
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },
      });
    },
    updateItem() {
      this.alert = false;
      this.alertPassword = false;
      this.alertUsername = false;
      this.alertEmail = false;
      let validate = true;
      for (let key in this.item) {
        if (Array.isArray(this.item[key])) {
          continue;
        }
        if (key == "posts") {
          continue;
        }
        if (this.item[key] == "") {
          this.alert = true;
          validate = false;
          return;
        }
      }
      if (this.typeUpdate == "usuario") {
        if (this.item.password.length < 8) {
          this.alertPassword = true;
          validate = false;
          return;
        }
        if (!this.item.email.includes("@") || !this.item.email.includes(".")) {
          this.alertEmail = true;
          validate = false;
          return;
        }
      }
      if (validate) {
        this.loadUpdate = true;
        this.item.index = this.itemUpdate;
        axios
          .post(
            `${this.url}${this.typeUpdate == "post" ? "post" : "user"}`,
            this.item
          )
          .then(({ data }) => {
            this.getUsers();
            this.getPosts();
            this.closeModal("modalUpdate");
          })
          .catch(() => {
            console.log("Error");
          })
          .finally(() => {
            this.loadUpdate = false;
          });
      }
    },
    deleteItem() {
      this.loadDelete = true;
      axios
        .delete(
          `${this.url}${this.typeDelete == "post" ? "post" : "user"}/${
            this.itemDelete
          }`
        )
        .then(() => {
          this.getUsers();
          this.getPosts();
          this.closeModal("modalDelete");
        })
        .catch(() => {
          console.log("Error");
        })
        .finally(() => {
          this.loadDelete = false;
        });
    },
    loadItems() {
      this.loadLoad = true;

      const formData = new FormData();

      formData.append(
        "document",
        document.getElementById("fileLoadMain").files[0]
      );

      axios
        .post(
          `${this.url}load-${this.typeLoad == "post" ? "posts" : "users"}`,
          formData,
          {
            "Content-Type": "multipart/form-data",
          }
        )
        .then(() => {
          this.getUsers();
          this.getPosts();
          this.closeModal("modalLoad");
        })
        .catch(() => {
          console.log("Error");
        })
        .finally(() => {
          this.loadLoad = false;
        });
    },
    closeModal(id) {
      $(`#${id}`).modal("hide");
    },
    exportUsers() {
      var element = document.getElementById("content-users");
      var opt = {
        margin: 0.6,
        filename: "Reporte Usuarios.pdf",
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
      };
      html2pdf().set(opt).from(element).save();
    },
    exportPosts() {
      var element = document.getElementById("content-posts");
      var opt = {
        margin: 0.6,
        filename: "Reporte Posts.pdf",
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
      };
      html2pdf().set(opt).from(element).save();
    },
  },
});
