import { FileQuestion } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

type NotFoundViewProps = {
  /** When true, fits inside dashboard main (sidebar stays visible). */
  compact?: boolean;
};

export function NotFoundView({ compact = false }: NotFoundViewProps) {
  const outerClass = compact
    ? "min-h-[60vh] bg-gray-50 flex items-center justify-center p-6"
    : "min-h-screen bg-gray-50 flex items-center justify-center p-6";

  return (
    <div className={outerClass}>
      <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-gray-200 p-8 text-center">
        <div className="mx-auto mb-5 bg-white rounded-lg w-[150px] flex items-center justify-center py-2 border border-gray-100 shadow-sm">
          <Image
            src="/logo.png"
            width={120}
            height={40}
            alt="EduMaster Management"
            priority
          />
        </div>
        <div className="mx-auto w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center mb-4">
          <FileQuestion className="w-8 h-8 text-emerald-600" aria-hidden />
        </div>
        <p className="text-5xl font-bold text-emerald-600 tracking-tight mb-1">
          404
        </p>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Page not found</h1>
        <p className="text-gray-600 mb-6">
          The page you are looking for does not exist, or it may have been moved
          or removed.
        </p>
        <div className="flex flex-col gap-3">
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center rounded-lg bg-emerald-600 px-4 py-2.5 text-white font-semibold hover:bg-emerald-700 transition-colors"
          >
            Go to dashboard
          </Link>
          <Link
            href="/login"
            className="inline-flex items-center justify-center rounded-lg border border-gray-200 px-4 py-2.5 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
          >
            Back to login
          </Link>
        </div>
      </div>
    </div>
  );
}
