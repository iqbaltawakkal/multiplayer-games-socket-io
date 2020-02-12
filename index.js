const express = require("express");
const app = express();
let http = require("http").Server(app);
const io = require("socket.io")(http);
const questions = require("./questions.js");

app.use(express.static(__dirname + "/dist"));

app.use("/lib", express.static(__dirname + "/node_modules/"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/dist/index.html");
});

http.listen(3000, () => {
  console.log("Listening on port *: 3000");
});

let globalUsers = [];
let quizUsers = [];
let ttUsers = [];
let quizPlayer = [];
let quizQuestions = [];
let indexQ = 0;
let multiReady = {
  teamDire: [],
  teamRadiant: [],
  teamUnassigned: []
};
let seq = 0;
let statusTarikTambang = "prepare"; // prepare - playing - ending

let scoreTarikTambang = {
  scoreDire: 50,
  scoreRadiant: 50
};
let statusQuiz = "prepare";

var timer;

function sanitizeMultiReady(data) {
  multiReady.teamDire = filterRemove(multiReady.teamDire, data.user);
  multiReady.teamRadiant = filterRemove(multiReady.teamRadiant, data.user);
  multiReady.teamUnassigned = filterRemove(
    multiReady.teamUnassigned,
    data.user
  );
}

function filterRemove(arr, data) {
  arr = arr.filter(item => {
    return item.id !== data.id;
  });
  return arr;
}

function findTeam(array, id) {
  for (let i = 0; i < array.length; i++) {
    if (array[i].id === id) {
      return i;
    }
  }
  return null;
}

function Timer(fn, t) {
  var timerObj = setInterval(fn, t);

  this.stop = function() {
    if (timerObj) {
      clearInterval(timerObj);
      timerObj = null;
    }
    return this;
  };

  // start timer using current settings (if it's not already running)
  this.start = function() {
    if (!timerObj) {
      this.stop();
      timerObj = setInterval(fn, t);
    }
    return this;
  };

  // start with new interval, stop current interval
  this.reset = function(newT) {
    t = newT;
    return this.stop().start();
  };
}

