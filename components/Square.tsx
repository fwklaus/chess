import React, {useEffect, useState, useLayoutEffect, useRef} from 'react';
import {Pressable, StyleSheet, GestureResponderEvent} from 'react-native';
import useBoard from '@/hooks/useBoard';
import Piece from './Piece';

export default function Square({ item, index }: {item: string, index: number}){
  const {positions, colorTiles, highlighted, selectedPiece, movePiece, resetHighlightedMoves, isElementPiece} = useBoard();
  const [isHighlighted, setIsHighlighted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  let background = colorTiles(index);
  const position = useRef(item); // references position

  useLayoutEffect(() => {

    debugger;
    let highlightedPosition = (position: string) => position === item;
    let currentPositionIsHighlighted = highlighted.find(highlightedPosition);
    if (currentPositionIsHighlighted) {
      setIsHighlighted(true);
    } else {
      setIsHighlighted(false);
    }
  }, [highlighted]);

  useEffect(() => {}, [isHighlighted]);

  const handleMouseEnter = (event: any) => {
    let isPiece = isElementPiece(event);

    if (isPiece) {
      setIsHovered(true);
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const handleClick = (e: GestureResponderEvent) => { 
    let isPiece = isElementPiece(e);
    if (isPiece) {
      return;
    } else if (!isPiece && isHighlighted) {
      movePiece(selectedPiece, position);
      resetHighlightedMoves();
    } else {
      console.log('Unreachable');
    }
  };

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
      <Piece piece={positions[item]} position={position} isHighlighted={isHighlighted}/>
    </Pressable>
  )
};

const styles = StyleSheet.create({
  item: {
    flex: 1,
    height: 75,
    backgroundColor: 'lightgray',
    margin: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
});
