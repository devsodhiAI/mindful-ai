import { create } from 'zustand';
import { supabase } from '@/lib/supabase';

interface SubscriptionState {
  currentPlan: string | null;
  isSubscribed: boolean;
  loading: boolean;
  checkSubscription: () => Promise<void>;
  handleSubscription: (priceId: string) => Promise<void>;
}

export const useSubscriptionStore = create<SubscriptionState>((set) => ({
  currentPlan: null,
  isSubscribed: false,
  loading: false,
  checkSubscription: async () => {
    set({ loading: true });
    try {
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .single();

      if (error) throw error;
      set({
        currentPlan: data.plan_type,
        isSubscribed: data.status === 'active',
      });
    } catch (error) {
      console.error('Error checking subscription:', error);
      set({ currentPlan: null, isSubscribed: false });
    } finally {
      set({ loading: false });
    }
  },
  handleSubscription: async (priceId: string) => {
    // Implementation will be added when we integrate Stripe
    throw new Error('Not implemented');
  },
}));