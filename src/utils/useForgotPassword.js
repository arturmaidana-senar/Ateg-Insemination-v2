// src/hooks/useForgotPassword.js

import { useState, useRef, useEffect, useMemo } from 'react';

export default function useForgotPassword(navigation) {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [pin, setPin] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);

  const pinInputRef = useRef(null);

  const isEmailValid = useMemo(
    () => email.includes('@') && email.includes('.'),
    [email],
  );
  const isPinComplete = useMemo(() => pin.length === 5, [pin]);

  const validations = useMemo(
    () => ({
      length: newPassword.length >= 8,
      number: /\d/.test(newPassword),
      specialChar: /[!@#$%^&*(),.?":{}|<>]/.test(newPassword),
    }),
    [newPassword],
  );

  const isPasswordStructureValid = useMemo(
    () => validations.length && validations.number && validations.specialChar,
    [validations],
  );

  const passwordsMatch = useMemo(
    () => newPassword === confirmPassword && newPassword !== '',
    [newPassword, confirmPassword],
  );

  const canChangePassword = useMemo(
    () => isPasswordStructureValid && passwordsMatch,
    [isPasswordStructureValid, passwordsMatch],
  );

  const handleSendCode = () => {
    if (isEmailValid) setStep(2);
  };
  const handleConfirmPin = () => {
    if (isPinComplete) setStep(3);
  };
  const handleChangePassword = () => {
    if (canChangePassword) {
      console.log('Password successfully changed!');
      navigation.navigate('SignIn');
    }
  };
  const handleGoBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      navigation.goBack();
    }
  };

  useEffect(() => {
    if (step === 2) {
      pinInputRef.current?.focus();
    }
  }, [step]);

  return {
    step,
    email,
    setEmail,
    pin,
    setPin,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    isPasswordVisible,
    setIsPasswordVisible,
    isConfirmPasswordVisible,
    setIsConfirmPasswordVisible,
    pinInputRef,
    isEmailValid,
    isPinComplete,
    validations,
    canChangePassword,
    handleSendCode,
    handleConfirmPin,
    handleChangePassword,
    handleGoBack,
  };
}
