import { Account } from 'near-api-js';
import { useEffect, useState } from 'react';

export function useAccountBalance(account?: Account) {
  const [balance, setBalance] = useState<number | null>(null);

  useEffect(() => {
    const fetchBalance = async () => {
      if (!account) return;
      try {
        const accountBalance = await account.getAccountBalance();
        setBalance(Number(accountBalance.available));
      } catch (error) {
        console.error('Error fetching balance:', error);
      }
    };

    if (account) {
      fetchBalance();
    }
  }, [account]);

  return { balance };
}
