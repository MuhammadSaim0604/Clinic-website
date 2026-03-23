import express, { type Express, type Request } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { connectDB } from "./db";
import { writeFileSync, mkdirSync } from "fs";
import { join } from "path";
import { adminAuthMiddleware } from "./middleware";
import { generateToken, verifyToken } from "./jwt";

const CLINIC_ID = "default-clinic";

async function seedData() {
  try {
    const existingUser = await storage.getUserByUsername("admin");
    if (!existingUser) {
      await storage.createUser({
        username: "user",
        password: "password", // DO NOT do this in prod
        role: "user",
      });
      await storage.createUser({
        username: "admin",
        password: "password", // DO NOT do this in prod
        role: "admin",
      });
      console.log("Seeded admin & user credentials");
    }

    // Seed default clinic config if none exists
    const existingConfig = await storage.getClinicConfig();
    if (!existingConfig) {
      // Create an empty-structured clinic config (no dummy content)
      await storage.saveConfig({
        clinic_name: "Al-Shifa clinic",
        clinic_type: process.env.CLINIC_TYPE || "general",
        branding: {
          logo_url: "/al-shifa.png",
          primary_color: "",
        },
        media: { hero_image: "", gallery_images: [] },
        hero_heading: "Book Your Appointment Now",
        hero_subtext: "Book your appointment now and be healthy with us",
        doctors: [
          {
            id: "doc_1772536764192",
            name: "Dr. Aliya",
            specialty: "Cardiology",
            bio: "Dr. Aliya is a highly experienced cardiologist with over 12 years of practice. She specializes in heart diseases and has a strong background in both clinical practice and research.",
            photo_url: "/1.jpeg",
            qualifications: "MBBS",
            experience: "12+ years",
            full_bio:
              "A cardiologist specializes in diagnosing, treating, and preventing diseases related to the heart and blood vessels. They manage conditions such as heart disease, high blood pressure, heart rhythm disorders, and heart attacks, using medical tests, medications, and preventive care plans to support patients’ cardiovascular health. ❤️",
            service_ids: ["srv_1772536751456"],
          },
          {
            id: "doc_1772543347782",
            name: "Dr. Muskan",
            specialty: "Cardiology",
            bio: "he is a specialist of heart.",
            photo_url: "/2.jpeg",
            qualifications: "MD - Cardiologist",
            experience: "10 years",
          },
        ],
        services: [
          {
            id: "srv_1772536751456",
            name: "MRA",
            description: "Conduct an MRA",
            image_url:
              "https://img.lb.wbmdstatic.com/vim/live/webmd/consumer_assets/site_images/article_thumbnails/BigBead/anosognosia_why_some_people_stop_taking_their_meds_bigbead/1800x1200_anosognosia_why_some_people_stop_taking_their_meds_bigbead.jpg",
            price: "1000",
            duration: "30 Minutes",
            category: "Cardiology",
          },
        ],
        branches: [
          {
            id: "br_1772536796944",
            name: "Al-Shifa Lahore",
            address: "Punjab, District Bahawalpur",
          },
        ],
        reviews: [
          {
            id: "r1",
            name: "Isabella H.",
            rating: 5,
            review:
              "I was hesitant to invest in this product at first, but I'm so glad I did. It has been a total game-changer for me and has made a significant positive impact on my work. It's worth every penny.",
            profile_picture:
              "https://api.dicebear.com/7.x/avataaars/svg?seed=Isabella",
            time_ago: "1 day ago",
          },
          {
            id: "r2",
            name: "Sophia M.",
            rating: 5,
            review:
              "I've tried similar products in the past, but none of them compare to this one. It's in a league of its own in terms of functionality, durability, and overall value. I can't recommend it highly enough!",
            profile_picture:
              "https://api.dicebear.com/7.x/avataaars/svg?seed=Sophia",
            time_ago: "1 day ago",
          },
          {
            id: "r3",
            name: "John D.",
            rating: 5,
            review:
              "This product is a game-changer! I've been using it for a few months now and it has consistently delivered excellent results. It's easy to use, well-designed, and built to last.",
            profile_picture:
              "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
            time_ago: "1 day ago",
          },
          {
            id: "r4",
            name: "Sarah L.",
            rating: 5,
            review:
              "Outstanding quality and exceptional customer service. The team went above and beyond to ensure I had a great experience. Highly recommended for anyone looking for reliable solutions.",
            profile_picture:
              "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
            time_ago: "2 days ago",
          },
          {
            id: "r5",
            name: "Michael R.",
            rating: 5,
            review:
              "Best purchase I've made in years. The attention to detail is incredible and it's clear the company cares about customer satisfaction. Will definitely be ordering again.",
            profile_picture:
              "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael",
            time_ago: "2 days ago",
          },
          {
            id: "r6",
            name: "Emma K.",
            rating: 5,
            review:
              "Exceeded all my expectations! The product arrived quickly, works perfectly, and the quality is outstanding. This is a must-have for anyone serious about their needs.",
            profile_picture:
              "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma",
            time_ago: "3 days ago",
          },
          {
            id: "r7",
            name: "David T.",
            rating: 5,
            review:
              "I'm impressed with every aspect of this product. From the packaging to the performance, everything is top-notch. Would highly recommend to friends and family.",
            profile_picture:
              "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
            time_ago: "3 days ago",
          },
          {
            id: "r8",
            name: "Jessica P.",
            rating: 5,
            review:
              "Amazing experience from start to finish. The product quality is excellent and the support team is incredibly helpful. Definitely worth the investment.",
            profile_picture:
              "https://api.dicebear.com/7.x/avataaars/svg?seed=Jessica",
            time_ago: "4 days ago",
          },
          {
            id: "r9",
            name: "Robert C.",
            rating: 5,
            review:
              "This is exactly what I was looking for. Perfect quality, great value, and excellent service. I've already recommended it to several colleagues who loved it.",
            profile_picture:
              "https://api.dicebear.com/7.x/avataaars/svg?seed=Robert",
            time_ago: "4 days ago",
          },
          {
            id: "r10",
            name: "Amy W.",
            rating: 5,
            review:
              "Fantastic product and fantastic service. The team was responsive and professional throughout the entire process. This is a company I can trust.",
            profile_picture:
              "https://api.dicebear.com/7.x/avataaars/svg?seed=Amy",
            time_ago: "5 days ago",
          },
        ],
        appointment: { enable_online_booking: false },
        features: { enable_blog: true, enable_faq: true },
        seo: {
          meta_title: "Al-SHIFA Clinic",
          meta_description: "Al-Shifa CLinic book your appointment",
        },
        contact: {
          email: "majorsaim786@gmail.com",
          phone: "03028477294",
          address: "Punjab, District Bahawalpur",
          google_maps_embed:
            "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d434.4764815058425!2d71.6607275!3d29.4050596!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x393b974de1ff124d%3A0x98607129cf54bfab!2sAl-Shifa%20Clinic!5e0!3m2!1sen!2s!4v1772516709663!5m2!1sen!2s",
          opening_hours: [
            {
              days: "Mon - Fri",
              hours: "8:00 AM - 5:00 PM ",
            },
          ],
        },
        faq: [
          {
            id: "faq_1",
            question: "How can I Book an Appointment?",
            answer: `<h2><span>Steps to Book an Appointment</span></h2><ol data-spread="true" start="1"><li><p class="isSelectedEnd"><strong><span>Visit the Appointment Page</span></strong><br><span>Go to the official website of </span><strong><span>Al Shifa Clinic</span></strong><span> and navigate to the </span><strong><span>Appointment</span></strong><span> page from the main menu.</span></p></li><li><p class="isSelectedEnd"><strong><span>Select the Doctor or Department</span></strong><br><span>Choose the doctor or medical department you want to consult with based on your healthcare needs.</span></p></li><li><p class="isSelectedEnd"><strong><span>Choose a Suitable Date and Time</span></strong><br><span>Pick an available date and time slot that works best for you.</span></p></li><li><p class="isSelectedEnd"><strong><span>Fill Out the Appointment Form</span></strong><br><span>Provide the required information such as:</span></p><ul data-spread="false"><li><p class="isSelectedEnd"><span>Your full name</span></p></li><li><p class="isSelectedEnd"><span>Contact number</span></p></li><li><p class="isSelectedEnd"><span>Email address</span></p></li><li><p class="isSelectedEnd"><span>Reason for visit or symptoms</span></p></li></ul></li><li><p class="isSelectedEnd"><strong><span>Review Your Information</span></strong><br><span>Double-check the details you entered to ensure everything is correct.</span></p></li><li><p class="isSelectedEnd"><strong><span>Submit the Appointment Request</span></strong><br><span>Click the </span><strong><span>Submit</span></strong><span> or </span><strong><span>Book Appointment</span></strong><span> button to complete your request.</span></p></li><li><p class="isSelectedEnd"><strong><span>Receive Confirmation</span></strong><br><span>Once your appointment is submitted, you will receive a confirmation message or email from </span><strong><span>Al Shifa Clinic</span></strong><span> with the details of your scheduled visit.</span></p></li></ol><p><span>By following these simple steps, you can quickly secure an appointment and receive the medical care you need.</span></p>`,
          },
        ],
        policies: {
          privacy_policy: `<h1>Privacy Policy</h1><p class="isSelectedEnd"><span>At </span><strong><span>Al Shifa Clinic</span></strong><span>, we value and respect the privacy of our patients. This Privacy Policy explains how we collect, use, and protect your personal information when you use our website or services.</span></p><h2><span>Information We Collect</span></h2><p class="isSelectedEnd"><span>We may collect the following types of information:</span></p><ul data-spread="false"><li><p class="isSelectedEnd"><span>Personal details such as name, phone number, and email address</span></p></li><li><p class="isSelectedEnd"><span>Appointment and medical inquiry information</span></p></li><li><p class="isSelectedEnd"><span>Basic website usage data for improving our services</span></p></li></ul><h2><span>How We Use Your Information</span></h2><p class="isSelectedEnd"><span>The information we collect may be used to:</span></p><ul data-spread="false"><li><p class="isSelectedEnd"><span>Schedule and manage appointments</span></p></li><li><p class="isSelectedEnd"><span>Contact you regarding your appointment or inquiries</span></p></li><li><p class="isSelectedEnd"><span>Improve our website and services</span></p></li><li><p class="isSelectedEnd"><span>Provide better patient support</span></p></li></ul><h2><span>Data Protection</span></h2><p class="isSelectedEnd"><span>We take reasonable security measures to protect your personal information from unauthorized access, misuse, or disclosure.</span></p><h2><span>Third-Party Sharing</span></h2><p class="isSelectedEnd"><span>Al Shifa Clinic does not sell or rent your personal information to third parties. Your information may only be shared when required for medical services or when required by law.</span></p><h2><span>Your Privacy Rights</span></h2><p><span>You have the right to request access to your personal information or ask for corrections if any information is inaccurate.</span></p>`,
          terms_conditions: `<p class="isSelectedEnd"><span>Welcome to </span><strong><span>Al Shifa Clinic</span></strong><span>. By using our website and services, you agree to the following terms and conditions.</span></p><h2><span>Use of the Website</span></h2><p class="isSelectedEnd"><span>The content provided on this website is for general informational purposes only. It should not be considered a substitute for professional medical advice or diagnosis.</span></p><h2><span>Appointment Policy</span></h2><p class="isSelectedEnd"><span>Submitting an appointment request does not guarantee immediate confirmation. The clinic may contact you to confirm or reschedule based on doctor availability.</span></p><h2><span>Patient Responsibility</span></h2><p class="isSelectedEnd"><span>Patients are responsible for providing accurate and complete information when booking appointments or submitting forms.</span></p><h2><span>Limitation of Liability</span></h2><p class="isSelectedEnd"><span>Al Shifa Clinic is not responsible for any damages or issues that arise from the misuse of information available on the website.</span></p><h2><span>Changes to Terms</span></h2><p class="isSelectedEnd"><span>Al Shifa Clinic reserves the right to update or modify these terms at any time. Continued use of the website indicates acceptance of the updated terms.</span></p><div contenteditable="false"><hr></div><p><br></p>`,
        },
      });
      console.log("Seeded empty clinic config structure");
    }

    const blogs = await storage.getBlogs();
    if (blogs.length === 0) {
      await storage.createBlog({
        title: "Welcome to Al-Shifa Clinic",
        slug: "welcome-to-al-shifa",
        content:
          "<p>We are happy to serve you with the best healthcare services.</p>",
        category: "General",
        thumbnail:
          "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800",
      });
      console.log("Seeded initial blog post");
    }
  } catch (err) {
    console.error("Failed to seed data:", err);
  }
}

