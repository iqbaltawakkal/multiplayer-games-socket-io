<template>
  <div class="container">
    <div class="outer-landing">
      <div class="col-md-6 offset-md-3">
        <div class="text-center">
          <b-form-input
            v-model="userName"
            placeholder="Enter your name"
            autofocus
            @keyup.enter="enter()" 
          />
          <button
            type="button"
            class="btn btn-outline-secondary  pl-5 pr-5 mt-3"
            @click="enter()"
          >
            Go!
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      userName: ""
    };
  },
  computed: {
    user() {
      return this.$store.state.user;
    },
    userList() {
      return this.$store.state.userList;
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.$store.dispatch("requestId");
      this.$store.dispatch("onId");
    });
  },
  methods: {
    enter() {
      if (this.userName && !/^\s+$/.test(this.userName)) {
        this.$store.commit("setUserName", this.userName);
        this.$router.push({ path: "games" });
      } else {
        alert("name cannot be empty or blankspaces");
      }
    }
  }
};
</script>

<style scoped>
.outer-landing {
  position: relative;
  top: 200px;
}
</style>
