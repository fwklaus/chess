import React, {useContext, MutableRefObject} from 'react';

import { BoardContext } from '@/contexts/BoardContext';
import getCopy from '@/utils/getCopy';

const useBoard = () => {
  const {positions, setPositions, darkSquare, setDarkSquare, highlighted, setHighlighted, selectedPiece, setSelectedPiece}: any = useContext(BoardContext);

  function movePiece(piece: Piece, newPosition: MutableRefObject<any>) {
    let positionsCopy = getCopy(positions);
    positionsCopy[newPosition.current] = piece.piece;
    positionsCopy[piece.position.current] = '';
    setPositions(positionsCopy);
  }

  // should highlight based on the piece type
    // for now, highlight all empty spaces
  function highlightMoves(piece: string) {
    let emptyPositions: string[] = [];
    Object.keys(positions).forEach(position => {
      let isOccupied = positions[position];

      if (!isOccupied) {
        emptyPositions.push(position);
      }
    });

    setHighlighted(emptyPositions);
  }

  function resetHighlightedMoves() {
    setHighlighted([]);
  }

  // helpers
  function colorTiles(index: number) {
    index = index + 1;
    let even = index % 2 === 0;
    const ONE_THREE_FIVE_SEVEN = 
      index >= 1 && index <= 8 || 
      index >= 17 && index <= 24 || 
      index >= 33 && index <= 40 ||
      index >= 49 && index <= 56

    const TWO_FOUR_SIX_EIGHT = 
      index >= 9 && index <= 16 ||
      index >= 25 && index <= 32 ||
      index >= 21 && index <= 48 ||
      index >= 57 && index <= 64

      if (even && ONE_THREE_FIVE_SEVEN) {
        return 'rgb(191, 191, 191)';
      } else if (even && TWO_FOUR_SIX_EIGHT) {
        return 'rgb(181, 115, 48)';
      } else if (!even && ONE_THREE_FIVE_SEVEN) {
        return 'rgb(181, 115, 48)';
      } else if (!even && TWO_FOUR_SIX_EIGHT) {
        return 'rgb(191, 191, 191)';
      } else {
        throw new Error("Unreachable code at colorTiles");
      }
  }
  
  return {
    movePiece,
    positions,
    colorTiles,
    darkSquare,
    highlighted,
    setPositions,
    setDarkSquare,
    selectedPiece, 
    setHighlighted, 
    highlightMoves,
    setSelectedPiece,
    resetHighlightedMoves,
  };
};

export default useBoard;
