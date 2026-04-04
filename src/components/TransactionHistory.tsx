import React, { useEffect, useState } from 'react';
import { tokenService } from '@/services/tokenService';
import { TokenTransaction } from '@/types';
import { History, ArrowUpRight, ArrowDownLeft, Clock, AlertCircle } from 'lucide-react';

const TransactionHistory: React.FC = () => {
  const [transactions, setTransactions] = useState<TokenTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    setLoading(true);
    try {
      const data = await tokenService.getTransactionHistory(50);
      setTransactions(data);
    } catch (err) {
      setError('Không thể tải lịch sử giao dịch');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const getStatusBadge = (status: string) => {
    const baseClasses = "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-tighter";
    switch (status) {
      case 'completed':
        return <span className={`${baseClasses} bg-green-500/10 text-green-400`}>Тhanà công</span>;
      case 'pending':
        return <span className={`${baseClasses} bg-yellow-500/10 text-yellow-400`}>Chờ xử lý</span>;
      case 'failed':
        return <span className={`${baseClasses} bg-red-500/10 text-red-400`}>Thất bại</span>;
      default:
        return <span className={`${baseClasses} bg-gray-700 text-gray-400`}>{status}</span>;
    }
  };

  const getTransactionIcon = (type: string, amount: number) => {
    if (type === 'purchase' || type === 'admin' || amount > 0) {
      return (
        <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center text-green-400 shadow-sm border border-green-500/30">
          <ArrowUpRight size={20} />
        </div>
      );
    }
    return (
      <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center text-red-400 shadow-sm border border-red-500/30">
        <ArrowDownLeft size={20} />
      </div>
    );
  };

  if (loading) {
    return (
      <div className="py-20 text-center">
        <div className="animate-spin inline-block w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full mb-4"></div>
        <p className="text-gray-400 font-medium">Đang tải lịch sử...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-10 text-center text-red-400 flex flex-col items-center gap-2">
        <AlertCircle size={32} />
        <p className="font-bold">{error}</p>
        <button 
          onClick={loadTransactions}
          className="mt-2 text-sm text-red-400 hover:underline"
        >
          Thử lại
        </button>
      </div>
    );
  }

  return (
    <div className="transaction-history">
      <div className="flex items-center gap-2 mb-6">
        <div className="p-2 bg-red-500/10 text-red-400 rounded-lg">
          <History size={20} />
        </div>
        <h3 className="text-xl font-extrabold text-gray-200">Lịch Sử Giao Dịch</h3>
      </div>

      {transactions.length === 0 ? (
        <div className="text-center py-16 bg-gray-800/30 rounded-2xl border border-dashed border-gray-700">
          <div className="mb-4 text-gray-500 flex justify-center">
            <Clock size={48} />
          </div>
          <p className="text-gray-400 font-medium">Bạn chưa có giao dịch nào</p>
          <p className="text-xs text-gray-500 mt-1 uppercase tracking-widest font-bold">Bắt đầu nạp token để trải nghiệm ngay</p>
        </div>
      ) : (
        <div className="space-y-3">
          {transactions.map((tx) => (
            <div 
              key={tx.id}
              className="bg-gray-800/40 border border-gray-700 rounded-2xl p-4 flex items-center justify-between hover:shadow-md transition-all group"
            >
              <div className="flex items-center gap-4">
                {getTransactionIcon(tx.type, tx.amount)}
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="font-bold text-gray-200 text-sm">{tx.description || 'Giao dịch token'}</p>
                    {getStatusBadge(tx.status)}
                  </div>
                  <p className="text-[10px] text-gray-500 font-medium flex items-center gap-1">
                    <Clock size={10} />
                    {formatDate(tx.createdAt)}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className={`text-lg font-black ${tx.amount > 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {tx.amount > 0 ? `+${tx.amount.toLocaleString()}` : tx.amount.toLocaleString()}
                </p>
                <p className="text-[8px] font-black text-gray-500 uppercase tracking-tighter">Tokens</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TransactionHistory;
