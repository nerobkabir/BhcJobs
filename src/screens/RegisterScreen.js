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
import { registerUser, verifyPhone } from '../services/api';

const GENDERS = ['Male', 'Female'];

const RegisterScreen = ({ navigation }) => {
  // form fields
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [dob, setDob] = useState('');
  const [passportNo, setPassportNo] = useState('');
  const [gender, setGender] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // OTP step
  const [step, setStep] = useState('register'); // 'register' | 'verify'
  const [otp, setOtp] = useState('');

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};

    if (!fullName.trim()) newErrors.fullName = 'Full name is required';

    if (!phone.trim()) {
      newErrors.phone = 'Mobile number is required';
    } else if (!/^[0-9]{10,15}$/.test(phone.trim())) {
      newErrors.phone = 'Enter a valid mobile number';
    }

    if (!dob.trim()) {
      newErrors.dob = 'Date of birth is required';
    } else if (!/^\d{4}-\d{2}-\d{2}$/.test(dob.trim())) {
      newErrors.dob = 'Use format YYYY-MM-DD';
    }

    if (!passportNo.trim()) newErrors.passportNo = 'Passport number is required';
    if (!gender) newErrors.gender = 'Please select a gender';

    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      newErrors.email = 'Enter a valid email address';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'At least 6 characters required';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validate()) return;

    setLoading(true);
    const result = await registerUser({
      name: fullName.trim(),
      phone: phone.trim(),
      date_of_birth: dob.trim(),
      passport_no: passportNo.trim(),
      gender: gender.toLowerCase(),
      email: email.trim(),
      password,
      password_confirmation: confirmPassword,
    });
    setLoading(false);

    if (result.success) {
      // OTP is sent — move to verify step
      setStep('verify');
      Alert.alert(
        'OTP Sent',
        `An OTP has been sent to ${phone}. Please enter it below to verify your account.`
      );
    } else {
      Alert.alert('Registration Failed', result.error || 'Something went wrong. Please try again.');
    }
  };

  const handleVerify = async () => {
    if (!otp.trim()) {
      Alert.alert('Error', 'Please enter the OTP you received.');
      return;
    }

    setLoading(true);
    const result = await verifyPhone(phone.trim(), otp.trim());
    setLoading(false);

    if (result.success) {
      Alert.alert('Account Verified!', 'Your account has been created successfully. You can now log in.', [
        { text: 'Login Now', onPress: () => navigation.navigate('Login') },
      ]);
    } else {
      Alert.alert('Verification Failed', result.error || 'Invalid OTP. Please try again.');
    }
  };

  // ─── OTP verification screen ───────────────────────────────
  if (step === 'verify') {
    return (
      <SafeAreaView style={styles.safe}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => setStep('register')}
            activeOpacity={0.7}
          >
            <MaterialCommunityIcons name="arrow-left" size={22} color="#fff" />
          </TouchableOpacity>

          <View style={styles.topSection}>
            <MaterialCommunityIcons name="cellphone-check" size={52} color="#f4c842" />
            <Text style={styles.brandName}>Verify Your Number</Text>
            <Text style={styles.subtitle}>Enter the OTP sent to {phone}</Text>
          </View>

          <View style={styles.formCard}>
            <View style={styles.fieldWrapper}>
              <Text style={styles.label}>One-Time Password (OTP)</Text>
              <View style={styles.inputRow}>
                <MaterialCommunityIcons name="numeric" size={18} color="#888" style={styles.fieldIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Enter OTP"
                  placeholderTextColor="#bbb"
                  keyboardType="number-pad"
                  value={otp}
                  onChangeText={setOtp}
                  maxLength={8}
                />
              </View>
            </View>

            <TouchableOpacity
              style={[styles.signUpBtn, loading && styles.btnDisabled]}
              onPress={handleVerify}
              activeOpacity={0.85}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={styles.signUpText}>VERIFY & CONTINUE</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.resendWrapper}
              onPress={handleRegister}
              activeOpacity={0.7}
            >
              <Text style={styles.resendText}>Didn't receive? Resend OTP</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // ─── Registration form ────────────────────────────────────
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
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <MaterialCommunityIcons name="arrow-left" size={22} color="#fff" />
          </TouchableOpacity>

          <View style={styles.topSection}>
            <View style={styles.logoContainer}>
              <Text style={styles.logoText}>B</Text>
            </View>
            <Text style={styles.brandName}>Create an Account</Text>
            <Text style={styles.subtitle}>Join thousands of job seekers on BhcJobs</Text>
          </View>

          <View style={styles.formCard}>
            {/* Full Name */}
            <InputField
              label="Full Name *"
              icon="account"
              placeholder="Enter your full name"
              value={fullName}
              onChangeText={(v) => { setFullName(v); clearError('fullName'); }}
              error={errors.fullName}
            />

            {/* Phone */}
            <InputField
              label="Mobile Number *"
              icon="phone"
              placeholder="01XXXXXXXXX"
              keyboardType="phone-pad"
              value={phone}
              onChangeText={(v) => { setPhone(v); clearError('phone'); }}
              error={errors.phone}
              maxLength={15}
            />

            {/* Date of Birth */}
            <InputField
              label="Date of Birth * (YYYY-MM-DD)"
              icon="calendar"
              placeholder="1995-06-15"
              value={dob}
              onChangeText={(v) => { setDob(v); clearError('dob'); }}
              error={errors.dob}
            />

            {/* Passport No */}
            <InputField
              label="Passport No *"
              icon="passport"
              placeholder="AB1234567"
              value={passportNo}
              onChangeText={(v) => { setPassportNo(v); clearError('passportNo'); }}
              error={errors.passportNo}
            />

            {/* Gender */}
            <View style={styles.fieldWrapper}>
              <Text style={styles.label}>Gender *</Text>
              <View style={styles.genderRow}>
                {GENDERS.map((g) => (
                  <TouchableOpacity
                    key={g}
                    style={[
                      styles.genderBtn,
                      gender === g && styles.genderBtnActive,
                    ]}
                    onPress={() => { setGender(g); clearError('gender'); }}
                    activeOpacity={0.8}
                  >
                    <MaterialCommunityIcons
                      name={g === 'Male' ? 'gender-male' : 'gender-female'}
                      size={16}
                      color={gender === g ? '#fff' : '#555'}
                    />
                    <Text style={[styles.genderText, gender === g && styles.genderTextActive]}>
                      {g}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              {!!errors.gender && <Text style={styles.errorText}>{errors.gender}</Text>}
            </View>

            {/* Email */}
            <InputField
              label="Email Address *"
              icon="email"
              placeholder="your@email.com"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={(v) => { setEmail(v); clearError('email'); }}
              error={errors.email}
            />

            {/* Password */}
            <View style={styles.fieldWrapper}>
              <Text style={styles.label}>Password *</Text>
              <View style={[styles.inputRow, errors.password && styles.inputError]}>
                <MaterialCommunityIcons name="lock" size={18} color="#888" style={styles.fieldIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Minimum 6 characters"
                  placeholderTextColor="#bbb"
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={(v) => { setPassword(v); clearError('password'); }}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                  <MaterialCommunityIcons name={showPassword ? 'eye-off' : 'eye'} size={18} color="#888" />
                </TouchableOpacity>
              </View>
              {!!errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
            </View>

            {/* Confirm Password */}
            <View style={styles.fieldWrapper}>
              <Text style={styles.label}>Confirm Password *</Text>
              <View style={[styles.inputRow, errors.confirmPassword && styles.inputError]}>
                <MaterialCommunityIcons name="lock-check" size={18} color="#888" style={styles.fieldIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Re-enter your password"
                  placeholderTextColor="#bbb"
                  secureTextEntry={!showConfirmPassword}
                  value={confirmPassword}
                  onChangeText={(v) => { setConfirmPassword(v); clearError('confirmPassword'); }}
                />
                <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                  <MaterialCommunityIcons name={showConfirmPassword ? 'eye-off' : 'eye'} size={18} color="#888" />
                </TouchableOpacity>
              </View>
              {!!errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}
            </View>

            {/* Sign Up Button */}
            <TouchableOpacity
              style={[styles.signUpBtn, loading && styles.btnDisabled]}
              onPress={handleRegister}
              activeOpacity={0.85}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={styles.signUpText}>SIGN UP</Text>
              )}
            </TouchableOpacity>

            {/* Divider */}
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>OR</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Navigate to Login */}
            <View style={styles.loginPrompt}>
              <Text style={styles.loginPromptText}>Already have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.loginLink}>Sign In.</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );

  function clearError(field) {
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: null }));
  }
};

