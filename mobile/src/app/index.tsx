import { useRouter } from "expo-router";
import { Text, View, StyleSheet, Image } from "react-native";
import Button_full_len from "../components/Button_full_len";

export default function Index() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Image
        source={require('@/assets/images/Welcome_guy.png')}
        style={{ width: '100%', height: '70%' }}
      />

      <View style={{ justifyContent: 'center', alignItems: 'center'}}>
        <Text style={{ color: 'black', fontSize: 32, fontWeight: 'bold', paddingTop: 16 }}>Welcome to MiniLedger</Text>
        <Text style={{ color: 'black', fontSize: 20, paddingTop: 2, textAlign: 'center' }}>
          Dosti apni jagah, udhaari apni jagah.
        </Text>
      </View>

      <Button_full_len text="Get Started →" bgColor="#9482db" color="white" width="90%" route='/(auth)/signup' style={{position:'absolute', bottom: 112}} />

      <Button_full_len text="Log in →" bgColor="#988c98" color="white" width="90%" route='/(auth)/login' style={{ position: 'absolute', bottom: 32}} />

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