io.on("connection", socket => {
  console.log("a user connected");

  socket.on("disconnect", () => {
    console.log("a user disconnected");
  });

  // request id
  socket.on("request-id", () => {
    seq++;
    socket.emit("id", seq);
  });

  // join to certain room
  socket.on("join", data => {
    console.log("join");
    socket.join(data.room);
    socket.to(data.room).emit("joined", { id: data.id, user: data.user });
    socket.emit("chat", {
      message: "welcome to " + data.room + " chat",
      user: "system",
      room: data.room,
      type: 0
    });
    if (data.room === "tarik-tambang") {
      ttUsers.push({ id: data.id, user: data.user, ready: data.ready });
      io.in(data.room).emit("users", ttUsers);
      io.in("tarik-tambang").emit("statusGame", statusTarikTambang);
    } else if (data.room === "quiz") {
      quizUsers.push({ id: data.id, user: data.user, ready: data.ready });
      io.in(data.room).emit("users", quizUsers);
    } else if (data.room === "global") {
      globalUsers.push({ id: data.id, user: data.user, ready: data.ready });
      io.in(data.room).emit("users", globalUsers);
    }
  });

  // quit from certain room
  socket.on("quit", data => {
    console.log("quit");
    socket.to(data.room).emit("quit", data.user);
    if (data.room === "tarik-tambang") {
      ttUsers = filterRemove(ttUsers, data);
      io.in(data.room).emit("users", ttUsers);
    } else if (data.room === "quiz") {
      quizUsers = filterRemove(quizUsers, data);
      io.in(data.room).emit("users", quizUsers);
    } else if (data.room === "global") {
      globalUsers = filterRemove(globalUsers, data);
      io.in(data.room).emit("users", globalUsers);
    }
    socket.leave(data.room);
  });

  // send chat message
  socket.on("chat", data => {
    socket.to(data.room).emit("chat", data);
  });

  // update multi player prepare state
  socket.on("update-user-ready", data => {
    quizUsers = data.users;
    io.in(data.room).emit("users", data.users);
  });

  // update multi player group prepare state
  socket.on("update-user-ready-group", data => {
    console.log("update-user-ready-group");
    sanitizeMultiReady(data);
    if (data.to !== "") {
      multiReady[data.to].push(data.user);
    }
    io.in("tarik-tambang").emit("ready-group-users-update", multiReady);
  });

  //tarik tambang
  socket.on("start-tarik-tambang", () => {
    statusTarikTambang = "playing";
    io.in("tarik-tambang").emit("status-game", statusTarikTambang);
    setTimeout(function() {
      if (statusTarikTambang === "playing") {
        endingTarikTambang();
      }
    }, 10000);
  });

  function updateScore(data) {
    let isCaptain = false;
    console.log(findTeam(multiReady.teamDire, data.id));
    if (findTeam(multiReady.teamDire, data.id) !== null) {
      let index = findTeam(multiReady.teamDire, data.id);
      isCaptain = multiReady.teamDire[0].id === data.id;
      scoreTarikTambang.scoreDire += isCaptain ? 4 : 2;
      scoreTarikTambang.scoreRadiant -= isCaptain ? 4 : 2;
      if (index !== null || index !== undefined) {
        multiReady.teamDire[index].score += isCaptain ? 4 : 2;
      }

      if (scoreTarikTambang.scoreDire >= 100) {
        scoreTarikTambang.scoreDire = 100;
        scoreTarikTambang.scoreRadiant = 0;
        endingTarikTambang();
      }
    } else {
      let index = findTeam(multiReady.teamRadiant, data.id);
      isCaptain = multiReady.teamRadiant[0].id === data.id;
      console.log(isCaptain);
      scoreTarikTambang.scoreRadiant += isCaptain ? 4 : 2;
      scoreTarikTambang.scoreDire -= isCaptain ? 4 : 2;
      if (index !== null || index !== undefined) {
        multiReady.teamRadiant[index].score += isCaptain ? 4 : 2;
      }
      if (scoreTarikTambang.scoreRadiant >= 100) {
        scoreTarikTambang.scoreRadiant = 100;
        scoreTarikTambang.scoreDire = 0;
        endingTarikTambang();
      }
    }
  }

  function endingTarikTambang() {
    io.in("tarik-tambang").emit("score-tarik-tambang", scoreTarikTambang);
    io.in("tarik-tambang").emit("ready-group-users-update", multiReady);
    io.in("tarik-tambang").emit("before-ending");
    setTimeout(function() {
      statusTarikTambang = "ending";
      io.in("tarik-tambang").emit("status-game", statusTarikTambang);
      scoreTarikTambang.scoreRadiant = 50;
      scoreTarikTambang.scoreDire = 50;
      io.in("tarik-tambang").emit("score-tarik-tambang", scoreTarikTambang);
    }, 3000);
    setTimeout(function() {
      statusTarikTambang = "prepare";
      io.in("tarik-tambang").emit("status-game", statusTarikTambang);
    }, 9000);
  }

  socket.on("do-tarik-tambang", data => {
    updateScore(data);
    io.in("tarik-tambang").emit("score-tarik-tambang", scoreTarikTambang);
  });

  // quiz game

  function initQuestions() {
    console.log("init question");
    quizQuestions = [...questions.data()];
  }

  function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function broadcastQuestion() {
    console.log("broadcastQuestion");
    if (quizQuestions[indexQ] !== undefined) {
      io.in("quiz").emit("questions", quizQuestions[indexQ]);
      indexQ++;
    } else {
      indexQ = 0;
      endingQuiz();
    }
  }

  function endingQuiz() {
    timer.stop();
    statusQuiz = "ending";
    io.in("quiz").emit("status-game", statusQuiz);
    setTimeout(function() {
      statusQuiz = "prepare";
      io.in("quiz").emit("status-game", statusQuiz);
    }, 9000);
  }

  function initQuizPlayer() {
    console.log("init quiz player");
    quizPlayer = [...quizUsers];
    for (let j = 0; j < quizPlayer.length; j++) {
      quizPlayer[j].score = 0;
    }
  }

  socket.on("start-quiz", () => {
    console.log("start-quiz");
    initQuizPlayer();
    statusQuiz = "playing";
    io.in("quiz").emit("status-game", statusQuiz);
    io.in("quiz").emit("update-players-quiz", quizPlayer);
    initQuestions();
    broadcastQuestion();
    timer = new Timer(function() {
      broadcastQuestion();
    }, 9000);
  });

  socket.on("update-score-quiz", data => {
    console.log("update-score-quiz");
    console.log(quizPlayer);
    let idx = findTeam(quizPlayer, data.user.id);
    console.log(idx);
    if (idx !== null) {
      quizPlayer[idx].score += data.point;
      io.in("quiz").emit("update-players-quiz", quizPlayer);
      io.in("quiz").emit("update-notice-quiz", data.user.name + " benar !!!");
      timer.stop();
      setTimeout(function() {
        io.in("quiz").emit("update-notice-quiz", "");
        broadcastQuestion();
        timer.reset(10000);
      }, 3000);
    }
  });

  socket.on("get-status-quiz", () => {
    console.log("get-status-quiz");
    socket.emit("status-game", statusQuiz);
  });

  socket.on("get-players-quiz", () => {
    console.log("get-players-quiz");
    socket.emit("update-players-quiz", quizPlayer);
    socket.emit("questions", quizQuestions[indexQ - 1]);
  });
});
