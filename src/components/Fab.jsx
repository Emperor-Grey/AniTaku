/* eslint-disable react-native/no-inline-styles */
import {useNavigation} from '@react-navigation/native';
import {
  Calendar,
  More2,
  SearchNormal1,
  TableDocument,
} from 'iconsax-react-native';
import React, {useState} from 'react';
import {Animated, StyleSheet, TouchableOpacity, View} from 'react-native';
const Fab = () => {
  const nav = useNavigation();
  const [icon_1] = useState(new Animated.Value(20));
  const [icon_2] = useState(new Animated.Value(20));
  const [icon_3] = useState(new Animated.Value(20));

  const [pop, setPop] = useState(false);

  const popIn = () => {
    setPop(true);
    Animated.timing(icon_1, {
      toValue: 120,
      duration: 150,
      useNativeDriver: false,
    }).start();
    Animated.timing(icon_2, {
      toValue: 100,
      duration: 350,
      useNativeDriver: false,
    }).start();
    Animated.timing(icon_3, {
      toValue: 120,
      duration: 420,
      useNativeDriver: false,
    }).start();
  };

  const popOut = () => {
    setPop(false);
    Animated.timing(icon_1, {
      toValue: 20,
      duration: 500,
      useNativeDriver: false,
    }).start();
    Animated.timing(icon_2, {
      toValue: 20,
      duration: 500,
      useNativeDriver: false,
    }).start();
    Animated.timing(icon_3, {
      toValue: 20,
      duration: 500,
      useNativeDriver: false,
    }).start();
  };

  return (
    <View
      style={{
        flex: 1,
      }}>
      <Animated.View style={[styles.circle, {bottom: icon_1}]}>
        <TouchableOpacity
          onPress={() => {
            nav.navigate('Search');
            pop === false ? popIn() : popOut();
          }}>
          <SearchNormal1 size="32" color="lime" />
        </TouchableOpacity>
      </Animated.View>
      <Animated.View style={[styles.circle, {bottom: icon_2, right: icon_2}]}>
        <TouchableOpacity
          onPress={() => {
            nav.navigate('Calender');
            pop === false ? popIn() : popOut();
          }}>
          <Calendar size="32" color="lime" />
        </TouchableOpacity>
      </Animated.View>
      <Animated.View style={[styles.circle, {right: icon_3}]}>
        <TouchableOpacity
          onPress={() => {
            nav.navigate('library');
            pop === false ? popIn() : popOut();
          }}>
          <TableDocument size="32" color="lime" />
        </TouchableOpacity>
      </Animated.View>
      <TouchableOpacity
        style={styles.circle}
        onPress={() => {
          pop === false ? popIn() : popOut();
        }}>
        <More2 size="32" color="lime" />
      </TouchableOpacity>
    </View>
  );
};

export default Fab;

const styles = StyleSheet.create({
  circle: {
    backgroundColor: 'rgb(31 41 65)',
    width: 63,
    height: 63,
    position: 'absolute',
    bottom: 20,
    right: 20,
    borderRadius: 63 / 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
