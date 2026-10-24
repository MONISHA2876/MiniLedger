
import { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';

import BackTract_btn from '@/components/BackTract_btn';
import InputBox from '@/components/InputBox';
import Button_full_len from '@/components/Button_full_len';
import { apiRequest } from '@/services/api';

type Status = 'idle' | 'right' | 'wrong';

type VerifyOtpResponse = {
  message: string;
  token: string;
  user: {
    id: number;
    username: string;
    phone: string;
  };
};

const IMAGES = {
  idle: require('@/assets/images/shy_guy.png'),
  right: require('@/assets/images/wink_guy.png'),
  wrong: require('@/assets/images/sad_guy.png'),
};

export default function VerifyOtp() {
  const router = useRouter();

  const { mobile, username, purpose } = useLocalSearchParams<{
    mobile: string;
    username?: string;
    purpose?: string;
  }>();

  const [otp, setOtp] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [loading, setLoading] = useState(false);

  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timer.current) {
        clearTimeout(timer.current);
      }
    };
  }, []);

  const verifyOtp = async () => {
    if (!/^\d{6}$/.test(otp)) {
      setStatus('wrong');
      Alert.alert('Invalid OTP', 'Please enter the 6-digit OTP.');
      return;
    }

    if (
      !mobile ||
      (purpose !== 'signup' && purpose !== 'login')
    ) {
      Alert.alert(
        'Invalid request',
        'Phone number or authentication type is missing. Please go back and try again.'
      );
      return;
    }

    if (purpose === 'signup' && !username?.trim()) {
      Alert.alert('Error', 'Username is missing. Please sign up again.');
      return;
    }

    try {
      setLoading(true);
      setStatus('idle');

      const data = (await apiRequest('/api/auth/verify-otp', {
        body: {
          phone: mobile,
          otp,
          purpose,
          ...(purpose === 'signup' ? { username } : {}),
        },
      })) as VerifyOtpResponse;

      if (!data.token) {
        throw new Error('Authentication token was not returned by the server.');
      }

      await SecureStore.setItemAsync('authToken', data.token);

      setStatus('right');

      timer.current = setTimeout(() => {
        router.dismissTo('/(tabs)/dashboard');
      }, 500);
    } catch (error) {
      setStatus('wrong');

      Alert.alert(
        'Verification failed',
        error instanceof Error
          ? error.message
          : 'Something went wrong. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (text: string) => {
    setOtp(text.replace(/\D/g, '').slice(0, 6));

    if (status !== 'idle') {
      setStatus('idle');
    }
  };

  return (
    <View style={styles.container}>
      <BackTract_btn />

      <Text style={styles.heading}>Verify Number</Text>

      <Text style={styles.subtitle}>
        Enter the OTP sent to your mobile number.
      </Text>

      <Image
        source={IMAGES[status]}
        style={styles.illustration}
        resizeMode="contain"
      />

      <InputBox
        placeholder="OTP"
        keyboardType="numeric"
        value={otp}
        onChangeText={handleChange}
      />

      <Button_full_len
        text={loading ? 'Verifying...' : 'Verify & Continue →'}
        bgColor="#9482db"
        color="white"
        width="100%"
        onPress={verifyOtp}
      />

      <Text style={styles.footer}>
        Wrong number?{' '}
        <Text
          style={styles.backLink}
          onPress={() => {
            if (!loading) router.back();
          }}
        >
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
  heading: {
    color: 'black',
    fontSize: 32,
    fontWeight: 'bold',
  },
  subtitle: {
    color: '#6f6f6f',
    fontSize: 18,
    paddingTop: 8,
  },
  illustration: {
    width: '80%',
    height: '35%',
    margin: 24,
    marginHorizontal: 'auto',
  },
  footer: {
    color: '#6f6f6f',
    fontSize: 16,
    paddingTop: 16,
    textAlign: 'center',
    alignSelf: 'center',
  },
  backLink: {
    color: '#9482db',
    fontSize: 16,
  },
});
