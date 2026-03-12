import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Plus,
  Trash2,
  Save,
  CheckCircle2,
  UploadCloud,
  Eye,
  EyeOff,
  Image as ImageIcon,
} from "lucide-react";
import { ClinicConfigSchema } from "@shared/schema";
import { useSaveClinic } from "@/hooks/use-clinic";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import JoditEditor from "jodit-react";
import parse from "html-react-parser";
import { useRef, useState } from "react";
import { ImageModal } from "@/components/clinic/ImageModal";

type ConfigFormValues = z.infer<typeof ClinicConfigSchema>;

interface ClinicConfigFormProps {
  initialData: ConfigFormValues;
}

const JODIT_CONFIG = {
  readonly: false,
  height: 250,
  toolbarSticky: true,
  buttons: [
    "bold",
    "italic",
    "underline",
    "strikethrough",
    "|",
    "heading",
    "paragraph",
    "|",
    "ul",
    "ol",
    "|",
    "link",
    "|",
    "undo",
    "redo",
  ],
  placeholder: "Enter content...",
};

export function ClinicConfigForm({ initialData }: ClinicConfigFormProps) {
  const save = useSaveClinic();
  const [faqPreviewIndex, setFaqPreviewIndex] = useState<number | null>(null);
  const [policyPreview, setPolicyPreview] = useState<
    "privacy" | "terms" | null
  >(null);
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [imageModalField, setImageModalField] = useState<string | null>(null);
  const faqEditorRefs = useRef<Record<number, any>>({});
  const privacyEditorRef = useRef<any>(null);
  const termsEditorRef = useRef<any>(null);

  const form = useForm<ConfigFormValues>({
    resolver: zodResolver(ClinicConfigSchema),
    defaultValues: initialData,
  });

  const {
    fields: serviceFields,
    append: appendService,
    remove: removeService,
  } = useFieldArray({
    control: form.control,
    name: "services",
  });

  const {
    fields: doctorFields,
    append: appendDoctor,
    remove: removeDoctor,
  } = useFieldArray({
    control: form.control,
    name: "doctors",
  });

  const {
    fields: branchFields,
    append: appendBranch,
    remove: removeBranch,
  } = useFieldArray({
    control: form.control,
    name: "branches",
  });

  const {
    fields: hourFields,
    append: appendHour,
    remove: removeHour,
  } = useFieldArray({
    control: form.control,
    name: "contact.opening_hours",
  });

  const {
    fields: faqFields,
    append: appendFaq,
    remove: removeFaq,
  } = useFieldArray({
    control: form.control,
    name: "faq",
  });

  const {
    fields: reviewsFields,
    append: appendReview,
    remove: removeReview,
  } = useFieldArray({
    control: form.control,
    name: "reviews",
  });

  // Handle gallery images (primitive array)
  const gallery =
    (form.watch("media.gallery_images") as string[] | undefined) || [];
  const appendGallery = (val = "") => {
    form.setValue("media.gallery_images", [...gallery, val]);
  };
  const removeGallery = (index: number) => {
    const arr = [...gallery];
    arr.splice(index, 1);
    form.setValue("media.gallery_images", arr);
  };

  const services = form.watch("services") || [];

  const onSubmit = (data: ConfigFormValues) => {
    save.mutate({ config: data });
  };

  const handleImageSelect = (imagePath: string | string[]) => {
    if (imageModalField === "gallery_add") {
      if (Array.isArray(imagePath)) {
        // Add all images at once to avoid React batching issues
        form.setValue("media.gallery_images", [...gallery, ...imagePath]);
      } else {
        appendGallery(imagePath);
      }
    } else if (imageModalField && typeof imagePath === "string") {
      form.setValue(imageModalField as any, imagePath);
    }
    setImageModalOpen(false);
    setImageModalField(null);
  };

  const openImageModal = (field: string) => {
    setImageModalField(field);
    setImageModalOpen(true);
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 pb-20">
      <div className="flex items-center justify-between bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-slate-800">
            Website Configuration
          </h2>
          <p className="text-sm text-slate-500">
            Manage your clinic's public website content and settings.
          </p>
        </div>
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={save.isPending}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 font-semibold text-slate-700 transition-all hover:shadow-md disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {save.isPending ? "Saving..." : "Save"}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <Tabs defaultValue="general" className="w-full">
          <div className="border-b border-slate-200 px-6 pt-4">
            <TabsList className="bg-slate-100/50 p-1 rounded-xl mb-4">
              <TabsTrigger
                value="general"
                className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm"
              >
                General
              </TabsTrigger>
              <TabsTrigger
                value="services"
                className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm"
              >
                Services
              </TabsTrigger>
              <TabsTrigger
                value="doctors"
                className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm"
              >
                Doctors
              </TabsTrigger>
              <TabsTrigger
                value="contact"
                className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm"
              >
                Contact & Location
              </TabsTrigger>
              <TabsTrigger
                value="media"
                className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm"
              >
                Media
              </TabsTrigger>
              <TabsTrigger
                value="faq"
                className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm"
              >
                FAQ
              </TabsTrigger>
              <TabsTrigger
                value="policies"
                className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm"
              >
                Policies
              </TabsTrigger>
              <TabsTrigger
                value="reviews"
                className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm"
              >
                Reviews
              </TabsTrigger>
              <TabsTrigger
                value="social"
                className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm"
              >
                Social
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="p-8">
            {/* General Tab */}
            <TabsContent value="general" className="space-y-6 m-0">
              <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Clinic Name
                    </label>
                    <input
                      {...form.register("clinic_name")}
                      placeholder="HealthCare Clinic"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Clinic Type
                    </label>
                    <input
                      {...form.register("clinic_type")}
                      readOnly
                      placeholder="Medical Center"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-100 text-slate-500 cursor-not-allowed outline-none"
                    />
                    <p className="text-xs text-slate-400">
                      Locked to {initialData.clinic_type} based on
                      environment/license.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Logo Image
                    </label>
                    <div className="flex flex-col gap-3">
                      <button
                        type="button"
                        onClick={() => openImageModal("branding.logo_url")}
                        className="px-4 py-3 rounded-xl border-2 border-dashed border-slate-200 hover:border-primary text-slate-600 hover:text-primary transition-all font-medium flex items-center justify-center gap-2"
                      >
                        <ImageIcon className="w-5 h-5" />
                        Select Image
                      </button>
                      {form.watch("branding.logo_url") && (
                        <div className="relative group w-32">
                          <img
                            src={form.watch("branding.logo_url")}
                            alt="Logo preview"
                            className="w-full h-auto object-contain rounded-lg border border-slate-200"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              form.setValue("branding.logo_url", "")
                            }
                            className="absolute inset-0 bg-red-500/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all rounded-lg"
                          >
                            <Trash2 className="w-5 h-5 text-white drop-shadow" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Primary Color
                    </label>
                    <input
                      {...form.register("branding.primary_color")}
                      placeholder="#0f766e"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      SEO Meta Title
                    </label>
                    <input
                      {...form.register("seo.meta_title")}
                      placeholder="Your Clinic Name - Best Healthcare Services"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      SEO Meta Description
                    </label>
                    <input
                      {...form.register("seo.meta_description")}
                      placeholder="Leading healthcare clinic with expert doctors..."
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-6 pt-4">
                  <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                    <Checkbox
                      checked={form.watch("features.enable_blog")}
                      onCheckedChange={(checked) =>
                        form.setValue("features.enable_blog", checked === true)
                      }
                    />
                    <span>Enable Blog</span>
                  </label>
                  <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                    <Checkbox
                      checked={form.watch("features.enable_faq")}
                      onCheckedChange={(checked) =>
                        form.setValue("features.enable_faq", checked === true)
                      }
                    />
                    <span>Enable FAQ</span>
                  </label>
                  <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                    <Checkbox
                      checked={form.watch("appointment.enable_online_booking")}
                      onCheckedChange={(checked) =>
                        form.setValue(
                          "appointment.enable_online_booking",
                          checked === true,
                        )
                      }
                    />
                    <span>Enable Online Booking</span>
                  </label>
                </div>

                <div className="space-y-4 pt-4 border-t border-slate-200">
                  <h3 className="font-bold text-slate-800">Footer Section</h3>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Footer Description
                    </label>
                    <textarea
                      {...form.register("footer_description")}
                      placeholder="Providing world-class medical care with compassion and expertise..."
                      rows={3}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none"
                    />
                    <p className="text-xs text-slate-400">
                      This text appears in the footer section of the website.
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Services Tab */}
            <TabsContent value="services" className="space-y-4 m-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {serviceFields.map((field, index) => (
                  <div
                    key={field.id}
                    className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-4 relative group hover:shadow-md transition-all"
                  >
                    <button
                      type="button"
                      onClick={() => removeService(index)}
                      className="absolute top-4 right-4 text-slate-300 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                    <div className="space-y-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                          Service Name
                        </label>
                        <input
                          {...form.register(`services.${index}.name`)}
                          placeholder="e.g. Dental Checkup"
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                          Service Image
                        </label>
                        <div className="flex items-center gap-4">
                          <button
                            type="button"
                            onClick={() =>
                              openImageModal(`services.${index}.image_url`)
                            }
                            className="flex-1 px-4 py-2.5 rounded-xl border-2 border-dashed border-slate-200 hover:border-primary text-slate-600 hover:text-primary transition-all font-medium flex items-center justify-center gap-2"
                          >
                            <ImageIcon className="w-4 h-4" />
                            Select Image
                          </button>
                          {form.watch(`services.${index}.image_url`) && (
                            <div className="relative group">
                              <img
                                src={form.watch(`services.${index}.image_url`)}
                                className="w-12 h-12 rounded-lg object-cover border border-slate-200"
                                alt=""
                              />
                              <button
                                type="button"
                                onClick={() =>
                                  form.setValue(
                                    `services.${index}.image_url`,
                                    "",
                                  )
                                }
                                className="absolute inset-0 bg-red-500/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all rounded-lg"
                              >
                                <Trash2 className="w-4 h-4 text-white" />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                            Category
                          </label>
                          <input
                            {...form.register(`services.${index}.category`)}
                            placeholder="General"
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                            Price
                          </label>
                          <input
                            {...form.register(`services.${index}.price`)}
                            placeholder="$100"
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                            Duration
                          </label>
                          <input
                            {...form.register(`services.${index}.duration`)}
                            placeholder="30 mins"
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                          />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                          Description
                        </label>
                        <textarea
                          {...form.register(`services.${index}.description`)}
                          placeholder="Describe the service..."
                          rows={3}
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={() =>
                  appendService({
                    id: `srv_${Date.now()}`,
                    name: "",
                    description: "",
                    price: "",
                    duration: "",
                    category: "",
                  })
                }
                className="w-full py-4 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 hover:text-primary hover:border-primary/50 hover:bg-primary/5 transition-all font-bold flex items-center justify-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Add New Service
              </button>
            </TabsContent>

            {/* Doctors Tab */}
            <TabsContent value="doctors" className="space-y-4 m-0">
              <div className="grid grid-cols-1 gap-6">
                {doctorFields.map((field, index) => (
                  <div
                    key={field.id}
                    className="p-8 bg-white rounded-[2rem] border border-slate-200 shadow-sm space-y-6 relative group hover:shadow-md transition-all"
                  >
                    <button
                      type="button"
                      onClick={() => removeDoctor(index)}
                      className="absolute top-6 right-6 text-slate-300 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-6 h-6" />
                    </button>

                    <div className="flex flex-col lg:flex-row gap-8">
                      {/* Doctor Basic Info */}
                      <div className="flex-1 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                              Doctor Name
                            </label>
                            <input
                              {...form.register(`doctors.${index}.name`)}
                              placeholder="Dr. Jane Smith"
                              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                              Specialty
                            </label>
                            <input
                              {...form.register(`doctors.${index}.specialty`)}
                              placeholder="Cardiologist"
                              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                              Qualifications
                            </label>
                            <input
                              {...form.register(
                                `doctors.${index}.qualifications`,
                              )}
                              placeholder="MBBS, MD - Cardiology"
                              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                              Experience
                            </label>
                            <input
                              {...form.register(`doctors.${index}.experience`)}
                              placeholder="10+ Years"
                              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                              Doctor Photo
                            </label>
                            <div className="flex items-center gap-4">
                              <button
                                type="button"
                                onClick={() =>
                                  openImageModal(`doctors.${index}.photo_url`)
                                }
                                className="flex-1 px-4 py-2.5 rounded-xl border-2 border-dashed border-slate-200 hover:border-primary text-slate-600 hover:text-primary transition-all font-medium flex items-center justify-center gap-2"
                              >
                                <ImageIcon className="w-4 h-4" />
                                Select Photo
                              </button>
                              {form.watch(`doctors.${index}.photo_url`) && (
                                <div className="relative group">
                                  <img
                                    src={form.watch(
                                      `doctors.${index}.photo_url`,
                                    )}
                                    className="w-12 h-12 rounded-full object-cover border border-slate-200"
                                    alt=""
                                  />
                                  <button
                                    type="button"
                                    onClick={() =>
                                      form.setValue(
                                        `doctors.${index}.photo_url`,
                                        "",
                                      )
                                    }
                                    className="absolute inset-0 bg-red-500/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all rounded-full"
                                  >
                                    <Trash2 className="w-4 h-4 text-white" />
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                            Short Bio
                          </label>
                          <textarea
                            {...form.register(`doctors.${index}.bio`)}
                            placeholder="A brief introduction..."
                            rows={2}
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                            Full Profile Description
                          </label>
                          <textarea
                            {...form.register(`doctors.${index}.full_bio`)}
                            placeholder="Detailed professional background..."
                            rows={3}
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                              Education (comma separated)
                            </label>
                            <input
                              value={
                                form
                                  .watch(`doctors.${index}.education`)
                                  ?.join(", ") || ""
                              }
                              onChange={(e) => {
                                const val = e.target.value
                                  .split(",")
                                  .map((s) => s.trim());
                                form.setValue(
                                  `doctors.${index}.education`,
                                  val,
                                );
                              }}
                              placeholder="Harvard Medical School, Stanford University"
                              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                              Languages (comma separated)
                            </label>
                            <input
                              value={
                                form
                                  .watch(`doctors.${index}.languages`)
                                  ?.join(", ") || ""
                              }
                              onChange={(e) => {
                                const val = e.target.value
                                  .split(",")
                                  .map((s) => s.trim());
                                form.setValue(
                                  `doctors.${index}.languages`,
                                  val,
                                );
                              }}
                              placeholder="English, Spanish, French"
                              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Service Selection */}
                      {services.length > 0 && (
                        <div className="w-full lg:w-72 bg-slate-50 rounded-2xl p-6 border border-slate-100">
                          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4 block">
                            Assigned Services
                          </label>
                          <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                            {services.map((service) => (
                              <label
                                key={service.id}
                                className="flex items-center gap-3 p-3 rounded-xl bg-white border border-slate-100 cursor-pointer hover:border-primary/30 transition-all group/label"
                              >
                                <div className="relative flex items-center justify-center">
                                  <input
                                    type="checkbox"
                                    className="peer appearance-none w-5 h-5 rounded-md border-2 border-slate-200 checked:bg-primary checked:border-primary transition-all cursor-pointer"
                                    checked={(
                                      form.watch(
                                        `doctors.${index}.service_ids`,
                                      ) || []
                                    ).includes(service.id)}
                                    onChange={(e) => {
                                      const current =
                                        form.getValues(
                                          `doctors.${index}.service_ids`,
                                        ) || [];
                                      if (e.target.checked) {
                                        form.setValue(
                                          `doctors.${index}.service_ids`,
                                          [...current, service.id],
                                        );
                                      } else {
                                        form.setValue(
                                          `doctors.${index}.service_ids`,
                                          current.filter(
                                            (id) => id !== service.id,
                                          ),
                                        );
                                      }
                                    }}
                                  />
                                  <CheckCircle2 className="w-3.5 h-3.5 text-white absolute opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" />
                                </div>
                                <span className="text-sm font-medium text-slate-600 group-hover/label:text-slate-900 transition-colors">
                                  {service.name}
                                </span>
                              </label>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={() =>
                  appendDoctor({
                    id: `doc_${Date.now()}`,
                    name: "",
                    specialty: "",
                    bio: "",
                    photo_url: "",
                    qualifications: "",
                    experience: "",
                    full_bio: "",
                    education: [],
                    languages: [],
                    service_ids: [],
                  })
                }
                className="w-full py-4 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 hover:text-primary hover:border-primary/50 hover:bg-primary/5 transition-all font-bold flex items-center justify-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Add New Doctor
              </button>
            </TabsContent>

            {/* Contact Tab */}
            <TabsContent value="contact" className="space-y-6 m-0">
              <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Email Address
                    </label>
                    <input
                      {...form.register("contact.email")}
                      placeholder="contact@clinic.com"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Phone Number
                    </label>
                    <input
                      {...form.register("contact.phone")}
                      placeholder="+1 (555) 000-0000"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Physical Address
                    </label>
                    <input
                      {...form.register("contact.address")}
                      placeholder="123 Medical Way, Health City"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Google Maps Embed URL
                    </label>
                    <input
                      {...form.register("contact.google_maps_embed")}
                      placeholder="https://www.google.com/maps/embed?pb=..."
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-slate-200">
                  <h3 className="font-bold text-slate-800">Opening Hours</h3>
                  <div className="space-y-3">
                    {hourFields.map((field, index) => (
                      <div key={field.id} className="flex gap-4 items-center">
                        <input
                          {...form.register(
                            `contact.opening_hours.${index}.days`,
                          )}
                          placeholder="Monday - Friday"
                          className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                        />
                        <input
                          {...form.register(
                            `contact.opening_hours.${index}.hours`,
                          )}
                          placeholder="8:00 AM - 6:00 PM"
                          className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                        />
                        <label className="flex items-center gap-2 text-sm">
                          <Checkbox
                            checked={form.watch(
                              `contact.opening_hours.${index}.is_closed`,
                            )}
                            onCheckedChange={(checked) =>
                              form.setValue(
                                `contact.opening_hours.${index}.is_closed`,
                                checked === true,
                              )
                            }
                          />
                          <span className="text-slate-600">Closed</span>
                        </label>
                        <button
                          type="button"
                          onClick={() => removeHour(index)}
                          className="text-red-500 p-2 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() =>
                        appendHour({ days: "", hours: "", is_closed: false })
                      }
                      className="text-primary text-sm font-bold flex items-center gap-1 hover:bg-primary/5 px-4 py-2 rounded-lg transition-colors"
                    >
                      <Plus className="w-4 h-4" /> Add Hour Entry
                    </button>
                  </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-slate-200">
                  <h3 className="font-bold text-slate-800">
                    Branches / Locations
                  </h3>
                  <div className="space-y-3">
                    {branchFields.map((field, index) => (
                      <div key={field.id} className="flex gap-4 items-center">
                        <input
                          {...form.register(`branches.${index}.name`)}
                          placeholder="Branch name"
                          className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                        />
                        <input
                          {...form.register(`branches.${index}.address`)}
                          placeholder="Address"
                          className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                        />
                        <button
                          type="button"
                          onClick={() => removeBranch(index)}
                          className="text-red-500 p-2 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() =>
                        appendBranch({
                          id: `br_${Date.now()}`,
                          name: "",
                          address: "",
                        })
                      }
                      className="text-primary text-sm font-bold flex items-center gap-1 hover:bg-primary/5 px-4 py-2 rounded-lg transition-colors"
                    >
                      <Plus className="w-4 h-4" /> Add Branch
                    </button>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Media Tab */}
            <TabsContent value="media" className="space-y-6 m-0">
              <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100 space-y-6">
                <div className="space-y-3">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Hero Background Image
                  </label>
                  <button
                    type="button"
                    onClick={() => openImageModal("media.hero_image")}
                    className="w-full px-6 py-4 rounded-xl border-2 border-dashed border-slate-200 hover:border-primary text-slate-600 hover:text-primary transition-all font-medium flex items-center justify-center gap-2"
                  >
                    <ImageIcon className="w-5 h-5" />
                    Select Hero Image
                  </button>
                  {form.watch("media.hero_image") && (
                    <div className="relative rounded-xl overflow-hidden border border-slate-200 group">
                      <img
                        src={form.watch("media.hero_image")}
                        alt="Hero preview"
                        className="w-full h-48 object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => form.setValue("media.hero_image", "")}
                        className="absolute inset-0 bg-red-500/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all"
                      >
                        <Trash2 className="w-6 h-6 text-white drop-shadow" />
                      </button>
                    </div>
                  )}
                  <p className="text-xs text-slate-500">
                    This image will be displayed on the public landing page hero
                    section.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Hero Heading
                  </label>
                  <input
                    {...form.register("hero_heading")}
                    placeholder="Modern Healthcare for Everyone"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Hero Subtext
                  </label>
                  <textarea
                    {...form.register("hero_subtext")}
                    placeholder="Experience the best medical care with our team of experts..."
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none"
                  />
                </div>

                <div className="space-y-4 pt-4 border-t border-slate-200">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-slate-800">Gallery Images</h3>
                    <span className="text-xs text-slate-500">
                      {gallery.length} images
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => openImageModal("gallery_add")}
                    className="w-full px-4 py-2.5 rounded-xl border-2 border-dashed border-primary text-primary hover:bg-primary/5 transition-all font-medium flex items-center justify-center gap-2"
                  >
                    <Plus className="w-4 h-4" /> Add to Gallery
                  </button>
                  {gallery.length > 0 && (
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                      {gallery.map((img, idx) => (
                        <div
                          key={idx}
                          className="relative group rounded-lg overflow-hidden border border-slate-200"
                        >
                          <img
                            src={img}
                            alt={`Gallery ${idx}`}
                            className="w-full aspect-square object-cover group-hover:opacity-80 transition-opacity"
                          />
                          <button
                            type="button"
                            onClick={() => removeGallery(idx)}
                            className="absolute inset-0 bg-red-500/0 group-hover:bg-red-500/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all"
                          >
                            <Trash2 className="w-5 h-5 text-white drop-shadow" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            {/* Social Tab */}
            <TabsContent value="faq" className="space-y-4 m-0 p-8">
              <div className="space-y-4">
                {faqFields.map((field, index) => (
                  <div
                    key={field.id}
                    className="p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-4 relative"
                  >
                    <button
                      type="button"
                      onClick={() => removeFaq(index)}
                      className="absolute top-4 right-4 text-slate-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <div className="space-y-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                          Question
                        </label>
                        <input
                          {...form.register(`faq.${index}.question`)}
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-primary/20 outline-none"
                          placeholder="e.g. How can I book an appointment?"
                        />
                      </div>
                      <div className="space-y-1.5 relative">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                            Answer (HTML Support)
                          </label>
                          <button
                            type="button"
                            onClick={() =>
                              setFaqPreviewIndex(
                                faqPreviewIndex === index ? null : index,
                              )
                            }
                            className="text-xs text-primary hover:text-primary/80 font-semibold flex items-center gap-1"
                          >
                            {faqPreviewIndex === index ? (
                              <EyeOff className="w-3 h-3" />
                            ) : (
                              <Eye className="w-3 h-3" />
                            )}
                            {faqPreviewIndex === index ? "Hide" : "Preview"}
                          </button>
                        </div>
                        <div className="border border-slate-200 rounded-xl overflow-hidden bg-white jodit-container">
                          <JoditEditor
                            ref={(el) => {
                              if (el) faqEditorRefs.current[index] = el;
                            }}
                            value={form.watch(`faq.${index}.answer`) || ""}
                            config={JODIT_CONFIG}
                            onBlur={(val) =>
                              form.setValue(`faq.${index}.answer`, val)
                            }
                            onChange={(val) =>
                              form.setValue(`faq.${index}.answer`, val)
                            }
                          />
                        </div>
                        {faqPreviewIndex === index && (
                          <div className="mt-3 p-4 bg-white border border-slate-200 rounded-xl prose prose-sm prose-slate max-w-none">
                            {parse(form.watch(`faq.${index}.answer`) || "")}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() =>
                    appendFaq({
                      id: `faq_${Date.now()}`,
                      question: "",
                      answer: "",
                    })
                  }
                  className="w-full py-4 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 hover:text-primary hover:border-primary transition-all font-bold flex items-center justify-center gap-2"
                >
                  <Plus className="w-5 h-5" /> Add FAQ Item
                </button>
              </div>
            </TabsContent>

            <TabsContent value="policies" className="space-y-6 m-0 p-8">
              <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100 space-y-8">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-bold text-slate-700">
                      Privacy Policy (HTML Support)
                    </label>
                    <button
                      type="button"
                      onClick={() =>
                        setPolicyPreview(
                          policyPreview === "privacy" ? null : "privacy",
                        )
                      }
                      className="text-xs text-primary hover:text-primary/80 font-semibold flex items-center gap-1"
                    >
                      {policyPreview === "privacy" ? (
                        <EyeOff className="w-3 h-3" />
                      ) : (
                        <Eye className="w-3 h-3" />
                      )}
                      {policyPreview === "privacy" ? "Hide" : "Preview"}
                    </button>
                  </div>
                  <div className="border border-slate-200 rounded-xl overflow-hidden bg-white jodit-container">
                    <JoditEditor
                      ref={privacyEditorRef}
                      value={form.watch("policies.privacy_policy") || ""}
                      config={JODIT_CONFIG}
                      onBlur={(val) =>
                        form.setValue("policies.privacy_policy", val)
                      }
                      onChange={(val) =>
                        form.setValue("policies.privacy_policy", val)
                      }
                    />
                  </div>
                  {policyPreview === "privacy" && (
                    <div className="mt-3 p-4 bg-white border border-slate-200 rounded-xl prose prose-sm prose-slate max-w-none">
                      {parse(form.watch("policies.privacy_policy") || "")}
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-bold text-slate-700">
                      Terms & Conditions (HTML Support)
                    </label>
                    <button
                      type="button"
                      onClick={() =>
                        setPolicyPreview(
                          policyPreview === "terms" ? null : "terms",
                        )
                      }
                      className="text-xs text-primary hover:text-primary/80 font-semibold flex items-center gap-1"
                    >
                      {policyPreview === "terms" ? (
                        <EyeOff className="w-3 h-3" />
                      ) : (
                        <Eye className="w-3 h-3" />
                      )}
                      {policyPreview === "terms" ? "Hide" : "Preview"}
                    </button>
                  </div>
                  <div className="border border-slate-200 rounded-xl overflow-hidden bg-white jodit-container">
                    <JoditEditor
                      ref={termsEditorRef}
                      value={form.watch("policies.terms_conditions") || ""}
                      config={JODIT_CONFIG}
                      onBlur={(val) =>
                        form.setValue("policies.terms_conditions", val)
                      }
                      onChange={(val) =>
                        form.setValue("policies.terms_conditions", val)
                      }
                    />
                  </div>
                  {policyPreview === "terms" && (
                    <div className="mt-3 p-4 bg-white border border-slate-200 rounded-xl prose prose-sm prose-slate max-w-none">
                      {parse(form.watch("policies.terms_conditions") || "")}
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            {/* Reviews Tab */}
            <TabsContent value="reviews" className="space-y-4 m-0 p-8">
              <div className="space-y-4">
                {reviewsFields.map((field, index) => (
                  <div
                    key={field.id}
                    className="p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-4 relative"
                  >
                    <button
                      type="button"
                      onClick={() => removeReview(index)}
                      className="absolute top-4 right-4 text-slate-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                          Reviewer Name
                        </label>
                        <input
                          {...form.register(`reviews.${index}.name`)}
                          placeholder="John Doe"
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-primary/20 outline-none"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                          Rating (1-5)
                        </label>
                        <input
                          type="number"
                          min="1"
                          max="5"
                          {...form.register(`reviews.${index}.rating`, {
                            valueAsNumber: true,
                          })}
                          placeholder="5"
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-primary/20 outline-none"
                        />
                      </div>

                      <div className="flex items-center gap-4">
                        <button
                          type="button"
                          onClick={() =>
                            openImageModal(`reviews.${index}.profile_picture`)
                          }
                          className="flex-1 px-4 py-2.5 rounded-xl border-2 border-dashed border-slate-200 hover:border-primary text-slate-600 hover:text-primary transition-all font-medium flex items-center justify-center gap-2"
                        >
                          <ImageIcon className="w-4 h-4" />
                          Select Image
                        </button>
                        {form.watch(`reviews.${index}.profile_picture`) && (
                          <div className="relative group">
                            <img
                              src={form.watch(
                                `reviews.${index}.profile_picture`,
                              )}
                              className="w-12 h-12 rounded-lg object-cover border border-slate-200"
                              alt=""
                            />
                            <button
                              type="button"
                              onClick={() =>
                                form.setValue(
                                  `reviews.${index}.profile_picture`,
                                  "",
                                )
                              }
                              className="absolute inset-0 bg-red-500/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all rounded-lg"
                            >
                              <Trash2 className="w-4 h-4 text-white" />
                            </button>
                          </div>
                        )}
                      </div>

                      <div className="space-y-1.5 md:col-span-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                          Review Text
                        </label>
                        <textarea
                          {...form.register(`reviews.${index}.review`)}
                          placeholder="Share what you loved about our clinic..."
                          rows={3}
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-primary/20 outline-none resize-none"
                        />
                      </div>
                      <div className="space-y-1.5 md:col-span-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                          Time Ago (Optional)
                        </label>
                        <input
                          {...form.register(`reviews.${index}.time_ago`)}
                          placeholder="2 weeks ago"
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-primary/20 outline-none"
                        />
                      </div>
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() =>
                    appendReview({
                      id: `review_${Date.now()}`,
                      name: "",
                      rating: 5,
                      review: "",
                      profile_picture: "",
                      time_ago: "",
                    })
                  }
                  className="w-full py-4 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 hover:text-primary hover:border-primary transition-all font-bold flex items-center justify-center gap-2"
                >
                  <Plus className="w-5 h-5" /> Add Review
                </button>
              </div>
            </TabsContent>

            <TabsContent value="social" className="space-y-6 m-0">
              <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Twitter URL
                    </label>
                    <input
                      {...form.register("social.twitter")}
                      placeholder="https://twitter.com/yourhandle"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Instagram URL
                    </label>
                    <input
                      {...form.register("social.instagram")}
                      placeholder="https://instagram.com/yourhandle"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Facebook URL
                    </label>
                    <input
                      {...form.register("social.facebook")}
                      placeholder="https://facebook.com/yourpage"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      TikTok URL
                    </label>
                    <input
                      {...form.register("social.tiktok")}
                      placeholder="https://tiktok.com/@yourhandle"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      YouTube URL
                    </label>
                    <input
                      {...form.register("social.youtube")}
                      placeholder="https://youtube.com/channel/yourid"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Footer Description
                    </label>
                    <textarea
                      {...form.register("footer_description")}
                      placeholder="Providing world-class medical care with compassion and expertise..."
                      rows={3}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none"
                    />
                    <p className="text-xs text-slate-400">
                      This text appears in the footer section of the website.
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
      <ImageModal
        isOpen={imageModalOpen}
        onClose={() => {
          setImageModalOpen(false);
          setImageModalField(null);
        }}
        onSelect={handleImageSelect}
        multiple={imageModalField === "gallery_add"}
      />
    </form>
  );
}
