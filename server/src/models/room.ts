import { TRoom } from "../utils/types";
import BaseModel from "./base";

class RoomModel {
  private model = new BaseModel("chat");

  public getRoom(name: string) {
    return this.model.getCollection<TRoom>().findOne({ name });
  }

  public getRooms() {
    return this.model.getCollection<TRoom>().find().toArray();
  }

  public createRoom(room: TRoom) {
    return this.model.getCollection().insertOne(room);
  }

  public deleteRoom(name: string) {
    return this.model.getCollection().deleteOne({ name });
  }

  public attendUser(name: string, user: string, msg_index: number) {
    return this.model.getCollection().updateOne({ name }, { $addToSet: { attendee: { user, msg_index } } });
  }

  public leaveUser(name: string, user: string) {
    return this.model.getCollection().updateOne({ name }, { $pull: { attendee: { user } } });
  }
}

export default RoomModel;
