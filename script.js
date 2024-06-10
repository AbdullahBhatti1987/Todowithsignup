var formContainer = document.getElementById("formContainer");
var adminEmail = document.getElementsByClassName("userName");
var signupForm = document.getElementById("signupForm");
var signinForm = document.getElementById("signinForm");
var signupEmail = document.getElementById("signupEmail");
var signupPassword1 = document.getElementById("signupPassword1");
var signupPassword2 = document.getElementById("signupPassword2");
var signupStorage = [];
var signinEmail = document.getElementById("signinEmail");
var signinPassword = document.getElementById("signinPassword");
var rememberMe = document.getElementById("rememberme");
var rememberStorage = [];
var signinStorage = [];
var activeUser = "";
var welcome = document.getElementById("welcome");
var nameHeading = document.getElementById("userHeading");
var task_list = document.getElementById("task-list");
var input = document.getElementById("new-task");
var add_btn = document.getElementById("add-task-btn");
var todoStorage = [];
// var todoStorage = todoStorage || [];

// ===============Form Container Start====================

function showSignup() {
  signinForm.style.display = "none";
  signupForm.style.display = "block";
  reset();
}

function showSignin() {
  signupForm.style.display = "none";
  signinForm.style.display = "block";
  localStorage.removeItem("SigninValue");
  reset();
}

function reset() {
  signupEmail.value = "";
  signupPassword1.value = "";
  signupPassword2.value = "";
  signinEmail.value = "";
  signinPassword.value = "";
}

function logout() {
  activeUser = "";
  localStorage.removeItem("SigninValue");
  formContainer.style.display = "block";
  welcome.style.display = "none";
  reset();
  nameHeading.innerText = "";
}

function welcomeScreen() {
  if (localStorage.getItem("SigninValue")) {
    welcome.style.display = "flex";
    formContainer.style.display = "none";
    nameHeading.innerText = localStorage.getItem("SigninValue");
  }
  if (localStorage.getItem("ToDos")) {
      listDown();
  }
}
welcomeScreen();

// ================Form Container Start==================
// ====================Signup End========================

function saveSignup() {
  if (
    signupEmail.value &&
    signupPassword1.value &&
    signupPassword2.value &&
    signupPassword1.value === signupPassword2.value
  ) {
    if (!localStorage.getItem("SignupValue")) {
      console.log("First User Entered");
      newSignUp();
      var emailShow = signupEmail.value;
      showSignin()
      signinEmail.value = emailShow;
    } else {
      console.log("localStorage me Signup value mojod hai");
      signupStorage = JSON.parse(localStorage.getItem("SignupValue"));
      var userExists = signupStorage.some(function (data) {
        if (data.signupEmail === signupEmail.value) {
          console.log("UserName already Available");
          return true;
        }
        return false;
      });
      if (!userExists) {
        console.log("Next User Entered");
        newSignUp();
        var emailShow = signupEmail.value;
        showSignin()
        signinEmail.value = emailShow;
      }
    }
  } else {
    alert("Incorrect Email or Password");
  }
}

function newSignUp() {
  var obj = {
    signupEmail: signupEmail.value,
    signupPassword: signupPassword1.value,
  };
  signupStorage.push(obj);
  localStorage.setItem("SignupValue", JSON.stringify(signupStorage));
}

// ==================Signup End========================
// ==================Signin Start======================

function saveSignin() {
  signinStorage = JSON.parse(localStorage.getItem("SignupValue"));

  var findUser = signinStorage.some(function (data) {
    if (
      data.signupEmail === signinEmail.value &&
      data.signupPassword === signinPassword.value
    ) {
      console.log("User Found");
      localStorage.setItem("SigninValue", signinEmail.value);

      welcomeScreen();
      adminUser();
      listDown();
      return true;
    }
    return false;
  });
  if (!findUser) {
    console.log("Incorrect Email or Password");
    signinPassword.value = "";
  }
  console.log("singin end");
}
// ==================Signin End======================

