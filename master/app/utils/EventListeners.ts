export type EventListener<T> = (event: T) => Promise<void> | void;

export class EventListeners<T> {
  private listeners: EventListener<T>[] = [];

  public errorLog: (error: unknown) => void = console.log;

  /**
   * Purge all
   */
  public purge() {
    this.listeners = [];
  }

  /**
   * Add new listener
   * @param listener
   */
  public add(listener: EventListener<T>) {
    this.listeners.push(listener);
  }

  /**
   * Remove listener
   * @param listener
   */
  public remove(listener: EventListener<T>) {
    const index = this.listeners.indexOf(listener);
    if (index > -1) {
      this.listeners.splice(index, 1);
    }
  }

  /**
   * Schedule to listen once
   * @param listener
   */
  public async once(): Promise<T> {
    return new Promise<T>((resolve) => {
      const wrapper = async (event: T) => {
        this.remove(wrapper);
        resolve(event);
      };

      this.add(wrapper);
    })
  }

  /**
   * Iterate over each listener
   * @param event
   */
  async onEvent(event: T) {
    const clone = [...this.listeners];
    for (const listener of clone) {
      try {
        await listener(event);
      } catch (e) {
        this.errorLog(e);
      }
    }
  }
}
