import { View, Text, StyleSheet } from 'react-native';

export default function TabScreen() {
  return (
    <View style={styles.container}>
      <Text>Placeholder Screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' }
});
