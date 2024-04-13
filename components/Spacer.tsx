import React from 'react';
import {View} from 'react-native';

export default function Spacer({flexValue}: {flexValue: number}) {
  return (
    <View style={{backgroundColor: 'red', flex: flexValue}}>{/*spacer*/}</View>
  )
}
