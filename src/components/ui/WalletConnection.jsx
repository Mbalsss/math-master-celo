import React from 'react';
import { Wallet, RefreshCw } from 'lucide-react';

const WalletConnection = ({ wallet }) => {
  const { walletConnected, walletAddress, celoBalance, loading, connectWallet } = wallet;

  return (
    <div className="mb-6">
      {!walletConnected ? (
        <button
          onClick={connectWallet}
          disabled={loading}
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 rounded-xl font-bold flex items-center justify-center hover:shadow-xl transition-all disabled:opacity-50"
        >
          {loading ? (
            <RefreshCw className="animate-spin mr-2" size={20} />
          ) : (
            <Wallet className="mr-2" size={20} />
          )}
          {loading ? 'Connecting...' : 'Connect Wallet'}
        </button>
      ) : (
        <div className="bg-gradient-to-r from-purple-100 to-blue-100 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-600 mb-1">Connected</p>
              <p className="font-bold text-purple-800">{walletAddress}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-600 mb-1">Balance</p>
              <p className="font-bold text-green-600">{celoBalance} CELO</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WalletConnection;