<template>
  <div
    ref="containerInfo"
    class="container-info"
  >
    <button
      type="button"
      class="btn btn-outline-secondary toggle-info shadow"
      @click="toggleInfo()"
    />
    <div
      class="outer-info shadow"
      @click="toggleInfo()"
    >
      <div
        class="inner-info "
      >
        <h4 class="text-center">
          Score
        </h4>
        <div class="wrapper-info">
          <div
            v-for="item in informations"
            :key="item.text"
            class="box-info d-flex"
          >
            <span
              class="content-info-name"
            >
              {{ item.user }} 
            </span>
            <span class="content-info-score">
              {{ item.score }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    informations() {
      return this.$store.state.informations;
    }
  },
  methods: {
    toggleInfo() {
      if (this.$refs.containerInfo.style.width === "0px") {
        this.$refs.containerInfo.style.width = "170px";
        this.$refs.containerInfo.firstElementChild.style.display = "none";
      } else {
        this.$refs.containerInfo.style.width = "0px";
        this.$refs.containerInfo.firstElementChild.style.display = "block";
      }
    }
  }
};
</script>

<style scoped>
.container-info {
  position: fixed;
  right: 0;
  top: 150px;
  width: 170px;
  height: 200px;
  color: #333333c2;
  font-size: 0.9rem;
  transition: 0.4s;
}

.outer-info {
  height: 100%;
  width: 100%;
  border-top-left-radius: 8px;
  border-bottom-left-radius: 8px;
  border-right: 0px;
  padding: 10px;
  background: white;
  cursor: pointer;
}

.box-info {
  justify-content: space-between;
}

.btn.toggle-info {
  height: 56px;
  width: 28px;
  border-bottom-left-radius: 56px;
  border-top-left-radius: 56px;
  border-right: 0px;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  left: -28px;
  background: white;
  border-color: white;
  display: none;
}

.btn.toggle-info {
  box-shadow: none;
}
</style>
