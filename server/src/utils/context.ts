class Clients {
  private list: { user: string; id: string[] }[] = [];

  pushUser(user: string, id: string) {
    this.list.push({ user, id: [id] });
  }

  spliceUser(id: string) {
    const index = this.list.findIndex((info) => info.id.includes(id));
    this.list.splice(index, 1);
  }

  addUserId(index: number, id: string) {
    if (this.list[index].id.length >= 5) this.list[index].id.splice(0, 1);
    return this.list[index].id.push(id);
  }

  findUserIdxByName(user: string) {
    return this.list.findIndex((info) => info.user === user);
  }

  findUserIdByName(user: string) {
    return this.list.find((info) => info.user === user);
  }
}

export default new Clients();
