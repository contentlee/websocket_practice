import { Chat, Room } from "../utils/types";
import { WithId } from "mongodb";
import BaseModel from "./base";

class ChatModel {
  private model = new BaseModel("chat");

  public getRoom(name: string) {
    return this.model.getCollection<Room>().findOne({ name });
  }

  public getRooms() {
    return this.model.getCollection<Room>().find().toArray();
  }

  public createRoom(room: Room) {
    return this.model.getCollection().insertOne(room);
  }

  public deleteRoom(name: string) {
    return this.model.getCollection().deleteOne({ name });
  }

  public addMessage(chat: Chat, name: string) {
    return this.model.getCollection().updateOne({ name }, { $addToSet: { chat } });
  }

  public attendUser(name: string, user: string, msg_index: number) {
    return this.model.getCollection().updateOne({ name }, { $addToSet: { attendee: { user, msg_index } } });
  }

  public leaveUser(name: string, user: string) {
    return this.model.getCollection().updateOne({ name }, { $pull: { attendee: { user } } });
  }
}

export default ChatModel;
