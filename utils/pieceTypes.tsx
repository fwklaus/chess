// const BLACK_PIECES = {
//   '♟': 'pawnB', 
//   '♜': 'rookB',
//   '♞': 'knightB', 
//   '♝': 'bishopB', 
//   '♚': 'kingB', 
//   '♛': 'queenB', 
// };

// const WHITE_PIECES = {
//   '♙': 'pawnW', 
//   '♖': 'rookW', 
//   '♘': 'knightW', 
//   '♗': 'bishopW', 
//   '♔': 'kingW', 
//   '♕': 'queenW', 
// };

const PIECE_ID = {
   pawn: {'♙': null, '♟': null},
   rook: {'♖': null, '♜': null}, 
   knight: {'♘': null, '♞': null}, 
   bishop: {'♗': null, '♝': null}, 
   king: {'♔': null, '♚': null}, 
   queen: { '♕': null, '♛': null} 
}

const WHITE_PIECE_TO_NAME = {
  '♙': 'pawn', 
  '♖': 'rook', 
  '♘': 'knight', 
  '♗': 'bishop', 
  '♔': 'king', 
  '♕': 'queen', 
};

const BLACK_PIECE_TO_NAME = {
  '♟': 'pawn', 
  '♜': 'rook',
  '♞': 'knight', 
  '♝': 'bishop', 
  '♚': 'king', 
  '♛': 'queen', 
}

const PIECE_TO_NAME = {
    '♙': 'pawn', 
    '♖': 'rook', 
    '♘': 'knight', 
    '♗': 'bishop', 
    '♔': 'king', 
    '♕': 'queen', 
    '♟': 'pawn', 
    '♜': 'rook',
    '♞': 'knight', 
    '♝': 'bishop', 
    '♚': 'king', 
    '♛': 'queen', 
}

const PIECE_TO_UNICODE = {
  '♟': '\u265F', 
  '♜': '\u265C',
  '♞': '\u265E', 
  '♝': '\u265D', 
  '♚': '\u265A', 
  '♛': '\u265B', 
  '♙': '\u2659', 
  '♖': '\u2656', 
  '♘': '\u2658', 
  '♗': '\u2657', 
  '♔': '\u2654', 
  '♕': '\u2655', 
};

const UNICODE_TO_PIECE = {
  '\u2659': '♙',
  '\u2656': '♖',
  '\u2658': '♘',
  '\u2657': '♗',
  '\u2654': '♔',
  '\u2655': '♕',
  '\u265F': '♟',
  '\u265C': '♜',
  '\u265E': '♞',
  '\u265D': '♝',
  '\u265A': '♚',
  '\u265B': '♛',
}

const WHITE_PIECES = {
  '\u2659': '♙',
  '\u2656': '♖',
  '\u2658': '♘',
  '\u2657': '♗',
  '\u2654': '♔',
  '\u2655': '♕',
};

const BLACK_PIECES = {
  '\u265F': '♟',
  '\u265C': '♜',
  '\u265E': '♞',
  '\u265D': '♝',
  '\u265A': '♚',
  '\u265B': '♛',
};

export {WHITE_PIECES, BLACK_PIECES, PIECE_TO_UNICODE, UNICODE_TO_PIECE, WHITE_PIECE_TO_NAME, BLACK_PIECE_TO_NAME, PIECE_ID, PIECE_TO_NAME};
