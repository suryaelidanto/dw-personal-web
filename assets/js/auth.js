const API_KEY = "e7dacf49-cb27-4a29-8380-0fd01bee141a";

const kontenbaseClient = new kontenbase.KontenbaseClient({
  apiKey: API_KEY,
});

async function checkAuth() {
  if (localStorage.token) {
    const { user, error } = await kontenbaseClient.auth.user();

    if (error) {
      localStorage.removeItem("token");
      // console.log("error : cannot get user for now!");
      return;
    }

    document.getElementById("welcome_name").style.display = "block";
    document.getElementById("welcome_name").innerHTML = user.firstName;

    document.getElementById("btn-login").style.display = "none";
    document.getElementById("btn-register").style.display = "none";
    document.getElementById("btn-logout").style.display = "block";
    document.getElementById("nav-chat").style.display = "block";
  } else {
    document.getElementById("welcome_name").style.display = "none";
    document.getElementById("welcome_name").innerHTML = "";

    document.getElementById("btn-login").style.display = "block";
    document.getElementById("btn-register").style.display = "block";
    document.getElementById("btn-logout").style.display = "none";
    document.getElementById("nav-chat").style.display = "none";
  }
}

checkAuth();

async function register() {
  let firstName = document.getElementById("input-name-register").value;
  let email = document.getElementById("input-email-register").value;
  let password = document.getElementById("input-password-register").value;

  const { user, token, error } = await kontenbaseClient.auth.register({
    firstName,
    email,
    password,
  });

  if (error) {
    return alert("Registration failed!");
  }

  // wipe input register
  document.getElementById("input-name-register").value = "";
  document.getElementById("input-email-register").value = "";
  document.getElementById("input-password-register").value = "";

  alert("Registration success!");

  // console.log("user", user);
  // console.log("token", token);
  // console.log("error", error);
}

async function login() {
  let email = document.getElementById("input-email-login").value;
  let password = document.getElementById("input-password-login").value;

  const { user, token, error } = await kontenbaseClient.auth.login({
    email,
    password,
  });

  if (error) {
    return alert("Wrong email / password!");
  }

  // check auth after login
  checkAuth();

  // wipe input login
  document.getElementById("input-email-login").value = "";
  document.getElementById("input-password-login").value = "";
  alert("Login success!");

  // console.log("user", user);
  // console.log("token", token);
  // console.log("error", error);
}

async function logout() {
  const { user, error } = await kontenbaseClient.auth.logout();
  checkAuth();
  alert("Logout success!");
}
