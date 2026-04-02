export type MutualPreviewUser = {
  id: number;
  username: string;
  imageUrl: string | null;
};

export type SuggestedUser = {
  id: number;
  username: string;
  name: string;
  imageUrl: string | null;
  mutualCount: number;
  mutualPreview: MutualPreviewUser[];
};
