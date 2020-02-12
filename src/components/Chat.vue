<template>
  <div
    ref="containerChat"
    class="container-chat shadow"
  >
    <div class="outer-chat ">
      <div class="inner-chat">
        <div class="wrapper-chat">
          <div
            v-for="(item, index) in messages"
            :key="`item-${index}`"
            class="box-chat"
          >
            <span
              v-if="item.type === 1"
              class="content-chat"
            >
              {{ item.userName }} : {{ item.text }}
            </span>
            <span
              v-else
              class="content-chat font-italic"
            >
              {{ item.text }}
            </span>
          </div>
          <div class="input-chat">
            <b-form-input
              v-model="newMessage"
              autocomplete="off"
              autofocus
              placeholder="type messages..."
              @keyup.enter="sendMessage()"
            />
          </div>
        </div>
      </div>
    </div>
    <div class="outer-users ">
      <div class="inner-users">
        <div class="wrapper-users">
          <div
            v-for="(item, index) in userList"
            :key="`item-${index}`"
            class="box-user"
          >
            <span class="content-users">
              {{ item.user }}
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
    messages() {
      return this.$store.state.messages;
    },
    userList() {
      return this.$store.state.userList;
    },
    user() {
      return this.$store.state.user;
    },
    newMessage: {
      set(value) {
        this.$store.commit("setNewMessage", value);
      },
      get() {
        return this.$store.state.newMessage;
      }
    }
  },
  watch: {
    messages() {
      this.$nextTick(() => {
        document.getElementsByClassName(
          "inner-chat"
        )[0].scrollTop = document.getElementsByClassName(
          "inner-chat"
        )[0].scrollHeight;
      });
    }
  },
  mounted() {
    this.$nextTick(() => {
      window.onbeforeunload = () => {
        this.$store.dispatch("quitRoom");
      };
      this.$store.dispatch("onReceiveChat");
      this.$store.dispatch("onUserJoin");
      this.$store.dispatch("onUserLeave");
      this.$store.dispatch("onReceiveRealTimeUsers");
    });
  },
  methods: {
    sendMessage() {
      this.$store.dispatch("sendMessage");
    }
  }
};
</script>

<style scoped>
.container-chat {
  position: fixed;
  bottom: 0;
  width: 600px;
  height: 25vh;
  max-height: 200px;
  margin: 0 auto;
  transform: translateX(-50%);
  left: 50%;
  display: flex;
  transition: 0.4s;
  border-radius: 8px;
}

.container-chat .input-chat input.form-control {
  border: 0px;
  border-top: 3px solid #fafafa;
  border-radius: 0px;
}

.container-chat .input-chat input.form-control:focus {
  box-shadow: none;
}

.outer-chat {
  position: relative;
  border-right: 3px solid #fafafa;
  height: 100%;
  border-bottom: 0px;
  border-top-left-radius: 8px;
  padding: 10px;
  width: 75%;
  background: white;
}

.outer-users {
  position: relative;
  border-top-right-radius: 8px;
  height: 100%;
  border-left: 0px;
  border-bottom: 0px;
  padding: 10px;
  width: 25%;
  background: white;
}

.inner-chat {
  height: calc(100% - 45px);
  overflow: auto;
}

.inner-users {
  height: 100%;
  overflow: auto;
}

.wrapper-chat {
  overflow: hidden;
}

.input-chat {
  margin: 0px -10px;
}

.wrapper-users {
  overflow: hidden;
}

.content-chat {
  font-size: 0.8rem;
  color: #333333;
}

.content-users {
  font-size: 0.8rem;
  color: #333333;
}

.content-chat.font-italic {
  color: #888;
}

.input-chat {
  bottom: 5px;
  position: absolute;
  width: 100%;
}

::-webkit-scrollbar {
  width: 5px;
}

/* Track */
::-webkit-scrollbar-track {
  background: #f1f1f1;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: #888;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>
