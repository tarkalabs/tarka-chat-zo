import TarkaChat from "../src/main.js";
import "./style.css";

const API_URL = "http://localhost:3000";

function parseCookies() {
  return document.cookie.split(';').reduce((cookies, cookieString) => {
    const [name, value] = cookieString.split('=');
    cookies[name.trim()] = decodeURIComponent(value);
    return cookies;
  }, {});
}

async function startSession() {
  const url = API_URL + "/api/chat/start-session";
  const response = await fetch(url, {
    headers: parseCookies(),
  });
  if (response.status >= 400 && response.status < 500) {
    throw "Failed to initialize session";
  } else if (response.status >= 500 && response.status < 600) {
    throw "Something went wrong. Please try again later";
  }
  const data = await response.json();
  return data?.sessionId;
}

const createSession = async () => {
  try {
    const sessionId = await startSession();
    if (!sessionId) {
      msgContainer.innerHTML = "Session id not found in response... Pls retry";
      return;
    }

    return sessionId;
  } catch (e) {
    console.error(e);
  }
};

const creatSubmitHandlerMethod = (sessionId) => {
  const submitHandler = async (message) => {
    const url = API_URL + "/api/chat";
    const payload = { message, silo: "zo", sessionId };
    try {
      const response = await fetch(url, {
        method: "POST",
        body: JSON.stringify(payload),
        headers: {
          ...parseCookies(),
          "Content-Type": "application/json",
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

      return Promise.resolve(responseData.content);
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
    onTileClick: (url) => {return console.log(url)},
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
