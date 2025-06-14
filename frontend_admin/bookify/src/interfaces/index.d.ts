import type { Dayjs } from "dayjs";

export interface IOrderChart {
  count: number;
  status:
    | "waiting"
    | "ready"
    | "on the way"
    | "delivered"
    | "could not be delivered";
}

export interface IOrderTotalCount {
  total: number;
  totalDelivered: number;
}

export interface ISalesChart {
  date: string;
  title?: "Order Count" | "Order Amount";
  value: number;
}

// export interface IOrderStatus {
//   id: number;
//   text: "Pending" | "Ready" | "On The Way" | "Delivered" | "Cancelled";
// }

export interface IIdentity {
  id: number;
  name: string;
  avatar: string;
}

export interface IFile {
  name: string;
  percent: number;
  size: number;
  status: "error" | "success" | "done" | "uploading" | "removed";
  type: string;
  uid: string;
  url: string;
}

export interface IEvent {
  date: string;
  status: string;
}

export interface IStore {
  id: number;
  title: string;
  isActive: boolean;
  createdAt: string;
  gsm: string;
  email: string;
  address: IAddress;
  products: IProduct[];
}

export interface ICourierStatus {
  id: number;
  text: "Available" | "Offline" | "On delivery";
}

export interface ICourier {
  id: number;
  name: string;
  surname: string;
  email: string;
  gender: string;
  gsm: string;
  createdAt: string;
  accountNumber: string;
  licensePlate: string;
  address: string;
  avatar: IFile[];
  store: IStore;
  status: ICourierStatus;
  vehicle: IVehicle;
}

// export interface IOrder {
//   id: number;
//   user: IUser;
//   createdAt: string;
//   products: IProduct[];
//   status: IOrderStatus;
//   adress: IAddress;
//   store: IStore;
//   courier: ICourier;
//   events: IEvent[];
//   orderNumber: number;
//   amount: number;
// }

export interface IProduct {
  id: number;
  name: string;
  isActive: boolean;
  description: string;
  images: (IFile & { thumbnailUrl?: string })[];
  createdAt: string;
  price: number;
  category: {
    id: number;
    title: string;
  };
  stock: number;
}

export interface IBook {
  id: string;
  title: string;
  authors: string[];
  description: string;
  price: number;
  originalPrice: number;
  condition: string;
  stock: number;
  /** the raw IDs, used for filtering */
  categoryIds: string[];
  /** human-readable names, used for display */
  categoryNames: string[];
  images: IImage[];
  averageRating: number;
  ratingCount: number;
  totalRating: number;
}

export interface ICategory {
  id: string;
  /** matches `Category.name` on the server */
  name: string;
}

export interface IOrderFilterVariables {
  q?: string;
  store?: string;
  user?: string;
  createdAt?: [Dayjs, Dayjs];
  status?: string;
}

export interface IUserFilterVariables {
  q: string;
  status: boolean;
  createdAt: [Dayjs, Dayjs];
  gender: string;
  isActive: boolean;
}

// export interface IReview {
//   id: number;
//   order: IOrder;
//   user: IUser;
//   star: number;
//   createDate: string;
//   status: "pending" | "approved" | "rejected";
//   comment: string[];
// }

export type IVehicle = {
  model: string;
  vehicleType: string;
  engineSize: number;
  color: string;
  year: number;
  id: number;
};

export interface ITrendingProducts {
  id: number;
  product: IProduct;
  orderCount: number;
}

export interface IImage {
  url: string;
  /** optional thumbnail variant (e.g. smaller size) */
  thumbnailUrl?: string;
  /** name or alt text for the image */
  name?: string;
  alt?: string;
}

// base
// export interface IAddress {
//   text: string;
//   coordinate: [number, number];
// }
// export interface IUser {
//   id: number;
//   firstName: string;
//   lastName: string;
//   fullName: string;
//   gender: string;
//   gsm: string;
//   createdAt: string;
//   isActive: boolean;
//   avatar: IFile[];
//   addresses: IAddress[];
// }

// bookify
export interface IAddress {
  street: string;
  city: string;
  state?: string;
  postalCode: string;
  country: string;
}

export type UserStatus = "ACTIVE" | "INACTIVE";

export interface IUser {
  id: string;
  firstName: string;
  lastName: string;
  profileAvatar: string;
  fullName: string;
  email: string;
  phone: string;
  address: IAddress;
  role: string;
  status: UserStatus;
  verified: boolean;
  /** list of favorite book IDs */
  favorites: string[];
  /** ISO timestamp string */
  createdAt: string;
  /** ISO timestamp string */
  updatedAt: string;
}

export type OrderStatusType =
  | "PENDING"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "COMPLETED"
  | "CANCELLED"
  | "REFUNDED";

export type TransactionStatus = "PENDING" | "SUCCESSFUL" | "FAILED";

export interface IOrderItem {
  bookId: string;
  title: string;
  price: number;
  quantity: number;
}

export interface ITransaction {
  transactionId: string;
  status: TransactionStatus;
  amount: number;
  rawResponse: string;
  createdAt: string; // ISO timestamp
}

export interface IPayment {
  method: string;
  transactions: ITransaction[];
}

export interface IOrder {
  id: string;
  userId: string;
  items: IOrderItem[];
  totalAmount: number;
  payment: IPayment;
  orderStatus: OrderStatusType;
  shippingInformation: IShippingInformation;
  addedAt: string; // ISO timestamp
  updatedAt: string; // ISO timestamp
  doneAt?: string; // ISO timestamp
}

export interface IShippingInformation {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  address: IAddress;
}

export type ReviewStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface IReview {
  id: string;
  bookTitle: string;
  orderId: string;
  userName: string;
  rating: number;
  subject: string;
  comment: string;
  status: ReviewStatus;
  addedAt: string;
  modifiedAt: string;
}

export interface BestSellerDTO {
  bookId: string;
  title: string;
  authors: string[];
  price: number;
  totalSold: number;
}

export interface BookQuantityDTO {
  bookId: string;
  title: string;
  totalQuantitySold: number;
}

export interface TopCategoryQuantityDTO {
  categoryId: string;
  categoryName: string;
  top10Books: BookQuantityDTO[];
}

export interface BookInLowStockDTO {
  id: string;
  title: string;
  stock: number;
}

export interface LoyalCustomerDTO {
  userId: string;
  fullName: string;
  email: string;
  phone: string;
  totalOrders: number;
  totalSpending: number;
  firstOrder: string; // ISO date string
  lastOrder: string;  // ISO date string
}

export interface TopAvgOrderValueUserDTO {
  userId: string;
  fullName: string;
  email: string;
  averageOrderValue: number;
}

