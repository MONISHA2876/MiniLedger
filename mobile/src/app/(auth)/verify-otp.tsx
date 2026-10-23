import { View, Text, StyleSheet, Image } from 'react-native';
import BackTract_btn from '@/components/BackTract_btn';
import InputBox from '@/components/InputBox';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'expo-router';
import Button_full_len from '@/components/Button_full_len';

type Status = 'idle' | 'right' | 'wrong';

const IMAGES = {
  idle: require('@/assets/images/shy_guy.png'),
  right: require('@/assets/images/wink_guy.png'),
  wrong: require('@/assets/images/sad_guy.png'),
};

const OTP = '123456';

export default function VerifyOtp() {
  const router = useRouter();
  const [otp, setOtp] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // clear the timeout if the screen unmounts
  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  const verifyOtp = () => {
    if (otp === OTP) {
      setStatus('right');
      timer.current = setTimeout(() => {
        router.navigate('/(auth)/signup');
      }, 500);
    } else {
      setStatus('wrong');
    }
  };

  const handleChange = (text: string) => {
    setOtp(text);
    if (status !== 'idle') setStatus('idle'); // reset the image when the user edits
  };

  return (
    <View style={styles.container}>
      <BackTract_btn />
      <Text style={{ color: 'black', fontSize: 32, fontWeight: 'bold' }}>Verify Number</Text>
      <Text style={{ color: '#6f6f6f', fontSize: 18, paddingTop: 8 }}>
        Enter the OTP sent to your mobile number.
      </Text>

      <Image
        source={IMAGES[status]}
        style={{ width: '80%', height: '35%', margin: 24, marginHorizontal: 'auto' }}
        resizeMode="contain"
      />

      <InputBox placeholder="OTP" keyboardType="numeric" value={otp} onChangeText={handleChange} />

      <Button_full_len
        text="Verify & Continue →"
        bgColor="#9482db"
        color="white"
        width="100%"
        onPress={verifyOtp}
      />

      <Text style={{ color: '#6f6f6f', fontSize: 16, paddingTop: 16, textAlign: 'center', marginHorizontal: 'auto' }}>
        Wrong number?{' '}
        <Text style={{ color: '#9482db', fontSize: 16 }} onPress={() => router.back()}>
          GO BACK
        </Text>
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