import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { MainScreen } from './components/MainScreen';
import { QuizProvider } from './store/context/QuizContext';

export default function App() {
  return (
    <>
    <QuizProvider>
    <View style={styles.container}>
      <MainScreen />
    </View>
    </QuizProvider>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  
  },
});
