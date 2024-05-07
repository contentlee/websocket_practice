import BaseModel from "./base";

import { TChat } from "../utils/types";

class ChatModel {
  private model = new BaseModel("chat");

  public addMessage(chat: TChat, name: string) {
    return this.model.getCollection().updateOne({ name }, { $addToSet: { chat } });
  }

  public getChats(name: string) {
    return this.model.getCollection().findOne({ name }, {});
  }
}

export default ChatModel;
