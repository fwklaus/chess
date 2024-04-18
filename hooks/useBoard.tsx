import React, {useContext, MutableRefObject} from 'react';
import { BoardContext } from '@/contexts/BoardContext';
import getCopy from '@/utils/getCopy';
import {makeBoardByRanks, makeBoardByFiles} from '@/utils/board';
import { WHITE_PIECES, BLACK_PIECES, PIECE_TO_NAME} from '@/utils/pieceTypes';

const FILES_BOARD = makeBoardByFiles();
const RANKS_BOARD = makeBoardByRanks();

const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
const RANKS = [1, 2, 3, 4, 5, 6, 7, 8];

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
    let moves: string[] = [];
    let attackPositions: string[] = [];

    // narrow piece type to WhitePieces and BlackPieces
    if (isWhitePiece(piece)) {
      moves = highLightMoves(piece, position.current, 'white');
      attackPositions = highlightAttack(piece, position.current, 'white', moves);
    } else if (isBlackPiece(piece)) {
      moves = highLightMoves(piece, position.current, 'black');
      attackPositions = highlightAttack(piece, position.current, 'black', moves);
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
    setHighlighted(moves);
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

    if (file.length === 0) {
      throw new Error("Invalid Position (getPawnMove at useBoard)")
    }

    if (initialMove && side === 'white') {
      [file, file].forEach( (_r) => {
        rank += 1;
        let move = file + String(rank);
        moves.push(move);
      });
    } else if (initialMove && side === 'black') {
      [file, file].forEach( (_r) => {
        rank -= 1;
        let move = file + String(rank);
        moves.push(move);
      });
    } else if  (side === 'white') {
      [file].forEach( (_r) => {
        rank += 1;
        let move = file + String(rank);
        moves.push(move);
      });
      
    } else if (side === 'black') {
      [file].forEach( (_r) => {
        rank -= 1;
        let move = file + String(rank);
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
    let file = fileMatcher(currentPosition);
    let rank = rankMatcher(currentPosition);

    FILES.forEach( f => {
      let position = f + String(rank);

      if (position !== currentPosition) {
        moves.push(position);
      }
    });

    RANKS.forEach( r => {
      let position = file + String(r);
      if (position !== currentPosition) {
        moves.push(position);
      }

    });

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

  function getPawnAttack(currentPosition: string, side: Sides) {
    let attacks: string[] = [];
    let rank = rankMatcher(currentPosition);
    let file = fileMatcher(currentPosition);
    let fileIndex = getIndex(file, FILES);
    let leftFile = FILES[fileIndex - 1];
    let rightFile = FILES[fileIndex + 1];

    if (fileIndex === -1) {
      throw new Error("Invalid rank (at getPawnAttack at useBoard)")
    }

    if (side === 'white') {
      rank = rank + 1;
    } else if (side === 'black') {
      rank = rank - 1;
    } else {
      let unreachableType: never = side;
      throw new Error(`Invalid Piece type: $${JSON.stringify(unreachableType)}`)
    }

    if (leftFile) {
      let threatPosition1 = leftFile + String(rank);
      attacks.push(threatPosition1);
    }

    if (rightFile) {
      let threatPosition2 = rightFile + String(rank);
      attacks.push(threatPosition2);
    }

    attacks = removeNonThreatPositionsPawn(attacks, side)

    // en pissant?
    return attacks;
  }


  function getAttackPosition(row: string[], direction: 'increase' | 'decrease', attackPositions: string[], currentPosition: string, side: Sides) {
    let blocked = false;
    let positionIndex = getIndex(currentPosition, row);

    let idx = positionIndex;
    if (direction === 'increase') {
      idx += 1;
    } else if (direction === 'decrease') {
      idx -= 1;
    }

    while (!blocked) {
      let position = row[idx];
      let occupied = moveIsBlocked(position);

      if (occupied === undefined) {
        blocked = true;
        break;
      }

      debugger;
      if (side === 'white' && occupied) {
        if (isBlackPiece(occupied)) {

          attackPositions.push(occupied);
          blocked = true;
        } else {
          blocked = true;
        }
      } else if (side === 'black' && occupied) {
        if (isWhitePiece(occupied)) {
          attackPositions.push(occupied);
          blocked = true;
        } else {
          blocked = true;
        }
      }

      if (direction === 'increase') {
        idx += 1;
      } else if (direction === 'decrease') {
        idx -= 1;
      }
    }
  }

  function getRookAttack(currentPosition: string, side: Sides) {
    let attacks: string[] = [];
    // let rank = rankMatcher(currentPosition);
    // let file = fileMatcher(currentPosition);
    let rank = getRank(currentPosition);
    let file = getFile(currentPosition);
    let rankIndex = getIndex(currentPosition, rank);
    let fileIndex = getIndex(currentPosition, file);
    // let forwardBlocked = false;
    // let backwardBlocked = false;
    // let leftBlocked = false;
    // let rightBlocked = false;


    debugger;
    
    // use position to get rank and file
    // iterate four ways all starting at current position
    // iterate until a piece is encountered or the end of the board is reached
    // if opposing piece, add the position to the attacks array
    // if not, break

    // getAttackPosition(file, "increase", attacks, currentPosition, side);
    getAttackPosition(file, "decrease", attacks, currentPosition, side);
    // getAttackPosition(rank, "increase", attacks, currentPosition, side);
    // getAttackPosition(rank, 'decrease', attacks, currentPosition, side);

    
    // let idxPlus = fileIndex + 1;
    // while (!forwardBlocked) {
    //   // iterate from fileIndex to end of file
    //   let position = file[idxPlus];
    //   let occupied = moveIsBlocked(position);

    //   if (occupied === undefined) {
    //     forwardBlocked = true;
    //     break;
    //   }

    //   if (side === 'white' && occupied) {
    //     if (isBlackPiece(occupied)) {
    //       attacks.push(occupied);
    //       forwardBlocked = true;
    //     }
    //   }
      
    //   if (side === 'black' && occupied) {
    //     if (isWhitePiece(occupied)) {
    //       attacks.push(occupied);
    //       forwardBlocked = true;
    //     }
    //   }

    //   idxPlus += 1;
    // }
    
    // let idxMinus = fileIndex - 1;
    // while (!backwardBlocked ) {
    //   // iterate from fileIndex to start of file
    //   let position = file[idxMinus];
    //   let occupied = moveIsBlocked(position);

    //   debugger;
    //   if (occupied === undefined) {
    //     backwardBlocked = true;
    //     break;
    //   }

    //   if (side === 'white' && occupied) {
    //     if (isBlackPiece(occupied)) {
    //       attacks.push(occupied);
    //       backwardBlocked = true;
    //     }
    //   }
      
    //   if (side === 'black' && occupied) {
    //     if (isWhitePiece(occupied)) {
    //       attacks.push(occupied);
    //       backwardBlocked = true;
    //     }
    //   }

    //   idxMinus -= 1;
    // }
    
    // let idxLeft = rankIndex - 1;
    // while (!leftBlocked) {
    //   // iterate from rankIndex to start of rank
    //   let position = rank[idxLeft];
    //   let occupied = moveIsBlocked(position);

    //   if (occupied === undefined) {
    //     leftBlocked = true;
    //     break;
    //   }

    //   if (side === 'white' && occupied) {
    //     if (isBlackPiece(occupied)) {
    //       attacks.push(occupied);
    //       leftBlocked = true;
    //     }
    //   }
      
    //   if (side === 'black' && occupied) {
    //     if (isWhitePiece(occupied)) {
    //       attacks.push(occupied);
    //       leftBlocked = true;
    //     }
    //   }

    //   idxLeft -= 1;
    // }
    
    // let idxRight = rankIndex + 1;
    // while (!rightBlocked) {
    //   // iterate from rankIndex to end of rank
    //   let position = rank[idxRight];
    //   let occupied = moveIsBlocked(position);

    //   if (occupied === undefined) {
    //     rightBlocked = true;
    //     break;
    //   }

    //   if (side === 'white' && occupied) {
    //     if (isBlackPiece(occupied)) {
    //       attacks.push(occupied);
    //       rightBlocked = true;
    //     }
    //   }
      
    //   if (side === 'black' && occupied) {
    //     if (isWhitePiece(occupied)) {
    //       attacks.push(occupied);
    //       rightBlocked = true;
    //     }
    //   }

    //   idxRight += 1;
    // }

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

  function highlightAttack(piece: WhitePiece | BlackPiece, position: string, side: Sides, moves: string[]) {
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

  let rankMatcher = (position: string): number => {
    return Number(position.match(/[\d]/)?.[0]);
  }
  
  let fileMatcher = (position: string): string => {
    return position.match(/[a-z]/)?.[0] || '';
  }

  let getIndex = (value: string | number, collection: any[]): number => {
    return collection.indexOf(value); 
  }

  let getFile = (position: string) => {

    debugger;
    return FILES_BOARD.find(file => file.includes(position));
  };

  let getRank = (position: string) => {

    debugger;
    return RANKS_BOARD.find(rank => rank.includes(position));
  };

  // check initial position for special moves

  function isInitialPawnPosition(position: string) {
    const black = ['a7', 'b7', 'c7', 'd7', 'e7', 'f7', 'g7', 'h7'];
    const white = ['a2', 'b2', 'c2', 'd2', 'e2', 'f2', 'g2', 'h2'];

    return white.includes(position) || black.includes(position); 
  }

  function isInitialRookPosition(position: string) {
    const white = ['a1', 'h1'];
    const black = ['a8', 'h8'];

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
