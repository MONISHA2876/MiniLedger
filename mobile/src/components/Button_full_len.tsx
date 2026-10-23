import {Text, Pressable, StyleSheet} from 'react-native';
import { Href, useRouter } from 'expo-router';

type Props = {
    text: string;
    route?: Href;
    onPress?: () => void;
    bgColor: string;
    color: string;
    width?: string;
    style?: object;
}

export default function Button_full_len({ text, route, onPress, bgColor, color, width, style }: Props) {
    const router = useRouter();

    const handlePress = () => {
        if (onPress) {
            onPress();
        } else if (route) {
            router.navigate(route);
        }
    };

    return (
    <Pressable onPress={handlePress} style={[styles.clayCard,{backgroundColor: bgColor, width: width || '90%', justifyContent: 'center', alignItems: 'center', ...style}]}>
        <Text style={{ color: color, fontSize: 24, padding: 12 }}>{text}</Text>
    </Pressable>
    );
}

const styles = StyleSheet.create({
    clayCard: {
    width: '100%',
    height: 64,
    marginTop: 24,
    borderRadius: 24,
    justifyContent: 'center',
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
      },
      {
        offsetX: -8,
        offsetY: -8,
        blurRadius: 12,
        color: 'rgba(0, 0, 0, 0.25)',
        inset: true,
      },
    ],
  },
})