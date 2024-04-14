import React from 'react';
import { StyleSheet, Text } from 'react-native';
import useBoard from '@/hooks/useBoard';

function Piece({piece, position}: GamePiece) {
  const {highlightMoves, setSelectedPiece, isElementPiece} = useBoard();
  const handleClick = (e: any) => {    
    let isPiece = isElementPiece(e);    
    if (isPiece) {
      setSelectedPiece({piece, position});
      highlightMoves(piece, position);
    } else {
      console.log('Unreachable');
      return;
    }
  }

  return (
    <Text 
      style={styles.pieces}
      onPress={handleClick}
    >
      {piece}
    </Text>
  );
}

export default Piece;

const styles = StyleSheet.create({
  pieces: {
    fontSize: 40,
  }
});
