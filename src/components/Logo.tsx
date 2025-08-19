import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

export function Logo({ className, size = "md" }: LogoProps) {
  const sizeClasses = {
    sm: "text-xl",
    md: "text-3xl",
    lg: "text-4xl",
    xl: "text-6xl"
  };

  return (
    <div className={cn("flex items-center", className)}>
      <h1 className={cn("font-orbitron font-bold", sizeClasses[size])}>
        <span className="text-foreground">FitPlan</span>
        <span className="logo-ai">AI</span>
      </h1>
    </div>
  );
}