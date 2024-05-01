class Clients {
  private list: { user: string; id: string }[] = [];

  pushUser(user: string, id: string) {
    this.list.push({ user, id });
  }

  changeUserId(index: number, id: string) {
    console.log(id);
    this.list[index].id = id;
  }

  findUserIdxById(id: string) {
    return this.list.findIndex((info) => info.id === id);
  }

  findUserIdByName(user: string) {
    return this.list.find((c) => c.user === user);
  }

  spliceUser(id: string) {
    const index = this.list.findIndex((v) => v.id === id);
    this.list.splice(index, 1);
  }
}

export default new Clients();
