import {
  FlatList,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import React, {useState} from 'react';
import Snackbar from 'react-native-snackbar';
import Icons from './src/Components/Icons';
import {trigger} from 'react-native-haptic-feedback';
import Sound from 'react-native-sound';

const options = {
  enableVibrateFallback: true,
  ignoreAndroidSystemSettings: false,
};

const App = () => {
  const [isCross, setIsCross] = useState<boolean>(false);
  const [gameWinner, setGameWinner] = useState<string>('');
  const [gameState, setGameState] = useState(new Array(9).fill('empty', 0, 9));

  const reloadGame = () => {
    setIsCross(false);
    setGameWinner('');
    setGameState(new Array(9).fill('empty', 0, 9));
    trigger('impactHeavy', options);
  };

  const playSound = () => {
    var tapsound = new Sound('tapsound.mp3', Sound.MAIN_BUNDLE, error => {
      if (error) {
        console.log('failed to load the sound', error);
        return;
      }
      // loaded successfully
      console.log(
        'duration in seconds: ' +
          tapsound.getDuration() +
          'number of channels: ' +
          tapsound.getNumberOfChannels(),
      );

      // Play the sound with an onEnd callback
      tapsound.play(success => {
        if (success) {
          console.log('successfully finished playing');
        } else {
          console.log('playback failed due to audio decoding errors');
        }
      });
    });
  };

  const checkWinner2 = () => {
    if (!gameState.includes('empty')) {
      setGameWinner("it's a draw 🙃");
    }
    const winningConditions = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (const elements of winningConditions) {
      const [a, b, c] = elements;

      if (
        gameState[a] !== 'empty' &&
        gameState[a] === gameState[b] &&
        gameState[b] === gameState[c]
      ) {
        setGameWinner(`${gameState[a]} won the game 🥳`);
      }
    }
  };

  const onChangeItem = (itemNumber: number) => {
    playSound();
    if (gameWinner) {
      return Snackbar.show({
        text: gameWinner,
        backgroundColor: '#000000',
        textColor: '#FFFFFF',
      });
    }

    if (gameState[itemNumber] === 'empty') {
      gameState[itemNumber] = !isCross ? 'cross' : 'circle';
      setIsCross(!isCross);
    } else {
      return Snackbar.show({
        text: 'Position is already filled',
        backgroundColor: 'red',
        textColor: '#FFFFFF',
      });
    }
    checkWinner2();
  };

  return (
    <SafeAreaView style={{backgroundColor: '#313131', flex: 1}}>
      <StatusBar />
      {gameWinner ? (
        <View style={[styles.playerInfo, styles.winnerInfo]}>
          <Text style={styles.winnerTxt}>{gameWinner}</Text>
        </View>
      ) : (
        <View
          style={[
            styles.playerInfo,
            !isCross ? styles.playerX : styles.playerO,
          ]}>
          <Text style={styles.gameTurnTxt}>
            Player {!isCross ? 'X' : 'O'}'s turn
          </Text>
        </View>
      )}

      <FlatList
        numColumns={3}
        style={styles.grid}
        data={gameState}
        renderItem={({item, index}) => (
          <TouchableOpacity
            style={styles.card}
            key={index}
            onPress={() => onChangeItem(index)}>
            <Icons name={item} />
          </TouchableOpacity>
        )}
      />

      <TouchableOpacity style={styles.gameBtn} onPress={() => reloadGame()}>
        <Text style={styles.gameBtnText}>
          {gameWinner ? 'Start a new game' : 'Reload the game'}
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default App;

const styles = StyleSheet.create({
  playerInfo: {
    height: 56,

    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',

    borderRadius: 4,
    paddingVertical: 8,
    marginVertical: 12,
    marginHorizontal: 14,

    shadowOffset: {
      width: 1,
      height: 1,
    },
    shadowColor: '#333',
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
  },
  gameTurnTxt: {
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  playerX: {
    backgroundColor: '#38CC77',
  },
  playerO: {
    backgroundColor: '#F7CD2E',
  },
  grid: {
    margin: 12,
  },
  card: {
    height: 100,
    width: '33.33%',

    alignItems: 'center',
    justifyContent: 'center',

    borderColor: '#333',
  },
  winnerInfo: {
    borderRadius: 8,
    backgroundColor: '#38CC77',

    shadowOpacity: 0.1,
  },
  winnerTxt: {
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  gameBtn: {
    alignItems: 'center',
    marginBottom: 200,
    padding: 10,
    borderRadius: 8,
    marginHorizontal: 36,
    backgroundColor: '#8D3DAF',
  },
  gameBtnText: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: '500',
  },
});
