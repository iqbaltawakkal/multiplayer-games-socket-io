<template>
  <div class="btn-exit-container">
    <button
      type="button"
      class="btn btn-outline-secondary"
      @click="goToGames()"
    >
      <img src="../img/close-logo.png">
    </button>
  </div>
</template>

<script>
export default {
  methods: {
    goToGames() {
      this.$router.go(-1);
    }
  }
};
</script>


<style scoped>
.btn-exit-container {
  position: absolute;
  top: 60px;
  right: 60px;
}
.btn-exit-container .btn {
  border-radius: 50%;
  padding: 10px;
}

.btn-exit-container .btn img {
  width: 100%;
  max-width: 25px;
}
</style>
