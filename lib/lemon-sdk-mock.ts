// Mock implementation of @lemoncash/mini-app-sdk for development/testing
// This matches the official SDK API structure from the documentation

export enum TransactionResult {
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
}

export enum TokenName {
  ETH = 'ETH',
  POL = 'POL',
  USDC = 'USDC',
  USDT = 'USDT',
}

export enum ChainId {
  // Mainnet
  ARBITRUM_ONE = 42161,
  BASE = 8453,
  ETH = 1,
  OP_MAINNET = 10,
  POLYGON = 137,

  // Testnet
  ARBITRUM_SEPOLIA = 421614,
  ETH_HOODI = 560048,
  ETH_SEPOLIA = 11155111,
  POLYGON_AMOY = 80002,
}

export enum ContractStandard {
  ERC20 = 'ERC20',
}

export type MiniAppError = {
  message: string;
  code: string;
};

export type Address = `0x${string}`;

// Authenticate Types
export type AuthenticateData = {
  nonce?: string;
  chainId?: ChainId;
};

export type AuthenticateResponse = {
  result: TransactionResult.SUCCESS;
  data: {
    wallet: string;
    signature: string;
    message: string;
  };
} | {
  result: TransactionResult.FAILED;
  error: MiniAppError;
} | {
  result: TransactionResult.CANCELLED;
};

// Deposit Types
export type DepositInput = {
  amount: string;
  tokenName: TokenName | string;
  chainId?: ChainId;
};

export type DepositResponse = {
  result: TransactionResult.SUCCESS;
  data: {
    txHash: string;
  };
} | {
  result: TransactionResult.FAILED;
  error: MiniAppError;
} | {
  result: TransactionResult.CANCELLED;
};

// Withdraw Types
export type WithdrawInput = {
  amount: string;
  tokenName: TokenName | string;
};

export type WithdrawResponse = {
  result: TransactionResult.SUCCESS;
  data: {
    txHash: string;
  };
} | {
  result: TransactionResult.FAILED;
  error: MiniAppError;
} | {
  result: TransactionResult.CANCELLED;
};

// Call Smart Contract Types
export type Permit = {
  owner: Address;
  token: Address;
  spender: Address;
  amount: string;
  deadline: string;
  nonce: string;
};

export type CallSmartContractInput = {
  contracts: Array<{
    contractAddress: Address;
    functionName: string;
    functionParams: string | number[];
    value: string;
    contractStandard?: ContractStandard;
    chainId?: ChainId;
    permits?: Permit[];
  }>;
  titleValues?: Record<string, string>;
  descriptionValues?: Record<string, string>;
};

export type CallSmartContractResponse = {
  result: TransactionResult.SUCCESS;
  data: {
    txHash: string;
  };
} | {
  result: TransactionResult.FAILED;
  error: MiniAppError;
} | {
  result: TransactionResult.CANCELLED;
};

// Mock SDK Implementation
class LemonSDKMock {
  private mockWallet = '0x1Ed17b06961B9B8DE78Ee924BcDaBC003aaE1867';

  // Mock authenticate function
  async authenticate(data?: AuthenticateData): Promise<AuthenticateResponse> {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simulate successful authentication
        const response: AuthenticateResponse = {
          result: TransactionResult.SUCCESS,
          data: {
            wallet: this.mockWallet,
            signature: '0xba099e3ab31b8bf1201d2de2d0e4d81f7162f5de6993a960988959ff97be45b27d284a6e29d065cd175122953cf861725906639dc1f3229e66ff8b9d5820634a1b',
            message: `lemoncash wants you to sign in with your Ethereum account:\n${this.mockWallet}\n\nSign in with Ethereum.\n\nURI: http://localhost:3000\nVersion: 1\nChain ID: ${data?.chainId || ChainId.POLYGON_AMOY}\nNonce: ${data?.nonce || 'mock_nonce_123456'}\nIssued At: ${new Date().toISOString()}`,
          },
        };
        resolve(response);
      }, 1000);
    });
  }

  // Mock deposit function
  async deposit(input: DepositInput): Promise<DepositResponse> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const amount = parseFloat(input.amount);

        if (isNaN(amount) || amount <= 0) {
          resolve({
            result: TransactionResult.FAILED,
            error: {
              message: 'Monto inválido',
              code: 'INVALID_AMOUNT',
            },
          });
          return;
        }

        // Simulate successful deposit
        resolve({
          result: TransactionResult.SUCCESS,
          data: {
            txHash: '0x' + Math.random().toString(16).substr(2, 64),
          },
        });
      }, 1500);
    });
  }

  // Mock withdraw function
  async withdraw(input: WithdrawInput): Promise<WithdrawResponse> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const amount = parseFloat(input.amount);

        if (isNaN(amount) || amount <= 0) {
          resolve({
            result: TransactionResult.FAILED,
            error: {
              message: 'Monto inválido',
              code: 'INVALID_AMOUNT',
            },
          });
          return;
        }

        // Simulate successful withdrawal
        resolve({
          result: TransactionResult.SUCCESS,
          data: {
            txHash: '0x' + Math.random().toString(16).substr(2, 64),
          },
        });
      }, 1500);
    });
  }

  // Mock callSmartContract function
  async callSmartContract(input: CallSmartContractInput): Promise<CallSmartContractResponse> {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simulate successful smart contract call
        resolve({
          result: TransactionResult.SUCCESS,
          data: {
            txHash: '0x' + Math.random().toString(16).substr(2, 64),
          },
        });
      }, 2000);
    });
  }

  // Mock isWebView function
  isWebView(): boolean {
    // In development, always return true for testing
    // In real SDK, this checks for React Native WebView environment
    if (typeof window === 'undefined') {
      return false;
    }
    
    // Check for common WebView indicators
    return !!(
      (window as any).ReactNativeWebView ||
      navigator.userAgent.includes('ReactNativeWebView') ||
      document.documentElement.classList.contains('ReactNativeWebView')
    );
  }
}

// Export singleton instance
const lemonSDKMock = new LemonSDKMock();

// Export functions that match the official SDK API
export const authenticate = (data?: AuthenticateData) => lemonSDKMock.authenticate(data);
export const deposit = (input: DepositInput) => lemonSDKMock.deposit(input);
export const withdraw = (input: WithdrawInput) => lemonSDKMock.withdraw(input);
export const callSmartContract = (input: CallSmartContractInput) => lemonSDKMock.callSmartContract(input);
export const isWebView = () => lemonSDKMock.isWebView();

// Also export the class instance for backward compatibility
export const lemonSDK = lemonSDKMock;

