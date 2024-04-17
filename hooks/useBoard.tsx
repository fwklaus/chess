import React, {useContext, MutableRefObject} from 'react';
import { BoardContext } from '@/contexts/BoardContext';
import getCopy from '@/utils/getCopy';
import {makeBoardByRanks, makeBoardByFiles} from '@/utils/board';
import { WHITE_PIECES, BLACK_PIECES, PIECE_TO_NAME} from '@/utils/pieceTypes';

const RANKS_BOARD = makeBoardByRanks();
const FILES_BOARD = makeBoardByFiles();

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
      emptyPositions = highLightMoves(piece, position.current, 'white');
      attackPositions = highlightAttack(piece, position.current, 'white');
    } else if (isBlackPiece(piece)) {
      emptyPositions = highLightMoves(piece, position.current, 'black');
      attackPositions = highlightAttack(piece, position.current, 'black');
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

  function getPawnMove(currentPosition: string, side: Sides) {
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

    moves = removeBlockedPawnMoves(moves);

    // if last position, promote piece to queen for simplicity

    return moves;
  }

  function getRookMove(currentPosition: string, side: Sides) {
    let moves: string[] = [];
    let initialMove = isInitialRookPosition(currentPosition); // for castling
    let rank = rankMatcher(currentPosition);
    let file = fileMatcher(currentPosition);

      FILES.forEach( f => {
        let position = rank + String(f);

        if (position !== currentPosition) {
          moves.push(position);
        }
      });

      RANKS.forEach( r => {
        let position = r + String(file);
        if (position !== currentPosition) {
          moves.push(position);
        }

      });

      // remove blocked moves

    moves = removeBlockedRookMoves(currentPosition, moves, side);

    return moves;
  }

  function getKnightMove(currentPosition: string, side: Sides) {
    let moves: string[] = [];
    let rank = rankMatcher(currentPosition);
    let file = fileMatcher(currentPosition);

    debugger;
    return moves;
  }

  function getBishopMove(currentPosition: string, side: Sides) {
    let moves: string[] = [];
    let rank = rankMatcher(currentPosition);
    let file = fileMatcher(currentPosition);

    debugger;
    return moves;
  }

  function getQueenMove(currentPosition: string, side: Sides) {
    let moves: string[] = [];
    let rank = rankMatcher(currentPosition);
    let file = fileMatcher(currentPosition);

    debugger;
    return moves;
  }

  function getKingMove(currentPosition: string, side: Sides) {
    let moves: string[] = [];
    let rank = rankMatcher(currentPosition);
    let file = fileMatcher(currentPosition);

    debugger;
    return moves;
  }

  // attacks

  function getPawnAttack(currentPosition: string, side: Sides) {
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

  function getRookAttack(currentPosition: string, side: Sides) {
    let attacks: string[] = [];
    let rank = rankMatcher(currentPosition);
    let file = fileMatcher(currentPosition);

    debugger;
    return attacks;
  }


  function getKnightAttack(currentPosition: string, side: Sides) {
    let attacks: string[] = [];
    let rank = rankMatcher(currentPosition);
    let file = fileMatcher(currentPosition);

    debugger;
    return attacks;
  }

  function getBishopAttack(currentPosition: string, side: Sides) {
    let attacks: string[] = [];
    let rank = rankMatcher(currentPosition);
    let file = fileMatcher(currentPosition);

    debugger;
    return attacks;
  }

  function getQueenAttack(currentPosition: string, side: Sides) {
    let attacks: string[] = [];
    let rank = rankMatcher(currentPosition);
    let file = fileMatcher(currentPosition);

    debugger;
    return attacks;
  }

  function getKingAttack(currentPosition: string, side: Sides) {
    let attacks: string[] = [];
    let rank = rankMatcher(currentPosition);
    let file = fileMatcher(currentPosition);

    debugger;
    return attacks;
  }

  function highlightAttack(piece: WhitePiece | BlackPiece, position: string, side: Sides) {
    let attacks: string[] = [];

    if (isPawn(piece)) {
      attacks = getPawnAttack(position, side);
    } else if (isRook(piece)){
      attacks = getRookAttack(position, side);
    } else if (isKnight(piece)){
      attacks = getKnightAttack(position, side);
    } else if (isBishop(piece)){
      attacks = getBishopAttack(position, side);
    } else if (isKing(piece)){
      attacks = getKingAttack(position, side);
    } else if (isQueen(piece)){
      attacks = getQueenAttack(position, side);
    } else {
      let unreachableType: never = piece;
      throw new Error(`Invalid Piece type: $${JSON.stringify(unreachableType)}`)
    }

    return attacks;
  }

  function highLightMoves(piece: WhitePiece | BlackPiece, position: string, side: Sides) {
    let moves: string[] = [];

    if (isPawn(piece)) {
      moves = getPawnMove(position, side);
    } else if (isRook(piece)){
      moves = getRookMove(position, side);
    } else if (isKnight(piece)){
      moves = getKnightMove(position, side);
    } else if (isBishop(piece)){
      moves = getBishopMove(position, side);
    } else if (isKing(piece)){
      moves = getKingMove(position, side);
    } else if (isQueen(piece)){
      moves = getQueenMove(position, side);
    } else {
      let unreachableType: never = piece;
      throw new Error(`Invalid Piece type: $${JSON.stringify(unreachableType)}`)
    }

    return moves;
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

  let getFile = (position: string) => {
    return FILES_BOARD.find(file => file.includes(position));
  };

  let getRank = (position: string) => {
    return RANKS_BOARD.find(rank => rank.includes(position));
  };

  // check initial position for special moves

  function isInitialPawnPosition(position: string) {
    const white = ['a7', 'b7', 'c7', 'd7', 'e7', 'f7', 'g7', 'h7'];
    const black = ['a2', 'b2', 'c2', 'd2', 'e2', 'f2', 'g2', 'h2'];

    return white.includes(position) || black.includes(position); 
  }

  function isInitialRookPosition(position: string) {
    const white = ['a8', 'h8'];
    const black = ['a1', 'h1'];

    return white.includes(position) || black.includes(position);
  }

  // remove positions that are not a threat

  function removeNonThreatPositionsPawn(attacks: string[], side: Sides) {
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

  function sortByProximity(a: string, b: string, currentPosition: string, rowType: 'rank' | 'file') {
    let aDistance = 0;
    let bDistance = 0;
    if (rowType === 'rank') {
      let rank = getRank(currentPosition);
      let currentIndex = getIndex(currentPosition, rank);
      let aIndex = getIndex(a, rank);
      let bIndex = getIndex(b, rank);

      aDistance = Math.abs(aIndex - currentIndex);
      bDistance = Math.abs(bIndex - currentIndex);
    } else if (rowType === 'file') {
      let file = getFile(currentPosition);
      let currentIndex = getIndex(currentPosition, file);
      let aIndex = getIndex(a, file);
      let bIndex = getIndex(b, file);

      aDistance = Math.abs(aIndex - currentIndex);
      bDistance = Math.abs(bIndex - currentIndex);
    } else {
      throw new Error('Invalid rowType (at sortByProximity at useBoard)');
    }

    return aDistance - bDistance;
  }

  function removeBlockedRookMoves(currentPosition: string, moves: string[], side: Sides) {
    let updatedMoves: string[] = [];
    let movesCopy = getCopy(moves);
    let rank = rankMatcher(currentPosition);
    let file = fileMatcher(currentPosition);
    let rankIndex = getIndex(rank, RANKS);
    let fileIndex = getIndex(file, FILES);

    let sameRankMovesForward: string[] = [];
    let sameRankMovesBackward: string[] = [];
    let sameFileMovesLeft: string[] = [];
    let sameFileMovesRight: string[] = [];

    movesCopy.forEach((move: string) => {
      let currentRank = rankMatcher(move);
      let currentFile = fileMatcher(move);
      let currentFileIdx = getIndex(currentFile, FILES);
      let currentRankIdx = getIndex(currentRank, RANKS);
      let FILES_REVERSED = getCopy(FILES).reverse();

      // files [1, 2, 3, 4, 5, 6, 7, 8]  backward -->  forward
      if (side === 'black') {
        if (currentFile === file) {
          if (currentRankIdx < rankIndex) {
            sameFileMovesRight.push(move);
          } else if (currentRankIdx > rankIndex) {
            sameFileMovesLeft.push(move)
          }
        }
      }

      // files [8, 7, 6, 5, 4, 3, 2, 1]  backward --> forward
      if (side === 'white') {        
        if (currentFile === file) {
          currentFileIdx = getIndex(currentFile, FILES_REVERSED);
          if (currentRankIdx > rankIndex) {
            sameFileMovesRight.push(move);
          } else if (currentRankIdx < rankIndex) {
            sameFileMovesLeft.push(move)
          }
        }
  
      }

      // ranks [a, b, c, d, e, f, g, h]  left <--> right
      if (currentRank === rank) {
        if (currentFileIdx < fileIndex) {
          sameRankMovesForward.push(move);
        } else if (currentFileIdx > fileIndex) {
          sameRankMovesBackward.push(move);
        }
      } 

    });

    sameRankMovesForward.sort((a, b) => {
      return sortByProximity(a, b, currentPosition, 'rank');
    });
    
    sameRankMovesBackward.sort((a, b) => {
      return sortByProximity(a, b, currentPosition, 'rank');
    });   
    
    sameFileMovesLeft.sort((a, b) => {
      return sortByProximity(a, b, currentPosition, 'file');
    });
    
    sameFileMovesRight.sort((a, b) => {
      return sortByProximity(a, b, currentPosition, 'file');
    });
    
    let leftRankMoveBlocked = false;
    let rightRankMoveBlocked = false;
    let forwardFileMoveBlocked = false;
    let backwardFileMoveBlocked = false;

    for (let idx = 0; idx < FILES.length; idx++) {
      let currentRightRankMove = sameRankMovesForward[idx];
      let currentLeftRankMove = sameRankMovesBackward[idx];
      let currentForwardFileMove = sameFileMovesLeft[idx];
      let currentBackwardFileMove = sameFileMovesRight[idx];

      if (currentRightRankMove) {
        if (moveIsBlocked(currentRightRankMove) && !rightRankMoveBlocked) {
          rightRankMoveBlocked = true;
        } else if (!rightRankMoveBlocked) {
          updatedMoves.push(currentRightRankMove);
        }
      }

      if (currentLeftRankMove) {
        if (moveIsBlocked(currentLeftRankMove) && !leftRankMoveBlocked) {
          leftRankMoveBlocked = true;
        } else if (!leftRankMoveBlocked) {
          updatedMoves.push(currentLeftRankMove);
        }
      }

      if (currentForwardFileMove) {
        if (moveIsBlocked(currentForwardFileMove) && !forwardFileMoveBlocked) {
          forwardFileMoveBlocked = true;
        } else if (!forwardFileMoveBlocked) {
          updatedMoves.push(currentForwardFileMove);
        }
      }

      if (currentBackwardFileMove) {
        if (moveIsBlocked(currentBackwardFileMove) && !backwardFileMoveBlocked) {
          backwardFileMoveBlocked = true;
        } else if (!backwardFileMoveBlocked) {
          updatedMoves.push(currentBackwardFileMove);
        }
      }

      debugger;
    }


    return updatedMoves;
  }

  function moveIsBlocked(position: string) {
    return positions[position];
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
