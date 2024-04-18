const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
let RANKS = ['1', '2', '3', '4', '5', '6', '7', '8']

let rankBoard: any[] = [];
let fileBoard: any[] = [];

function makeBoardByFiles() {
  FILES.forEach((rank) => {
    let row: string[] = [];
    RANKS.forEach((file) => {
      let position = rank + file;
      row.push(position);
    });

    rankBoard.push(row);
  });

  return rankBoard;
}

function makeBoardByRanks() {
  RANKS.forEach((file) => {
    let row: string[] = [];
    FILES.forEach((rank) => {
      let position = rank + file;
      row.push(position);
    });

    fileBoard.push(row);
  });

  return fileBoard;
}

export {makeBoardByRanks, makeBoardByFiles};
