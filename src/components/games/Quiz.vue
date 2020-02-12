<template>
  <div>
    <ExitButton />
    <ReadySingle v-if="status === 'prepare'" />
    <Info v-if="status === 'playing'" />
    <div
      v-if="status === 'playing'"
      class="quiz-play-wrapper "
    >
      <div
        class="question-wrapper-outer col-md-8 offset-md-2 p-5 shadow bg-white"
        :class="{'pulse' : isPulse}"
      >
        <h5
          v-if="isSpectator" 
          class="text-center font-italic text-secondary mb-3"
        >
          <span
            v-b-tooltip.hover
            title="Still can play with no scores"
          >
            Spectator mode
          </span>
        </h5>
        <div class="question-wrapper text-center  rounded border border-primary mb-5 p-3 ">
          <span class="question-text">{{ currentQuestion.question }} </span> 
        </div>
        <b-form-radio-group
          id="radio-group"
          ref="test"
          v-model="selected"
          :class="{ 'disabled' : getDisabled }"
          :options="currentQuestion.multipleChoices"
          buttons
          button-variant="outline-primary"
          size="lg"
          name="radio-btn-outline"
        />
        <div>
          <span
            v-if="notice !== ''"
            class="text-success font-italic float-right"
          >
            {{ notice }}
          </span>
          <span
            v-if="isWrong"
            class="text-danger font-italic "
          > kamu salah :( </span>
          <span
            v-if="isSpectator && isRight"
            class="text-danger font-italic "
          > kamu benar :)) </span>
        </div>
      </div>
    </div>
    <div v-if="status === 'ending'">
      <ScoreSingle v-if="status === 'ending'" />
    </div>
  </div>
</template>

<script>
import ExitButton from "../ExitButton.vue";
import ReadySingle from "../ReadySingle.vue";
import Info from "../Info.vue";
import ScoreSingle from "../ScoreSingle.vue";

export default {
  components: {
    ExitButton,
    ReadySingle,
    Info,
    ScoreSingle
  },
  data() {
    return {
      selected: "",
      isWrong: false,
      isRight: false,
      isPulse: false
    };
  },
  computed: {
    status() {
      return this.$store.state.statusQuiz;
    },
    user() {
      return this.$store.state.user;
    },
    notice() {
      return this.$store.state.noticeQuiz;
    },
    getDisabled() {
      return this.$store.state.noticeQuiz !== "" || this.selected !== "";
    },
    currentQuestion() {
      return this.$store.state.currentQuestion;
    },
    userList() {
      return this.$store.state.userList;
    },
    isSpectator() {
      if (this.status === "playing" && !this.isOnTeam) {
        return true;
      } else {
        return false;
      }
    },
    isOnTeam() {
      return this.$store.getters.getIsOnQuizPlayer;
    }
  },
  watch: {
    selected(value) {
      if (value !== "") {
        if (value === this.currentQuestion.answer) {
          if (!this.isSpectator) {
            this.$store.dispatch("updateQuizScore");
          } else {
            this.isRight = true;
          }
        } else {
          this.isWrong = true;
        }
      }
    },
    currentQuestion() {
      this.isPulse = true;
      setTimeout(() => {
        console.log("timeout");
        this.isPulse = false;
      }, 2000);
      this.selected = "";
      this.isWrong = false;
      this.isRight = false;
      this.$refs.test.$el.blur();
      let el = document.getElementById("radio-group");
      el.focus();
    }
  },
  mounted() {
    if (this.$refs.test) {
      this.$refs.test.$el.className = "btn-group-toggle btn-group-lg";
    }
    this.$store.dispatch("initRoom", "quiz");
    this.$store.dispatch("requestStatusQuiz");
    this.$store.dispatch("onReceiveStatusQuiz");
    this.$store.dispatch("onReceiveQuestion");
    this.$store.dispatch("onUpdateNoticeQuiz");
    this.$store.dispatch("onUpdatePlayerQuiz");
    this.$store.dispatch("requestPlayersQuiz");
  }
};
</script>

<style scoped>
#radio-group {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}

.disabled {
  pointer-events: none;
}

.question-text {
  font-size: 1.25rem;
  line-height: 1.5;
  color: #007bff;
}

.text-notice {
  color: #28a745;
}

.question-wrapper-outer {
  border-radius: 8px;
}

.pulse {
  animation: shadow-pulse 1s 1;
}

@keyframes shadow-pulse {
  0% {
    box-shadow: 0 0 0 0px rgba(0, 0, 0, 0.2);
  }
  100% {
    box-shadow: 0 0 0 30px rgba(0, 0, 0, 0);
  }
}
</style>



