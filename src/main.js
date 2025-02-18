import layout from "./layout.html?raw";
import greetingsBackground from "./images/greetings-background.png";
import logoImage from "./images/logo.png";
import "./style.scss";
import { createNode, createTextNode, createTilesNode } from "./utils";

const INITIAL_STATE = false;

export default {
  selectorId: "",
  title: "",
  botName: "",
  userName: "Guest",

  init: function (config = {}) {
    this.selectorId = config.selectorId;
    this.title = config.title;
    this.botName = config.botName;
    this.userName = config.userName ?? this.userName;

    this.render(config.submitHandler);
    this.toggle(config.expand || INITIAL_STATE);
    return { toggle: this.toggle, isOpen: this.isOpen };
  },

  isOpen: function () {
    const chatContainer = document.querySelector("#ziva-chat");
    return chatContainer.style.display === "flex";
  },

  toggle: function (forceOpenState = undefined) {
    const chatContainer = document.querySelector("#ziva-chat");
    const shouldBeOpen = forceOpenState || (forceOpenState === undefined && !this.isOpen());
    chatContainer.style.display = shouldBeOpen ? "flex" : "none";
  },

  render: function (submitHandler) {
    const targetElement = document.getElementById(this.selectorId);
    if (!targetElement) {
      console.error(`Element with ID "${this.selectorId}" not found.`);
      return;
    }

    const setProcessing = (processing) => {
      this.isProcessing = processing;
      const inputElement = document.querySelector("#ziva-chat .input-container input");
      inputElement.disabled = processing;
      const submitButton = document.querySelector("#ziva-chat .input-container button");
      submitButton.disabled = processing;
    };

    const messageHandler = async () => {
      const msgInput = document.querySelector("#ziva-chat .chat-input");
      const text = msgInput.value;
      if (this.isProcessing || text.length === 0) {
        return;
      }

      this.insertMessage(text, false);
      setProcessing(true);
      const response = await submitHandler(text);
      setProcessing(false);
      this.insertMessage(response, true, false);

      msgInput.value = "";
      msgInput.focus();
    };

    targetElement.innerHTML = layout;
    document.querySelector("#ziva-chat .header-title .logo").innerHTML = `<img src="${logoImage}"/>`;
    document.querySelector("#ziva-chat .header-title h4").textContent = this.title;
    document.querySelector("#ziva-chat .greetings-overlay h4").textContent = `Hello, ${this.userName}!`;
    document.querySelector("#ziva-chat .greetings-overlay").style.backgroundImage = `url(${greetingsBackground})`;

    const sendButton = document.querySelector("#ziva-chat .send-button");
    const msgInput = document.querySelector("#ziva-chat .chat-input");
    const closeButton = document.querySelector("#ziva-chat .close-button");

    sendButton.addEventListener("click", messageHandler);
    msgInput.addEventListener("keyup", async (event) => {
      if (event.keyCode === 13) sendButton.click();
    });
    closeButton.addEventListener("click", () => this.toggle(false));

    // Hide greetings overlay on first message submission
    sendButton.addEventListener("click", this.hideGreetingsOverlay, { once: true });
  },

  hideGreetingsOverlay() {
    const greetingsOverlay = document.querySelector("#ziva-chat .greetings-overlay");
    greetingsOverlay.style.display = "none";
  },

  createNodeByType(data) {
    if (typeof data === "string") {
      data = { type: "text", message: data };
    }
    if (!data.hasOwnProperty("type")) {
      throw new Error(`'type' is mandatory in ${JSON.stringify(data)}`);
    }
    switch (data.type) {
      case "text":
        return createTextNode(data.message);
      case "tiles":
        return createTilesNode(data.tiles_data);
      default:
        throw new Error(`Invalid type: ${type}`);
    }
  },

  insertMessage(data = "", incoming = false, showReportMessage = false) {
    // Timestamp
    const messageTimestamp = createNode("message-timestamp");
    messageTimestamp.innerHTML = new Date().toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });

    // Message (can be an array)
    const messageContentWrapper = createNode("wrapper");
    if (Array.isArray(data)) {
      data.forEach((item) => messageContentWrapper.appendChild(this.createNodeByType(item)));
    } else {
      messageContentWrapper.appendChild(this.createNodeByType(data));
    }

    // Full message object including timestamp
    const messageElement = createNode(`message ${incoming ? "incoming" : "outgoing"}`);
    messageElement.id = `message-${Date.now()}`;
    messageElement.appendChild(messageTimestamp);
    messageElement.appendChild(messageContentWrapper);

    // Add message element in all messages container for render
    const messagesContainer = document.querySelector("#ziva-chat .messages-container");
    messagesContainer.appendChild(messageElement);
    messagesContainer.lastElementChild.scrollIntoView();
  },
};
