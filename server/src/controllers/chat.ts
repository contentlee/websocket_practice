import { ChatService, RoomService } from "../services";
import { TChat } from "../utils/types";
import BaseController from "./base";

class ChatController extends BaseController {
  private chatService = new ChatService();

  public getChats = async (
    roomName: string,
    userName: string,
    endIdx: number,
    done: (chats: TChat[], startIdx: number) => void
  ) => {
    if (!userName) this.requireValidation();
    try {
      const { chats, startIdx } = await this.chatService.getChats(roomName, userName, endIdx);
      done(chats, startIdx);
    } catch (err) {
      this.sendError(err);
    }
  };

  public sendMessage = async (message: string, roomName: string, userName: string, done: () => void) => {
    if (!userName) return this.requireValidation();

    try {
      const chat = await this.chatService.sendMessage(message, roomName, userName);
      this.socket.to(roomName).emit("new_message", chat);
      done();
    } catch (err) {
      this.sendError(err);
      console.log(err);
    }
  };
}

export default ChatController;
