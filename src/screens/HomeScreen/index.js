/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {View, Text, Dimensions, Pressable} from 'react-native';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import NewOrderPopup from '../../components/NewOrderPopup';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import styles from './styles';

import {Auth, API, graphqlOperation} from 'aws-amplify';
import {getCar} from '../../graphql/queries';
import {updateCar} from '../../graphql/mutations';

const origin = {latitude: 28.450927, longitude: -16.260847};
const destination = {latitude: 37.771707, longitude: -122.4053769};
const GOOGLE_MAPS_APIKEY = 'AIzaSyAAXSxSUlN9mzMG5rB-UR8rqf-GfTKEwHY';

const HomeScreen = () => {
  const [car, setCar] = useState(null);
  // const [isOnline, setIsOnline] = useState(false);
  const [order, setOrder] = useState(null);
  const [myPosition, setMyPosition] = useState(null);
  const [newOrder, setNewOrder] = useState({
    id: '1',
    type: 'UberX',

    originLatitude: 28.450027,
    originLongitude: -16.260845,

    destLatitude: 28.450927,
    destLongitude: -16.260845,

    user: {
      rating: 4.0,
      name: 'Sheriff',
    },
  });

  const fetchCar = async () => {
    try {
      // Get authenticated user
      const userData = await Auth.currentAuthenticatedUser();
      const carData = await API.graphql(
        graphqlOperation(getCar, {id: userData.attributes.sub}),
      );
      setCar(carData);
    } catch (error) {}
  };
  useEffect(() => {
    fetchCar();
  }, []);
  const onGoPress = async () => {
    // setIsOnline(!isOnline);

    // update the car and set it to active

    try {
      const userData = await Auth.currentAuthenticatedUser();
      const input = {
        id: userData.attributes.sub,
        isActive: !car.isActive,
      };
      const updatedCarData = await API.graphql(
        graphqlOperation(updateCar, {
          input,
        }),
      );
      setCar(updatedCarData.data.updateCar);
    } catch (e) {
      console.log(e);
    }
  };

  const onDecline = () => {
    setNewOrder(null);
  };

  const onAccept = newOrder => {
    setOrder(newOrder);
    setNewOrder(null);
  };

  const renderBottomTitle = () => {
    if (order && order.isFinished) {
      // console.log(order);
      return (
        <View style={{alignItems: 'center'}}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#cb1a1a',
              width: 200,
              padding: 10,
            }}>
            <Text style={{color: 'white', fontWeight: 'bold'}}>
              Complete {order.type}
            </Text>
          </View>
          <Text style={styles.bottomText}> {order.user.name}</Text>
        </View>
      );
    }
    if (order && order.pickedUp) {
      // console.log(order);
      return (
        <View style={{alignItems: 'center'}}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text>{order.duration ? order.duration.toFixed(1) : '?'} min</Text>
            <View
              style={{
                backgroundColor: '#d41212',
                marginHorizontal: 10,
                width: 30,
                height: 30,
                borderRadius: 20,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <FontAwesome name={'user'} size={20} color="white" />
            </View>
            <Text>{order.distance ? order.distance.toFixed(1) : '?'} mi</Text>
          </View>
          <Text style={styles.bottomText}>Dropping off {order.user.name}</Text>
        </View>
      );
    }
    if (order) {
      console.log(order);
      return (
        <View style={{alignItems: 'center'}}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text>{order.duration ? order.duration.toFixed(1) : '?'} min</Text>
            <View
              style={{
                backgroundColor: '#1e9203',
                marginHorizontal: 10,
                width: 30,
                height: 30,
                borderRadius: 20,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <FontAwesome name={'user'} size={20} color="white" />
            </View>
            <Text>{order.distance ? order.distance.toFixed(1) : '?'} mi</Text>
          </View>
          <Text style={styles.bottomText}>Picking up {order.user.name}</Text>
        </View>
      );
    }

    if (car?.isActive) {
      return <Text style={styles.bottomText}>Your are online</Text>;
    }
    return <Text style={styles.bottomText}>Your are offline</Text>;
  };

  const onUserLocationChange = event => {
    setMyPosition(event.nativeEvent.coordinate);
  };

  const onDirectionFound = event => {
    console.warn('Direction found', event);
    if (order) {
      setOrder({
        ...order,
        distance: event.distance,
        duration: event.duration,
        pickedUp: order.pickedUp || event.distance < 0.2,
        isFinished: order.pickedUp && event.distance < 0.2,
      });
    }
  };

  // useEffect(() => {
  //   if (order && order.distance && order.distance < 0.2) {
  //     setOrder({
  //       ...order,
  //       pickedUp: true,
  //     });
  //   }
  // }, [order]);

  const getDestination = () => {
    if (order && order.pickedUp) {
      return {
        latitude: order.destLatitude,
        longitude: order.destLongitude,
      };
    }

    return {
      latitude: order.originLatitude,
      longitude: order.originLongitude,
    };
  };

  return (
    <View
      style={{
        position: 'relative',
      }}>
      <MapView
        style={{
          height: Dimensions.get('window').height - 150,
          width: '100%',
        }}
        provider={PROVIDER_GOOGLE}
        showuserLocation={true}
        onUserLocationChange={onUserLocationChange}
        initialRegion={{
          latitude: 28.450627,
          longitude: -16.263045,
          latitudeDelta: 0.0222,
          longitudeDelta: 0.0121,
        }}>
        {order && (
          <MapViewDirections
            origin={myPosition}
            onReady={onDirectionFound}
            destination={getDestination()}
            apikey={GOOGLE_MAPS_APIKEY}
            strokeWidth={3}
            strokeColor="blue"
          />
        )}
        {/* <Marker coordinate={origin} title={'Origin'} />
        <Marker coordinate={destination} title={'Destination'} /> */}
      </MapView>
      <Pressable
        onPress={() => console.warn('balance')}
        style={styles.balanceButton}>
        <Text style={styles.balanceText}>
          <Text style={{color: 'green'}}>$</Text> 0.00
        </Text>
      </Pressable>

      <Pressable
        onPress={() => console.warn('hey')}
        style={[styles.roundButton, {top: 10, left: 10}]}>
        <Entypo name={'menu'} size={24} color="#4a4a4a" />
      </Pressable>
      <Pressable
        onPress={() => console.warn('hey')}
        style={[styles.roundButton, {top: 10, right: 10}]}>
        <Entypo name={'menu'} size={24} color="#4a4a4a" />
      </Pressable>
      <Pressable
        onPress={() => console.warn('hey')}
        style={[styles.roundButton, {bottom: 110, left: 10}]}>
        <Entypo name={'menu'} size={24} color="#4a4a4a" />
      </Pressable>
      <Pressable
        onPress={() => console.warn('hey')}
        style={[styles.roundButton, {bottom: 110, right: 10}]}>
        <Entypo name={'menu'} size={24} color="#4a4a4a" />
      </Pressable>
      <Pressable onPress={onGoPress} style={styles.goButton}>
        <Text style={styles.goText}>{car?.isActive ? 'End' : 'Go'}</Text>
      </Pressable>

      <View style={styles.bottomContainer}>
        <Ionicons name={'options'} size={30} color="#4a4a4a" />
        {renderBottomTitle()}

        <Entypo name={'menu'} size={30} color="#4a4a4a" />
      </View>
      {newOrder && (
        <NewOrderPopup
          newOrder={newOrder}
          onDecline={onDecline}
          duration={2}
          distance={0.5}
          onAccept={() => onAccept(newOrder)}
        />
      )}
    </View>
  );
};

export default HomeScreen;
