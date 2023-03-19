import { mapState, mapMutations, mapGetters } from "vuex";
export const vuexObj = {
  computed: {
    ...mapState(["userInfo", "panes", "activeKey", "apiStatus"]),
    ...mapGetters(["getPart"]),
  },
  methods: {
    ...mapMutations([
      "login",
      "setApiStatus",
      "logout",
      "setPane",
      "pushPane",
      "setPanes",
      "setActiveKey",
    ]),
  },
};
export const operaPane = {
  mixins: [vuexObj],
  methods: {
    addPane(pane) {
      const result = this.panes.findIndex((item) => {
        return item.path.split("?")[0] === pane.path.split("?")[0];
      });
      if (result === -1) {
        this.pushPane(pane);
        this.setActiveKey(this.panes.length - 1);
      } else {
        this.setPane({ index: result, data: pane });
        this.setActiveKey(result);
      }
    },
  },
};
export const setScore = {
  mixins: [operaPane],
  methods: {
    datail(index) {
      const pane = {
        path: this.$route.matched[0].path + "/getReport?tno=" + index.tno,
        title: "申报详情",
      };
      this.addPane(pane);
    },
    putScore(index) {
      const pane = {
        path: this.$route.matched[0].path + "/putScore",
        title: "评教页面",
      };
      if (index.tno) {
        pane.path = pane.path + "?tno=" + index.tno + "&cno=" + index.cno;
      } else {
        pane.path =
          pane.path + "?tno=" + this.query.tno + "&cno=" + this.query.cno;
      }
      if (index.account) {
        pane.path =
          pane.path + "&account=" + index.account + "&part=" + index.part;
      }
      this.addPane(pane);
    },
  },
};
export const fileOperation = {
  methods: {
    handlePreview(file) {
      if (file.url) {
        window.open("http://ow365.cn/?i=28909&furl=" + file.url);
      }
    },
    handleDownload(file) {
      if (file.url) {
        window.open(file.url);
      }
    },
  },
};