// ==================ToDo Start======================

add_btn.addEventListener("click", function () {
  newTodo();
  firstEntry = true;
  console.log("1st Todo");
  listDown();
});

function newTodo() {
  localStorage = JSON.parse(localStorage.getItem("ToDos"));
  var now = new Date();
  var nowDate = now.toLocaleDateString();
  if (input.value) {
    var obj = {
      emailID: localStorage.getItem("SigninValue"),
      toDo: input.value,
      date: nowDate,
    };
    todoStorage.push(obj);
    input.value = "";
    localStorage.setItem("ToDos", JSON.stringify(todoStorage));
    input.value = "";
  }
}

function edit_btn(element) {
  var email = element.parentElement.parentElement.children[0].innerText;
  var text = element.parentElement.parentElement.children[1].innerText;
  var previousDate = element.parentElement.parentElement.children[2].innerHTML;
  todoStorage = JSON.parse(localStorage.getItem("ToDos"));
  var checkData = false;
  todoStorage.forEach(function (data, ind) {
    if (
      email === data.emailID &&
      text === data.toDo &&
      previousDate === data.date
    ) {
      console.log("value available for change");
      console.log(data.toDo);
      var now = new Date();
      var updatedDate = now.toLocaleDateString();
      var updatedText = prompt("Enter updated value", data.toDo);
      var obj = {
        emailID: email,
        toDo: updatedText,
        date: updatedDate,
      };
      todoStorage.splice(ind, 1, obj);
      console.log(todoStorage);
      localStorage.setItem("ToDos", JSON.stringify(todoStorage));
      console.log("value updated");
      listDown();
      checkData = true;
    }
  });
}
function delete_btn(element) {
  var email = element.parentElement.parentElement.children[0].innerText;
  var text = element.parentElement.parentElement.children[1].innerText;
  var date = element.parentElement.parentElement.children[2].innerHTML;
  todoStorage = JSON.parse(localStorage.getItem("ToDos"));

  var checkData = false;

  todoStorage.forEach(function (data, ind) {
    if (email === data.emailID && text === data.toDo && date === data.date) {
      console.log("value available");
      todoStorage.splice(ind, 1);
      console.log("value delete");
      localStorage.setItem("ToDos", JSON.stringify(todoStorage));
      listDown();
      checkData = true;
    }
  });
}

function listDown() {
  var myID = localStorage.getItem("SigninValue");
  task_list.innerHTML = "";
  todoStorage = JSON.parse(localStorage.getItem("ToDos"));
  todoStorage.forEach(function (data, ind) {
    if (myID === "admin@gmail.com" || myID === data.emailID) {
      var new_Entry = `
              <li class="task-item">
              <span class="userName" id="adminID${ind}">${data.emailID}</span>
                  <span class="task-text">${data.toDo}</span>
                  <span class="number" id="number">${data.date}</span>
                  <div class="task-buttons">
                      <span class="task-date"></span>
                      <button class="edit-btn" onclick="edit_btn(this)">✎</button>
                      <button class="delete-btn" onclick="delete_btn(this)">&times;</button>
                  </div>
              </li>`;
              task_list.innerHTML += new_Entry;
              }
            adminUser();
              });
              }
              
// ==================ToDo Start======================

function adminUser() {
  var getAdminUser = localStorage.getItem("SigninValue");
  var filterButton = document.getElementById('filter-button');
  if (getAdminUser === "admin@gmail.com") {
    document.getElementById("listContainer").style.width = "550px";
    filterButton.style.display = 'flex';
    // document.getElementById('allUser').innerText = 'All Users Todos';
        
        for(var i = 0; i < adminEmail.length; i++){
          adminEmail[i].style.display = "flex";

        }
    }   else {
      document.getElementById("listContainer").style.width = "400px";
      filterButton.style.display = 'none';
      for(var i = 0; i < adminEmail.length; i++){
        adminEmail[i].style.display = "none";

        }
    }
}

function filter(){
    console.log(task_list.innerHTML)
}
