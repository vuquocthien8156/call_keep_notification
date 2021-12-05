import RNCallKeep from "react-native-callkeep";

import { NativeModules } from "react-native";

export class CallKeep {
  static instance;
  callId;
  callerName;
  callerId;
  isAudioCall;
  deviceOS;
  endCallCallback;
  muteCallback;
  IsRinging = false;

  constructor(callId, callerName, callerId, deviceOS, isAudioCall) {
    this.callId = callId;
    this.callerName = callerName;
    this.callerId = callerId;
    this.isAudioCall = isAudioCall;
    this.deviceOS = deviceOS;

    CallKeep.instance = this;
    this.setupEventListeners();
  }

  static getInstance() {
    return CallKeep.instance;
  }

  endCall = () => {
    RNCallKeep.endCall(this.callId);

    if (this.endCallCallback) {
      this.endCallCallback();
    }

    this.removeEventListeners();
  };

  displayCallAndroid = () => {
    this.IsRinging = true;
    RNCallKeep.displayIncomingCall(
      this.callId,
      this.callerName,
      this.callerName,
      "number"
    );
    setTimeout(() => {
      console.log("setTimeout");
      if (this.IsRinging) {
        this.IsRinging = false;
        // 6 = MissedCall
        // https://github.com/react-native-webrtc/react-native-callkeep#constants
        RNCallKeep.reportEndCallWithUUID(this.callId, 6);
      }
    }, 15000);
  };

  answerCall = ({ callUUID }) => {
    console.log("this.deviceOS", callUUID, this.deviceOS);
    if (this.deviceOS === "android") {
      const { CallkeepHelperModule } = NativeModules;
      console.log("this CallkeepHelperModule", CallkeepHelperModule);
      CallkeepHelperModule.startActivity();
      RNCallKeep.endCall(this.callId);
      alert('Accepted call')
    }
    this.IsRinging = false;
  };

  didDisplayIncomingCall = (args) => {
    if (args.error) {
      logError({
        message: `Callkeep didDisplayIncomingCall error: ${args.error}`,
      });
    }

    this.IsRinging = true;
    RNCallKeep.updateDisplay(this.callId, `${this.callerName}`, this.callerId);

    setTimeout(() => {
      if (this.IsRinging) {
        this.IsRinging = false;
        // 6 = MissedCall
        // https://github.com/react-native-webrtc/react-native-callkeep#constants
        RNCallKeep.reportEndCallWithUUID(this.callId, 6);
      }
    }, 15000);
  };

  setupEventListeners() {
    RNCallKeep.addEventListener("endCall", this.endCall);
    RNCallKeep.addEventListener("answerCall", this.answerCall);
    RNCallKeep.addEventListener(
      "didDisplayIncomingCall",
      this.didDisplayIncomingCall
    );
  }

  removeEventListeners() {
    RNCallKeep.removeEventListener("endCall");
    RNCallKeep.removeEventListener("didDisplayIncomingCall");
    this.endCallCallback = undefined;
  }
}
