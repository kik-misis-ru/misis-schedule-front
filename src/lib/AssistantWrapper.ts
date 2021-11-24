import {createAssistant, createSmartappDebugger} from "@sberdevices/assistant-client";
import {App} from "../App";
import {AssistantEvent, AssistantEventCharacter, AssistantEventSmartAppData} from "../types/AssistantReceiveAction";
import {AssistantSendAction} from "../types/AssistantSendAction";

export const initializeAssistant = (getState) => {
  if (process.env.NODE_ENV === "development") {
    return createSmartappDebugger({
      token: process.env.REACT_APP_TOKEN ?? "",
      initPhrase: `Запусти ${process.env.REACT_APP_SMARTAPP}`,
      getState,
    });
  }
  return createAssistant({getState});
};


export class AssistantWrapper {
  _assistant
  _App: App

  constructor(_App: App) {
    this._App = _App;
  }

  init() {
    this._assistant = initializeAssistant(() => this._App.getStateForAssistant());

    this._assistant.on("data", (event: AssistantEvent) => {
      console.log('_assistant.on("data"): event:', event);
      this.handleAssistantDataEvent(event);
    });

    this._assistant.on("start", (event) => {
      console.log(`_assistant.on(start)`, event);
    });

    this._assistant.on("ANSWER_TO_USER", (event) => {
      console.log(`_assistant.on(raw)`, event);
    });
  }

  handleAssistantDataEvent(event: AssistantEvent) {
    console.log('handleAssistantDataEvent: event:', event);

    switch (event?.type) {

      case "character":
        this.handleAssistantDataEventCharacter(event);
        break;

      case "smart_app_data":
        this.handleAssistantDataEventSmartAppData(event);
        break

      default:
        break
    }
  }

  handleAssistantDataEventCharacter(event: AssistantEventCharacter) {
    console.log('handleAssistantEventCharacter: character.id:', event.character.id);

    this._App.handleAssistantCharacter(event.character)
    // this.setState({character: event.character.id});
    // if (event.character.id === CHAR_TIMEPARAMOY) {
    //   this.setState({description: FILL_DATA_TO_OPEN_TEXT});
    // } else {
    //   this.setState({description: TO_VIEW_SET_GROUP_TEXT});
    // }
  }

  handleAssistantDataEventSmartAppData(event: AssistantEventSmartAppData) {
    console.log('handleAssistantEventSmartAppData: event:', event);

    if (event.sub !== undefined) {
      this._App.handleAssistantSub(event.sub);
    }

    console.log(`assistant.on(data)`, event);
    const {action} = event;
    this._App.dispatchAssistantAction(action);
  }

  //

  sendAction(action: AssistantSendAction) {
    console.log(action);
    return this._assistant.sendData({
      action
    })
  }

}
