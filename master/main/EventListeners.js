export class EventListeners {
  #listeners = [];

  errorLog = console.log;

  /**
   * Purge all
   */
  purge() {
     this.#listeners = [];
  }

  /**
   * Add new listener
   * @param listener
   */
  add(listener) {
    this.#listeners.push(listener);
  }

  /**
   * Remove listener
   * @param listener
   */
  remove(listener) {
    const index =  this.#listeners.indexOf(listener);
    if (index > -1) {
       this.#listeners.splice(index, 1);
    }
  }

  /**
   * Schedule to listen once
   * @param listener
   */
  async once() {
    return new Promise<T>((resolve) => {
      const wrapper = async (event) => {
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
  async onEvent(event) {
    const clone = [... this.#listeners];
    for (const listener of clone) {
      try {
        await listener(event);
      } catch (e) {
        this.errorLog(e);
      }
    }
  }
}
