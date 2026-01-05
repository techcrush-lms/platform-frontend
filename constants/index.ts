import { SignupRole, SystemRole } from '@/lib/utils';
import {
  HiBell,
  HiBookOpen,
  HiChartPie,
  HiCollection,
  HiHome,
  HiLogout,
  HiOutlineQuestionMarkCircle,
  HiOutlineUpload,
  HiQuestionMarkCircle,
  HiShoppingCart,
  HiUpload,
  HiUserGroup,
  HiUsers,
  HiViewBoards,
} from 'react-icons/hi';
import {
  IoIosAdd,
  IoIosAnalytics,
  IoIosBook,
  IoIosBriefcase,
  IoIosCog,
  IoIosFilm,
  IoIosHelp,
  IoIosPower,
  IoIosPricetag,
  IoIosWallet,
  IoMdChatboxes,
} from 'react-icons/io';

export enum groups {
  ONE = 1,
  TWO = 2,
}

export const sidebarLinks = [
  {
    icon: HiHome,
    route: '/home',
    label: 'Overview',
    group: groups.ONE,
    roleOptions: [SystemRole.BUSINESS_SUPER_ADMIN, SystemRole.BUSINESS_ADMIN],
    activeIconColor: 'text-primary-main', // Add this
  },
  {
    icon: HiHome,
    route: '/dashboard/home',
    label: 'Overview',
    group: groups.ONE,
    roleOptions: [SystemRole.USER],
    activeIconColor: 'text-primary-main', // Add this
  },
  {
    icon: IoIosPricetag,
    route: '/products',
    label: 'Products',
    group: groups.ONE,
    roleOptions: [SystemRole.BUSINESS_SUPER_ADMIN, SystemRole.BUSINESS_ADMIN],
    activeIconColor: 'text-primary-main', // Add this
    items: [
      {
        route: '/products/courses',
        label: 'Courses',
      },
      {
        route: '/products/tickets',
        label: 'Event Tickets',
      },
      {
        route: '/products/subscriptions',
        label: 'Subscriptions',
      },
      {
        route: '/products/digital-products',
        label: 'Digital Products',
      },
      {
        route: '/products/physical-products',
        label: 'Physical Products',
      },
    ],
  },
  {
    icon: IoIosPricetag,
    route: '/dashboard/products',
    label: 'Products',
    group: groups.ONE,
    roleOptions: [SystemRole.USER],
    activeIconColor: 'text-primary-main', // Add this
    items: [
      {
        route: '/dashboard/products/courses',
        label: 'Courses',
      },
      {
        route: '/dashboard/products/tickets',
        label: 'Event Tickets',
      },
      {
        route: '/dashboard/products/subscription-plans',
        label: 'Subscription Plans',
      },
      {
        route: '/dashboard/products/digital-products',
        label: 'Digital Products',
      },
      // {
      //   route: '/dashboard/products/physical-products',
      //   label: 'Physical Products',
      // },
    ],
  },
  {
    icon: HiShoppingCart,
    route: '/dashboard/cart',
    label: 'Cart',
    group: groups.ONE,
    roleOptions: [SystemRole.USER],
    activeIconColor: 'text-primary-main', // Add this
  },
  {
    icon: HiUsers,
    route: '/customers',
    label: 'Client Management',
    group: groups.ONE,
    roleOptions: [SystemRole.BUSINESS_SUPER_ADMIN, SystemRole.BUSINESS_ADMIN],
    activeIconColor: 'text-primary-main', // Add this
  },
  {
    icon: HiUserGroup,
    route: '/team',
    label: 'Team',
    group: groups.ONE,
    roleOptions: [SystemRole.BUSINESS_SUPER_ADMIN],
    activeIconColor: 'text-primary-main', // Add this
  },
  {
    icon: HiBell,
    route: '/campaigns/email',
    label: 'Campaigns',
    group: groups.TWO,
    roleOptions: [SystemRole.BUSINESS_SUPER_ADMIN, SystemRole.BUSINESS_ADMIN],
    items: [
      {
        route: '/campaigns/email',
        label: 'Email',
      },
      {
        route: '/campaigns/whatsapp',
        label: 'Whatsapp',
      },
    ],
  },
  // {
  //   icon: HiChartPie,
  //   route: '/reports',
  //   label: 'Reports',
  //   group: groups.ONE,
  //   roleOptions: [SystemRole.BUSINESS_SUPER_ADMIN],
  //   activeIconColor: 'text-primary-main', // Add this
  // },
  {
    icon: IoIosWallet,
    route: '/wallet',
    label: 'Wallet',
    group: groups.ONE,
    roleOptions: [SystemRole.BUSINESS_SUPER_ADMIN, SystemRole.BUSINESS_ADMIN],
    activeIconColor: 'text-primary-main', // Add this
  },
  {
    icon: IoIosPricetag,
    route: '/coupons',
    label: 'Coupons',
    group: groups.ONE,
    roleOptions: [SystemRole.BUSINESS_SUPER_ADMIN, SystemRole.BUSINESS_ADMIN],
    activeIconColor: 'text-primary-main', // Add this
  },
  {
    icon: IoIosAnalytics,
    route: '/payments',
    label: 'Payments',
    group: groups.ONE,
    roleOptions: [SystemRole.BUSINESS_SUPER_ADMIN, SystemRole.BUSINESS_ADMIN],
    activeIconColor: 'text-primary-main', // Add this
  },
  {
    icon: IoIosBook,
    route: '/invoices',
    label: 'Invoices',
    group: groups.ONE,
    roleOptions: [SystemRole.BUSINESS_SUPER_ADMIN, SystemRole.BUSINESS_ADMIN],
    activeIconColor: 'text-primary-main', // Add this
  },
  {
    icon: IoIosAnalytics,
    route: '/dashboard/orders',
    label: 'Orders',
    group: groups.ONE,
    roleOptions: [SystemRole.USER],
    activeIconColor: 'text-primary-main', // Add this
  },
  {
    icon: IoMdChatboxes,
    route: '/messages',
    label: 'Messages',
    group: groups.ONE,
    roleOptions: [SystemRole.BUSINESS_SUPER_ADMIN, SystemRole.BUSINESS_ADMIN],
    activeIconColor: 'text-primary-main', // Add this
  },
  {
    icon: IoMdChatboxes,
    route: '/dashboard/messages',
    label: 'Messages',
    group: groups.ONE,
    roleOptions: [SystemRole.USER],
    activeIconColor: 'text-primary-main', // Add this
  },

  {
    icon: IoIosCog,
    route: '/settings',
    label: 'Settings',
    group: groups.TWO,
    roleOptions: [SystemRole.BUSINESS_SUPER_ADMIN, SystemRole.BUSINESS_ADMIN],
    activeIconColor: 'text-primary-main', // Add this
  },
  {
    icon: IoIosCog,
    route: '/dashboard/settings',
    label: 'Settings',
    group: groups.TWO,
    roleOptions: [SystemRole.USER],
    activeIconColor: 'text-primary-main', // Add this
  },
  // {
  //   icon: HiOutlineQuestionMarkCircle,
  //   route: '/help',
  //   label: 'Help',
  //   group: groups.TWO,
  //   roleOptions: [SystemRole.BUSINESS_SUPER_ADMIN, SystemRole.BUSINESS_ADMIN],
  //   activeIconColor: 'text-primary-main', // Add this
  // },
];

