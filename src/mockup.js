const MockupIO = {
  emit: function(name, data) {
    console.log("emit " + name);
    if (data !== undefined) {
      console.log("data " + JSON.stringify(data));
    }
  },
  on: function(name, data) {
    console.log("listening event " + name);
    if (data !== undefined) {
      console.log("data " + data);
    }
  },
  populateMock: function(store) {
    store.state.userList = userList;
    store.state.multiReady.teamUnassigned = userList;
    store.state.statusTarikTambang = "playing";
    store.state.statusQuiz = "playing";
    store.state.noticeQuiz = "kamu salah :(";
    store.state.informations = [
      {
        id: 1,
        user: "iqbal",
        score: 70
      },
      {
        id: 2,
        user: "aku",
        score: 30
      },
      {
        id: 3,
        user: "kamu",
        score: 40
      },
      {
        id: 4,
        user: "kita",
        score: 50
      }
    ];
    store.state.currentQuestion = {
      question: "test",
      answer: "a",
      point: 21,
      multipleChoices: [
        {
          text: "test",
          value: "a"
        },
        {
          text: "test",
          value: "b"
        },
        {
          text: "test",
          value: "c"
        },
        {
          text: "test",
          value: "d"
        }
      ]
    };
    store.state.multiReady.teamRadiant = [
      {
        id: 1,
        user: "you",
        ready: false,
        score: 80
      },
      {
        id: 2,
        user: "dasdd",
        ready: false,
        score: 30
      },
      {
        id: 3,
        user: "youfasd",
        ready: false,
        score: 20
      },
      {
        id: 4,
        user: "youfasd",
        ready: false,
        score: 52
      }
    ];
    store.state.multiReady.teamDire = [
      {
        id: "",
        user: "you",
        ready: false,
        score: 32
      },
      {
        id: 6,
        user: "dasdd",
        ready: false,
        score: 33
      },
      {
        id: 5,
        user: "youfasd",
        ready: false,
        score: 22
      },
      {
        id: 9,
        user: "youfasd",
        ready: false,
        score: 11
      }
    ];
  }
};

let userList = [
  {
    id: 1,
    user: "you",
    ready: false
  },
  {
    id: 2,
    user: "dasdd",
    ready: false
  },
  {
    id: 4,
    user: "youfasd",
    ready: false
  },
  {
    id: 3,
    user: "youfasd",
    ready: false
  }
];

export default MockupIO;
