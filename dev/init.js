import TarkaChat from "../src/main.js";
import "./style.css";

async function startSession(passkey) {
  const url = "http://localhost:3000/api/start-session";
  const response = await fetch(url, {
    headers: { Authorization: "Bearer " + passkey },
  });
  if (response.status >= 400 && response.status < 500) {
    throw "Invalid Passkey";
  } else if (response.status >= 500 && response.status < 600) {
    throw "Something went wrong. Please try again later";
  }
  const data = await response.json();
  return data?.sessionId;
}

const createSession = async () => {
  try {
    // ! Deprecate that and replace this with cookie logic.
    const passkey =
      "$2a$10$/PjHaF7KdVQ/6hP.O.T7AexFsaCwGb.SNto/aYyzBFgTRkc1FAlFa";
    sessionStorage.setItem("passkey", passkey);
    // ! Till here

    const sessionId = await startSession(passkey);
    if (!sessionId) {
      msgContainer.innerHTML = "Session id not found in response... Pls retry";
      return;
    }
    sessionStorage.setItem("session-id", sessionId);

    return "mock-session-id";
  } catch (e) {
    console.error(e);
  }
};

const creatSubmitHandlerMethod = (sessionId) => {
  const submitHandler = async (message) => {
    // ! remove this
    const passkey = sessionStorage.getItem("passkey");
    const sessionId = sessionStorage.getItem("session-id");

    const url = "http://localhost:3000/api/chat";
    const payload = { message, silo: "zo", sessionId };
    try {
      const response = await fetch(url, {
        method: "POST",
        body: JSON.stringify(payload),
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + passkey,
        },
      });

      let errorMsg = "";
      if (response.status === 504) {
        errorMsg = "Oops! Server took too long to process. Please try again!";
      } else if (response.status >= 400 && response.status < 600) {
        errorMsg = await response.text();
      }

      if (errorMsg) {
        return Promise.resolve([{ type: "text", message: errorMsg }]);
      }
      if (!response.ok) {
        return Promise.resolve(response.json());
      }

      console.log("Question: ", message);
      const responseData = await response.json();

      return Promise.resolve(responseData.content_json);
    } catch (err) {
      console.error(err);
      return Promise.resolve({
        type: "text",
        message: "Something went wrong, Please try again.",
      });
    }
  };
  return submitHandler;
};

const initializeChatbot = (submitHandler) => {
  const chat = TarkaChat.init({
    title: "ZIVA",
    botName: "ZIVA",
    userName: "Hruser",
    selectorId: "zivachatbot",
    submitHandler: submitHandler,
    expand: false,
  });
  return chat;
};

const init = async () => {
  const sessionId = await createSession();
  const submitHandler = await creatSubmitHandlerMethod(sessionId);
  const chat = initializeChatbot(submitHandler);

  const toggleButton = document.getElementById("toggle-ziva");
  toggleButton.onclick = chat.toggle;
};

init();
