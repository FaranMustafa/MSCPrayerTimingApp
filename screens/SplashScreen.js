import {StackActions} from '@react-navigation/native';
import React, {useEffect} from 'react';
import {View, Text, Image, StatusBar} from 'react-native';
const SplashScreen = (props) => {
  useEffect(() => {
    setTimeout(() => {
      props.navigation.dispatch(StackActions.replace('Home'));
    }, 1000);
  }, []);

  return (
    <View style={{flex: 1, backgroundColor: '#313C4D'}}>
      <StatusBar backgroundColor="#313C4D" />
      <View style={{justifyContent: 'center', alignItems: 'center', flex: 1}}>
        <Text
          style={{
            color: 'white',
            fontSize: 40,
            marginTop: 20,
            textAlign: 'center',
          }}>
          Prayers Time
        </Text>

        <Image
          resizeMode={'contain'}
          style={{width: 200, height: 200}}
          source={require('../assets/mosque.png')}
        />
      </View>
    </View>
  );
};
export default SplashScreen;
