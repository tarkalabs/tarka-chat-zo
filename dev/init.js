import TarkaChat from "../src/main.js";
import "./style.css";

const createSession = async () => {
  // const response = await fetch("loclhost:3000/api/start-session");
  // const { sessionId } = await response.json();
  // return sessionId;

  return "mock-session-id";
};

const creatSubmitHandlerMethod = (sessionId) => {
  const submitHandler = async (message) => {
    console.log(sessionId, message);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return Promise.resolve([
      {
        type: "text",
        message: `Received user message **${message}**`,
      },
      {
        type: "tiles",
        tiles_data: [
          { title: "Report Name", url: "https://google.com" },
          { title: "Report Name 2", url: "https://google.com" }
        ]
      }
    ]);
  }
  return submitHandler;
}

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
}


const init = async () => {
  const sessionId = await createSession();
  const submitHandler = await creatSubmitHandlerMethod(sessionId);
  const chat = initializeChatbot(submitHandler);

  const toggleButton = document.getElementById("toggle-ziva");
  toggleButton.onclick = chat.toggle;
}

init();