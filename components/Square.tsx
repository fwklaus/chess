import React, {useEffect, useState, useLayoutEffect, useRef} from 'react';
import {Pressable, StyleSheet, GestureResponderEvent, useWindowDimensions} from 'react-native';
import useBoard from '@/hooks/useBoard';
import Piece from './Piece';

export default function Square({ item, index }: {item: string, index: number}){
  const {positions, colorTiles, highlighted, attackPositions, selectedPiece, movePiece, resetHighlightedMoves, isElementPiece, resetAttackPositions} = useBoard();
  const [isHighlighted, setIsHighlighted] = useState(false);
  const [isThreat, setIsThreat] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const {height} = useWindowDimensions();
  let background = colorTiles(index);
  const position = useRef(item); // references position
  let isColoredPosition = (position: string) => position === item;

  useLayoutEffect(() => {
    let currentPositionIsHighlighted = highlighted.find(isColoredPosition);
    let currentPositionIsThreatened = attackPositions.find(isColoredPosition);

    if (currentPositionIsHighlighted) {
      setIsHighlighted(true);
    } else {
      setIsHighlighted(false);
    }

    if (currentPositionIsThreatened) {
      setIsThreat(true);
    } else {
      setIsThreat(false);
    }
  }, [highlighted, isThreat]);

  useEffect(() => {}, [isHighlighted, isThreat]);

  const handleMouseEnter = (event: any) => {
    let isPiece = isElementPiece(event);
    console.log(height);
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
      resetAttackPositions();
    } else {
      console.log('Unreachable (at handleClick at Square)');
    }
  };

  return (
    <Pressable 
      style={[
        styles.item, 
        isHovered ? {backgroundColor: 'white'} : {backgroundColor: background},
        isHighlighted ? {backgroundColor: 'green'} : null,
        isThreat ? {backgroundColor: 'red'} : null,
        height < 600 ? styles.smallItem : null
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
  smallItem: {
    height: 50,
  }
});
