// types/global.d.ts
import {WHITE_PIECES, BLACK_PIECES, PIECE_ID} from "@/utils/pieceTypes";
export {};

declare global {
  interface Positions {
    [key: string]: any;
  }

  interface Board {
    [key: string]: unknown;
  }

  interface Piece {
    piece: AllPieces;
    position: MutableRefObject<any>;
  }

  interface GamePiece extends Piece {
    isHighlighted: boolean;
  }

  type WhitePiece = keyof typeof WHITE_PIECES;
  type BlackPiece = keyof typeof BLACK_PIECES
  type AllPieces = WhitePiece | BlackPiece;

  type Pawn = keyof typeof PIECE_ID['pawn'];
  type Rook = keyof typeof PIECE_ID['rook'];
  type Bishop = keyof typeof PIECE_ID['bishop'];
  type Knight = keyof typeof PIECE_ID['knight'];
  type King = keyof typeof PIECE_ID['king'];
  type Queen = keyof typeof PIECE_ID['queen'];

  type Collection = string[] | number[];

  type Sides = 'white' | 'black';
}
