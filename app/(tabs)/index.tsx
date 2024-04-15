import { GestureResponderEvent, Pressable, StyleSheet } from 'react-native';
import { Text, View } from '@/components/Themed';
import ChessBoard from '@/components/ChessBoard';
import useBoard from '@/hooks/useBoard';

export default function PlayScreen() {
  const {resetHighlightedMoves, resetAttackPositions} = useBoard();

  const handleClick = (e: GestureResponderEvent) => {
    resetHighlightedMoves();
    resetAttackPositions();
  };

  return (
    <Pressable style={styles.container} onPress={handleClick}>
      <Text style={styles.title}>Chess</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <ChessBoard />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'teal'
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
