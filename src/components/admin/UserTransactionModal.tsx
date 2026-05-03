import React, { useEffect, useState } from 'react';
import { X, Clock, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { adminService } from '../../services/adminService';

interface UserTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  token: string;
  userId: number;
  username: string;
}

export const UserTransactionModal: React.FC<UserTransactionModalProps> = ({ isOpen, onClose, token, userId, username }) => {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen && userId) {
      setLoading(true);
      adminService.getUserTransactions(token, userId)
        .then(res => {
          if (res.status === 'success') {
            setTransactions(res.data.transactions);
          }
        })
        .finally(() => setLoading(false));
    }
  }, [isOpen, userId, token]);

  if (!isOpen) return null;

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString('vi-VN');
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
        <div className="p-4 border-b border-gray-800 flex justify-between items-center bg-gray-800/50">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            Lịch sử giao dịch: <span className="text-yellow-500">{username}</span>
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-4 max-h-[60vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700">
          {loading ? (
            <div className="py-20 text-center text-gray-500 italic">Đang tải...</div>
          ) : transactions.length === 0 ? (
            <div className="py-20 text-center text-gray-500 italic">Không có giao dịch nào</div>
          ) : (
            <div className="space-y-3">
              {transactions.map((tx) => (
                <div key={tx.id} className="bg-gray-800/40 border border-gray-700/50 rounded-xl p-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${tx.amount > 0 ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                      {tx.amount > 0 ? <ArrowUpRight size={16} /> : <ArrowDownLeft size={16} />}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-200">{tx.description || 'Giao dịch'}</p>
                      <div className="flex items-center gap-2">
                         <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold uppercase ${tx.status === 'completed' ? 'bg-green-500/10 text-green-400' : 'bg-yellow-500/10 text-yellow-400'}`}>
                          {tx.status === 'completed' ? 'Thành công' : 'Chờ xử lý'}
                        </span>
                        <span className="text-[10px] text-gray-500 flex items-center gap-1">
                          <Clock size={10} /> {formatDate(tx.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className={`text-sm font-black ${tx.amount > 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {tx.amount > 0 ? `+${tx.amount}` : tx.amount}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-4 bg-gray-800/30 border-t border-gray-800 text-center">
          <button onClick={onClose} className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm font-semibold transition-colors">
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
