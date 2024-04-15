import React, {useContext, MutableRefObject} from 'react';
import { BoardContext } from '@/contexts/BoardContext';
import getCopy from '@/utils/getCopy';
import { WHITE_PIECES, BLACK_PIECES, PIECE_TO_NAME} from '@/utils/pieceTypes';

const RANKS = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
const FILES = [1, 2, 3, 4, 5, 6, 7, 8];

const useBoard = () => {
  const {positions, setPositions, darkSquare, setDarkSquare, highlighted, setHighlighted, selectedPiece, setSelectedPiece, attackPositions, setAttackPositions}: any = useContext(BoardContext);

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
    let attackPositions: string[] = [];

    // narrow piece type to WhitePieces and BlackPieces
    if (isWhitePiece(piece)) {
      emptyPositions = highLightWhiteMoves(piece, position.current);
      attackPositions = highlightWhiteAttack(piece, position.current);
    } else if (isBlackPiece(piece)) {
      emptyPositions = highlightBlackMoves(piece, position.current);
      attackPositions = highlightBlackAttack(piece, position.current);
    } else {
      console.log('Unreachable (at highlightMoves at useBoard)');
    }

    // pawn ✔️ - finish pawn before attempting other pieces
    // rook
    // knight
    // bishop
    // king
    // queen
    setAttackPositions(attackPositions)
    setHighlighted(emptyPositions);
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

  function resetAttackPositions() {
    setAttackPositions([]);
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

  // moves

  function getPawnMove(currentPosition: string, side: "white" | "black") {
    let moves: string[] = [];
    let initialMove = isInitialPawnPosition(currentPosition)
    let rank = rankMatcher(currentPosition);
    let file = fileMatcher(currentPosition);

    if (rank.length === 0) {
      throw new Error("Invalid Position (getPawnMove at useBoard)")
    }

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
        file -= 1;
        let move = rank + String(file);
        moves.push(move);
      });
      
    } else if (side === 'black') {
      [rank].forEach( (_r) => {
        file += 1;
        let move = rank + String(file);
        moves.push(move);
      });

    } else {
      let unreachableType: never = side;
      throw new Error(`Invalid Piece type: $${JSON.stringify(unreachableType)}`)
    }

    moves = removeBlockedPawnMoves(moves, side);

    // if last position, promote piece to queen for simplicity

    return moves;
  }

  function getRookMove(currentPosition: string) {
    
  }

  function getKnightMove(currentPosition: string) {

  }

  function getBishopMove(currentPosition: string) {

  }

  function getQueenMove(currentPosition: string) {

  }

  function getKingMove(currentPosition: string) {

  }

  // attacks

  function getPawnAttack(currentPosition: string, side: "white" | "black") {
    let attacks: string[] = [];
    let rank = rankMatcher(currentPosition);
    let file = fileMatcher(currentPosition);
    let rankIndex = getIndex(rank, RANKS);
    let leftRank = RANKS[rankIndex - 1];
    let rightRank = RANKS[rankIndex + 1];

    if (rankIndex === -1) {
      throw new Error("Invalid rank (at getPawnAttack at useBoard)")
    }

    if (side === 'white') {
      file = file - 1;
    } else if (side === 'black') {
      file = file + 1;
    } else {
      let unreachableType: never = side;
      throw new Error(`Invalid Piece type: $${JSON.stringify(unreachableType)}`)
    }

    if (leftRank) {
      let threatPosition1 = leftRank + String(file);
      attacks.push(threatPosition1);
    }

    if (rightRank) {
      let threatPosition2 = rightRank + String(file);
      attacks.push(threatPosition2);
    }

    attacks = removeNonThreatPositionsPawn(attacks, side)

    // en pissant?
    return attacks;
  }

  function getRookAttack(currentPosition: string) {

  }

  function getKnightAttack(currentPosition: string) {

  }

  function getBishopAttack(currentPosition: string) {

  }

  function getQueenAttack(currentPosition: string) {

  }

  function getKingAttack(currentPosition: string) {

  }

  function highlightWhiteAttack(piece: WhitePiece, position: string) {
    let attacks: string[] = [];

    if (isPawn(piece)) {
      attacks = getPawnAttack(position, "white");
    } else if (isRook(piece)){
      attacks = getRookAttack(position);
    } else if (isKnight(piece)){
      attacks = getKnightAttack(position);
    } else if (isBishop(piece)){
      attacks = getBishopAttack(position);
    } else if (isKing(piece)){
      attacks = getKingAttack(position);
    } else if (isQueen(piece)){
      attacks = getQueenAttack(position);
    } else {
      let unreachableType: never = piece;
      throw new Error(`Invalid Piece type: $${JSON.stringify(unreachableType)}`)
    }


    // debugger;

    return attacks;
  }

  function highlightBlackAttack(piece: BlackPiece, position: string) {
    let attacks: string[] = [];

    if (isPawn(piece)) {
      attacks = getPawnAttack(position, "black");
    } else if (isRook(piece)){
      attacks = getRookAttack(position);
    } else if (isKnight(piece)){
      attacks = getKnightAttack(position);
    } else if (isBishop(piece)){
      attacks = getBishopAttack(position);
    } else if (isKing(piece)){
      attacks = getKingAttack(position);
    } else if (isQueen(piece)){
      attacks = getQueenAttack(position);
    } else {
      let unreachableType: never = piece;
      throw new Error(`Invalid Piece type: $${JSON.stringify(unreachableType)}`)
    }

    return attacks;
  }

  function highLightWhiteMoves(piece: WhitePiece, position: string) {
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

  function highlightBlackMoves(piece: BlackPiece, position: string) {
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

  let rankMatcher = (position: string): string => {
    return position.match(/[a-z]/)?.[0] || '';
  }

  let fileMatcher = (position: string): number => {
    return Number(position.match(/[\d]/)?.[0]);
  }

  let getIndex = (value: string | number, collection: any[]): number => {
    return collection.indexOf(value); 
  }

  // remove positions that are not a threat

  function removeNonThreatPositionsPawn(attacks: string[], side: 'black' | 'white') {
    attacks = attacks.filter(attackPosition => {
      // if square is empty, return false
      let occupied = positions[attackPosition];
      if (!occupied) {
        return false;
      }

      // if own piece, return false
      if (side === 'white') {
        return !isWhitePiece(occupied);
      } else if (side === 'black') {
        return !isBlackPiece(occupied);
      } else {
        let unreachableType: never = side;
        throw new Error("Invalid side (at removeNonThreatPositionsPawn at useBoard)");
      }
    });
    
    return attacks;
  }

  // remove occupied and blocked moves
  
  function removeBlockedPawnMoves(moves: string[]) {
    if (positions[moves[0]]) {
      return [];
    }

    return moves.filter(move => {
      return !positions[move];
    });
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
    attackPositions,
    setSelectedPiece,
    resetAttackPositions,
    resetHighlightedMoves,
  };
};

export default useBoard;
