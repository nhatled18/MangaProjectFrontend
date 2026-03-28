import { useState, useCallback } from 'react';

export interface FormFields {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  otpCode: string;
}

const INITIAL_FIELDS: FormFields = {
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  otpCode: '',
};

export function useAuthFields() {
  const [fields, setFields] = useState<FormFields>(INITIAL_FIELDS);

  const setField = useCallback((field: keyof FormFields, value: string) => {
    setFields((prev) => ({ ...prev, [field]: value }));
  }, []);

  const resetFields = useCallback(() => {
    setFields(INITIAL_FIELDS);
  }, []);

  return { fields, setField, resetFields };
}
