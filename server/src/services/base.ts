class BaseService {
  protected _mkChatIdx(firstIdx: number, lastIdx: number): number {
    const startIdx = lastIdx - firstIdx;
    return startIdx > 20 ? lastIdx - 20 : firstIdx;
  }
}

export default BaseService;
