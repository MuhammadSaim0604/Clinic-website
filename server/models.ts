import mongoose, { Schema } from "mongoose";

const UserSchema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["admin", "user"], default: "user" },
});

export const UserModel =
  mongoose.models.User || mongoose.model("User", UserSchema);

const ClinicConfigSchema = new Schema(
  {
    clinic_type: { type: String, required: true },
    clinic_name: { type: String, required: true },
    branding: {
      logo_url: String,
      primary_color: String,
    },
    media: {
      hero_image: String,
      gallery_images: [String],
    },
    footer_description: String,
    hero_heading: String,
    hero_subtext: String,
    doctors: [
      {
        id: String,
        name: String,
        specialty: String,
        bio: String,
        photo_url: String,
        qualifications: String,
        experience: String,
        full_bio: String,
        education: [String],
        languages: [String],
        service_ids: [String],
      },
    ],
    services: [
      {
        id: String,
        name: String,
        description: String,
        price: String, // Added missing field
        duration: String, // Added missing field
        category: String,
        image_url: String, // Added missing field
      },
    ],
    branches: [
      {
        id: String,
        name: String,
        address: String,
      },
    ],
    appointment: {
      enable_online_booking: Boolean,
    },
    features: {
      enable_blog: Boolean,
      enable_faq: Boolean,
    },
    seo: {
      meta_title: String,
      meta_description: String,
    },
    contact: {
      email: String,
      phone: String,
      address: String,
      google_maps_embed: String,
      opening_hours: [
        {
          days: String,
          hours: String,
          is_closed: Boolean,
        },
      ],
    },
    // Add social media fields if they're part of your schema
    social: {
      twitter: String,
      instagram: String,
      facebook: String,
      tiktok: String,
      youtube: String,
    },
    faq: [
      {
        id: String,
        question: String,
        answer: String,
      },
    ],
    reviews: [
      {
        id: String,
        name: String,
        rating: Number,
        review: String,
        profile_picture: String,
        time_ago: String,
      },
    ],
    policies: {
      privacy_policy: String,
      terms_conditions: String,
    },
  },
  { timestamps: true },
);

export const ClinicConfigModel =
  mongoose.models.ClinicConfig ||
  mongoose.model("ClinicConfig", ClinicConfigSchema);

const BlogSchema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    content: { type: String, required: true },
    thumbnail: String,
    author: String,
    category: String,
  },
  { timestamps: true },
);

export const BlogModel =
  mongoose.models.Blog || mongoose.model("Blog", BlogSchema);

const AppointmentSchema = new Schema(
  {
    clinic_id: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    service: String,
    date: String,
    status: { type: String, default: "pending" },
    custom_fields: Schema.Types.Mixed,
  },
  { timestamps: true },
);

export const AppointmentModel =
  mongoose.models.Appointment ||
  mongoose.model("Appointment", AppointmentSchema);

const ContactMessageSchema = new Schema(
  {
    clinic_id: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required: true },
    status: { type: String, default: "pending" },
  },
  { timestamps: true },
);

export const ContactMessageModel =
  mongoose.models.ContactMessage ||
  mongoose.model("ContactMessage", ContactMessageSchema);

const UploadedImageSchema = new Schema(
  {
    filename: { type: String, required: true },
    path: { type: String, required: true },
    originalName: String,
  },
  { timestamps: true },
);

export const UploadedImageModel =
  mongoose.models.UploadedImage ||
  mongoose.model("UploadedImage", UploadedImageSchema);
