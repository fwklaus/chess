const RANKS = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
let FILES = ['1', '2', '3', '4', '5', '6', '7', '8']

let rankBoard: any[] = [];
let fileBoard: any[] = [];

function makeBoardByRanks() {
  RANKS.forEach((rank) => {
    let row: string[] = [];
    FILES.forEach((file) => {
      let position = rank + file;
      row.push(position);
    });

    rankBoard.push(row);
  });

  return rankBoard;
}

function makeBoardByFiles() {
  FILES.forEach((file) => {
    let row: string[] = [];
    RANKS.forEach((rank) => {
      let position = rank + file;
      row.push(position);
    });

    fileBoard.push(row);
  });

  return fileBoard;
}


export {makeBoardByRanks, makeBoardByFiles};
