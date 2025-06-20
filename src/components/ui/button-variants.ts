import { cva } from "class-variance-authority";

export const buttonVariants = cva(
  "inline-flex items-center rounded px-3 py-1 text-sm font-semibold transition-colors focus:outline-none",
  {
    variants: {
      variant: {
        default: "bg-blue-600 text-white hover:bg-blue-700",
        outline:
          "border border-gray-300 text-gray-800 bg-white hover:bg-gray-50",
        destructive: "bg-red-600 text-white hover:bg-red-700",
        ghost: "bg-transparent text-blue-600 hover:bg-blue-50",
      },
      size: {
        sm: "text-xs px-2 py-1",
        md: "text-sm px-3 py-1.5",
        lg: "text-base px-4 py-2",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  },
);
