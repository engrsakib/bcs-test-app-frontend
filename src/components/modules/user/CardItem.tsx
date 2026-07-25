"use client";

import {
  Book,
  Video,
  FileText,
  Trophy,
  Link2,
  GraduationCap,
  Users,
  HelpCircle,
} from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

const icons = {
  Book,
  Video,
  FileText,
  Trophy,
  Link2,
  GraduationCap,
  Users,
  HelpCircle,
};

type IconName = keyof typeof icons;

interface CardItemProps {
  title: string;
  value: string | number;
  icon: IconName;
  gradientFrom: string;
  gradientTo: string;
  heading: string;
  description: string;
  href?: string;
  loading?: boolean;
}

export function CardItem({
  title,
  value,
  icon,
  gradientFrom,
  gradientTo,
  heading,
  description,
  href,
  loading = false,
}: CardItemProps) {
  const Icon = icons[icon];
  const router = useRouter();

  const handleClick = () => {
    if (href) {
      router.push(href);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 1.1 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        type: "spring",
        stiffness: 100,
        damping: 20,
        duration: 0.6,
      }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.97 }}
      onClick={handleClick}
      className={`relative p-6 rounded-xl shadow-xl bg-gradient-to-br ${gradientFrom} ${gradientTo} text-white cursor-pointer overflow-hidden`}
    >
      <div className="absolute top-3 left-4 right-4 text-sm opacity-90">
        <h4 className="text-md font-semibold uppercase tracking-wide">{heading}</h4>
        <p className="text-xs">{description}</p>
      </div>

      <div className="mt-12 flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold">{title}</h3>
          <p className="text-3xl font-extrabold mt-1">
            {loading ? "..." : value}
          </p>
        </div>
        {Icon && <Icon className="w-10 h-10 text-white opacity-90" />}
      </div>

      <div className="absolute inset-0 rounded-xl bg-white opacity-5 pointer-events-none" />
    </motion.div>
  );
}
