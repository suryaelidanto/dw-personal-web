// dummy private route
if (!localStorage.token) {
  window.location.href = "/index.html";
}

const API_KEY = "e7dacf49-cb27-4a29-8380-0fd01bee141a";

const kontenbaseClient = new kontenbase.KontenbaseClient({
  apiKey: API_KEY,
});

// fetching data
async function getData() {
  const { user, error: errorUser } = await kontenbaseClient.auth.user({
    lookup: "*",
  });

  const { data, error } = await kontenbaseClient.service("Chat").find({
    lookup: "*",
  });

  // console.log("ini data user awal", user);
  // console.log("ini data awal", data);

  if (error) {
    localStorage.removeItem("token");
    window.location.href = "/index.html";
    // console.log("maaf sedang terjadi kesalahan, message : ", error);
    return;
  }

  if (errorUser) {
    localStorage.removeItem("token");
    window.location.href = "/index.html";
    // console.log("error : cannot get user for now!");
    return;
  }

  let initData = "";

  data.map((item) => {
    if (item.idSender[0]._id == user._id) {
      initData += `
      <div class="w-100 d-flex justify-content-end">
        <div
        class="p-2 rounded text-white mb-3"
        style="
            width: fit-content;
            max-width: 50%;
            background-color: #7FD1AE;
            overflow-wrap: break-word;
        "
        >
          <b>${item.name}</b>
          <br />
          ${item.notes}
      </div>
    </div>
    `;
    } else {
      initData += `
      <div class="w-100 d-flex">
        <div
        class="p-2 rounded text-white mb-3"
        style="
            width: fit-content;
            max-width: 50%;
            background-color: #00c6cf;
            overflow-wrap: break-word;
        "
        >
          <b>${item.name}</b>
          <br />
          ${item.notes}
      </div>
    </div>
    `;
    }
  });

  // console.log(user);
  document.getElementById("chat-section").innerHTML = initData;
}

getData();

kontenbaseClient.realtime.subscribe("Chat", { event: "*" }, (message) => {
  if (message.error) {
    // console.log(message.error);
    return;
  }

  // get lagi kalau terjadi perubahan
  getData();
  // console.log("ini bener gasih", message.event, message.payload);
});

async function sendMessage() {
  const { user, error: errorUser } = await kontenbaseClient.auth.user();
  let message = document.getElementById("message").value;

  if (errorUser) {
    // console.log("error : cannot send message for now!");
    return;
  }

  const { data, error } = await kontenbaseClient.service("Chat").create({
    name: user.firstName,
    notes: message,
    idSender: [user._id],
  });

  if (error) {
    // console.log("error : cannot send message for now!");
    return;
  }

  document.getElementById("message").value = "";
  // console.log("message sent : ", data);
}