export async function registerRoutes(
  httpServer: Server,
  app: Express,
): Promise<Server> {
  // Serve uploads directory as static
  const uploadsPath = join(process.cwd(), "public", "uploads");
  app.use("/uploads", express.static(uploadsPath));

  // Connect to MongoDB
  await connectDB();

  // Seed initial data
  seedData().catch(console.error);


  app.post(api.auth.login.path, async (req, res) => {
    try {
      const input = api.auth.login.input.parse(req.body);
      const user = await storage.getUserByUsername(input.username);
      if (!user || user.password !== input.password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      const token = generateToken({
        id: user.id,
        username: user.username,
        role: user.role,
      });

      res.cookie("auth_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 3600000, // 1 hour
      });
      res.json({ token, user });
    } catch (e) {
      res.status(400).json({ message: "Validation error" });
    }
  });

  app.post("/admin/logout", (req, res) => {
    // 1️⃣ Clear all cookies
    for (const cookieName in req.cookies) {
      res.clearCookie(cookieName, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
      });
    }

    // 3️⃣ Redirect to login page
    res.redirect("/admin/login");
  });

  app.get(api.auth.me.path, async (req, res) => {
    const token = req.cookies?.auth_token;
    if (!token) return res.status(401).json({ message: "Token not found" });
    const user = verifyToken(token);
    if (!user) return res.status(401).json({ message: "Unauthorized" });
    res.json(user);
  });

  app.get(api.clinic_info.info.path, async (req, res) => {
    const config = await storage.getClinicConfig();
    res.json({
      CLINIC_ID: CLINIC_ID,
      clinic_type: process.env.CLINIC_TYPE || config?.clinic_type || "general",
      license_status: "active",
      env_locked_clinic_type: process.env.CLINIC_TYPE,
    });
  });

  app.get(api.clinic.config.path, async (req, res) => {
    const config = await storage.getClinicConfig();
    if (!config) {
      return res.status(404).json({ message: "Not found" });
    }
    res.json({ clinic_type: config.clinic_type, config });
  });

  app.get(api.clinic.render.path, async (req, res) => {
    const config = await storage.getClinicConfig();
    if (!config) return res.status(404).json({ message: "Not found" });
    res.json({ clinic_type: config.clinic_type, config });
  });

  app.put(api.clinic.save.path, adminAuthMiddleware, async (req, res) => {
    try {
      const { config } = req.body;
      const updated = await storage.saveConfig(config || {});
      res.json({ success: true, config: updated });
    } catch (err) {
      res.status(400).json({ message: "Failed to save" });
    }
  });

  app.get(api.appointments.list.path, adminAuthMiddleware, async (req, res) => {
    const list = await storage.getAppointments(CLINIC_ID);
    res.json(list);
  });

  app.post(api.appointments.create.path, async (req, res) => {
    await storage.createAppointment({ ...req.body, clinic_id: CLINIC_ID });
    res.json({ success: true });
  });

  app.get(api.messages.list.path, adminAuthMiddleware, async (req, res) => {
    const list = await storage.getMessages(CLINIC_ID);
    res.json(list);
  });

  app.post(api.messages.create.path, async (req, res) => {
    await storage.createMessage({ ...req.body, clinic_id: CLINIC_ID });
    res.json({ success: true });
  });

  app.patch("/api/messages/:id", adminAuthMiddleware, async (req: Request<{ id: string }>, res) => {
    const message = await storage.updateMessage(req.params.id, req.body);
    res.json(message);
  });

  app.patch("/api/appointments/:id", adminAuthMiddleware, async (req: Request<{ id: string }>, res) => {
    const appointment = await storage.updateAppointment(
      req.params.id,
      req.body,
    );
    res.json(appointment);
  });

  // Blog routes
  app.get("/api/blogs", async (req, res) => {
    const list = await storage.getBlogs();
    res.json(list);
  });

  app.get("/api/blogs/:slug", async (req, res) => {
    const blog = await storage.getBlogBySlug(req.params.slug);
    if (!blog) return res.status(404).json({ message: "Blog not found" });
    res.json(blog);
  });

  app.post("/api/blogs", adminAuthMiddleware, async (req, res) => {
    const blog = await storage.createBlog(req.body);
    res.json(blog);
  });

  app.patch("/api/blogs/:id", adminAuthMiddleware, async (req: Request<{ id: string }>, res) => {
    const blog = await storage.updateBlog(req.params.id, req.body);
    res.json(blog);
  });

  app.delete("/api/blogs/:id", adminAuthMiddleware, async (req: Request<{ id: string }>, res) => {
    await storage.deleteBlog(req.params.id);
    res.json({ success: true });
  });

  // Image upload
  app.post("/api/images/upload", adminAuthMiddleware, async (req, res) => {
    try {
      const { imageData, fileName } = req.body;
      if (!imageData || !fileName) {
        return res.status(400).json({ error: "Missing imageData or fileName" });
      }

      const uploadsDir = join(process.cwd(), "public", "uploads");
      mkdirSync(uploadsDir, { recursive: true });

      // Generate filename with timestamp
      const timestamp = Date.now();
      const ext = fileName.split(".").pop() || "jpg";
      const filename = `${timestamp}.${ext}`;
      const filepath = join(uploadsDir, filename);
      const publicPath = `/uploads/${filename}`;

      // Decode base64 and write file
      const buffer = Buffer.from(imageData.split(",")[1], "base64");
      writeFileSync(filepath, buffer);

      // Store in database
      const image = await storage.createImage(filename, publicPath, fileName);
      res.json({ path: publicPath, ...image });
    } catch (err) {
      console.error("Upload error:", err);
      res.status(500).json({ error: "Upload failed" });
    }
  });

  // Get recent images
  app.get("/api/images/recent", adminAuthMiddleware, async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 20;
      const images = await storage.getRecentImages(limit);
      res.json(images);
    } catch (err) {
      console.error("Fetch images error:", err);
      res.status(500).json({ error: "Failed to fetch images" });
    }
  });

  return httpServer;
}
