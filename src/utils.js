import { marked } from "marked";
import * as attachmentImage from "./images/attachment.png";

export function createNode(className, content = null) {
  const node = document.createElement("div");
  node.className = className;
  if (content !== null) {
    node.innerHTML = content;
  }
  return node;
}

export function createTextNode(text) {
  let markdownText = marked.parse(text);
  return createNode("content-text", markdownText);
}

export function createTilesNode(tiles,onTileClick) {
  const wrapperNode = createNode("content-tiles");
  tiles.forEach(tileData => {
    const imageContainer = document.createElement("div");
    imageContainer.innerHTML = `<img src=${tileData.icon} onerror="this.onerror=null; this.src='${attachmentImage.default}'"/>`;

    const title = document.createElement("span");
    title.innerHTML = tileData.report_name;

    const tileNode = createNode("tile-item");
    tileNode.title = tileData.report_name;
    tileNode.onclick = () => onTileClick(tileData.url);
    tileNode.appendChild(imageContainer);
    tileNode.appendChild(title);

    wrapperNode.appendChild(tileNode);
  });
  return wrapperNode;
}
