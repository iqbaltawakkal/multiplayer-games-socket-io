<template>
  <div>
    <ExitButton />
    <ReadyMulti v-if="status === 'prepare'" />
    <div v-if="status === 'playing'">
      <div class="play-wrapper">
        <h5 class="text-secondary text-center">
          {{ team === 'teamRadiant' ? 'You are team radiant' : team === 'teamDire' ? 'You are team dire' : 'Spectator mode' }}
        </h5>
        <div class="row">
          <div class="col-md-2">
            <div class="img-wrapper">
              <img
                v-b-tooltip.hover
                class="mirror"
                src="../../img/pull.gif"
                title="animation by Dennis"
              >
            </div>
          </div>
          <div class="col-md-8 middle">
            <b-progress
              v-b-tooltip.hover
              class="ropes"
              :max="score.scoreRadiant + score.scoreDire "
              show-value
              title="ini ceritanya tambang"
              height="1rem"
              animated
            >
              <b-progress-bar
                :value="score.scoreRadiant"
                variant="success"
              >
                Radiant
              </b-progress-bar>
              <b-progress-bar
                :value="score.scoreDire"
                variant="warning"
              >
                Dire
              </b-progress-bar>
            </b-progress>
          </div>
          <div class="col-md-2">
            <div class="img-wrapper">
              <img
                v-b-tooltip.hover
                src="../../img/pull.gif"
                title="animation by Dennis"
              >
            </div>
          </div>
          <div class="col-md-4 offset-md-4 mt-5">
            <b-button
              v-if="team !== 'teamUnassigned' "
              :disabled=" score.scoreDire === 100 || score.scoreRadiant === 100 || beforeEnding"
              variant="primary"
              class="w-100 pulse"
              @click="tarik()"
            >
              Tarik
            </b-button>
          </div>
          <div class="col-md-4 offset-md-4 mt-5 text-center">
            <h5 v-if="score.scoreDire === 100">
              Dire Victory
            </h5>
            <h5 v-if="score.scoreRadiant === 100">
              Radiant Victory
            </h5>
            <div
              v-if="beforeEnding"
              class="text-secondary font-italic"
            >
              <span>Time is up...</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <ScoreMulti v-if="status === 'ending'" />
  </div>
</template>

<script>
import ExitButton from "../ExitButton.vue";
import ReadyMulti from "../ReadyMulti.vue";
import ScoreMulti from "../ScoreMulti.vue";
import { setTimeout } from "timers";

export default {
  components: {
    ExitButton,
    ReadyMulti,
    ScoreMulti
  },
  data() {
    return {
      beforeEnding: false
    };
  },
  computed: {
    status() {
      return this.$store.state.statusTarikTambang;
    },
    user() {
      return this.$store.state.user;
    },
    team() {
      return this.$store.getters.getTeam;
    },
    score() {
      return this.$store.state.scoreTarikTambang;
    }
  },
  mounted() {
    this.$store.dispatch("initRoom", "tarik-tambang");
    this.$store.dispatch("onReceiveStatusGame");
    this.$store.dispatch("onUpdateScoreTarikTambang");

    this.$socketio.on("before-ending", () => {
      this.beforeEnding = true;
      setTimeout(() => {
        console.log("timeout");
        this.beforeEnding = false;
      }, 4000);
    });
  },
  methods: {
    tarik() {
      this.$store.dispatch("doTarikTambang");
    }
  }
};
</script>

<style scoped>
.pulse {
  animation: shadow-pulse 1s infinite;
}

.img-wrapper img {
  width: 100%;
  height: auto;
}

img.mirror {
  -moz-transform: scale(-1, 1);
  -webkit-transform: scale(-1, 1);
  -o-transform: scale(-1, 1);
  -ms-transform: scale(-1, 1);
  transform: scale(-1, 1);
}

.middle {
  margin: 60px 0px;
}

.middle:after {
  content: "";
  border-right: 1px solid #333333;
  margin-left: calc(50% - 1px);
}

.middle:before {
  content: "";
  border-right: 1px solid #333333;
  margin-left: calc(50% - 1px);
}

@keyframes shadow-pulse {
  0% {
    box-shadow: 0 0 0 0px rgba(0, 0, 0, 0.2);
  }
  100% {
    box-shadow: 0 0 0 15px rgba(0, 0, 0, 0);
  }
}
</style>



