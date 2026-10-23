import { View, Text, StyleSheet, Image } from 'react-native';
import BackTract_btn from '@/components/BackTract_btn';
import InputBox from '@/components/InputBox';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import Button_full_len from '@/components/Button_full_len';

export default function Login() {
    const router = useRouter();
    const [otp, setOtp] = useState('');
    const OTP = '123456';
    return (
        <View style={styles.container}>
            <BackTract_btn />
            <Text style={{ color: 'black', fontSize: 32, fontWeight: 'bold' }}>Verify Number</Text>
            <Text style={{ color: '#6f6f6f', fontSize: 18, paddingTop: 8 }}>
                Enter the OTP sent to your mobile number.
            </Text>

            <Image source={require('@/assets/images/shy_guy.png')} style={{ width: '80%', height: '35%', margin: 24, marginHorizontal: 'auto' }} />
            
            <InputBox placeholder="OTP" keyboardType="numeric" value={otp} onChangeText={setOtp} />

            <Button_full_len text="Verify & Continue →" bgColor="#9482db" color="white" width="100%" route='/login' />
           
            <Text style={{ color: '#6f6f6f', fontSize: 16, paddingTop: 16, textAlign: 'center', marginHorizontal: 'auto' }}>
                Wrong number? <Text style={{ color: '#9482db', fontSize: 16 }} onPress={() => router.back()}>GO BACK</Text>
            </Text>
            
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