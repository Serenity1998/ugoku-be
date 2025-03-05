import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { string, z } from 'zod';

extendZodWithOpenApi(z);

export type SubscriptionType = z.infer<typeof SubscriptionSchema>;
export const SubscriptionSchema = z.object({
  customerId: z.string(),
  planId: z.string(),
  startDate: z.string(),
  endDate: z.string(),
});

export type StoreType = z.infer<typeof StoreZodSchema>;
export const StoreZodSchema = z.object({
  _id: z.string(),
  loginEmail: z.string(),
  storeName: z.string(),
  storePostcode: z.string(),
  storePrefectures: z.string(),
  storeCity: z.string(),
  storeTown: z.string(),
  storeBuilding: z.string(),
  storeOwnerName: z.string(),
  storeOwnerFurigana: z.string(),
  storePhone: z.string(),
  statusText: z.string(),
  storePrimary: z.boolean(),
  cardString: z.string().optional(),
});

export type CompanyType = z.infer<typeof CompanyZodSchema>;
export const CompanyZodSchema = z.object({
  companyName: z.string(),
  companyPostcode: z.string(),
  companyPrefectures: z.string(),
  companyCity: z.string(),
  companyTown: z.string(),
  companyBuilding: z.string(),
  companyPosition: z.string(),
  companyEstablished: z.string(),
  companyOwnerName: z.string(),
  companyOwnerFurigana: z.string(),
  companySecondOwnerName: z.string().optional(),
  companySecondOwnerFurigana: z.string().optional(),
  companyPhone: z.string(),
  companyAccountantPhone: z.string().optional(),
  companyTrialUsed: z.boolean(),
  companyPromoCode: z.string().optional(),
});

export type StoreStatusType = z.infer<typeof StoreStatusZodSchema>;
export const StoreStatusZodSchema = z.object({
  planStart: z.date(),
  planEnd: z.date(),
  videosCreated: z.number(),
  planVideos: z.number(),
  purchasedVideos: z.number(),
});

export type DistributorType = z.infer<typeof DistributorZodSchema>;
export const DistributorZodSchema = z.object({
  name: z.string(),
  displayName: z.string(),
  contactName: z.string(),
  email: z.string(),
  contactAddress: z.string(),
});

export type PlanType = z.infer<typeof PlanZodSchema>;
export const PlanZodSchema = z.object({
  name: z.string(),
  description: z.string(),
  videoLimit: z.number(),
  price: z.number(),
  type: z.string(),
  tags: z.array(z.string()),
  isTrial: z.boolean(),
});

export type ProductType = z.infer<typeof ProductZodSchema>;
export const ProductZodSchema = z.object({
  name: z.string(),
  description: z.string(),
  videos: z.number(),
  price: z.number(),
  tags: z.array(z.string()),
});

export type AlbumType = z.infer<typeof AlbumZodSchema>;
export const AlbumZodSchema = z.object({
  name: z.string(),
  albumDivision: z.number(),
  albumSubDivision: z.number(),
  albumAge: z.number(),
});

export type MediaType = z.infer<typeof MediaZodSchema>;
export const MediaZodSchema = z.object({
  mediaUrl: z.string(),
  mediaThumb: z.string(),
  fileName: z.string(),
});

export type NotificationType = z.infer<typeof NotificationZodSchema>;
export const NotificationZodSchema = z.object({
  title: z.string(),
  body: z.string(),
  all: z.boolean(),
  albumDivision: z.number().optional(),
  albumSubDivision: z.number().optional(),
  albumAge: z.number().optional(),
});
