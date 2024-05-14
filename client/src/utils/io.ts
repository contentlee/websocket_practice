interface TOptions {
  notWorkOnInit?: boolean;
  workOnOnlyIntersecting?: boolean;
}

class Io {
  io: IntersectionObserver;
  queue: ((_?: IntersectionObserverEntry[]) => void)[] = [];

  init: boolean = true;
  options: TOptions = {
    notWorkOnInit: false,
    workOnOnlyIntersecting: false,
  };

  constructor(options?: TOptions) {
    this.io = new IntersectionObserver(this._callback);
    if (options) this.options = options;
  }

  enqueueFn = (fn: (_?: IntersectionObserverEntry[]) => void) => {
    this.queue.push(fn);
  };

  observe = (elm: HTMLElement) => {
    this.io.observe(elm);
  };

  disconnect = () => {
    this.io.disconnect();
  };

  private _isInit = () => {
    return this.options?.notWorkOnInit && this.init;
  };

  private _isIntersecting = (entries: IntersectionObserverEntry[]) => {
    return this.options?.workOnOnlyIntersecting && !entries.find((e) => e.isIntersecting === true);
  };

  private _callback = (entries: IntersectionObserverEntry[]) => {
    if (this._isIntersecting(entries)) return;
    if (this._isInit()) {
      this.init = false;
      return;
    }
    this.queue.forEach((fn) => {
      fn(entries);
    });
    this.queue = [];
  };
}

export default Io;
