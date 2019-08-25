/* eslint-disable eslint-comments/no-unlimited-disable */
/* eslint-disable*/
import React from 'react';
import firebase from 'react-native-firebase';
import YouTube from 'react-native-youtube'

import {
  SafeAreaView,
  Platform,View,AsyncStorage
} from 'react-native';
export default class App extends React.Component {
  constructor(props){
    super(props)
    this.generateToken = this.generateToken.bind(this);

  }  
  componentDidMount(){
      this.checkPermission();
      this.createNotificationListeners(); //add this line
    }

    async checkPermission() {
        const enabled = await firebase.messaging().hasPermission();
        if (enabled) {
          this.getToken();
        } else {
          this.requestPermission();
        }
      }
      componentWillUnmount() {
        this.notificationListener;
        this.notificationOpenedListener;
      }
      async createNotificationListeners() {
        /*
         * Triggered when a particular notification has been received in foreground
         * */
        this.notificationListener = firebase
          .notifications()
          .onNotification(notification => {
            const { title, body } = notification;
            console.log("onNotification:");
            // Alert.alert(title,body)
            // alert('message');
    
            const localNotification = new firebase.notifications.Notification({
              sound: "sampleaudio",
              show_in_foreground: true
            })
              .setNotificationId(notification.notificationId)
              .setTitle(notification.title)
              // .setSubtitle(notification.subtitle)
              .setBody(notification.body)
              // .setData(notification.data)
              .android.setChannelId("fcm_default_channel") // e.g. the id you chose above
              .android.setSmallIcon("@drawable/ic_launcher") // create this icon in Android Studio
              .android.setColor("#000000") // you can set a color here
              .android.setPriority(firebase.notifications.Android.Priority.High)
              .notifications()
              .displayNotification(localNotification)
              .catch(err => console.error(err));
          });
    
    
          const channel = new firebase.notifications.Android.Channel('fcm_default_channel', 'Demo app name', firebase.notifications.Android.Importance.High).setDescription("Demo app description")
          .setSound("sampleaudio.mp3");
        firebase.notifications().android.createChannel(channel);
    
        /*
         * If your app is in background, you can listen for when a notification is clicked / tapped / opened as follows:
         * */
        this.notificationOpenedListener = firebase
          .notifications()
          .onNotificationOpened(notificationOpen => {
            const { title, body } = notificationOpen.notification;
            console.log("onNotificationOpened:");
            const {videoId} = notificationOpen.data
            this.props.navigation.navigate("RouteToVideo",{videoId});
          });
    
        /*
         * If your app is closed, you can check if it was opened by a notification being clicked / tapped / opened as follows:
         * */
        const notificationOpen = await firebase
          .notifications()
          .getInitialNotification();
        if (notificationOpen) {
          const { title, body } = notificationOpen.notification;
          const {videoId} = notificationOpen.data
          this.props.navigation.navigate("RouteToVideo",{videoId});
        }
        /*
         * Triggered for data only payload in foreground
         * */
        this.messageListener = firebase.messaging().onMessage(message => {
          //process data message
          console.log(JSON.stringify(message));
        });
      }
    
      //3
      async generateToken() {
        let Token = await firebase.messaging().getToken();
        if (Token) {
          // user has a device token
          console.log(Token);;
          // let data = {
          //   firebaseUID: this.props.UID,
          //   token: Token,
          // };;
          // fetch(url + "/api/addToken", {
          //   method: "PUT",
          //   body: JSON.stringify(data),
          //   headers: { "Content-Type": "application/json" }
          // })
          //   .then(res => res.json())
          //   .then(response => {
          //     console.log(response);;
          //     AsyncStorage.setItem("fcmToken", Token);
          //   });;
        }
      }
      async getToken() {
        await AsyncStorage.getItem("fcmToken").then(data => {
          if  (data === null) {
            this.generateToken();;
          } else console.log(data);;
        });;
      }
    
      //2
      async requestPermission() {
        try {
          await firebase.messaging().requestPermission();
          // User has authorised
          this.getToken();
        } catch (error) {
          // User has rejected permissions
          console.log("permission rejected");
        }
      }
    render() {
        const Banner = firebase.admob.Banner;
        const AdRequest = firebase.admob.AdRequest;
        
        const request = new AdRequest();
        const unitId =
        Platform.OS === 'ios'
          ? 'ca-app-pub-6938707447888789/8748968424'
          : 'ca-app-pub-3940256099942544/6300978111';
        return (
            <SafeAreaView style={{borderLeftColor:'white',borderRightColor:'white',borderLeftWidth:10,borderRightWidth:10,backgroundColor:'#ededeb'
      
        }}>
          <YouTube
    videoId="KVZ-P-ZI6W4"   // The YouTube video ID
    play                    // control playback of video with true/false
    loop                    // control whether the video should loop when ended
    apiKey='468757366156-6fheg94rjasc9qlj45k61psfv0udnncu.apps.googleusercontent.com'
    fullscreen
  
    style={{ alignSelf: 'stretch', height: 200,marginBottom:150 }}
  />
          <Banner
            
            unitId={unitId}
            size={'SMART_BANNER'}
            request={request.build()}
            onAdLoaded={() => {
              console.log('Advert loaded');
            }}
          />
        </SafeAreaView>
        )
    }
}
