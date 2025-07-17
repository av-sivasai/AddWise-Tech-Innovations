"use client";
/*
 * Documentation:
 * Modern navbar — https://app.subframe.com/library?component=Modern+navbar_cba8555a-1e5a-4a57-8c3d-6ad67c2ef976
 * Button — https://app.subframe.com/library?component=Button_3b777358-b86b-40af-9327-891efc6826fe
 */

import React from "react";
import * as SubframeUtils from "../utils";
import { Button } from "./Button";

interface NavItemProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  className?: string;
}

const NavItem = React.forwardRef<HTMLElement, NavItemProps>(function NavItem(
  { children, className, ...otherProps }: NavItemProps,
  ref
) {
  return (
    <div
      className={SubframeUtils.twClassNames(
        "group/4f025ecf flex h-12 cursor-pointer flex-col items-center justify-center gap-4 px-4",
        className
      )}
      ref={ref as any}
      {...otherProps}
    >
      {children ? (
        <span className="text-body-bold font-body-bold text-subtext-color group-hover/4f025ecf:text-default-font">
          {children}
        </span>
      ) : null}
    </div>
  );
});

interface ModernNavbarRootProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

const ModernNavbarRoot = React.forwardRef<HTMLElement, ModernNavbarRootProps>(
  function ModernNavbarRoot(
    { className, ...otherProps }: ModernNavbarRootProps,
    ref
  ) {
    return (
      <div
        className={SubframeUtils.twClassNames(
          "flex w-full max-w-[1024px] flex-wrap items-center gap-4 rounded-md border border-solid border-neutral-border bg-default-background shadow-md",
          className
        )}
        ref={ref as any}
        {...otherProps}
      >
        <div className="flex h-12 flex-col items-start justify-center gap-2 px-4">
          <img
            className="h-4 flex-none object-cover"
            src="https://res.cloudinary.com/subframe/image/upload/v1711417507/shared/y2rsnhq3mex4auk54aye.png"
          />
        </div>
        <div className="flex min-w-[320px] grow shrink-0 basis-0 flex-wrap items-center gap-6">
          <NavItem>Product</NavItem>
          <NavItem>Features</NavItem>
          <NavItem>Pricing</NavItem>
          <NavItem>About</NavItem>
          <NavItem>Changelog</NavItem>
          <NavItem>Contact</NavItem>
        </div>
        <div className="flex items-center gap-2 px-2">
          <Button variant="brand-secondary">Log in</Button>
          <Button>Sign up</Button>
        </div>
      </div>
    );
  }
);

export const ModernNavbar = Object.assign(ModernNavbarRoot, {
  NavItem,
});
