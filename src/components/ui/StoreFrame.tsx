import Image from "next/image";
import type { ProjectView } from "@/lib/projects";
import { cn } from "@/lib/utils";

/**
 * Capture de boutique dans un faux navigateur. Au survol (de l'élément parent
 * marqué "group"), la capture défile verticalement pour montrer la page.
 */
export function StoreFrame({
  project,
  sizes,
  priority,
  className,
}: {
  project: ProjectView;
  sizes: string;
  priority?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("overflow-hidden rounded-2xl border border-line bg-bg-3", className)}>
      <div className="flex items-center gap-3 border-b border-line bg-bg-2 px-4 py-2.5">
        <div className="flex gap-1.5">
          <span className="size-2.5 rounded-full bg-[#ff5f57]/80" />
          <span className="size-2.5 rounded-full bg-[#febc2e]/80" />
          <span className="size-2.5 rounded-full bg-[#28c840]/80" />
        </div>
        <div className="flex-1 truncate rounded-md bg-bg-3 px-3 py-1 text-center font-mono text-[0.65rem] text-muted">
          {project.host}
        </div>
      </div>
      <div className="relative aspect-[4/5] overflow-hidden [container-type:size]">
        <Image
          src={project.image}
          alt={project.name}
          width={1350}
          height={2100}
          sizes={sizes}
          quality={90}
          priority={priority}
          className="absolute inset-x-0 top-0 h-auto w-full transition-transform duration-[5s] ease-[cubic-bezier(0.45,0.05,0.55,0.95)] group-hover:translate-y-[calc(-100%+100cqh)]"
        />
      </div>
    </div>
  );
}
