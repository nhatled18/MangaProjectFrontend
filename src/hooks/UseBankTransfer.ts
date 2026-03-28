import { useState, useEffect, useRef, useCallback } from 'react';
import apiClient from '../services/api';

export type ModalState = 'loading' | 'qr' | 'success' | 'error';

export interface PaymentData {
  shortCode: string;
  transferContent: string;
  qrUrl: string;
}

export interface UseBankTransferOptions {
  isOpen: boolean;
  amount: number;
  price: number;
  userId: number| string | undefined;
  onSuccess: (newBalance?: number) => void;
}

export interface UseBankTransferReturn {
  modalState: ModalState;
  errorMessage: string;
  paymentData: PaymentData | null;
  tokensAdded: number;
  retryPayment: () => void;
}

const buildQrUrl = (price: number, transferContent: string): string =>
  `https://qr.sepay.vn/img?acc=21483301&bank=ACB&amount=${price}&des=${encodeURIComponent(
    transferContent,
  )}&t=${Date.now()}`;

// for testting
// const buildQrUrl = (price: number, transferContent: string): string =>
//   `https://qr.sepay.vn/img?acc=09172194820&bank=TPBank&amount=${price}&des=${encodeURIComponent(
//     transferContent,
//   )}&t=${Date.now()}`;

const POLL_INTERVAL_MS = 3_000;
const POLL_TIMEOUT_MS = 10 * 60 * 1_000; // 10 minutes

export function useBankTransfer({
  isOpen,
  amount,
  price,
  userId,
  onSuccess,
}: UseBankTransferOptions): UseBankTransferReturn {
  const [modalState, setModalState] = useState<ModalState>('loading');
  const [errorMessage, setErrorMessage] = useState('');
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null);
  const [tokensAdded, setTokensAdded] = useState(0);

  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const stopPolling = useCallback(() => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = null;
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const startPolling = useCallback(
    (shortCode: string) => {
      stopPolling();
      pollingRef.current = setInterval(async () => {
        try {
          const res = await apiClient.get(`/shop/check-payment/${shortCode}`);
          const json = res.data;

          if (json.status === 'success' && json.data.paymentStatus === 'completed') {
            stopPolling();
            setTokensAdded(json.data.tokensAdded);
            setModalState('success');
            onSuccess(json.data.tokenBalance);
          }
        } catch {
          // Keep polling
        }
      }, POLL_INTERVAL_MS);

      timeoutRef.current = setTimeout(stopPolling, POLL_TIMEOUT_MS);
    },
    [stopPolling, onSuccess],
  );

  const createPayment = useCallback(async () => {
    if (!userId) return;

    setModalState('loading');
    setErrorMessage('');
    setPaymentData(null);

    try {
      const res = await apiClient.post('/shop/create-payment', { amount, price });
      const json = res.data;

      if (json.status !== 'success') {
        throw new Error(json.message || 'Không tạo được payment request');
      }

      const { shortCode, transferContent } = json.data;
      setPaymentData({
        shortCode,
        transferContent,
        qrUrl: buildQrUrl(price, transferContent),
      });

      setModalState('qr');
    } catch (err: any) {
      const message = err.response?.data?.message || err.message || 'Lỗi không xác định';
      setErrorMessage(message);
      setModalState('error');
    }
  }, [userId, amount, price]);

  useEffect(() => {
    if (isOpen) {
      setTokensAdded(0);
      createPayment();
    } else {
      stopPolling();
    }
    return () => stopPolling();
  }, [isOpen, createPayment, stopPolling]);

  useEffect(() => {
    if (modalState === 'qr' && paymentData?.shortCode) {
      startPolling(paymentData.shortCode);
    } else {
      stopPolling();
    }
  }, [modalState, paymentData?.shortCode, startPolling, stopPolling]);

  return {
    modalState,
    errorMessage,
    paymentData,
    tokensAdded,
    retryPayment: createPayment,
  };
}
