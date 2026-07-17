import { Construction } from "lucide-react";
import { motion } from "framer-motion";

export function UnderDevelopment({ title }: { title: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center px-6 text-center"
    >
      <div className="flex h-20 w-20 items-center justify-center rounded-3xl border border-hairline bg-surface">
        <Construction className="h-8 w-8 text-amber-300/80" strokeWidth={1.5} />
      </div>
      <h1 className="mt-8 text-2xl font-semibold tracking-tight text-white">{title}</h1>
      <p className="mt-3 text-sm text-white/50">
        🚧 Em Desenvolvimento — this section is being carefully crafted. Check back soon.
      </p>
    </motion.div>
  );
}
