import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';

type Locale = 'en' | 'bn';
const translations = {
  en: { search: 'Search dishes', all: 'All', restaurant: 'Restaurant', menu: 'Fresh from our kitchen', subtitle: 'Good food, delivered with care.', add: 'Add', cart: 'Your cart', checkout: 'Continue to checkout', empty: 'Your cart is hungry.', delivery: 'Delivery', pickup: 'Self-pickup', name: 'Full name', email: 'Email address', phone: 'Phone number', notes: 'Order notes (optional)', placeOrder: 'Place order', subtotal: 'Subtotal', deliveryFee: 'Delivery', total: 'Total', verifyTitle: 'Check your messages', verifyCopy: 'Enter the 6-digit code sent to your phone to confirm your order.', resend: 'Resend code', verify: 'Verify & continue', tracking: 'Track your order', pay: 'Pay now', loading: 'Loading your menu…', failed: 'Something went wrong. Please try again.', back: 'Back to menu', browse: 'Explore the menu', items: 'items', close: 'Close', orderPlaced: 'Order placed', trackingCode: 'Order reference', details: 'About this dish', related: 'You may also like', unavailable: 'Currently unavailable' },
  bn: { search: 'পছন্দের খাবার খুঁজুন', all: 'সব', restaurant: 'রেস্তোরাঁ', menu: 'আমাদের রান্নাঘর থেকে টাটকা', subtitle: 'যত্নের সাথে পৌঁছে যায় সুস্বাদু খাবার।', add: 'যোগ করুন', cart: 'আপনার কার্ট', checkout: 'চেকআউটে যান', empty: 'আপনার কার্ট খালি।', delivery: 'হোম ডেলিভারি', pickup: 'নিজে এসে নিন', name: 'পুরো নাম', email: 'ইমেল ঠিকানা', phone: 'ফোন নম্বর', notes: 'অর্ডারের নোট (ঐচ্ছিক)', placeOrder: 'অর্ডার করুন', subtotal: 'সাবটোটাল', deliveryFee: 'ডেলিভারি', total: 'মোট', verifyTitle: 'মেসেজ দেখুন', verifyCopy: 'অর্ডার নিশ্চিত করতে ফোনে পাঠানো ৬ সংখ্যার কোড দিন।', resend: 'কোড আবার পাঠান', verify: 'যাচাই করে এগিয়ে যান', tracking: 'অর্ডার ট্র্যাক করুন', pay: 'এখন পেমেন্ট করুন', loading: 'মেনু লোড হচ্ছে…', failed: 'সমস্যা হয়েছে। আবার চেষ্টা করুন।', back: 'মেনুতে ফিরুন', browse: 'মেনু দেখুন', items: 'টি আইটেম', close: 'বন্ধ করুন', orderPlaced: 'অর্ডার সম্পন্ন', trackingCode: 'অর্ডার রেফারেন্স', details: 'এই খাবার সম্পর্কে', related: 'আরও পছন্দ হতে পারে', unavailable: 'এখন পাওয়া যাচ্ছে না' },
} as const;

type I18n = { locale: Locale; setLocale: (locale: Locale) => void; t: { [Key in keyof typeof translations.en]: string } };
const Context = createContext<I18n>({ locale: 'en', setLocale: () => {}, t: translations.en });
export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>('en');
  const value = useMemo(() => ({ locale, setLocale, t: translations[locale] }), [locale]);
  return <Context.Provider value={value}>{children}</Context.Provider>;
}
export const useI18n = () => useContext(Context);
