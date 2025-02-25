# Tarka Chat UI

Tarka Chat UI is a plug and play javascript library to integrate a chat assistant to your website in one line

## Usage

1. Include the following script (hosted in CDN) in your html

```
<script src="https://d1fmfone96g0x2.cloudfront.net/tarka-chat-2.4.0.umd.js"></script>
```

2. Initialise the global `TarkaChat` component with options in any script tag

```
TarkaChat.init({
        title: "Personal Assistant",
        botName: "superbot",
        selectorId: "chatbot",
        expand: true,
        submitHandler: async function (message) {
          // Do API calls
          // after getting response return the response string
          return Promise.resolve("Recieved response");
        },
      });
```

where,

- [Optional] **title** is the title of the chatbot window
- [Optional] **botName** will be displayed below each bot message
- [Optional] **expand** opens the chat window in expanded mode on init when set to true, otherwise opens in collapse mode. Defaults to false.
- **selectorId** the DOM element selector (id) inside which the bot will be rendered
- **submitHandler** this function will be called whenever a user types a message in the bot and submits
  Returned response from submitHandler should be one the below types:

  1. _String_
  2. One of the below objects:

  - _Text type:_

  ```
    {
        "type": "text",
        "message": "MESSAGE"
    }
  ```

  - _TILE type:_

  ```
    {
      "type": "tiles",
      "tiles_data":[
        {
          "report_name":"name of report",
          "url":"url of report"
        }
      ] 
    }    
  ```

  3. _Array containing one/multiple of above mentioned types:_
     E.g.

  ```
  [
    {
      "type": "text",
      "message": "MESSAGE"
    },
    {
      "type": "tiles",
      "tiles_data":[
        {
          "report_name":"name of report",
          "url":"url of report"
        }
      ] 
    }
  ]
  ```


## Demo


# Dev notes

If you wanted to run this code in your local for development purposes, Run the following command from project root folder `yarn dev` and open `dev/index.html` in your browser to see the chat window. Your local changes will be hot reloaded

## Releasing new version
Run following command to release a new version:
```
yarn build
```