<template>
  <div class="wrapper-score-single shadow bg-white p-3 col-md-8 offset-md-2">
    <div class="row">
      <div class="col-md-12 text-center">
        <h3>
          Game Over
        </h3>
        <span class="text-secondary font-italic"> Thanks for playing... </span>
      </div>
      <div class="col-md-12 col-sm-12 p-5">
        <template>
          <div
            class="table-wrapper-score-single"
          >
            <table class="table table-borderless">
              <thead />
              <tbody>
                <tr
                  v-for="(item,index) in info" 
                  :key="index"
                >
                  <td>
                    {{ item.user }} 
                    <template v-if="item.score === max">
                      <b-badge variant="success">
                        winner
                      </b-badge>
                    </template>
                  </td>
                  <td class="text-right">
                    {{ item.score }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    info() {
      return this.$store.state.informations;
    },
    max() {
      return Math.max.apply(
        Math,
        this.info.map(item => {
          return item.score;
        })
      );
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.$store.dispatch("onReadyGroupUserUpdate");
    });
  },
  methods: {}
};
</script>


<style scoped>
.wrapper-score-multi {
  border-radius: 8px;
}

.wrapper-score-single {
  border-radius: 8px;
  margin-bottom: 200px;
}
</style>

