/* eslint-disable no-prototype-builtins */
import { type ClassValue, clsx } from 'clsx';
import qs from 'query-string';
import { twMerge } from 'tailwind-merge';
import moment from 'moment-timezone';
import { capitalize } from 'lodash';
import crypto from 'crypto';
import { ProductDetails, TicketTier } from '@/types/product';
import Joi from 'joi';
import slugify from 'slugify';
import {
  BusinessProfileFull,
  BusinessWallet,
  Product,
  SubscriptionPlanPrice,
} from '@/types/org';
import { Cart } from '@/types/cart';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const timezones = moment.tz.names();

export const productTypes = [
  { type: 'Courses', count: 80, color: '#f43f5e' },
  { type: 'Tickets', count: 20, color: '#2265d8' },
];

export enum EmailTemplate {
  WAITLIST = 'waitlist',
  CUSTOM = 'custom',
}

export enum NotificationKind {
  IMMEDIATE = 'immediate',
  SCHEDULED = 'scheduled',
}

export enum NOTIFICATION_STATUS {
  NONE = 'none',
  PENDING = 'pending',
  CANCELED = 'canceled',
  SCHEDULED = 'scheduled',
  DELIVERED = 'delivered',
  FAILED = 'failed',
}

export enum ProductStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  ARCHIVED = 'ARCHIVED',
}

export enum BusinessState {
  'registered',
  'deleted',
}

export enum ContactStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

export enum PaymentStatus {
  SUCCESS = 'SUCCESS',
  PENDING = 'PENDING',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
}

export enum PaymentMethod {
  PAYSTACK = 'PAYSTACK',
  FLUTTERWAVE = 'FLUTTERWAVE',
}

export enum PurchaseItemType {
  COURSE = 'COURSE',
  TICKET = 'TICKET',
  SUBSCRIPTION = 'SUBSCRIPTION',
  DIGITAL_PRODUCT = 'DIGITAL_PRODUCT',
  PHYSICAL_PRODUCT = 'PHYSICAL_PRODUCT',
}

export enum ProductType {
  COURSE = 'COURSE',
  TICKET = 'TICKET',
  SUBSCRIPTION = 'SUBSCRIPTION',
  DIGITAL_PRODUCT = 'DIGITAL_PRODUCT',
  PHYSICAL_PRODUCT = 'PHYSICAL_PRODUCT',
}

export enum CouponType {
  PERCENTAGE = 'PERCENTAGE',
  FLAT = 'FLAT',
}

export enum CartType {
  OPEN = 'OPEN',
  CLOSED = 'CLOSED',
  SOLD_OUT = 'SOLD_OUT',
}

export enum MultimediaType {
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO',
  AUDIO = 'AUDIO',
  DOCUMENT = 'DOCUMENT',
}

export enum MultimediaProvider {
  CLOUDINARY = 'CLOUDINARY',
}

export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
}

export enum IdType {
  INTERNATIONAL_PASSPORT = 'international-passport',
  NATIONAL_IDENTITY_CARD_NIN_SLIP = 'national-identity-card-nin-slip',
  DRIVERS_LICENSE = 'drivers-license',
  VOTERS_CARD = 'voters-card',
  RESIDENCE_PERMIT = 'residence-permit',
}

export enum SubscriptionPeriod {
  FREE = 'free',
  MONTHLY = 'monthly',
  QUARTERLY = 'quarterly',
  SEMI_ANNUALLY = 'semi_annually',
  YEARLY = 'yearly',
}

export enum SystemRole {
  USER = 'user',
  BUSINESS_SUPER_ADMIN = 'business-super-administrator',
  BUSINESS_ADMIN = 'business-administrator',
  TUTOR = 'tutor',
}

export enum BusinessOwnerOrgRole {
  USER = 'user',
  BUSINESS_ADMIN = 'business-administrator',
}

export enum BusinessInviteRole {
  TUTOR = 'tutor',
  BUSINESS_ADMIN = 'business-administrator',
}

export enum SignupRole {
  CUSTOMER = 'customer',
  BUSINESS_OWNER = 'business-owner',
}

export enum ChatReadStatus {
  READ = 'read',
  UNREAD = 'unread',
}

export enum TicketTierStatus {
  CLOSED = 'CLOSED',
  OPEN = 'OPEN',
}

export enum EventType {
  ONLINE = 'ONLINE',
  PHYSICAL = 'PHYSICAL',
  HYBRID = 'HYBRID',
}

export enum ContactInviteStatus {
  ACTIVE = 'active',
  SUSPENDED = 'suspended',
  PENDING = 'pending',
  EXPIRED = 'expired',
}

export const NotificationStatusTypes = [
  { slug: 'immediate', name: 'Immediate', template: EmailTemplate.CUSTOM },
  { slug: 'scheduled', name: 'Scheduled', template: EmailTemplate.WAITLIST },
];

export const notificationTemplates = ['custom'];

export const badgeColors = [
  {
    color: 'blue',
    for: [NOTIFICATION_STATUS.PENDING, EmailTemplate.WAITLIST] as Array<string>,
  },
  {
    color: 'red',
    for: [
      NOTIFICATION_STATUS.CANCELED,
      NOTIFICATION_STATUS.FAILED,
    ] as Array<string>,
  },
  { color: 'indigo', for: [NOTIFICATION_STATUS.SCHEDULED] as Array<string> },
  { color: 'green', for: [NOTIFICATION_STATUS.DELIVERED] as Array<string> },
  { color: 'pink', for: [EmailTemplate.CUSTOM] as Array<string> },
  { color: 'purple', for: [''] as Array<string> },
];

