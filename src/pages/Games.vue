<template>
  <div>
    <div class="container">
      <div
        class="outer-games"
      >
        <div v-if="isExact()">
          <h4>welcome, {{ user.name }}</h4>
          <div class="wrapper-list">
            <div class="row">
              <template
                v-for="(item,index) in games"
              >
                <div
                  :key="index"
                  class="col-md-3"
                >
                  <div
                    class="box shadow"
                    @click="goTo(item.route)"
                  >
                    <div class="card-image">
                      <img :src="require(`../img/${item.route}-logo.png`)">
                    </div>
                    <div class="card-title">
                      <span>{{ item.name }}</span>
                    </div>
                  </div>
                </div>
              </template>
            </div>
          </div>
        </div>
        <router-view />
      </div>
    </div>
    <Chat />
  </div>
</template>

<script>
import Chat from "../components/Chat.vue";

export default {
  components: {
    Chat
  },
  data() {
    return {
      room: "global"
    };
  },
  computed: {
    user() {
      return this.$store.state.user;
    },
    games() {
      return this.$store.state.games;
    }
  },
  watch: {
    "$route.name": {
      handler: function(value) {
        console.log(value);
        if (value === "games") {
          this.initGlobalRoom(this.room);
        }
      }
    }
  },
  mounted() {
    this.initGlobalRoom(this.room);
  },
  methods: {
    isExact() {
      return this.$route.name === "games";
    },
    goTo(value) {
      this.$router.push({ path: `/games/${value}` });
    },
    initGlobalRoom(room) {
      this.$store.dispatch("initRoom", room);
    }
  }
};
</script>

<style scoped>
.wrapper-list {
  margin: 30px 0px;
}

.box {
  height: 200px;
  border-radius: 8px;
  transition: 0.4s;
  cursor: pointer;
  padding: 10px;
  background: white;
}

.box:hover {
  transform: scale(0.9, 0.9);
}

.card-image img {
  width: 100%;
  max-width: 150px;
  height: auto;
  margin: 0px auto;
  transform: translateX(-50%);
  position: relative;
  left: 50%;
}

.card-title {
  text-align: center;
  text-transform: uppercase;
}

.outer-games {
  margin: 50px;
}
</style>
