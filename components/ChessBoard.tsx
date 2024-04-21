import React, {useEffect} from 'react';
import {View, FlatList, StyleSheet, useWindowDimensions} from 'react-native';
import useBoard from '@/hooks/useBoard';
import Spacer from './Spacer';
import Square from './Square';

function BoardList({positions}: {positions: Positions} ) {
  return (
    <FlatList
      data={Object.keys(positions)}
      renderItem={({item, index}) => <Square item={item} index={index}/>}
      keyExtractor={(item) => item}
      numColumns={8}
      contentContainerStyle={styles.listContainer}
      style={{overflow: 'hidden'}}
    />
  );
}

export default function ChessBoard() {
  const {positions} = useBoard();
  const {height, width} = useWindowDimensions();

  useEffect(() => {
    // console.log(width);
  }, [width]);

  return (
    <View style={styles.container}>
      <Spacer flexValue={width < 1000 ? 0.75 : 1.75}/>
      <Spacer flexValue={width < 600 ? 2 : 0.75}/>
      <BoardList positions={positions}/>
      <Spacer flexValue={width < 1000 ? 0.75 : 1.75}/>
      <Spacer flexValue={width < 600 ? 2 : 0.75}/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
  },
  listContainer: {
    backgroundColor: 'black',
  },
});