export const maskSensitiveData = (data: string, maskChar = '*') => {
  // If data length is too short, just return it
  if (data.length <= 4) return data;

  // Get the first two and last two characters
  const firstTwo = data.slice(0, 2);
  const lastTwo = data.slice(-2);

  // Mask the middle part with the specified mask character
  const maskedSection = maskChar.repeat(data.length - 4);

  // Return the combined result
  return `${firstTwo}${maskedSection}${lastTwo}`;
};

export const emailSplit = (email: string) => {
  return email.split('@');
};

export const getColor = (status: string) => {
  const details = badgeColors?.find(
    (badge: { color: string; for: Array<string> }) =>
      badge.for.includes(status?.toLowerCase()),
  );

  return details?.color;
};

export const replaceAsterisk = (network: string) => {
  return network === '*' ? 'All' : capitalize(network);
};

export const formatMoney = (
  amount: number,
  currency: string = 'NGN',
): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(amount);
};

export const formatCurrency = (amount: string, currency = 'NGN'): string => {
  const numericAmount = parseFloat(amount);
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
  }).format(numericAmount);
};

const algorithm = 'aes-256-cbc';
const secret = process.env.NEXT_PUBLIC_ENCRYPTION_KEY!; // Ensure this is exactly 32 characters
const secretKey = crypto.createHash('sha256').update(secret).digest(); // Converts it to a 32-byte key
const iv = crypto.randomBytes(16); // Initialization vector

