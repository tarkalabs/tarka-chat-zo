import TarkaChat from "../src/main.js";
import "./style.css";

async function sendMessage(message) {
  // API call
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

const chat = TarkaChat.init({
  title: "ZIVA",
  botName: "ZIVA",
  userName: "Hruser",
  selectorId: "zivachatbot",
  submitHandler: sendMessage,
  expand: false,
});

const toggleButton = document.getElementById("toggle-ziva");
toggleButton.onclick = chat.toggle;
