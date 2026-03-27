import { useState, useEffect, useRef, useCallback } from 'react';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

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

// ─── Helpers ────────────────────────────────────────────────────────────────

const getAuthToken = (): string =>
  localStorage.getItem('token') || sessionStorage.getItem('token') || '';

const buildQrUrl = (price: number, transferContent: string): string =>
  `https://qr.sepay.vn/img?acc=21483301&bank=ACB&amount=${price}&des=${encodeURIComponent(
    transferContent,
  )}&t=${Date.now()}`;

// ─── Hook ────────────────────────────────────────────────────────────────────

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

  // ── Cleanup helpers ──────────────────────────────────────────────────────

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

  // ── Polling ──────────────────────────────────────────────────────────────

  const startPolling = useCallback(
    (shortCode: string) => {
      stopPolling();

      pollingRef.current = setInterval(async () => {
        try {
          const res = await fetch(`${API_BASE}/api/shop/check-payment/${shortCode}`, {
            headers: { Authorization: `Bearer ${getAuthToken()}` },
          });
          const json = await res.json();

          if (json.status === 'success' && json.data.paymentStatus === 'completed') {
            stopPolling();
            setTokensAdded(json.data.tokensAdded);
            setModalState('success');
            onSuccess(json.data.tokenBalance);
          }
        } catch {
          // Ignore transient network errors; keep polling
        }
      }, POLL_INTERVAL_MS);

      // Auto-expire after timeout
      timeoutRef.current = setTimeout(stopPolling, POLL_TIMEOUT_MS);
    },
    [stopPolling, onSuccess],
  );

  // ── Create payment request ───────────────────────────────────────────────

  const createPayment = useCallback(async () => {
    if (!userId) return;

    setModalState('loading');
    setErrorMessage('');
    setPaymentData(null);

    try {
      const res = await fetch(`${API_BASE}/api/shop/create-payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getAuthToken()}`,
        },
        body: JSON.stringify({ amount, price }),
      });

      const json = await res.json();

      if (!res.ok || json.status !== 'success') {
        throw new Error(json.message || 'Không tạo được payment request');
      }

      const { shortCode, transferContent } = json.data;

      setPaymentData({
        shortCode,
        transferContent,
        qrUrl: buildQrUrl(price, transferContent),
      });

      setModalState('qr');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Lỗi không xác định';
      setErrorMessage(message);
      setModalState('error');
    }
  }, [userId, amount, price]);

  // ── Effect: reset + init when modal opens/closes ─────────────────────────

  useEffect(() => {
    if (isOpen) {
      setTokensAdded(0);
      createPayment();
    } else {
      stopPolling();
    }

    return () => {
      stopPolling();
    };
  }, [isOpen, createPayment, stopPolling]);

  // ── Effect: start/stop polling based on state ────────────────────────────

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