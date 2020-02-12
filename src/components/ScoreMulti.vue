<template>
  <div class="wrapper-score-multi shadow bg-white p-3">
    <div class="row">
      <div class="col-md-12 text-center">
        <h3>
          Game Over
        </h3>
        <span class="text-secondary  font-italic">
          Thank you for playing...
        </span>
      </div>
      <div class="col-md-6 col-sm-12 pl-5 pt-2 pb-2 pr-5">
        <template>
          <div
            class="table-wrapper-score-multi"
          >
            <table class="table table-borderless">
              <thead>
                <tr>
                  <th
                    scope="col"
                    colspan="2"
                    class="text-center"
                  >
                    TEAM RADIANT <b-badge
                      v-if="totalRadiant >= totalDire"
                      variant="success"
                    >
                      WINNER
                    </b-badge>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(item,index) in multiReady.teamRadiant" 
                  :key="index"
                >
                  <td>{{ item.user }} <b-badge>{{ index == 0 ? 'captain': '' }}</b-badge></td>
                  <td class="text-right">
                    {{ item.score }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </template>
      </div>
      <div class="col-md-6 col-sm-12 pl-5 pt-2 pb-2 pr-5">
        <template>
          <div
            class="table-wrapper-score-multi "
          >
            <table class="table table-borderless">
              <thead>
                <tr>
                  <th
                    scope="col"
                    colspan="2"
                    class="text-center"
                  >
                    TEAM DIRE <b-badge
                      v-if="totalDire >= totalRadiant"
                      variant="success"
                    >
                      WINNER
                    </b-badge>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(item,index) in multiReady.teamDire" 
                  :key="index"
                >
                  <td>{{ item.user }} <b-badge>{{ index == 0 ? 'captain': '' }}</b-badge></td>
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
  data() {
    return {
      totalDire: null,
      totalRadiant: null
    };
  },
  computed: {
    userList() {
      return this.$store.state.userList;
    },
    user() {
      return this.$store.state.user;
    },
    multiReady() {
      return this.$store.state.multiReady;
    },
    status() {
      return this.$store.state.statusTarikTambang;
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.$store.dispatch("onReadyGroupUserUpdate");
      this.findTotal();
    });
  },
  methods: {
    findTotal() {
      this.totalDire = this.multiReady.teamDire.reduce((currentTotal, item) => {
        return item.score + currentTotal;
      }, 0);
      this.totalRadiant = this.multiReady.teamRadiant.reduce(
        (currentTotal, item) => {
          return item.score + currentTotal;
        },
        0
      );
    }
  }
};
</script>


<style scoped>
.wrapper-score-multi {
  border-radius: 8px;
}
</style>

