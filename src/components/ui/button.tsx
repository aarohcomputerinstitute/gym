"use client"

import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { Slot } from "@radix-ui/react-slot"
import { cn } from "@/lib/utils"
import { buttonVariants, type ButtonVariantProps } from "./button-variants"

interface ButtonProps
  extends ButtonPrimitive.Props,
    ButtonVariantProps {
  asChild?: boolean
}

const Button = ({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: ButtonProps) => {
  const Comp = asChild ? Slot : ButtonPrimitive
  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button }
