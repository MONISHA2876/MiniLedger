import {Text, Pressable} from 'react-native';
import { useRouter } from 'expo-router';

export default function BackTract_btn() {
    const router = useRouter();

    return (
        <Pressable onPress={() => router.back()}>
            <Text style={{ color: 'black', fontSize: 48, marginBottom: 16 }}>←</Text>
        </Pressable>
    )
}