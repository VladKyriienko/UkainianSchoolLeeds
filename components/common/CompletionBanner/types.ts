import type { CompletionFieldConfig } from '@/lib/auth/completion';

export type CompletionData = {
  percentage: number;
  completedFields: string[];
  missingFields: string[];
  totalFields: number;
};

export type CompletionBannerData = {
  completionData: CompletionData;
  settings: {
    showCompletionBanner: boolean;
  };
  postSignupSettings: {
    requirePostSignupCompletion: boolean;
    postSignupCompletionPath: string;
  };
  fieldConfig: CompletionFieldConfig[];
};
