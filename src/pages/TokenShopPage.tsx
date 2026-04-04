import { useState } from 'react';
import TokenShop from '@/components/TokenShop';

export function TokenShopPage() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleSuccess = () => {
    // Refresh component
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gray-950 py-8 px-4">
      <div className="container mx-auto">
        <TokenShop key={refreshKey} onSuccess={handleSuccess} />
      </div>
    </div>
  );
}

export default TokenShopPage;
