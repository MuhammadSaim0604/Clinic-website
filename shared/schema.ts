import { z } from "zod";

export const UserSchema = z.object({
  id: z.string().optional(),
  username: z.string(),
  password: z.string(),
  role: z.enum(["admin", "user"]).default("user"),
});
export type User = z.infer<typeof UserSchema>;

export const BrandingSchema = z.object({
  logo_url: z.string().optional(),
  primary_color: z.string().optional(),
});

export const ClinicConfigSchema = z.object({
  id: z.string().optional(),
  clinic_type: z.string(),
  clinic_name: z.string(),
  branding: BrandingSchema.optional(),
  media: z
    .object({
      hero_image: z.string().optional(),
      gallery_images: z.array(z.string()).optional(),
    })
    .optional(),
  // Hero text shown on the landing page
  hero_heading: z.string().optional(),
  hero_subtext: z.string().optional(),
  doctors: z
    .array(
      z.object({
        id: z.string(),
        name: z.string(),
        specialty: z.string().optional(),
        bio: z.string().optional(),
        photo_url: z.string().optional(),
        qualifications: z.string().optional(),
        experience: z.string().optional(),
        full_bio: z.string().optional(),
        education: z.array(z.string()).optional(),
        languages: z.array(z.string()).optional(),
        service_ids: z.array(z.string()).optional(),
      }),
    )
    .optional(),
  services: z
    .array(
      z.object({
        id: z.string(),
        name: z.string(),
        description: z.string().optional(),
        price: z.string().optional(),
        duration: z.string().optional(),
        category: z.string().optional(),
        image_url: z.string().optional(),
      }),
    )
    .optional(),
  branches: z
    .array(
      z.object({
        id: z.string(),
        name: z.string(),
        address: z.string().optional(),
      }),
    )
    .optional(),
  appointment: z
    .object({
      enable_online_booking: z.boolean().optional(),
    })
    .optional(),
  features: z
    .object({
      enable_blog: z.boolean(),
      enable_faq: z.boolean(),
    })
    .optional(),
  reviews: z
    .array(
      z.object({
        id: z.string(),
        name: z.string(),
        rating: z.number().min(1).max(5),
        review: z.string(),
        profile_picture: z.string().optional(),
        time_ago: z.string().optional(),
      }),
    )
    .optional(),
  seo: z
    .object({
      meta_title: z.string().optional(),
      meta_description: z.string().optional(),
    })
    .optional(),
  faq: z
    .array(
      z.object({
        id: z.string(),
        question: z.string(),
        answer: z.string(),
      }),
    )
    .optional(),
  policies: z
    .object({
      privacy_policy: z.string().optional(),
      terms_conditions: z.string().optional(),
    })
    .optional(),
  contact: z
    .object({
      email: z.string().optional(),
      phone: z.string().optional(),
      address: z.string().optional(),
      google_maps_embed: z.string().optional(),
      opening_hours: z
        .array(
          z.object({
            days: z.string(),
            hours: z.string(),
            is_closed: z.boolean().optional(),
          }),
        )
        .optional(),
    })
    .optional(),
  footer_description: z.string().optional(),
  social: z
    .object({
      twitter: z.string().optional(),
      instagram: z.string().optional(),
      facebook: z.string().optional(),
      tiktok: z.string().optional(),
      youtube: z.string().optional(),
    })
    .optional(),
  // removed draft/publish and versioning — single config document is used
});

export type ClinicConfig = z.infer<typeof ClinicConfigSchema>;

export const LoginSchema = z.object({
  username: z.string(),
  password: z.string(),
});
export type LoginRequest = z.infer<typeof LoginSchema>;

export const insertUserSchema = UserSchema;
export type InsertUser = User;

export const AppointmentSchema = z.object({
  id: z.string().optional(),
  clinic_id: z.string(),
  name: z.string(),
  email: z.string(),
  service: z.string(),
  date: z.string(),
  status: z.string().default("pending"),
  custom_fields: z.record(z.any()).optional(),
  createdAt: z.string().optional(),
});
export type Appointment = z.infer<typeof AppointmentSchema>;

export const ContactMessageSchema = z.object({
  id: z.string().optional(),
  clinic_id: z.string(),
  name: z.string(),
  email: z.string(),
  message: z.string(),
  status: z.string().default("pending"),
  createdAt: z.string().optional(),
});
export type ContactMessage = z.infer<typeof ContactMessageSchema>;

export const BlogSchema = z.object({
  id: z.string().optional(),
  title: z.string(),
  slug: z.string(),
  content: z.string(),
  thumbnail: z.string().optional(),
  author: z.string().optional(),
  category: z.string().optional(),
  published: z.boolean().default(false),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});
export type Blog = z.infer<typeof BlogSchema>;
