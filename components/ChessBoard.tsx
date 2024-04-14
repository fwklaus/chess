import React, {useEffect, useState, useLayoutEffect, useRef} from 'react';
import {View, Pressable, Text, FlatList, StyleSheet, useWindowDimensions, GestureResponderEvent} from 'react-native';
import useBoard from '@/hooks/useBoard';
import Spacer from './Spacer';

const Item = ({ item, index }: {item: any, index: number}) => {
  const {positions, colorTiles, highlighted, highlightMoves, selectedPiece, setSelectedPiece, movePiece, resetHighlightedMoves} = useBoard();
  const [isHighlighted, setIsHighlighted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  let background = colorTiles(index);
  const position = useRef(item); // references position

  useLayoutEffect(() => {
    let highlightedPosition = (position: string) => position === item;
    let currentPositionIsHighlighted = highlighted.find(highlightedPosition);
    if (currentPositionIsHighlighted) {
      setIsHighlighted(true);
    } else {
      setIsHighlighted(false);
    }
  }, [highlighted]);

  useEffect(() => {}, [isHighlighted]);

  const handleMouseEnter = (e: any) => {
    const targetElement = e.target as unknown as HTMLElement;

    let isPiece = targetElement
    && 'textContent' in targetElement
    && typeof targetElement.textContent === 'string'
    && targetElement.textContent.length > 0;

    if (isPiece) {
      setIsHovered(true);
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const handleClick = (e: GestureResponderEvent) => {    
    const targetElement = e.target as unknown as HTMLElement;

    let isPiece = targetElement
      && 'textContent' in targetElement
      && typeof targetElement.textContent === 'string'
      && targetElement.textContent.length > 0;
      
    if (isPiece) {
      let piece: string = targetElement.textContent ?? '';

      setSelectedPiece({piece, position});
      highlightMoves(piece);
    } else if (!isPiece && isHighlighted) {
      movePiece(selectedPiece, position);
      resetHighlightedMoves();
    } else {
      console.log('Unreachable');
      return;
    }
  }

  return (
    <Pressable 
      style={[
        styles.item, 
        isHovered ? {backgroundColor: 'red'} : {backgroundColor: background},
        isHighlighted ? {backgroundColor: 'green'} : null
      ]}
      onHoverIn={handleMouseEnter}
      onHoverOut={handleMouseLeave}
      onPress={handleClick}
    >
      <Text style={styles.pieces}>{positions[item]}</Text>
    </Pressable>
  )
};

function BoardList({positions}: {positions: Positions} ) {
  return (
    <FlatList
      data={Object.keys(positions)}
      renderItem={({item, index}) => <Item item={item} index={index}/>}
      keyExtractor={(item) => item}
      numColumns={8}
      contentContainerStyle={styles.listContainer}
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
      <BoardList positions={positions}/>
      <Spacer flexValue={width < 1000 ? 0.75 : 1.75}/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center'
  },
  listContainer: {
    backgroundColor: 'black',
  },
  item: {
    flex: 1,
    height: 75,
    backgroundColor: 'lightgray',
    margin: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  pieces: {
    fontSize: 40,
  }
});
