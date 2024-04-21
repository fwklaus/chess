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
      [moves, attackPositions] = highLightMoves(piece, position.current, 'white');
      // attackPositions = highlightAttack(piece, position.current, 'white', moves);
    } else if (isBlackPiece(piece)) {
      [moves, attackPositions] = highLightMoves(piece, position.current, 'black');
      // attackPositions = highlightAttack(piece, position.current, 'black', moves);
    } else {
      console.log('Unreachable (at highlightMoves at useBoard)');
    }

    // pawn ✔️
    // rook ✔️
    // knight --- occassional bug where the attack positions are not correctly highlighted
    // bishop ✔️
    // king ✔️
    // queen ✔️
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
    let attackPositions: string[] = [];
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
    attackPositions = getPawnAttack(currentPosition, side);

    // if last position, promote piece to queen for simplicity

    return [moves, attackPositions];
  }

  function getRookMove(currentPosition: string, side: Sides) {
    let moves: string[] = [];
    let attackPositions: string[] = [];
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
    attackPositions = getRookAttack(currentPosition, side);

    return [moves, attackPositions];
  }

  function getKnightMove(currentPosition: string, side: Sides) {
    let moves: string[] = [];
    let attackPositions: string[] = [];
    let file = fileMatcher(currentPosition);
    let rank = rankMatcher(currentPosition);

    let rankIndex = getIndex(rank, RANKS);
    let fileIndex = getIndex(file, FILES);
    let startRankIdx = (rankIndex - 2 < 0) ? 0 : rankIndex - 2;
    let stopRankIdx = (rankIndex + 2 > 7) ? 7 : rankIndex + 2;
    
    for (let currentIdx = startRankIdx; currentIdx <= stopRankIdx; currentIdx++) {
      let row = RANKS_BOARD[currentIdx];
      
      if (Math.abs(rankIndex - currentIdx) === 2) {
        let leftPosition = row[fileIndex - 1];
        let rightPosition = row[fileIndex + 1];

        if (leftPosition) {
          let piece = getPiece(leftPosition);

          if (moveIsBlocked(leftPosition)) {
            if (side === 'white') {
              if (isBlackPiece(piece)) {
                attackPositions.push(leftPosition);
              }
            } else if (side === 'black') {
              if (isWhitePiece(piece)) {
                attackPositions.push(leftPosition);
              }
            }
          } else {
            moves.push(leftPosition);
          }
        }

        if (rightPosition) {
          let piece = getPiece(leftPosition);

          if (moveIsBlocked(rightPosition)) {
            if (side === 'white') {
              if (isBlackPiece(piece)) {
                attackPositions.push(rightPosition);
              }
            } else if (side === 'black') {
              if (isWhitePiece(piece)) {
                attackPositions.push(rightPosition);
              }
            }
          } else {
            moves.push(rightPosition);
          }
        }

      } else if (Math.abs(rankIndex - currentIdx) === 1) {
        let leftPosition = row[fileIndex - 2];
        let rightPosition = row[fileIndex + 2];

        if (leftPosition) {
          let piece = getPiece(leftPosition);

          if (moveIsBlocked(leftPosition)) {
            if (side === 'white') {
              if (isBlackPiece(piece)) {
                attackPositions.push(leftPosition);
              }
            } else if (side === 'black') {
              if (isWhitePiece(piece)) {
                attackPositions.push(leftPosition);
              }
            }
          } else {
            moves.push(leftPosition);
          }
        }

        if (rightPosition) {
          let piece = getPiece(leftPosition);

          if (moveIsBlocked(rightPosition)) {
            if (side === 'white') {
              if (isBlackPiece(piece)) {
                attackPositions.push(rightPosition);
              }
            } else if (side === 'black') {
              if (isWhitePiece(piece)) {
                attackPositions.push(rightPosition);
              } 
            }
          } else {
            moves.push(rightPosition);
          }
        }

      }
    }

    moves = removeBlockedKnightMoves(moves);

    return [moves, attackPositions];
  }

  function getBishopMove(currentPosition: string, side: Sides) {
    let moves: string[] = [];
    let attackPositions: string[] = [];
    let rank = rankMatcher(currentPosition);
    let file = fileMatcher(currentPosition);
    let rankIndex = getIndex(rank, RANKS);
    let fileIndex = getIndex(file, FILES);

    let forwardRt: string[] = [];
    let forwardLt: string[] = [];
    let backRt: string[] = [];
    let backLt: string[] = []; 
    let forwardLtAttacks: string[] = [];
    let forwardRtAttacks: string[] = [];
    let backLtAttacks: string[] = [];
    let backRtAttacks: string[] = [];

    [forwardRt, forwardRtAttacks] = getBishopMoves(forwardRt, fileIndex, rankIndex, side,  'fr');
    [forwardLt, forwardLtAttacks] = getBishopMoves(forwardLt, fileIndex, rankIndex, side,  'fl');
    [backRt, backRtAttacks] = getBishopMoves(backRt, fileIndex, rankIndex, side,  'br');
    [backLt, backLtAttacks] = getBishopMoves(backLt, fileIndex, rankIndex, side,  'bl');

    moves = forwardRt.concat(forwardLt).concat(backRt).concat(backLt);
    attackPositions = forwardRtAttacks.concat(forwardLtAttacks).concat(backRtAttacks).concat(backLtAttacks);

    return [moves, attackPositions];
  }

  function getQueenMove(currentPosition: string, side: Sides) {
    let moves: string[] = [];
    let attackPositions: string[] = [];
    let [bishopMoves, bishopAttackPositions] = getBishopMove(currentPosition, side);
    let [rookMoves, rookAttackPositions] = getRookMove(currentPosition, side);

    moves = bishopMoves.concat(rookMoves);
    attackPositions = bishopAttackPositions.concat(rookAttackPositions);

    return [moves, attackPositions];
  }

  function getKingMove(currentPosition: string, side: Sides) {
    let moves: string[] = [];
    let attackPositions: string[] = [];
    let rank = rankMatcher(currentPosition);
    let file = fileMatcher(currentPosition);
    let rankIndex = getIndex(rank, RANKS);
    let fileIndex = getIndex(file, FILES);

    let startRankIdx = (rankIndex - 1 < 0) ? 0 : rankIndex - 1;
    let stopRankIdx = (rankIndex + 1 > 7) ? 7 : rankIndex + 1;
    let startFileIdx = (fileIndex - 1 < 0) ? 0 : fileIndex - 1;
    let stopFileIdx = (fileIndex + 1 > 7) ? 7 : fileIndex + 1;

    for (let i = startRankIdx; i <= stopRankIdx; i++) {
      let row = RANKS_BOARD[i];

      moves = moves.concat(row.slice(startFileIdx, stopFileIdx + 1));
    }

    let movesCopy = moves.filter(move => move !== currentPosition);
    moves = moves.filter(move => !moveIsBlocked(move));

    attackPositions = movesCopy.filter(position => {
      if (moveIsBlocked(position)) {
        let piece = getPiece(position);

        if (side === 'black') {
          if (isWhitePiece(piece)) {
            return true;
          }
        } else if (side === 'white') {
          if (isBlackPiece(piece)) {
            return true;
          }
        }

        return false;
      } else {
        return false;
      }
    });

    // check
    // checkmate
    // castling
    // stalemate

    return [moves, attackPositions];
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

  function getRookAttack(currentPosition: string, side: Sides) {
    let attacks: string[] = [];
    let file = getFile(currentPosition);
    let rank = getRank(currentPosition);

    getAttackRookPositions(file, "increase", attacks, currentPosition, side);
    getAttackRookPositions(file, "decrease", attacks, currentPosition, side);
    getAttackRookPositions(rank, "increase", attacks, currentPosition, side);
    getAttackRookPositions(rank, 'decrease', attacks, currentPosition, side);

    return attacks;
  }

  function highLightMoves(piece: WhitePiece | BlackPiece, position: string, side: Sides) {
    let moves: string[] = [];
    let attackPositions: string[] = [];

    if (isPawn(piece)) {
      [moves, attackPositions] = getPawnMove(position, side);
    } else if (isRook(piece)){
      [moves, attackPositions] = getRookMove(position, side);
    } else if (isKnight(piece)){
      [moves, attackPositions] = getKnightMove(position, side);
    } else if (isBishop(piece)){
      [moves, attackPositions] = getBishopMove(position, side);
    } else if (isKing(piece)){
      [moves, attackPositions] = getKingMove(position, side);
    } else if (isQueen(piece)){
      [moves, attackPositions] = getQueenMove(position, side);
    } else {
      let unreachableType: never = piece;
      throw new Error(`Invalid Piece type: $${JSON.stringify(unreachableType)}`)
    }

    return [moves, attackPositions];
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
    return FILES_BOARD.find(file => file.includes(position));
  };

  let getRank = (position: string) => {
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

  // move/attack helpers

  function getBishopMoves(moves: string[], fileIdx: number, rankIdx: number, side: Sides, type: 'fr' | 'fl' | 'br' | 'bl') {
    let fileStart;
    let rankStart;
    let attacks: string[] = [];

    if (type === 'fr' || type === 'br') {
      fileStart = fileIdx + 1;
    } else if (type === 'fl' || type === 'bl') {
      fileStart = fileIdx - 1;
    } else {
      throw new Error(`Invalid type ${type} (at getBishopMoves at useBoard)`);
    }

    if (type === 'br' || type === 'bl') {
      rankStart = rankIdx - 1;
    } else if (type === 'fr' || type === 'fl') {
      rankStart = rankIdx + 1;
    } else {
      throw new Error(`Invalid type ${type} (at getBishopMoves at useBoard)`);
    }

    let currRankIdx = rankStart;
    for (let currFileIdx = fileStart; currFileIdx <= FILES.length;) {
      let currFile = FILES[currFileIdx];
      let currRank = RANKS[currRankIdx];  
      if (currRank && currFile) {
        let position = currFile + String(currRank);
        if (moveIsBlocked(position)) {
          let piece = getPiece(position);
          
          if (side === 'white') {
            if (isBlackPiece(piece)) {
              attacks.push(position);
            }
          } else if (side === 'black') {
            if (isWhitePiece(piece)) {
              attacks.push(position);
            }
          }
          break;
        } else {
          moves.push(position);
        }
      } else {
        break;
      }

      if (type === 'fr' || type === 'br') {
        currFileIdx++;
      } else if (type === 'fl' || type === 'bl') {
        currFileIdx--;
      }

      if (type === 'br' || type === 'bl') {
        currRankIdx--;
      } else if (type === 'fl' || type === 'fr') {
        currRankIdx++;
      }
    } 

    return [moves, attacks];
  }

  function getAttackRookPositions(row: string[], direction: 'increase' | 'decrease', attackPositions: string[], currentPosition: string, side: Sides) {
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

      if (side === 'white' && occupied) {
        if (isBlackPiece(occupied)) {
          attackPositions.push(position);
          blocked = true;
        } else {
          blocked = true;
        }
      } else if (side === 'black' && occupied) {
        if (isWhitePiece(occupied)) {
          attackPositions.push(position);
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

  // sort

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

  // remove occupied and blocked moves

  function removeBlockedKnightMoves(moves: string[]) {
    moves = moves.filter(move => !moveIsBlocked(move));
    return moves;
  }
  
  function removeBlockedPawnMoves(moves: string[]) {
    if (positions[moves[0]]) {
      return [];
    }

    return moves.filter(move => {
      return !positions[move];
    });
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

      // files [8, 7, 6, 5, 4, 3, 2, 1]  backward -->  forward
      if (side === 'black') {
        if (currentFile === file) {
          if (currentRankIdx < rankIndex) {
            sameFileMovesRight.push(move);
          } else if (currentRankIdx > rankIndex) {
            sameFileMovesLeft.push(move)
          }
        }
      }

      // files  [1, 2, 3, 4, 5, 6, 7, 8] backward --> forward
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

  function getPiece(position: string) {
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
