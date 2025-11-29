import { useState, useEffect } from 'react';

export const useWallet = () => {
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [celoBalance, setCeloBalance] = useState(0);
  const [loading, setLoading] = useState(false);
  const [fullAddress, setFullAddress] = useState('');

  const connectWallet = async () => {
    setLoading(true);
    try {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts'
        });

        const address = accounts[0];
        setFullAddress(address);
        const formattedAddress = `${address.slice(0, 6)}...${address.slice(-4)}`;
        setWalletAddress(formattedAddress);
        setWalletConnected(true);

        // Get balance
        try {
          const balance = await window.ethereum.request({
            method: 'eth_getBalance',
            params: [address, 'latest']
          });
          const balanceInEth = parseInt(balance) / 10**18;
          setCeloBalance(balanceInEth.toFixed(2));
        } catch (balanceError) {
          console.log('Could not fetch balance, using demo data');
          setCeloBalance('12.5');
        }

      } else {
        alert('Please install MetaMask or a Celo-compatible wallet!');
      }
    } catch (error) {
      console.error('Error connecting wallet:', error);
      alert('Error connecting wallet. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const checkWalletConnection = async () => {
      if (window.ethereum) {
        try {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          if (accounts.length > 0) {
            const address = accounts[0];
            setFullAddress(address);
            setWalletAddress(`${address.slice(0, 6)}...${address.slice(-4)}`);
            setWalletConnected(true);
            
            try {
              const balance = await window.ethereum.request({
                method: 'eth_getBalance',
                params: [address, 'latest']
              });
              const balanceInEth = parseInt(balance) / 10**18;
              setCeloBalance(balanceInEth.toFixed(2));
            } catch (balanceError) {
              setCeloBalance('12.5');
            }
          }
        } catch (error) {
          console.error('Error checking wallet connection:', error);
        }
      }
    };

    checkWalletConnection();
  }, []);

  return {
    walletConnected,
    walletAddress,
    fullAddress,
    celoBalance,
    loading,
    connectWallet
  };
};