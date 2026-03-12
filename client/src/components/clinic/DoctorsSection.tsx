import { motion } from "framer-motion";
import { Link } from "wouter";

interface Doctor {
  id: string;
  name: string;
  specialty?: string;
  qualifications?: string;
  experience?: string;
  bio?: string;
  photo_url?: string;
}

interface DoctorsSectionProps {
  doctors?: Doctor[];
}

export function DoctorsSection({ doctors }: DoctorsSectionProps) {
  if (!doctors || doctors.length === 0) return null;

  return (
    <section id="doctors" className="py-8 md:py-12 lg:py-16 bg-white">
      <div className="container mx-auto px-4 md:px-8 lg:px-16">
        <div className="text-center mb-6 lg:mb-10">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-primary font-bold tracking-wider uppercase text-xs lg:text-sm mb-2 lg:mb-3">
              Medical Team
            </h2>
          </motion.div>
          <motion.h3
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl lg:text-4xl font-bold font-display text-slate-900"
          >
            Our Specialists
          </motion.h3>
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            whileInView={{ opacity: 1, scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-10 lg:w-12 h-1 bg-primary mx-auto mt-3 lg:mt-4 rounded-full"
          ></motion.div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {doctors.map((doc, idx) => {
            const defaultAvatar = `https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop&q=80&sig=${idx}`;

            return (
              <motion.div
                key={doc.id}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.06, duration: 0.36 }}
                className="group"
              >
                <div className="relative bg-white rounded-2xl overflow-hidden shadow-md border border-slate-100 hover:shadow-lg transition-shadow">
                  <div className="aspect-[4/3] bg-slate-50 overflow-hidden">
                    <img src={doc.photo_url || defaultAvatar} alt={doc.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  </div>
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <h4 className="text-lg font-semibold text-slate-900">{doc.name}</h4>
                        <p className="text-sm text-primary font-medium mt-1">{doc.specialty || "Specialist"}</p>
                      </div>
                    </div>

                    <p className="mt-3 text-sm text-slate-600 leading-relaxed line-clamp-3">{doc.bio || "Experienced professional available for consultation."}</p>

                    <div className="mt-4 flex items-center justify-between">
                      <Link href={`/doctor/${doc.id}`}>
                        <button className="text-sm text-primary font-semibold hover:underline">View Profile</button>
                      </Link>
                      <a href="#contact" className="text-sm text-slate-500 hover:text-primary transition-colors">Contact</a>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
