import React, {useState, useEffect} from 'react';

import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  PermissionsAndroid,
  Platform,
  StatusBar,
  AsyncStorage,
  Dimensions,
  ImageBackground,
  ActivityIndicator,
  Modal,
} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {Calendar} from 'react-native-calendars';

//geolocation
import Geolocation from '@react-native-community/geolocation';

//firebase
import messaging from '@react-native-firebase/messaging';

const moment = require('moment');
const {width} = Dimensions.get('screen');

const HomeScreen = () => {
  const [currentLongitude, setCurrentLongitude] = useState(null);
  const [currentLatitude, setCurrentLatitude] = useState(null);
  const [adhaanData, setadhaanData] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const getToken = async () => {
    let fcmToken = await AsyncStorage.getItem('fcmToken');

    fcmToken = await messaging().getToken();
    if (fcmToken) {
      await AsyncStorage.setItem('fcmToken', fcmToken);
    }
  };

  useEffect(() => {
    getToken();
    const requestLocationPermission = async () => {
      if (Platform.OS === 'ios') {
        getOneTimeLocation();
        subscribeLocationLocation();
      } else {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
              title: 'Location Access Required',
              message: 'This App needs to Access your location',
            },
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            getOneTimeLocation();
          } else {
            setLocationStatus('Permission Denied');
          }
        } catch (err) {
          console.warn(err);
        }
      }
    };
    requestLocationPermission();
    return () => {
      Geolocation.clearWatch();
    };
  }, []);

  const getOneTimeLocation = async () => {
    Geolocation.getCurrentPosition(
      (position) => {
        setCurrentLongitude(JSON.stringify(position.coords.longitude));
        setCurrentLatitude(JSON.stringify(position.coords.latitude));
        const time = moment();
        getData(
          time.unix(),
          JSON.stringify(position.coords.longitude),
          JSON.stringify(position.coords.latitude),
        );
      },
      (error) => {
        setLocationStatus(error.message);
      },
      {
        enableHighAccuracy: false,
        timeout: 30000,
        maximumAge: 1000,
      },
    );
  };

  const getData = (timestamp, longitude, latitude) => {
    console.log(currentLatitude, currentLongitude, 'getdata');

    var myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');

    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
    };
    fetch(
      `http://api.aladhan.com/v1/timings/${timestamp}?latitude=${
        currentLatitude ? currentLatitude : latitude
      }&longitude=${currentLongitude ? currentLongitude : longitude}&method=2`,
      requestOptions,
    )
      .then((response) => response.json())
      .then((result) => {
        setadhaanData(result.data);
        console.log(result.data, 'get data');
      })
      .catch((error) => console.log('error', error));
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <StatusBar backgroundColor="#313C4D" />

      <ImageBackground
        source={{
          uri:
            'https://images.pexels.com/photos/2784992/pexels-photo-2784992.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
        }}
        style={styles.container}
        resizeMode="cover">
        <ModalCalendar
          modalVisible={modalVisible}
          handleClose={() => setModalVisible(false)}
          getData={getData}
        />

        <View
          style={{
            flex: 1,
            alignItems: 'center',
            width: width,
            height: '100%',
            marginTop: -10,
            marginBottom: -10,
            backgroundColor: 'rgba(0,0,0,0.5)',
          }}>
          {adhaanData && (
            <View
              style={{
                flex: 0.8,
                justifyContent: 'space-around',
                marginTop: 20,
              }}>
              <Text
                style={{
                  fontSize: 20,
                  color: 'white',
                  fontWeight: '900',
                  textAlign: 'center',
                }}>
                {adhaanData ? adhaanData.date.hijri.month.en : 'month'}
              </Text>
              <Text
                style={{
                  fontSize: 24,
                  color: 'white',
                  fontStyle: 'italic',
                  fontWeight: '900',
                  textAlign: 'center',
                }}>
                {adhaanData ? adhaanData.date.readable : 'date'}
              </Text>
              <Text
                style={{
                  fontSize: 28,
                  color: 'white',
                  fontWeight: '900',
                  textAlign: 'center',
                }}>
                Karachi
              </Text>
              <Text
                style={{
                  fontSize: 20,
                  color: 'white',
                  fontStyle: 'italic',
                  fontWeight: '900',
                  textAlign: 'center',
                }}>
                {adhaanData &&
                  `${adhaanData.date.hijri.day}  ${adhaanData.date.hijri.weekday.en} ${adhaanData.date.hijri.year}`}
              </Text>
            </View>
          )}
        </View>
      </ImageBackground>

      {adhaanData ? (
        <View style={{flex: 1, justifyContent: 'space-around', top: 10}}>
          <View style={styles.timingWrap}>
            <Text style={styles.keyStyle}>Fajr</Text>
            <Text style={styles.valueStyle}>{adhaanData.timings.Fajr}</Text>
          </View>

          <View style={styles.timingWrap}>
            <Text style={styles.keyStyle}>Sunrise</Text>
            <Text style={styles.valueStyle}>{adhaanData.timings.Sunrise}</Text>
          </View>
          <View style={styles.timingWrap}>
            <Text style={styles.keyStyle}>Dhuhr</Text>
            <Text style={styles.valueStyle}>{adhaanData.timings.Dhuhr}</Text>
          </View>
          <View style={styles.timingWrap}>
            <Text style={styles.keyStyle}>Asr</Text>
            <Text style={styles.valueStyle}>{adhaanData.timings.Asr}</Text>
          </View>
          <View style={styles.timingWrap}>
            <Text style={styles.keyStyle}>Maghrib</Text>
            <Text style={styles.valueStyle}>{adhaanData.timings.Maghrib}</Text>
          </View>
          <View style={styles.timingWrap}>
            <Text style={styles.keyStyle}>Isha</Text>
            <Text style={styles.valueStyle}>{adhaanData.timings.Isha}</Text>
          </View>
        </View>
      ) : (
        <View style={[styles.Acontainer, styles.Achorizontal]}>
          <ActivityIndicator size="large" color="#b17104" />
        </View>
      )}

      <View
        style={{flex: 0.4, justifyContent: 'flex-end', alignItems: 'center'}}>
        <TouchableOpacity
          style={{
            backgroundColor: '#466CA9',
            height: 50,
            justifyContent: 'center',
            width: width,
          }}
          onPress={() => setModalVisible(true)}>
          <Text
            style={{
              fontWeight: 'bold',
              fontSize: 20,
              color: 'white',
              textAlign: 'center',
            }}>
            Month View
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  boldText: {
    fontSize: 25,
    color: 'red',
    marginVertical: 16,
  },
  centeredView: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,.2)',
    justifyContent: 'center',
  },
  timingWrap: {flexDirection: 'row', justifyContent: 'space-around'},
  keyStyle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    width: 100,
  },
  valueStyle: {fontSize: 20, fontWeight: '900', color: '#787878'},
  modalView: {
    margin: 40,
    backgroundColor: 'white',
    flex: 0.7,
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  Accontainer: {
    flex: 1,
    justifyContent: 'center',
  },
  Achorizontal: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
  },
});

export default HomeScreen;

const ModalCalendar = (props) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={props.modalVisible}
      onRequestClose={() => {
        Alert.alert('Modal has been closed.');
      }}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Calendar
            onDayPress={(day) => {
              console.log('selected day', day);
              const time = moment(day.timestamp);
              props.getData(time.unix());
              props.handleClose();
            }}
            // Collection of dates that have to be marked. Default = {}
          />
        </View>
      </View>
    </Modal>
  );
};
