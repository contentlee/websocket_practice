class Chat {
  public createMsg(msg: string, userName: string) {
    return {
      type: "message",
      date: new Date(),
      msg,
      user: userName,
    };
  }

  public createWelcome(userName: string) {
    return {
      type: "welcome",
      date: new Date(),
      msg: `${userName} 님이 참여하셨습니다.`,
      user: userName,
    };
  }

  public createLeave(userName: string) {
    return {
      type: "bye",
      date: new Date(),
      msg: `${userName} 님이 퇴장하셨습니다.`,
      user: userName,
    };
  }
}

export default Chat;
