import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/FontAwesome';
import {TouchableOpacity} from 'react-native';

//screens
import HomeScreen from './screens/Home';
import MonthCalendarScreen from './screens/MonthCalendar';
import SplashScreen from './screens/SplashScreen';
import {View} from 'react-native';

const Stack = createStackNavigator();

//disable warning
// console.disableYellowBox = true;

function Info() {
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text>Developed By:</Text>
      <Text>Syed Faran Mustafa</Text>
      <Text>cs171051</Text>
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={'SplashScreen'}>
        <Stack.Screen
          name="SplashScreen"
          component={SplashScreen}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{
            title: 'Prayer Times',
            headerStyle: {
              backgroundColor: '#313C4D',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
            headerLeft: () => (
              <Icon style={{left: 10}} name="bars" size={30} color="#fff" />
            ),
            headerRight: () => (
              <TouchableOpacity>
                <Icon
                  style={{right: 10}}
                  name="ellipsis-v"
                  size={30}
                  color="#fff"
                />
              </TouchableOpacity>
            ),
          }}
        />
        <Stack.Screen name="Calendar" component={MonthCalendarScreen} />
        <Stack.Screen name="Info" component={Info} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
