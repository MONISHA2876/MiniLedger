import { View, Text, StyleSheet, Pressable, TextInput } from 'react-native';
import { useState } from 'react';
import { useRouter, RelativePathString } from 'expo-router';
import InputBox from '@/components/InputBox';
import Button_full_len from '@/components/Button_full_len';

export default function SignUp() {
    const router = useRouter();
    const [username, setUsername] = useState('');
    const [mobileNumber, setMobileNumber] = useState('');

    return (
        <View style={styles.container}>
            <Pressable onPress={() => router.back()}>
                <Text style={{ color: 'black', fontSize: 48, marginBottom: 16 }}>←</Text>
            </Pressable>
            <Text style={{ color: 'black', fontSize: 32, fontWeight: 'bold' }}>Getting Started</Text>
            <Text style={{ color: '#6f6f6f', fontSize: 18, paddingTop: 8 }}>
                Enter a username and mobile number to continue (^v^)
            </Text>

            <InputBox placeholder="Username" value={username} onChangeText={setUsername} />
            <InputBox placeholder="Mobile Number" keyboardType="phone-pad" value={mobileNumber} onChangeText={setMobileNumber} />

            <Button_full_len text="Continue →" bgColor="#9482db" color="white" width="100%" route='/login' />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        paddingTop: 48,
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        backgroundColor: '#F5FCFF',
    },
 });