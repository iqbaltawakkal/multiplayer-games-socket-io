<template>
  <div class="wrapper shadow">
    <div
      id="app"
    >
      <router-view />
    </div>
  </div>
</template>

<script>
export default {
  name: "App",
  computed: {
    pageTitle() {
      return this.$store.state.activeMenu;
    },
    subTitle() {
      return this.$store.state.activeSubtitle;
    }
  },
  mounted() {
    this.$socketio.on("disconnect", function() {
      this.$connection = false;
      window.location.replace(window.location.origin);
    });
    this.$socketio.on("connection", function() {
      console.log("reconnect");
      this.$connection = true;
      window.location.replace(window.location.origin);
    });
  }
};
</script>

<style scoped>
.wrapper {
  background: #fafafa;
  height: 100%;
  min-height: 100vh;
  padding: 50px 0px;
}
</style>
