import { Text, View, StyleSheet, Image } from "react-native";

export default function Index() {
  return (
    <View style={styles.container}>
      <Image
        source={require('@/assets/images/Welcome_guy.png')}
        style={{ width: '100%', height: '70%' }}
      />

      <View style={{ justifyContent: 'center', alignItems: 'center'}}>
        <Text style={{ color: 'black', fontSize: 32, paddingTop: 16 }}>Welcome to MiniLedger</Text>
        <Text style={{ color: 'black', fontSize: 20, paddingTop: 2, textAlign: 'center' }}>
          Dosti apni jagah, udhaari apni jagah.
        </Text>
      </View>

      
      <View style={[styles['clay-card'],{backgroundColor: '#9482db', width: '90%', justifyContent: 'center', alignItems: 'center', position: 'absolute', bottom: 112}]}>
        <Text style={{ color: 'white', fontSize: 24, padding: 12 }}>Get Started →</Text>
      </View>

      <View style={[styles['clay-card'],{backgroundColor: '#988c98', width: '90%', justifyContent: 'center', alignItems: 'center', marginTop: 16, position: 'absolute', bottom: 32}]}>
        <Text style={{ color: 'white', fontSize: 24, padding: 12 }}>Log in →</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-start",
    backgroundColor: "#FAF9F6",
  },
  'clay-card': {
    borderRadius: 24,
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