// ── Small reusable input field component ──────────────────────
const InputField = ({
  label, icon, placeholder, value, onChangeText, error,
  keyboardType = 'default', autoCapitalize = 'words', maxLength,
}) => (
  <View style={styles.fieldWrapper}>
    <Text style={styles.label}>{label}</Text>
    <View style={[styles.inputRow, error && styles.inputError]}>
      <MaterialCommunityIcons name={icon} size={18} color="#888" style={styles.fieldIcon} />
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor="#bbb"
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        maxLength={maxLength}
      />
    </View>
    {!!error && <Text style={styles.errorText}>{error}</Text>}
  </View>
);

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#1a3c5e',
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 50,
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
    paddingBottom: 28,
  },
  logoContainer: {
    width: 58,
    height: 58,
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
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 13,
    color: '#7fa8c9',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  formCard: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 24,
    paddingTop: 30,
    paddingBottom: 30,
    flex: 1,
  },
  fieldWrapper: {
    marginBottom: 16,
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

  // Gender
  genderRow: {
    flexDirection: 'row',
    gap: 12,
  },
  genderBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#e0e5ef',
    backgroundColor: '#f4f6fa',
  },
  genderBtnActive: {
    backgroundColor: '#1a3c5e',
    borderColor: '#1a3c5e',
  },
  genderText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#555',
    marginLeft: 4,
  },
  genderTextActive: {
    color: '#fff',
  },

  // Buttons
  signUpBtn: {
    backgroundColor: '#1a3c5e',
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 20,
  },
  btnDisabled: {
    opacity: 0.7,
  },
  signUpText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 15,
    letterSpacing: 1,
  },
  resendWrapper: {
    alignItems: 'center',
    marginTop: 12,
  },
  resendText: {
    fontSize: 14,
    color: '#1a3c5e',
    fontWeight: '600',
  },

  // Divider
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
  loginPrompt: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginPromptText: {
    fontSize: 14,
    color: '#555',
  },
  loginLink: {
    fontSize: 14,
    color: '#1a3c5e',
    fontWeight: '700',
  },
});

export default RegisterScreen;