export const dummyUsers = [
  {
    id: 1,
    firstname: 'Niel',
    lastname: 'Niel',
    username: 'Nielx',
    email: 'neil.sims@flowbite.com',
    phone: '+2348129027941',
    device: 'Android',
    country: 'United States',
    isActive: true,
    color: '#402000',
  },
  {
    id: 2,
    firstname: 'Roberta',
    lastname: 'Casas',
    username: 'Casa',
    email: 'roberta.casas@flowbite.com',
    phone: '+2349129027940',
    device: 'Android',
    country: 'Spain',
    isActive: false,
    color: '#125a0f',
  },
  {
    id: 3,
    firstname: 'Michael',
    lastname: 'Gough',
    username: 'Goug',
    email: 'michael.gough@flowbite.com',
    phone: '+2347089484822',
    device: 'iPhone',
    country: 'United Kingdom',
    isActive: true,
    color: '#0f2e5a',
  },
];

export const dummyUploads = [
  {
    id: 1,
    resourceType: 'image',
    format: 'png',
    folder: 'uploads/notification-svc',
    link: 'https://res.cloudinary.com/image/upload/test1.jpg',
  },
  {
    id: 2,
    resourceType: 'image',
    format: 'png',
    folder: 'uploads/notification-svc',
    link: 'https://res.cloudinary.com/image/upload/test2.jpg',
  },
  {
    id: 3,
    resourceType: 'image',
    format: 'png',
    folder: 'uploads/notification-svc',
    link: 'https://res.cloudinary.com/image/upload/test3.jpg',
  },
  {
    id: 4,
    resourceType: 'image',
    format: 'png',
    folder: 'uploads/notification-svc',
    link: 'https://res.cloudinary.com/image/upload/test4.jpg',
  },
  {
    id: 5,
    resourceType: 'image',
    format: 'png',
    folder: 'uploads/notification-svc',
    link: 'https://res.cloudinary.com/image/upload/test5.jpg',
  },
];

