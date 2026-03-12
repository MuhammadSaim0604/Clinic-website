import { User, InsertUser, ClinicConfig, Blog } from "@shared/schema";
import { UserModel, ClinicConfigModel, AppointmentModel, ContactMessageModel, BlogModel, UploadedImageModel } from "./models";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getClinicConfig(): Promise<ClinicConfig | undefined>;
  saveConfig(config: Partial<ClinicConfig>): Promise<ClinicConfig>;
  
  createAppointment(appointment: any): Promise<any>;
  getAppointments(clinicId: string): Promise<any[]>;
  createMessage(message: any): Promise<any>;
  getMessages(clinicId: string): Promise<any[]>;

  // Blogs
  getBlogs(): Promise<Blog[]>;
  getBlogBySlug(slug: string): Promise<Blog | undefined>;
  createBlog(blog: Partial<Blog>): Promise<Blog>;
  updateBlog(id: string, blog: Partial<Blog>): Promise<Blog>;
  deleteBlog(id: string): Promise<boolean>;

  // Images
  createImage(filename: string, path: string, originalName?: string): Promise<any>;
  getRecentImages(limit?: number): Promise<any[]>;
}

export class MongoStorage implements IStorage {
  // ... (rest of the methods)

  async getUser(id: string): Promise<User | undefined> {
    const user = await UserModel.findById(id);
    return user ? this.mapUser(user) : undefined;
  }
  
  async getUserByUsername(username: string): Promise<User | undefined> {
    const user = await UserModel.findOne({ username });
    return user ? this.mapUser(user) : undefined;
  }
  
  async createUser(insertUser: InsertUser): Promise<User> {
    const user = await UserModel.create(insertUser);
    return this.mapUser(user);
  }

  async getClinicConfig(): Promise<ClinicConfig | undefined> {
    // Return the single clinic config (there is only one document expected).
    const config = await ClinicConfigModel.findOne({});
    return config ? this.mapConfig(config) : undefined;
  }

  async saveConfig(updates: Partial<ClinicConfig>): Promise<ClinicConfig> {
    // Find existing config (single document). If none, create new.
    let existing = await ClinicConfigModel.findOne({});
    if (!existing) {
      const toCreate: any = Object.assign({ clinic_type: "general", clinic_name: "Default Clinic" }, updates);
      const created = await ClinicConfigModel.create(toCreate);
      return this.mapConfig(created);
    }

    // Apply updates and save (no versioning)
    Object.assign(existing, updates);
    await existing.save();
    return this.mapConfig(existing);
  }

  async createAppointment(appointment: any): Promise<any> {
    return await AppointmentModel.create(appointment);
  }

  async getAppointments(clinicId: string): Promise<any[]> {
    return await AppointmentModel.find({ clinic_id: clinicId }).sort({ createdAt: -1 });
  }

  async createMessage(message: any): Promise<any> {
    return await ContactMessageModel.create(message);
  }

  async getMessages(clinicId: string): Promise<any[]> {
    return await ContactMessageModel.find({ clinic_id: clinicId }).sort({ createdAt: -1 });
  }

  async updateMessage(id: string, updates: any): Promise<any> {
    return await ContactMessageModel.findByIdAndUpdate(id, updates, { new: true });
  }

  async updateAppointment(id: string, updates: any): Promise<any> {
    return await AppointmentModel.findByIdAndUpdate(id, updates, { new: true });
  }

  // Blogs
  async getBlogs(): Promise<Blog[]> {
    const blogs = await BlogModel.find({}).sort({ createdAt: -1 });
    return blogs.map(b => this.mapBlog(b));
  }

  async getBlogBySlug(slug: string): Promise<Blog | undefined> {
    const blog = await BlogModel.findOne({ slug });
    return blog ? this.mapBlog(blog) : undefined;
  }

  async createBlog(blog: Partial<Blog>): Promise<Blog> {
    const created = await BlogModel.create(blog);
    return this.mapBlog(created);
  }

  async updateBlog(id: string, blog: Partial<Blog>): Promise<Blog> {
    const updated = await BlogModel.findByIdAndUpdate(id, blog, { new: true });
    return this.mapBlog(updated);
  }

  async deleteBlog(id: string): Promise<boolean> {
    const res = await BlogModel.findByIdAndDelete(id);
    return !!res;
  }

  private mapUser(doc: any): User {
    return {
      id: doc._id.toString(),
      username: doc.username,
      password: doc.password,
      role: doc.role
    };
  }

  private mapConfig(doc: any): ClinicConfig {
    const obj = doc.toObject();
    obj.id = obj._id.toString();
    delete obj._id;
    delete obj.__v;
    return obj as ClinicConfig;
  }

  private mapBlog(doc: any): Blog {
    const obj = doc.toObject();
    obj.id = obj._id.toString();
    delete obj._id;
    delete obj.__v;
    return obj as Blog;
  }

  async createImage(filename: string, path: string, originalName?: string): Promise<any> {
    const image = await UploadedImageModel.create({
      filename,
      path,
      originalName,
    });
    return { id: image._id, ...image.toObject() };
  }

  async getRecentImages(limit: number = 20): Promise<any[]> {
    const images = await UploadedImageModel.find()
      .sort({ createdAt: -1 })
      .limit(limit);
    return images.map(img => ({ id: img._id, ...img.toObject() }));
  }
}

export const storage = new MongoStorage();
