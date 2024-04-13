// types/global.d.ts
export {};

declare global {
  interface Positions {
    [key: string]: any;
  }

  interface Board {
    [key: string]: unknown;
  }

  interface Piece {
    piece: string;
    position: MutableRefObject<any>;
  }

  interface Collection {
    [key: string]: unknown;
  }
}
