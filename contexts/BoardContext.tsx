import React, {createContext, useState, useEffect} from 'react';
import startingPositions from '@/utils/startingPositions';
const BoardContext = createContext<null | Board>(null);

type AppProps = {
  children: React.ReactNode;
}; 

const defaultSelectedPiece = {piece: '', position: ''};

const BoardProvider = ({children}: AppProps) => {
  const [positions, setPositions] = useState(startingPositions);
  const [darkSquare, setDarkSquare] = useState(false);
  const [highlighted, setHighlighted] = useState([]);
  const [attackPositions, setAttackPositions] = useState([]);
  const [selectedPiece, setSelectedPiece] = useState(defaultSelectedPiece);

  useEffect(() => {
    // console.log(JSON.stringify(highlighted)+ " (highlighted at BoardContext)");
  }, [highlighted]);

  useEffect(() => {
    console.log(JSON.stringify(attackPositions)+ " (attackPositions at BoardContext)");
  }, [attackPositions]);

  useEffect(() => {
    // console.log(positions + " (positions at BoardContext)");
  }, [positions]);

  useEffect(() => {
    // console.log(darkSquare + " (darkSquare at BoardContext)");
  }, [darkSquare]);

  return (
    <BoardContext.Provider value={{positions, setPositions, darkSquare, setDarkSquare, highlighted, setHighlighted, selectedPiece, setSelectedPiece, defaultSelectedPiece, attackPositions, setAttackPositions}}>
      {children}
    </BoardContext.Provider>
  );
};

export {BoardContext, BoardProvider};
