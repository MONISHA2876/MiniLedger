import { Text, View, StyleSheet } from "react-native";

export default function Index() {
  return (
    <View style={styles.container}>
      <View style={styles['clay-card']}>
        <Text style={{ color: 'white', fontSize: 24, padding: 16 }}>Clay Card</Text>
      </View>
      <Text>Edit src/app/index.tsx to edit this screen.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  'clay-card': {
    backgroundColor: '#7c5cff',
    borderRadius: 32,
    boxShadow: [
      {
        offsetX: 8,
        offsetY: 12,
        blurRadius: 16,
        color: 'rgba(0, 0, 0, 0.2)',
      },
      {
        offsetX: 6,
        offsetY: 6,
        blurRadius: 10,
        color: 'rgba(255, 255, 255, 0.45)',
        inset: true,
      },{
        offsetX: -8,
        offsetY: -8,
        blurRadius: 12,
        color: 'rgba(0, 0, 0, 0.25)',
        inset: true,
      }
    ]
  },
});
