// This file is no longer needed as filtering logic has been moved to useAccounts hook
// Keeping for backward compatibility but can be removed in future cleanup

import { Account, AccountFilters } from "@/types/account";

export const useAccountFilters = () => {
  const applyFilters = (
    accounts: Account[],
    filters: AccountFilters,
  ): Account[] => {
    return accounts.filter((account) => {
      // Apply client search filter
      if (filters.client_search) {
        const searchTerm = filters.client_search.toLowerCase();
        const clientName =
          `${account.client?.first_name} ${account.client?.last_name}`.toLowerCase();
        const emailMatch = account.client?.email
          ?.toLowerCase()
          .includes(searchTerm);
        const accountNameMatch = account.account_name
          ?.toLowerCase()
          .includes(searchTerm);
        const accountNumberMatch = account.account_number
          ?.toLowerCase()
          .includes(searchTerm);

        if (
          !clientName.includes(searchTerm) &&
          !emailMatch &&
          !accountNameMatch &&
          !accountNumberMatch
        ) {
          return false;
        }
      }

      return true;
    });
  };

  return {
    applyFilters,
  };
};
