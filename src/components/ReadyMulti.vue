<template>
  <div class="wrapper-ready-multi">
    <div class="row">
      <div class="col-md-6">
        <template>
          <div
            class="table-wrapper-ready-multi shadow"
            @click="joinTeam('teamRadiant')"
          >
            <table class="table table-borderless">
              <thead>
                <tr>
                  <th
                    scope="col"
                    class="text-center"
                  >
                    TEAM RADIANT
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(item,index) in multiReady.teamRadiant" 
                  :key="index"
                >
                  <td>
                    {{ item.user }} 
                    <template v-if="index === 0">
                      <b-badge
                        v-b-tooltip.hover
                        title="double damage"
                      >
                        captain
                      </b-badge>
                    </template>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </template>
      </div>
      <div class="col-md-6">
        <template>
          <div
            class="table-wrapper-ready-multi shadow"
            @click="joinTeam('teamDire')"
          >
            <table class="table table-borderless">
              <thead>
                <tr>
                  <th
                    scope="col"
                    class="text-center"
                  >
                    TEAM DIRE
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(item,index) in multiReady.teamDire" 
                  :key="index"
                >
                  <td>
                    {{ item.user }} <template v-if="index === 0">
                      <b-badge
                        v-b-tooltip.hover
                        title="double damage"
                      >
                        captain
                      </b-badge>
                    </template>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </template>
      </div>
    </div>
    <div class="row mt-5">
      <div class="col-md-6 offset-md-3">
        <template>
          <div
            class="table-wrapper-ready-multi shadow"
            @click="joinTeam('teamUnassigned')"
          >
            <b-table
              borderless
              :items="multiReady.teamUnassigned"
              :fields="unassignFields"
            />
          </div>
        </template>
      </div>
    </div>
    <div class="col-md-4 offset-md-4 mt-5">
      <b-button
        :disabled="multiReady.teamRadiant.length === 0 || multiReady.teamDire.length === 0"
        variant="success"
        class="w-100 button-start"
        @click="start()"
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
      unassignFields: [{ key: "user", label: "UNASSIGNED" }]
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
      this.joinTeam("teamUnassigned");
    });
  },
  beforeDestroy() {
    this.$nextTick(() => {
      if (this.status === "prepare") {
        this.joinTeam("");
      }
    });
  },
  methods: {
    joinTeam(destination) {
      this.$store.dispatch("updateUserMultiReady", destination);
    },
    start() {
      this.$store.dispatch("startTarikTambang");
    }
  }
};
</script>


<style scoped>
.table-wrapper-ready-multi {
  border-radius: 8px;
  background: white;
  padding: 0 50px 20px 50px;
  overflow: hidden;
  cursor: pointer;
}

.wrapper-ready-multi {
  margin-bottom: 250px;
}
</style>

