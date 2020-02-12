import Vue from "vue";
import Vuex from "vuex";
Vue.config.devtools = true;
Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    newMessage: "",
    user: {
      id: "",
      name: "",
      room: "",
      ready: false
    },
    userList: [],
    messages: [],
    noticeQuiz: "",
    currentQuestion: {
      question: "",
      answer: "",
      point: 0,
      multipleChoices: [
        {
          text: "",
          value: ""
        },
        {
          text: "",
          value: ""
        },
        {
          text: "",
          value: ""
        },
        {
          text: "",
          value: ""
        }
      ]
    },
    informations: [],
    games: [
      {
        name: "Tarik Tambang",
        route: "tarik-tambang"
      },
      {
        name: "Quiz",
        route: "quiz"
      }
    ],
    statusTarikTambang: "prepare", // prepare - playing - ending
    statusQuiz: "prepare", // prepare - playing - ending
    userListSingle: [],
    multiReady: {
      teamDire: [],
      teamRadiant: [],
      teamUnassigned: []
    },
    scoreTarikTambang: {
      scoreDire: 50,
      scoreRadiant: 50
    }
  },
  getters: {
    getTeam: state => {
      if (
        state.multiReady.teamDire.find(element => (element.id = state.user.id))
      ) {
        return "teamDire";
      } else if (
        state.multiReady.teamRadiant.find(
          element => (element.id = state.user.id)
        )
      ) {
        return "teamRadiant";
      } else {
        return "teamUnassigned";
      }
    },
    getIsOnQuizPlayer: state => {
      return state.informations.find(element => {
        return element.id === state.user.id;
      });
    }
  },
  mutations: {
    setMultiReady(state, value) {
      state.multiReady.teamDire = value.teamDire;
      state.multiReady.teamUnassigned = value.teamUnassigned;
      state.multiReady.teamRadiant = value.teamRadiant;
    },
    setUserName(state, value) {
      state.user.name = value;
    },
    setUserId(state, value) {
      state.user.id = value;
    },
    setUserRoom(state, value) {
      state.user.room = value;
    },
    setUserReady(state, value) {
      state.user.ready = value;
    },
    updateUserList(state, value) {
      state.userList.map(item => {
        if (item.id === value.id) {
          item = value;
        }
      });
    },
    addMessage(state, value) {
      state.messages.push(value);
    },
    updateInformations(state, { username, value }) {
      state.informations.map(item => {
        if (item.userName === username) {
          item.score += value;
        }
      });
    },
    setStatus(state, value) {
      state.status = value;
    },
    setUserList(state, value) {
      state.userList = value;
    },
    deleteMessages(state) {
      state.messages = [];
    },
    setNewMessage(state, value) {
      state.newMessage = value;
    },
    setStatusTarikTambang(state, value) {
      state.statusTarikTambang = value;
    },
    setScoreTarikTambang(state, value) {
      state.scoreTarikTambang = value;
    },
    setStatusQuiz(state, value) {
      state.statusQuiz = value;
    },
    setInformations(state, value) {
      state.informations = value;
    },
    setCurrentQuestion(state, value) {
      state.currentQuestion = value;
    },
    setNoticeQuiz(state, value) {
      state.noticeQuiz = value;
    }
  },
  actions: {
    requestId() {
      this._vm.$socketio.emit("request-id");
    },
    onId(context) {
      this._vm.$socketio.on("id", data => {
        context.commit("setUserId", data);
      });
    },
    clearMessages(context) {
      context.commit("deleteMessages");
    },
    leaveCurrentRoom({ state }) {
      if (state.user.room !== "") {
        this._vm.$socketio.emit("quit", {
          id: state.user.id,
          user: state.user.name,
          room: state.user.room
        });
      }
    },
    joinRoom({ state }) {
      this._vm.$socketio.emit("join", {
        id: state.user.id,
        user: state.user.name,
        room: state.user.room,
        ready: state.user.ready
      });
    },
    updateUserReady({ state }) {
      this._vm.$socketio.emit("update-user-ready", {
        room: state.user.room,
        users: state.userList
      });
    },
    initRoom({ dispatch, commit }, room) {
      dispatch("clearMessages");
      dispatch("leaveCurrentRoom");
      commit("setUserRoom", room);
      dispatch("joinRoom");
    },
    sendMessage({ state, commit }) {
      commit("addMessage", {
        userName: state.user.name,
        text: state.newMessage,
        type: 1
      });
      this._vm.$socketio.emit("chat", {
        message: state.newMessage,
        user: state.user.name,
        room: state.user.room,
        type: 1
      });
      state.newMessage = null;
    },
    onReceiveRealTimeUsers({ commit }) {
      this._vm.$socketio.on("users", value => {
        commit("setUserList", value);
      });
    },
    onUserLeave({ commit }) {
      this._vm.$socketio.on("quit", data => {
        commit("addMessage", {
          userName: "system",
          text: data + " has left",
          type: 0
        });
      });
    },
    onUserJoin({ commit }) {
      this._vm.$socketio.on("joined", data => {
        commit("addMessage", {
          userName: "system",
          text: data.user + " has joined",
          type: 0
        });
      });
    },
    onReceiveChat({ commit }) {
      this._vm.$socketio.on("chat", data => {
        commit("addMessage", {
          userName: data.user,
          text: data.message,
          type: data.type
        });
      });
    },
    quitRoom({ state }) {
      this._vm.$socketio.emit("quit", {
        id: state.user.id,
        user: state.user.name,
        room: state.user.room
      });
    },
    onReadyGroupUserUpdate({ commit }) {
      this._vm.$socketio.on("ready-group-users-update", data => {
        commit("setMultiReady", data);
        console.log(data);
      });
    },
    updateUserMultiReady({ state }, destination) {
      this._vm.$socketio.emit("update-user-ready-group", {
        to: destination,
        user: {
          id: state.user.id,
          user: state.user.name,
          room: state.user.room,
          score: 0
        }
      });
    },

    //tarik tambang actions
    onReceiveStatusGame({ commit }) {
      this._vm.$socketio.on("status-game", data => {
        commit("setStatusTarikTambang", data);
      });
    },
    startTarikTambang() {
      this._vm.$socketio.emit("start-tarik-tambang");
    },
    doTarikTambang({ state }) {
      this._vm.$socketio.emit("do-tarik-tambang", state.user);
    },
    onUpdateScoreTarikTambang({ commit }) {
      this._vm.$socketio.on("score-tarik-tambang", data => {
        commit("setScoreTarikTambang", data);
      });
    },

    // quiz actions
    updateQuizScore({ state }) {
      this._vm.$socketio.emit("update-score-quiz", {
        user: state.user,
        point: state.currentQuestion.point
      });
    },
    onReceiveStatusQuiz({ commit }) {
      this._vm.$socketio.on("status-game", data => {
        commit("setStatusQuiz", data);
      });
    },
    requestStatusQuiz() {
      this._vm.$socketio.emit("get-status-quiz");
    },
    requestPlayersQuiz() {
      this._vm.$socketio.emit("get-players-quiz");
    },
    startQuiz() {
      this._vm.$socketio.emit("start-quiz");
    },
    onUpdatePlayerQuiz({ commit }) {
      this._vm.$socketio.on("update-players-quiz", data => {
        commit("setInformations", data);
      });
    },
    onReceiveQuestion({ commit }) {
      this._vm.$socketio.on("questions", data => {
        commit("setCurrentQuestion", data);
      });
    },
    onUpdateNoticeQuiz({ commit }) {
      this._vm.$socketio.on("update-notice-quiz", data => {
        commit("setNoticeQuiz", data);
      });
    }
  }
});

export default store;
