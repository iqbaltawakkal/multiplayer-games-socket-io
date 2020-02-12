<template>
  <div class="wrapper-ready-single">
    <div class="col-md-10 offset-md-1">
      <template v-for="(item,index) in userList">
        <div
          :key="index"
          class="row mb-3"
        >
          <div class="col-md-9 col-sm-6">
            <div class="box-username-ready border border-secondary rounded bg-white">
              {{ item.user }}
            </div>
          </div>
          <div class="col-md-3 col-sm-6">
            <b-form-checkbox
              v-model="item.ready"
              name="check-button"
              button
              :disabled="item.id !== user.id"
              :button-variant="item.ready ? 'success' : 'outline-success'"
              class="toggle-ready w-100"
              @change="onToggleReady($event)"
            >
              {{ item.ready ? 'Ready' : 'Not Ready' }}
            </b-form-checkbox>
          </div>
        </div>
      </template>
    </div>
    <div class="col-md-4 offset-md-4 mt-3">
      <b-button
        v-if="allReady"
        variant="success"
        class="w-100"
        @click="startQuiz()"
      >
        Start
      </b-button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      allReady: false
    };
  },
  computed: {
    userList() {
      return this.$store.state.userList;
    },
    user() {
      return this.$store.state.user;
    }
  },
  watch: {
    userList: {
      handler: function(value) {
        this.allReady = value.every(item => {
          return item.ready;
        });
      },
      deep: true
    }
  },
  mounted() {
    this.$store.commit("setUserReady", false);
    this.$nextTick(() => {
      this.allReady = this.userList.every(item => {
        return item.ready;
      });
    });
  },
  methods: {
    onToggleReady(value) {
      console.log(value);
      this.$store.commit("setUserReady", value);
      this.$store.commit("updateUserList", this.user);

      this.$nextTick(() => {
        this.$store.dispatch("updateUserReady");
      });
    },
    startQuiz() {
      this.$store.dispatch("startQuiz");
    }
  }
};
</script>


<style scoped>
.box-username-ready {
  vertical-align: middle;
  padding: 0.375rem 0.75rem;
  font-size: 1rem;
  line-height: 1.5;
}
</style>