// Encrypt Function
export const encryptInput = (input: string): string => {
  const cipher = crypto.createCipheriv(algorithm, secretKey, iv);
  let encrypted = cipher.update(input, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return iv.toString('hex') + ':' + encrypted;
};

// Check if input is an encrypted string
export const isEncrypted = (input: string) => {
  if (!input.includes(':')) return false; // Must have IV and encrypted text
  const [ivHex, encryptedText] = input.split(':');
  return ivHex.length === 32 && /^[a-f0-9]+$/.test(encryptedText); // IV should be 16 bytes (hex = 32 chars)
};

// Decrypt Function
export const decryptInput = (encryptedInput: string): string => {
  if (!isEncrypted(encryptedInput)) {
    throw new Error('Invalid encrypted input');
  }

  try {
    const [ivHex, encrypted] = encryptedInput.split(':');
    const decipher = crypto.createDecipheriv(
      algorithm,
      secretKey,
      Buffer.from(ivHex, 'hex'),
    );
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  } catch (error) {
    throw new Error('Decryption failed. Invalid encrypted input.');
  }
};

export const getLeastTicketTierPrice = (
  ticketTiers: TicketTier[],
): number | 0 => {
  if (!ticketTiers.length) return 0;

  return Math.min(...ticketTiers.map((tier) => Number(tier.amount)));
};

export const getISODateString = (date: Date) => date.toISOString().slice(0, 16);
export const oneMonthAgo = () => {
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
  return oneMonthAgo;
};
export const now = new Date();

export const shortenId = (id?: string) => {
  return id?.split('-')[0];
};

export enum ActionKind {
  CRITICAL = 'unsuspend',
  FAVORABLE = 'favorable',
}

export enum NotificationType {
  EMAIL = 'EMAIL',
}

export const actualRole = (role: SignupRole | string): SystemRole | string => {
  let roleName = '';
  if (role === SignupRole.CUSTOMER) {
    roleName = SystemRole.USER;
  } else if (role === SignupRole.BUSINESS_OWNER) {
    roleName = SystemRole.BUSINESS_SUPER_ADMIN;
  }
  return roleName;
};

export const truncate = (text: string, maxLength: number) => {
  if (!text) return '';
  return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
};

export const getAvatar = (picture: string, name: string) => {
  return picture
    ? picture
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(
        name,
      )}&background=random&size=32`;
};

export enum TransactionType {
  CREDIT = 'CREDIT',
  WITHDRAWAL = 'WITHDRAWAL',
}

export enum RefundStatus {
  PENDING = 'PENDING',
  PROCESSED = 'PROCESSED',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
}

export enum RefundType {
  REFUND = 'REFUND',
  CHARGEBACK = 'CHARGEBACK',
}

export const getPurchaseTypeLabel = (type: string) => {
  switch (type) {
    case 'COURSE':
      return 'Course';
    case 'TICKET':
      return 'Event Ticket';
    case 'SUBSCRIPTION':
      return 'Subscription';
    default:
      return 'Purchase';
  }
};

export const BUSINESS_INDUSTRIES = [
  'Select Industry',
  'Technology',
  'Healthcare',
  'Finance',
  'Education',
  'Retail',
  'Manufacturing',
  'Real Estate',
  'Hospitality',
  'Transportation',
  'Construction',
  'Media & Entertainment',
  'Professional Services',
  'Agriculture',
  'Energy',
  'Telecommunications',
  'Food & Beverage',
  'Automotive',
  'Fashion & Apparel',
  'Sports & Fitness',
  'Arts & Crafts',
  'Legal Services',
  'Consulting',
  'Marketing & Advertising',
  'Non-Profit',
  'Other',
];

export type BusinessIndustry = (typeof BUSINESS_INDUSTRIES)[number];

export const reformatText = (text: string, separator: string) => {
  return text?.split(separator).join(' ');
};

export const OK = 200;

// Utility to safely check if we're in a browser environment
export const isBrowser = typeof window !== 'undefined';

// Safe browser API access (make these lazy, not at module scope)
export const safeBrowserAPI = {
  get location() {
    return isBrowser ? window.location : null;
  },
  get localStorage() {
    return isBrowser ? window.localStorage : null;
  },
  get sessionStorage() {
    return isBrowser ? window.sessionStorage : null;
  },
  get navigator() {
    return isBrowser ? window.navigator : null;
  },
};

// Safe redirect function
export const safeRedirect = (url: string) => {
  if (isBrowser) {
    window.location.href = url;
  }
};

// Safe router push (for Next.js router)
export const safeRouterPush = (router: any, url: string) => {
  if (isBrowser && router) {
    router.push(url);
  }
};

export const getProductPath = (type: ProductType) => {
  let path = '';
  switch (type) {
    case ProductType.COURSE:
      path = 'courses';
      break;
    case ProductType.DIGITAL_PRODUCT:
      path = 'digital-products';
      break;
    case ProductType.PHYSICAL_PRODUCT:
      path = 'physical-products';
      break;
    case ProductType.SUBSCRIPTION:
      path = 'subscriptions';
      break;
    case ProductType.TICKET:
      path = 'tickets';
      break;
    default:
      break;
  }

  return path;
};

export const PAGINATION_LIMIT = 20;

export const reformatUnderscoreText = (text: string) => {
  return text.split('_').join(' ');
};
// Convert product type to ProductType enum
export const getProductType = (type: ProductType): ProductType => {
  if (type === ProductType.COURSE) return ProductType.COURSE;
  if (type === ProductType.TICKET) return ProductType.TICKET;
  if (type === ProductType.SUBSCRIPTION) return ProductType.SUBSCRIPTION;
  if (type === ProductType.DIGITAL_PRODUCT) return ProductType.DIGITAL_PRODUCT;
  return ProductType.COURSE; // Default fallback
};

export const hyphenate = (word: string) => {
  let slug = slugify(word, { lower: true, strict: true });

  return slug;
};

export const sortTiersByPrice = (tiers: TicketTier[]): TicketTier[] =>
  [...tiers].sort((a, b) => +a.amount - +b.amount);

export const getFirstAvailableTier = (product: Product): TicketTier | null => {
  if (
    product?.type === ProductType.TICKET &&
    product?.ticket?.ticket_tiers?.length
  ) {
    return sortTiersByPrice(product.ticket.ticket_tiers)[0];
  }
  return null;
};

export const sortSubPlansByPrice = (
  plan_prices: SubscriptionPlanPrice[],
): SubscriptionPlanPrice[] =>
  [...plan_prices].sort((a, b) => +a.price - +b.price);

export const getFirstAvailablePlan = (
  product: Product,
): SubscriptionPlanPrice | null => {
  if (
    product?.type === ProductType.SUBSCRIPTION &&
    product?.subscription_plan?.subscription_plan_prices?.length
  ) {
    return sortSubPlansByPrice(
      product.subscription_plan.subscription_plan_prices,
    )[0];
  }
  return null;
};

export const productItemInCart = (
  cart_items: Cart['items'],
  product_id: string,
) => {
  const anyProductInCart = cart_items?.some(
    (item) => item.product_id === product_id,
  );

  // Is this specific product in the cart?
  const productInCart = cart_items?.some(
    (item) => item.product_id === product_id,
  );

  return {
    anyProductInCart,
    productInCart,
  };
};

export const lowestTicketTier = (ticket_tiers: TicketTier[]) => {
  const lowestTier = ticket_tiers.reduce((lowest: any, tier: any) =>
    Number(tier.amount) < Number(lowest.amount) ? tier : lowest,
  );
  return `${formatMoney(Number(lowestTier.amount), lowestTier.currency)}+`;
};

export const baseUrl = process.env.NEXT_PUBLIC_WEBSITE_URL; // change to your actual base URL

export enum ChatTab {
  ALL = 'all',
  UNREAD = 'unread',
  CONTACTS = 'contacts',
  GROUPS = 'groups',
}

export const pluralizeText = (word: string, count: number) => {
  const pluralChar = count > 1 ? 's' : '';
  return `${word}${pluralChar}`;
};

export enum OnboardingProcess {
  BUSINESS_DETAILS = 'BUSINESS_DETAILS',
  KYC = 'KYC',
  WITHDRAWAL_ACCOUNT = 'WITHDRAWAL_ACCOUNT',
  TEAM_MEMBERS_INVITATION = 'TEAM_MEMBERS_INVITATION',
  PRODUCT_CREATION = 'PRODUCT_CREATION',
}

export interface OnboardingStep {
  id: number;
  process: OnboardingProcess;
  title: string;
  description: string;
  icon: React.ReactNode;
  action: string;
  path?: string;
}

export const onboardingProcesses = (org: BusinessProfileFull) => {
  return (org?.onboarding_status?.onboard_processes as string[]) ?? [];
};

// helper to format nicely
export const formatLabel = (val: string) =>
  val
    .split('-')
    .map((word) =>
      word.toUpperCase() === 'NIN'
        ? 'NIN'
        : word.charAt(0).toUpperCase() + word.slice(1),
    )
    .join(' ');

export const areAllOnboardingStepsPresent = (
  steps: OnboardingStep[],
  onboard_processes: BusinessProfileFull['onboarding_status']['onboard_processes'],
): boolean => {
  for (let i = 0; i < steps.length; i++) {
    if (!onboard_processes?.includes(steps[i].process)) {
      return false; // break immediately if not found
    }
  }
  return true; // all items are present
};

export const DEFAULT_CURRENCY = 'NGN';
export const DEFAULT_COUNTRY = 'NG';

export const isBusiness = (role: SystemRole) => {
  return [SystemRole.BUSINESS_SUPER_ADMIN, SystemRole.BUSINESS_ADMIN].includes(
    role,
  );
};

export const reorderWallets = (wallets: BusinessWallet[]) => {
  if (!Array.isArray(wallets)) return [];

  // Make a copy before sorting (to avoid mutating frozen Redux/React Query state)
  return [...wallets].sort((a, b) => {
    if (a.currency === 'NGN') return -1;
    if (b.currency === 'NGN') return 1;
    return 0;
  });
};

// Complete list of countries with dial codes and flags
export const countries = [
  { code: 'US', name: 'United States', dialCode: '+1', flag: '🇺🇸' },
  { code: 'GB', name: 'United Kingdom', dialCode: '+44', flag: '🇬🇧' },
  { code: 'CA', name: 'Canada', dialCode: '+1', flag: '🇨🇦' },
  { code: 'AU', name: 'Australia', dialCode: '+61', flag: '🇦🇺' },
  { code: 'IN', name: 'India', dialCode: '+91', flag: '🇮🇳' },
  { code: 'AF', name: 'Afghanistan', dialCode: '+93', flag: '🇦🇫' },
  { code: 'AL', name: 'Albania', dialCode: '+355', flag: '🇦🇱' },
  { code: 'DZ', name: 'Algeria', dialCode: '+213', flag: '🇩🇿' },
  { code: 'AS', name: 'American Samoa', dialCode: '+1684', flag: '🇦🇸' },
  { code: 'AD', name: 'Andorra', dialCode: '+376', flag: '🇦🇩' },
  { code: 'AO', name: 'Angola', dialCode: '+244', flag: '🇦🇴' },
  { code: 'AI', name: 'Anguilla', dialCode: '+1264', flag: '🇦🇮' },
  { code: 'AQ', name: 'Antarctica', dialCode: '+672', flag: '🇦🇶' },
  { code: 'AG', name: 'Antigua and Barbuda', dialCode: '+1268', flag: '🇦🇬' },
  { code: 'AR', name: 'Argentina', dialCode: '+54', flag: '🇦🇷' },
  { code: 'AM', name: 'Armenia', dialCode: '+374', flag: '🇦🇲' },
  { code: 'AW', name: 'Aruba', dialCode: '+297', flag: '🇦🇼' },
  { code: 'AC', name: 'Ascension Island', dialCode: '+247', flag: '🇦🇨' },
  { code: 'AT', name: 'Austria', dialCode: '+43', flag: '🇦🇹' },
  { code: 'AZ', name: 'Azerbaijan', dialCode: '+994', flag: '🇦🇿' },
  { code: 'BS', name: 'Bahamas', dialCode: '+1242', flag: '🇧🇸' },
  { code: 'BH', name: 'Bahrain', dialCode: '+973', flag: '🇧🇭' },
  { code: 'BD', name: 'Bangladesh', dialCode: '+880', flag: '🇧🇩' },
  { code: 'BB', name: 'Barbados', dialCode: '+1246', flag: '🇧🇧' },
  { code: 'BY', name: 'Belarus', dialCode: '+375', flag: '🇧🇾' },
  { code: 'BE', name: 'Belgium', dialCode: '+32', flag: '🇧🇪' },
  { code: 'BZ', name: 'Belize', dialCode: '+501', flag: '🇧🇿' },
  { code: 'BJ', name: 'Benin', dialCode: '+229', flag: '🇧🇯' },
  { code: 'BM', name: 'Bermuda', dialCode: '+1441', flag: '🇧🇲' },
  { code: 'BT', name: 'Bhutan', dialCode: '+975', flag: '🇧🇹' },
  { code: 'BO', name: 'Bolivia', dialCode: '+591', flag: '🇧🇴' },
  { code: 'BA', name: 'Bosnia and Herzegovina', dialCode: '+387', flag: '🇧🇦' },
  { code: 'BW', name: 'Botswana', dialCode: '+267', flag: '🇧🇼' },
  { code: 'BR', name: 'Brazil', dialCode: '+55', flag: '🇧🇷' },
  {
    code: 'IO',
    name: 'British Indian Ocean Territory',
    dialCode: '+246',
    flag: '🇮🇴',
  },
  { code: 'VG', name: 'British Virgin Islands', dialCode: '+1284', flag: '🇻🇬' },
  { code: 'BN', name: 'Brunei', dialCode: '+673', flag: '🇧🇳' },
  { code: 'BG', name: 'Bulgaria', dialCode: '+359', flag: '🇧🇬' },
  { code: 'BF', name: 'Burkina Faso', dialCode: '+226', flag: '🇧🇫' },
  { code: 'BI', name: 'Burundi', dialCode: '+257', flag: '🇧🇮' },
  { code: 'KH', name: 'Cambodia', dialCode: '+855', flag: '🇰🇭' },
  { code: 'CM', name: 'Cameroon', dialCode: '+237', flag: '🇨🇲' },
  { code: 'CV', name: 'Cape Verde', dialCode: '+238', flag: '🇨🇻' },
  { code: 'KY', name: 'Cayman Islands', dialCode: '+1345', flag: '🇰🇾' },
  {
    code: 'CF',
    name: 'Central African Republic',
    dialCode: '+236',
    flag: '🇨🇫',
  },
  { code: 'TD', name: 'Chad', dialCode: '+235', flag: '🇹🇩' },
  { code: 'CL', name: 'Chile', dialCode: '+56', flag: '🇨🇱' },
  { code: 'CN', name: 'China', dialCode: '+86', flag: '🇨🇳' },
  { code: 'CX', name: 'Christmas Island', dialCode: '+61', flag: '🇨🇽' },
  { code: 'CC', name: 'Cocos Islands', dialCode: '+61', flag: '🇨🇨' },
  { code: 'CO', name: 'Colombia', dialCode: '+57', flag: '🇨🇴' },
  { code: 'KM', name: 'Comoros', dialCode: '+269', flag: '🇰🇲' },
  { code: 'CD', name: 'Congo', dialCode: '+243', flag: '🇨🇩' },
  { code: 'CK', name: 'Cook Islands', dialCode: '+682', flag: '🇨🇰' },
  { code: 'CR', name: 'Costa Rica', dialCode: '+506', flag: '🇨🇷' },
  { code: 'HR', name: 'Croatia', dialCode: '+385', flag: '🇭🇷' },
  { code: 'CU', name: 'Cuba', dialCode: '+53', flag: '🇨🇺' },
  { code: 'CW', name: 'Curaçao', dialCode: '+599', flag: '🇨🇼' },
  { code: 'CY', name: 'Cyprus', dialCode: '+357', flag: '🇨🇾' },
  { code: 'CZ', name: 'Czech Republic', dialCode: '+420', flag: '🇨🇿' },
  { code: 'DK', name: 'Denmark', dialCode: '+45', flag: '🇩🇰' },
  { code: 'DJ', name: 'Djibouti', dialCode: '+253', flag: '🇩🇯' },
  { code: 'DM', name: 'Dominica', dialCode: '+1767', flag: '🇩🇲' },
  { code: 'DO', name: 'Dominican Republic', dialCode: '+1', flag: '🇩🇴' },
  { code: 'EC', name: 'Ecuador', dialCode: '+593', flag: '🇪🇨' },
  { code: 'EG', name: 'Egypt', dialCode: '+20', flag: '🇪🇬' },
  { code: 'SV', name: 'El Salvador', dialCode: '+503', flag: '🇸🇻' },
  { code: 'GQ', name: 'Equatorial Guinea', dialCode: '+240', flag: '🇬🇶' },
  { code: 'ER', name: 'Eritrea', dialCode: '+291', flag: '🇪🇷' },
  { code: 'EE', name: 'Estonia', dialCode: '+372', flag: '🇪🇪' },
  { code: 'SZ', name: 'Eswatini', dialCode: '+268', flag: '🇸🇿' },
  { code: 'ET', name: 'Ethiopia', dialCode: '+251', flag: '🇪🇹' },
  { code: 'FK', name: 'Falkland Islands', dialCode: '+500', flag: '🇫🇰' },
  { code: 'FO', name: 'Faroe Islands', dialCode: '+298', flag: '🇫🇴' },
  { code: 'FJ', name: 'Fiji', dialCode: '+679', flag: '🇫🇯' },
  { code: 'FI', name: 'Finland', dialCode: '+358', flag: '🇫🇮' },
  { code: 'FR', name: 'France', dialCode: '+33', flag: '🇫🇷' },
  { code: 'GF', name: 'French Guiana', dialCode: '+594', flag: '🇬🇫' },
  { code: 'PF', name: 'French Polynesia', dialCode: '+689', flag: '🇵🇫' },
  { code: 'GA', name: 'Gabon', dialCode: '+241', flag: '🇬🇦' },
  { code: 'GM', name: 'Gambia', dialCode: '+220', flag: '🇬🇲' },
  { code: 'GE', name: 'Georgia', dialCode: '+995', flag: '🇬🇪' },
  { code: 'DE', name: 'Germany', dialCode: '+49', flag: '🇩🇪' },
  { code: 'GH', name: 'Ghana', dialCode: '+233', flag: '🇬🇭' },
  { code: 'GI', name: 'Gibraltar', dialCode: '+350', flag: '🇬🇮' },
  { code: 'GR', name: 'Greece', dialCode: '+30', flag: '🇬🇷' },
  { code: 'GL', name: 'Greenland', dialCode: '+299', flag: '🇬🇱' },
  { code: 'GD', name: 'Grenada', dialCode: '+1473', flag: '🇬🇩' },
  { code: 'GP', name: 'Guadeloupe', dialCode: '+590', flag: '🇬🇵' },
  { code: 'GU', name: 'Guam', dialCode: '+1671', flag: '🇬🇺' },
  { code: 'GT', name: 'Guatemala', dialCode: '+502', flag: '🇬🇹' },
  { code: 'GG', name: 'Guernsey', dialCode: '+44', flag: '🇬🇬' },
  { code: 'GN', name: 'Guinea', dialCode: '+224', flag: '🇬🇳' },
  { code: 'GW', name: 'Guinea-Bissau', dialCode: '+245', flag: '🇬🇼' },
  { code: 'GY', name: 'Guyana', dialCode: '+592', flag: '🇬🇾' },
  { code: 'HT', name: 'Haiti', dialCode: '+509', flag: '🇭🇹' },
  { code: 'HN', name: 'Honduras', dialCode: '+504', flag: '🇭🇳' },
  { code: 'HK', name: 'Hong Kong', dialCode: '+852', flag: '🇭🇰' },
  { code: 'HU', name: 'Hungary', dialCode: '+36', flag: '🇭🇺' },
  { code: 'IS', name: 'Iceland', dialCode: '+354', flag: '🇮🇸' },
  { code: 'IN', name: 'India', dialCode: '+91', flag: '🇮🇳' },
  { code: 'ID', name: 'Indonesia', dialCode: '+62', flag: '🇮🇩' },
  { code: 'IR', name: 'Iran', dialCode: '+98', flag: '🇮🇷' },
  { code: 'IQ', name: 'Iraq', dialCode: '+964', flag: '🇮🇶' },
  { code: 'IE', name: 'Ireland', dialCode: '+353', flag: '🇮🇪' },
  { code: 'IM', name: 'Isle of Man', dialCode: '+44', flag: '🇮🇲' },
  { code: 'IL', name: 'Israel', dialCode: '+972', flag: '🇮🇱' },
  { code: 'IT', name: 'Italy', dialCode: '+39', flag: '🇮🇹' },
  { code: 'CI', name: 'Ivory Coast', dialCode: '+225', flag: '🇨🇮' },
  { code: 'JM', name: 'Jamaica', dialCode: '+1876', flag: '🇯🇲' },
  { code: 'JP', name: 'Japan', dialCode: '+81', flag: '🇯🇵' },
  { code: 'JE', name: 'Jersey', dialCode: '+44', flag: '🇯🇪' },
  { code: 'JO', name: 'Jordan', dialCode: '+962', flag: '🇯🇴' },
  { code: 'KZ', name: 'Kazakhstan', dialCode: '+7', flag: '🇰🇿' },
  { code: 'KE', name: 'Kenya', dialCode: '+254', flag: '🇰🇪' },
  { code: 'KI', name: 'Kiribati', dialCode: '+686', flag: '🇰🇮' },
  { code: 'XK', name: 'Kosovo', dialCode: '+383', flag: '🇽🇰' },
  { code: 'KW', name: 'Kuwait', dialCode: '+965', flag: '🇰🇼' },
  { code: 'KG', name: 'Kyrgyzstan', dialCode: '+996', flag: '🇰🇬' },
  { code: 'LA', name: 'Laos', dialCode: '+856', flag: '🇱🇦' },
  { code: 'LV', name: 'Latvia', dialCode: '+371', flag: '🇱🇻' },
  { code: 'LB', name: 'Lebanon', dialCode: '+961', flag: '🇱🇧' },
  { code: 'LS', name: 'Lesotho', dialCode: '+266', flag: '🇱🇸' },
  { code: 'LR', name: 'Liberia', dialCode: '+231', flag: '🇱🇷' },
  { code: 'LY', name: 'Libya', dialCode: '+218', flag: '🇱🇾' },
  { code: 'LI', name: 'Liechtenstein', dialCode: '+423', flag: '🇱🇮' },
  { code: 'LT', name: 'Lithuania', dialCode: '+370', flag: '🇱🇹' },
  { code: 'LU', name: 'Luxembourg', dialCode: '+352', flag: '🇱🇺' },
  { code: 'MO', name: 'Macau', dialCode: '+853', flag: '🇲🇴' },
  { code: 'MG', name: 'Madagascar', dialCode: '+261', flag: '🇲🇬' },
  { code: 'MW', name: 'Malawi', dialCode: '+265', flag: '🇲🇼' },
  { code: 'MY', name: 'Malaysia', dialCode: '+60', flag: '🇲🇾' },
  { code: 'MV', name: 'Maldives', dialCode: '+960', flag: '🇲🇻' },
  { code: 'ML', name: 'Mali', dialCode: '+223', flag: '🇲🇱' },
  { code: 'MT', name: 'Malta', dialCode: '+356', flag: '🇲🇹' },
  { code: 'MH', name: 'Marshall Islands', dialCode: '+692', flag: '🇲🇭' },
  { code: 'MQ', name: 'Martinique', dialCode: '+596', flag: '🇲🇶' },
  { code: 'MR', name: 'Mauritania', dialCode: '+222', flag: '🇲🇷' },
  { code: 'MU', name: 'Mauritius', dialCode: '+230', flag: '🇲🇺' },
  { code: 'YT', name: 'Mayotte', dialCode: '+262', flag: '🇾🇹' },
  { code: 'MX', name: 'Mexico', dialCode: '+52', flag: '🇲🇽' },
  { code: 'FM', name: 'Micronesia', dialCode: '+691', flag: '🇫🇲' },
  { code: 'MD', name: 'Moldova', dialCode: '+373', flag: '🇲🇩' },
  { code: 'MC', name: 'Monaco', dialCode: '+377', flag: '🇲🇨' },
  { code: 'MN', name: 'Mongolia', dialCode: '+976', flag: '🇲🇳' },
  { code: 'ME', name: 'Montenegro', dialCode: '+382', flag: '🇲🇪' },
  { code: 'MS', name: 'Montserrat', dialCode: '+1664', flag: '🇲🇸' },
  { code: 'MA', name: 'Morocco', dialCode: '+212', flag: '🇲🇦' },
  { code: 'MZ', name: 'Mozambique', dialCode: '+258', flag: '🇲🇿' },
  { code: 'MM', name: 'Myanmar', dialCode: '+95', flag: '🇲🇲' },
  { code: 'NA', name: 'Namibia', dialCode: '+264', flag: '🇳🇦' },
  { code: 'NR', name: 'Nauru', dialCode: '+674', flag: '🇳🇷' },
  { code: 'NP', name: 'Nepal', dialCode: '+977', flag: '🇳🇵' },
  { code: 'NL', name: 'Netherlands', dialCode: '+31', flag: '🇳🇱' },
  { code: 'NC', name: 'New Caledonia', dialCode: '+687', flag: '🇳🇨' },
  { code: 'NZ', name: 'New Zealand', dialCode: '+64', flag: '🇳🇿' },
  { code: 'NI', name: 'Nicaragua', dialCode: '+505', flag: '🇳🇮' },
  { code: 'NE', name: 'Niger', dialCode: '+227', flag: '🇳🇪' },
  { code: 'NG', name: 'Nigeria', dialCode: '+234', flag: '🇳🇬' },
  { code: 'NU', name: 'Niue', dialCode: '+683', flag: '🇳🇺' },
  { code: 'NF', name: 'Norfolk Island', dialCode: '+672', flag: '🇳🇫' },
  { code: 'KP', name: 'North Korea', dialCode: '+850', flag: '🇰🇵' },
  { code: 'MK', name: 'North Macedonia', dialCode: '+389', flag: '🇲🇰' },
  {
    code: 'MP',
    name: 'Northern Mariana Islands',
    dialCode: '+1670',
    flag: '🇲🇵',
  },
  { code: 'NO', name: 'Norway', dialCode: '+47', flag: '🇳🇴' },
  { code: 'OM', name: 'Oman', dialCode: '+968', flag: '🇴🇲' },
  { code: 'PK', name: 'Pakistan', dialCode: '+92', flag: '🇵🇰' },
  { code: 'PW', name: 'Palau', dialCode: '+680', flag: '🇵🇼' },
  { code: 'PS', name: 'Palestine', dialCode: '+970', flag: '🇵🇸' },
  { code: 'PA', name: 'Panama', dialCode: '+507', flag: '🇵🇦' },
  { code: 'PG', name: 'Papua New Guinea', dialCode: '+675', flag: '🇵🇬' },
  { code: 'PY', name: 'Paraguay', dialCode: '+595', flag: '🇵🇾' },
  { code: 'PE', name: 'Peru', dialCode: '+51', flag: '🇵🇪' },
  { code: 'PH', name: 'Philippines', dialCode: '+63', flag: '🇵🇭' },
  { code: 'PL', name: 'Poland', dialCode: '+48', flag: '🇵🇱' },
  { code: 'PT', name: 'Portugal', dialCode: '+351', flag: '🇵🇹' },
  { code: 'PR', name: 'Puerto Rico', dialCode: '+1', flag: '🇵🇷' },
  { code: 'QA', name: 'Qatar', dialCode: '+974', flag: '🇶🇦' },
  { code: 'RE', name: 'Réunion', dialCode: '+262', flag: '🇷🇪' },
  { code: 'RO', name: 'Romania', dialCode: '+40', flag: '🇷🇴' },
  { code: 'RU', name: 'Russia', dialCode: '+7', flag: '🇷🇺' },
  { code: 'RW', name: 'Rwanda', dialCode: '+250', flag: '🇷🇼' },
  { code: 'WS', name: 'Samoa', dialCode: '+685', flag: '🇼🇸' },
  { code: 'SM', name: 'San Marino', dialCode: '+378', flag: '🇸🇲' },
  { code: 'ST', name: 'São Tomé & Príncipe', dialCode: '+239', flag: '🇸🇹' },
  { code: 'SA', name: 'Saudi Arabia', dialCode: '+966', flag: '🇸🇦' },
  { code: 'SN', name: 'Senegal', dialCode: '+221', flag: '🇸🇳' },
  { code: 'RS', name: 'Serbia', dialCode: '+381', flag: '🇷🇸' },
  { code: 'SC', name: 'Seychelles', dialCode: '+248', flag: '🇸🇨' },
  { code: 'SL', name: 'Sierra Leone', dialCode: '+232', flag: '🇸🇱' },
  { code: 'SG', name: 'Singapore', dialCode: '+65', flag: '🇸🇬' },
  { code: 'SX', name: 'Sint Maarten', dialCode: '+1721', flag: '🇸🇽' },
];

export enum SaveState {
  IDLE = 'idle',
  SAVING = 'saving',
  SAVED = 'saved',
}

export const allowedTypes = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/heic',
  'image/heif',
  'video/mp4',
  'video/quicktime', // .mov iPhone videos
  'video/webm',
];

export const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MBe
export const MAX_VIDEO_SIZE = 50 * 1024 * 1024; // 50eMB

export const BUSINESS_SIZES = [
  'Select Business Size',
  'Small',
  'Medium',
  'Large',
];

export const COUNTRIES = [
  'Select Country',
  'Afghanistan',
  'Albania',
  'Algeria',
  'Andorra',
  'Angola',
  'Antigua and Barbuda',
  'Argentina',
  'Armenia',
  'Australia',
  'Austria',
  'Azerbaijan',
  'Bahamas',
  'Bahrain',
  'Bangladesh',
  'Barbados',
  'Belarus',
  'Belgium',
  'Belize',
  'Benin',
  'Bhutan',
  'Bolivia',
  'Bosnia and Herzegovina',
  'Botswana',
  'Brazil',
  'Brunei',
  'Bulgaria',
  'Burkina Faso',
  'Burundi',
  'Cabo Verde',
  'Cambodia',
  'Cameroon',
  'Canada',
  'Central African Republic',
  'Chad',
  'Chile',
  'China',
  'Colombia',
  'Comoros',
  'Congo',
  'Costa Rica',
  'Croatia',
  'Cuba',
  'Cyprus',
  'Czech Republic',
  'Democratic Republic of the Congo',
  'Denmark',
  'Djibouti',
  'Dominica',
  'Dominican Republic',
  'Ecuador',
  'Egypt',
  'El Salvador',
  'Equatorial Guinea',
  'Eritrea',
  'Estonia',
  'Eswatini',
  'Ethiopia',
  'Fiji',
  'Finland',
  'France',
  'Gabon',
  'Gambia',
  'Georgia',
  'Germany',
  'Ghana',
  'Greece',
  'Grenada',
  'Guatemala',
  'Guinea',
  'Guinea-Bissau',
  'Guyana',
  'Haiti',
  'Honduras',
  'Hungary',
  'Iceland',
  'India',
  'Indonesia',
  'Iran',
  'Iraq',
  'Ireland',
  'Israel',
  'Italy',
  'Ivory Coast',
  'Jamaica',
  'Japan',
  'Jordan',
  'Kazakhstan',
  'Kenya',
  'Kiribati',
  'Kuwait',
  'Kyrgyzstan',
  'Laos',
  'Latvia',
  'Lebanon',
  'Lesotho',
  'Liberia',
  'Libya',
  'Liechtenstein',
  'Lithuania',
  'Luxembourg',
  'Madagascar',
  'Malawi',
  'Malaysia',
  'Maldives',
  'Mali',
  'Malta',
  'Marshall Islands',
  'Mauritania',
  'Mauritius',
  'Mexico',
  'Micronesia',
  'Moldova',
  'Monaco',
  'Mongolia',
  'Montenegro',
  'Morocco',
  'Mozambique',
  'Myanmar',
  'Namibia',
  'Nauru',
  'Nepal',
  'Netherlands',
  'New Zealand',
  'Nicaragua',
  'Niger',
  'Nigeria',
  'North Korea',
  'North Macedonia',
  'Norway',
  'Oman',
  'Pakistan',
  'Palau',
  'Palestine',
  'Panama',
  'Papua New Guinea',
  'Paraguay',
  'Peru',
  'Philippines',
  'Poland',
  'Portugal',
  'Qatar',
  'Romania',
  'Russia',
  'Rwanda',
  'Saint Kitts and Nevis',
  'Saint Lucia',
  'Saint Vincent and the Grenadines',
  'Samoa',
  'San Marino',
  'Sao Tome and Principe',
  'Saudi Arabia',
  'Senegal',
  'Serbia',
  'Seychelles',
  'Sierra Leone',
  'Singapore',
  'Slovakia',
  'Slovenia',
  'Solomon Islands',
  'Somalia',
  'South Africa',
  'South Korea',
  'South Sudan',
  'Spain',
  'Sri Lanka',
  'Sudan',
  'Suriname',
  'Sweden',
  'Switzerland',
  'Syria',
  'Taiwan',
  'Tajikistan',
  'Tanzania',
  'Thailand',
  'Timor-Leste',
  'Togo',
  'Tonga',
  'Trinidad and Tobago',
  'Tunisia',
  'Turkey',
  'Turkmenistan',
  'Tuvalu',
  'Uganda',
  'Ukraine',
  'United Arab Emirates',
  'United Kingdom',
  'United States',
  'Uruguay',
  'Uzbekistan',
  'Vanuatu',
  'Vatican City',
  'Venezuela',
  'Vietnam',
  'Yemen',
  'Zambia',
  'Zimbabwe',
];

export const INVOICE_ID_STORAGE_KEY = 'INVOICE_ID';

export const getInviteRole = ({
  businessInviteRole,
  superAdmin = false,
}: {
  businessInviteRole: BusinessInviteRole;
  superAdmin?: boolean;
}) => {
  return superAdmin
    ? 'Super Admin'
    : businessInviteRole === BusinessInviteRole.BUSINESS_ADMIN
      ? 'Admin'
      : 'Tutor';
};

export const listFromNumber = (num: number) => {
  return Array.from({ length: num }, (_, i) => i);
};

export const brandPreffix = 'TC';
