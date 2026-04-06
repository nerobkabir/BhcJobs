import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { loginUser } from '../services/api';

const LoginScreen = ({ navigation }) => {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // basic validation
  const validate = () => {
    const newErrors = {};

    if (!phone.trim()) {
      newErrors.phone = 'Mobile number is required';
    } else if (!/^[0-9]{10,15}$/.test(phone.trim())) {
      newErrors.phone = 'Enter a valid mobile number';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validate()) return;

    setLoading(true);
    const result = await loginUser(phone.trim(), password);
    setLoading(false);

    if (result.success) {
      Alert.alert('Welcome Back!', 'You have logged in successfully.', [
        { text: 'OK', onPress: () => navigation.navigate('Landing') },
      ]);
    } else {
      Alert.alert('Login Failed', result.error || 'Invalid phone or password. Please try again.');
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Back button */}
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <MaterialCommunityIcons name="arrow-left" size={22} color="#fff" />
          </TouchableOpacity>

          {/* Header */}
          <View style={styles.topSection}>
            <View style={styles.logoContainer}>
              <Text style={styles.logoText}>B</Text>
            </View>
            <Text style={styles.brandName}>BhcJobs</Text>
            <Text style={styles.pageTitle}>Job Seeker Login</Text>
            <Text style={styles.subtitle}>Sign in to access your account</Text>
          </View>

          {/* Form */}
          <View style={styles.formCard}>
            {/* Phone */}
            <View style={styles.fieldWrapper}>
              <Text style={styles.label}>Mobile Number</Text>
              <View style={[styles.inputRow, errors.phone && styles.inputError]}>
                <MaterialCommunityIcons name="phone" size={18} color="#888" style={styles.fieldIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="01XXXXXXXXX"
                  placeholderTextColor="#bbb"
                  keyboardType="phone-pad"
                  value={phone}
                  onChangeText={(val) => {
                    setPhone(val);
                    if (errors.phone) setErrors((prev) => ({ ...prev, phone: null }));
                  }}
                  maxLength={15}
                />
              </View>
              {!!errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}
            </View>

            {/* Password */}
            <View style={styles.fieldWrapper}>
              <Text style={styles.label}>Password</Text>
              <View style={[styles.inputRow, errors.password && styles.inputError]}>
                <MaterialCommunityIcons name="lock" size={18} color="#888" style={styles.fieldIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Enter your password"
                  placeholderTextColor="#bbb"
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={(val) => {
                    setPassword(val);
                    if (errors.password) setErrors((prev) => ({ ...prev, password: null }));
                  }}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                  <MaterialCommunityIcons
                    name={showPassword ? 'eye-off' : 'eye'}
                    size={18}
                    color="#888"
                  />
                </TouchableOpacity>
              </View>
              {!!errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
            </View>

            {/* Forgot password */}
            <TouchableOpacity style={styles.forgotWrapper} activeOpacity={0.7}>
              <Text style={styles.forgotText}>Forgot Your Password?</Text>
            </TouchableOpacity>

            {/* Login Button */}
            <TouchableOpacity
              style={[styles.signInBtn, loading && styles.signInBtnDisabled]}
              onPress={handleLogin}
              activeOpacity={0.85}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={styles.signInText}>SIGN IN</Text>
              )}
            </TouchableOpacity>

            {/* Divider */}
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>OR</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Navigate to Register */}
            <View style={styles.registerPrompt}>
              <Text style={styles.registerPromptText}>New to BhcJobs.com? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                <Text style={styles.registerLink}>Create an account</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#1a3c5e',
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  backBtn: {
    marginTop: 8,
    marginLeft: 16,
    padding: 8,
    alignSelf: 'flex-start',
  },
  topSection: {
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 32,
  },
  logoContainer: {
    width: 60,
    height: 60,
    borderRadius: 16,
    backgroundColor: '#f4c842',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  logoText: {
    fontSize: 28,
    fontWeight: '900',
    color: '#1a3c5e',
  },
  brandName: {
    fontSize: 20,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 6,
  },
  pageTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#a8c6e0',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: '#7fa8c9',
  },
  formCard: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 30,
    paddingBottom: 20,
  },
  fieldWrapper: {
    marginBottom: 18,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#444',
    marginBottom: 7,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f4f6fa',
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#e0e5ef',
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === 'ios' ? 14 : 10,
  },
  inputError: {
    borderColor: '#e74c3c',
    backgroundColor: '#fff5f5',
  },
  fieldIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  errorText: {
    fontSize: 12,
    color: '#e74c3c',
    marginTop: 5,
    marginLeft: 2,
  },
  forgotWrapper: {
    alignSelf: 'flex-end',
    marginBottom: 22,
    marginTop: -8,
  },
  forgotText: {
    fontSize: 13,
    color: '#1a3c5e',
    fontWeight: '600',
  },
  signInBtn: {
    backgroundColor: '#1a3c5e',
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
    marginBottom: 20,
  },
  signInBtnDisabled: {
    opacity: 0.7,
  },
  signInText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 15,
    letterSpacing: 1,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#e0e5ef',
  },
  dividerText: {
    fontSize: 12,
    color: '#aaa',
    marginHorizontal: 12,
    fontWeight: '600',
  },
  registerPrompt: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  registerPromptText: {
    fontSize: 14,
    color: '#555',
  },
  registerLink: {
    fontSize: 14,
    color: '#1a3c5e',
    fontWeight: '700',
  },
});

export default LoginScreen;