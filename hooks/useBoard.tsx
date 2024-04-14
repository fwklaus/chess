import React, {useContext, MutableRefObject} from 'react';
import { BoardContext } from '@/contexts/BoardContext';
import getCopy from '@/utils/getCopy';
import { WHITE_PIECES, BLACK_PIECES, PIECE_TO_NAME} from '@/utils/pieceTypes';

const useBoard = () => {
  const {positions, setPositions, darkSquare, setDarkSquare, highlighted, setHighlighted, selectedPiece, setSelectedPiece}: any = useContext(BoardContext);

  function movePiece(piece: Piece, newPosition: MutableRefObject<any>) {
    let positionsCopy = getCopy(positions);
    positionsCopy[newPosition.current] = piece.piece;
    positionsCopy[piece.position.current] = '';
    setPositions(positionsCopy);
  }

  // highlight moves based on piece type
  // elaborate switch control flow?
  function highlightMoves(piece: AllPieces, position: MutableRefObject<any>) {
    let emptyPositions: string[] = [];

    // narrow piece type to WhitePieces and BlackPieces
    if (isWhitePiece(piece)) {
      emptyPositions = highLightWhiteMove(piece, position.current);
    } else if (isBlackPiece(piece)) {
      emptyPositions = highlightBlackMove(piece, position.current);
    } else {
      console.log('unreachable');
    }

    // pawn ✔️
    // rook
    // knight
    // bishop
    // king
    // queen
    // setHighlighted(emptyPositions);
  }

  // function highlightMoves(piece: AllPieces) {
  //   let emptyPositions: string[] = [];


  //   Object.keys(positions).forEach(position => {
  //     let isOccupied = positions[position];

  //     if (!isOccupied) {
  //       emptyPositions.push(position);
  //     }
  //   });

  //   setHighlighted(emptyPositions);
  // }

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

  let isElementPiece = (e: any) => {
    const targetElement = e.target as unknown as HTMLElement;
  
    return targetElement
    && 'textContent' in targetElement
    && typeof targetElement.textContent === 'string'
    && targetElement.textContent.length > 0;
  }

  function getPawnMove(currentPosition: string, side: "white" | "black") {
    let moves: string[] = [];
    let initialMove = isInitialPawnPosition(currentPosition)
    let rank = rankMatcher(currentPosition);
    let file = fileMatcher(currentPosition);

    if (initialMove && side === 'white') {
      [rank, rank].forEach( (_r) => {
        file -= 1;
        let move = rank + String(file);
        moves.push(move);
      });
    } else if (initialMove && side === 'black') {
      [rank, rank].forEach( (_r) => {
        file += 1;
        let move = rank + String(file);
        moves.push(move);
      });
    } else if  (side === 'white') {
      [rank].forEach( (_r) => {
        file += 1;
        let move = rank + String(file);
        moves.push(move);
      });
      
    } else if (side === 'black') {
      [rank].forEach( (_r) => {
        file -= 1;
        let move = rank + String(file);
        moves.push(move);
      });

    } else {
      let unreachableType: never = side;
      throw new Error(`Invalid Piece type: $${JSON.stringify(unreachableType)}`)
    }

    // if last position, promote piece to queen for simplicity

    // if in attack position
      // diagonal highlight
        // red

    return moves;
  }

  function getRookMove(currentPosition: string) {
    
  }

  function getKnightMove(currentPosition: string) {

  }

  function getBishopMove(currentPosition: string) {

  }

  function getKingMove(currentPosition: string) {

  }

  function getQueenMove(currentPosition: string) {

  }

  function highLightWhiteMove(piece: WhitePiece, position: string) {
    let moves: string[] = [];

    if (isPawn(piece)) {
      moves = getPawnMove(position, "white");
    } else if (isRook(piece)){
      moves = getRookMove(position);
    } else if (isKnight(piece)){
      moves = getKnightMove(position);
    } else if (isBishop(piece)){
      moves = getBishopMove(position);
    } else if (isKing(piece)){
      moves = getKingMove(position);
    } else if (isQueen(piece)){
      moves = getQueenMove(position);
    } else {
      let unreachableType: never = piece;
      throw new Error(`Invalid Piece type: $${JSON.stringify(unreachableType)}`)
    }

    return moves;
  }

  function highlightBlackMove(piece: BlackPiece, position: string) {
    let moves: string[] = [];

    if (isPawn(piece)) {
      moves = getPawnMove(position, 'black');
    } else if (isRook(piece)){
      moves = getRookMove(position);
    } else if (isKnight(piece)){
      moves = getKnightMove(position);
    } else if (isBishop(piece)){
      moves = getBishopMove(position);
    } else if (isKing(piece)){
      moves = getKingMove(position);
    } else if (isQueen(piece)){
      moves = getQueenMove(position);
    } else {
      let unreachableType: never = piece;
      throw new Error(`Invalid Piece type: $${JSON.stringify(unreachableType)}`)
    }

    return moves;
  }

  function isInitialPawnPosition (position: string) {
    const white = ['a7', 'b7', 'c7', 'd7', 'e7', 'f7', 'g7', 'h7'];
    const black = ['a2', 'b2', 'c2', 'd2', 'e2', 'f2', 'g2', 'h2'];

    return white.includes(position) || black.includes(position); 
  }

  let rankMatcher = (position: string) => {
    return position.match(/[a-z]/)?.[0];
  }

  let fileMatcher = (position: string) => {
    return Number(position.match(/[\d]/)?.[0]);
  }

  // type predicates

  function isWhitePiece(piece: AllPieces): piece is WhitePiece {
    return piece in WHITE_PIECES;
  }

  function isBlackPiece(piece: AllPieces): piece is BlackPiece {
    return piece in BLACK_PIECES;
  }

  
  function isPawn(piece: WhitePiece | BlackPiece): piece is Pawn {
    return PIECE_TO_NAME[piece] === 'pawn';
  }

  function isRook(piece: WhitePiece | BlackPiece): piece is Rook {
    return PIECE_TO_NAME[piece] === 'rook';
  }

  function isKnight(piece: WhitePiece | BlackPiece): piece is Knight {
    return PIECE_TO_NAME[piece] === 'knight';
  }

  function isBishop(piece: WhitePiece | BlackPiece): piece is Bishop {
    return PIECE_TO_NAME[piece] === 'bishop';
  }

  function isKing(piece: WhitePiece | BlackPiece): piece is King {
    return PIECE_TO_NAME[piece] === 'king';
  }

  function isQueen(piece: WhitePiece | BlackPiece): piece is Queen {
    return PIECE_TO_NAME[piece] === 'queen';
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
    isElementPiece,
    highlightMoves,
    setSelectedPiece,
    resetHighlightedMoves,
  };
};

export default useBoard;
