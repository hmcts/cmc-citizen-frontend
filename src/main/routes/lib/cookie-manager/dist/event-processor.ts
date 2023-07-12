interface EventToken {
    type: string;
    token: string;
  }
  
  class EventProcessor {
    private static _handlerMap: Map<string, Map<string, Function>> = new Map();
  
    public static on(eventName: string, callback: Function): EventToken {
      if (typeof eventName !== 'string') {
        console.error('Event not provided');
        return;
      }
      if (typeof callback !== 'function') {
        console.error('No callback function provided');
        return;
      }
      eventName = eventName.toLowerCase();
      const token = Math.random().toString(16).slice(2);
      if (!EventProcessor._handlerMap.has(eventName)) {
        EventProcessor._handlerMap.set(eventName, new Map());
      }
      EventProcessor._handlerMap.get(eventName).set(token, callback);
      return { type: eventName, token: token };
    }
  
    public static off(eventToken: EventToken): void {
      let type;
      let token;
      try {
        type = eventToken.type.toLowerCase();
        token = eventToken.token;
      } catch (e) {
        console.error('Missing or malformed event token provided');
        return;
      }
      if (EventProcessor._handlerMap.has(type)) {
        EventProcessor._handlerMap.get(type).delete(token);
      }
    }
  
    public static emit(type: string, data: any): void {
      type = type.toLowerCase();
      console.debug('Event fired: ' + type);
      if (EventProcessor._handlerMap.has(type)) {
        EventProcessor._handlerMap.get(type).forEach((value) => value(data));
      }
    }
  }  