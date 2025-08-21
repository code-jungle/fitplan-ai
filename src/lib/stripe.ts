// Stripe integration for subscription management
export interface StripeConfig {
  publishableKey: string;
  priceId: string;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  currency: string;
  interval: 'month' | 'year';
  features: string[];
  trialDays: number;
}

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'basic',
    name: 'FitPlanAI Básico',
    price: 14.90,
    currency: 'BRL',
    interval: 'month',
    features: [
      'Planos personalizados de dieta e treino',
      'IA adaptativa com Gemini',
      'Ajustes automáticos diários',
      'Dashboard completo',
      'Suporte por email'
    ],
    trialDays: 7
  }
];

export const STRIPE_CONFIG: StripeConfig = {
  publishableKey: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '',
  priceId: import.meta.env.VITE_STRIPE_PRICE_ID || ''
};

// Load Stripe script
export const loadStripe = async () => {
  if (typeof window !== 'undefined' && !window.Stripe) {
    const script = document.createElement('script');
    script.src = 'https://js.stripe.com/v3/';
    script.async = true;
    document.head.appendChild(script);
    
    return new Promise((resolve) => {
      script.onload = () => resolve(window.Stripe);
    });
  }
  return window.Stripe;
};

// Create checkout session
export const createCheckoutSession = async (priceId: string, customerEmail?: string) => {
  try {
    const response = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        priceId,
        customerEmail,
        successUrl: `${window.location.origin}/dashboard?success=true`,
        cancelUrl: `${window.location.origin}/subscription?canceled=true`,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to create checkout session');
    }

    const session = await response.json();
    return session;
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw error;
  }
};

// Create customer portal session
export const createCustomerPortalSession = async (customerId: string) => {
  try {
    const response = await fetch('/api/create-portal-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        customerId,
        returnUrl: `${window.location.origin}/dashboard`,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to create portal session');
    }

    const session = await response.json();
    return session;
  } catch (error) {
    console.error('Error creating portal session:', error);
    throw error;
  }
};

// Format price for display
export const formatPrice = (price: number, currency: string = 'BRL') => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency,
  }).format(price);
};

// Check if subscription is active
export const isSubscriptionActive = (subscription: any) => {
  if (!subscription) return false;
  
  const now = new Date();
  const trialEnd = new Date(subscription.trial_ends_at);
  const subscriptionEnd = subscription.subscription_ends_at ? new Date(subscription.subscription_ends_at) : null;
  
  // Check if in trial period
  if (trialEnd > now) return true;
  
  // Check if subscription is active
  if (subscriptionEnd && subscriptionEnd > now) return true;
  
  return subscription.subscribed === true;
};

// Get subscription status
export const getSubscriptionStatus = (subscription: any) => {
  if (!subscription) return 'inactive';
  
  const now = new Date();
  const trialEnd = new Date(subscription.trial_ends_at);
  
  if (trialEnd > now) {
    const daysLeft = Math.ceil((trialEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return `trial_${daysLeft}`;
  }
  
  if (subscription.subscribed) return 'active';
  return 'expired';
};