export const filterPeriods = [
  { slug: 'today', name: 'Today' },
  { slug: 'last_week', name: 'Last week' },
  { slug: 'last_month', name: 'Last month' },
  { slug: 'last_year', name: 'Last year' },
];

export const dummyProducts = [
  {
    id: '1a2b3c4d',
    name: 'Frontend Mastery',
    price: 15000,
    currency: 'NGN',
    organization: 'TechAcademy',
    type: 'Course',
    status: 'PUBLISHED',
  },
  {
    id: '2b3c4d5e',
    name: 'Backend Development Bootcamp',
    price: 25000,
    currency: 'NGN',
    organization: 'CodeHub',
    type: 'Course',
    status: 'DRAFT',
  },
  {
    id: '3c4d5e6f',
    name: 'Digital Marketing Summit',
    price: 10000,
    currency: 'NGN',
    organization: 'MarketPros',
    type: 'Ticket',
    status: 'ARCHIVED',
  },
  {
    id: '4d5e6f7g',
    name: 'Product Design Masterclass',
    price: 18000,
    currency: 'NGN',
    organization: 'DesignPro',
    type: 'Course',
    status: 'PUBLISHED',
  },
  {
    id: '5e6f7g8h',
    name: 'Tech Conference 2025',
    price: 12000,
    currency: 'NGN',
    organization: 'InnovateTech',
    type: 'Ticket',
    status: 'DRAFT',
  },
  {
    id: '6f7g8h9i',
    name: 'Blockchain & Web3 Workshop',
    price: 20000,
    currency: 'NGN',
    organization: 'CryptoLearn',
    type: 'Course',
    status: 'ARCHIVED',
  },
  {
    id: '7g8h9i0j',
    name: 'AI & Machine Learning Summit',
    price: 15000,
    currency: 'NGN',
    organization: 'DataGenius',
    type: 'Ticket',
    status: 'PUBLISHED',
  },
  {
    id: '8h9i0j1k',
    name: 'Cybersecurity Training',
    price: 22000,
    currency: 'NGN',
    organization: 'SecureNet',
    type: 'Course',
    status: 'DRAFT',
  },
];

export enum InvoiceStep {
  CUSTOMER = 'customer',
  DETAILS = 'details',
  PAYMENT = 'payment',
  PREVIEW = 'preview',
  SEND = 'send',
}

export const INVOICE_STEPS = [
  { key: InvoiceStep.CUSTOMER, label: 'Customer Information' },
  { key: InvoiceStep.DETAILS, label: 'Invoice Details' },
  { key: InvoiceStep.PAYMENT, label: 'Payment Methods' },
  { key: InvoiceStep.PREVIEW, label: 'Preview & Invoice' },
  { key: InvoiceStep.SEND, label: 'Send Invoice' },
];
