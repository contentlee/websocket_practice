import BaseModel from "./base";

import { Chat } from "../utils/types";

class ChatModel {
  private model = new BaseModel("chat");

  public addMessage(chat: Chat, name: string) {
    return this.model.getCollection().updateOne({ name }, { $addToSet: { chat } });
  }
}

export default ChatModel;
