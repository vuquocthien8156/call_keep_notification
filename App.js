import { StatusBar } from "expo-status-bar";
import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Platform,
  AppRegistry,
} from "react-native";

import { CallKeep } from "./CallKeepService";
import messaging from "@react-native-firebase/messaging";

import RNCallKeep from "react-native-callkeep";
import { PermissionsAndroid } from "react-native";

const options = {
  ios: {
    appName: "My app name",
  },
  android: {
    alertTitle: "Permissions required",
    alertDescription: "This application needs to access your phone accounts",
    cancelButton: "Cancel",
    okButton: "ok",
    additionalPermissions: [
      PermissionsAndroid.PERMISSIONS.READ_PHONE_STATE,
      PermissionsAndroid.PERMISSIONS.CALL_PHONE,
      PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
    ],
    // Required to get audio in background when using Android 11
    // foregroundService: {
    //   channelId: "com.company.my",
    //   channelName: "Foreground service for my app",
    //   notificationTitle: "My app is running on background",
    //   notificationIcon: "Path to the resource icon of the notification",
    // },
  },
};

const makeCall = (data) => {
  const callkeep = new CallKeep(
    new Date().getTime().toString(),
    data?.phone,
    data?.name,
    Platform.OS,
    true
  );
  callkeep.displayCallAndroid();
};

export const backgroundMessageHandler = async (remoteMessage) => {
  console.log("Message handled in the background!", remoteMessage);
  RNCallKeep.setup(options);
  RNCallKeep.setAvailable(true);
  RNCallKeep.canMakeMultipleCalls(true);

  makeCall(remoteMessage.data);
  return Promise.resolve();
};

messaging().setBackgroundMessageHandler(backgroundMessageHandler);

messaging()
  .getToken()
  .then((res) => {
    console.log("messaging().getToken()", res);
  });

export default function App() {
  React.useEffect(() => {
    const unsubscribe = messaging().onMessage((remoteMessage) => {
      console.log("onMessage", remoteMessage);
      makeCall(remoteMessage.data);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <View style={styles.container}>
      <Text>Open up App.js to start working on your app!</Text>
      <StatusBar style="auto" />
      <TouchableOpacity
        style={{ width: 100, height: 80, backgroundColor: "pink" }}
        onPress={() => {}}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
