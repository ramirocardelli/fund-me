export interface Project {
  id: string;
  title: string;
  description: string;
  goalAmount: number;
  currentAmount: number;
  creatorAddress: string;
  creatorName: string;
  createdAt: Date;
  imageUrl?: string;
}

export interface Donation {
  id: string;
  projectId: string;
  amount: number;
  donorAddress: string;
  timestamp: Date;
}

export interface UserProfile {
  id: string;
  username: string;
  walletAddress: string;
  avatar?: string;
  bio?: string;
  createdAt: Date;
  stats: {
    campaignsCreated: number;
    totalDonated: number;
    donationsCount: number;
  };
}
