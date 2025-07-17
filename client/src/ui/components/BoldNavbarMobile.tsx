"use client";
/*
 * Documentation:
 * Bold navbar mobile — https://app.subframe.com/library?component=Bold+navbar+mobile_f905f6bd-ab80-464d-a940-fcb91b9ddf42
 * Button — https://app.subframe.com/library?component=Button_3b777358-b86b-40af-9327-891efc6826fe
 * Icon Button — https://app.subframe.com/library?component=Icon+Button_af9405b1-8c54-4e01-9786-5aad308224f6
 */

import React from "react";
import * as SubframeUtils from "../utils";
import { Button } from "./Button";
import * as SubframeCore from "@subframe/core";
import { IconButton } from "./IconButton";
import { FeatherMenu } from "@subframe/core";

interface NavItemProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  selected?: boolean;
  className?: string;
}

const NavItem = React.forwardRef<HTMLElement, NavItemProps>(function NavItem(
  { children, selected = false, className, ...otherProps }: NavItemProps,
  ref
) {
  return (
    <div
      className={SubframeUtils.twClassNames(
        "group/0a1c836c flex h-8 cursor-pointer flex-col items-center justify-center gap-4 rounded-full px-4",
        { "bg-brand-200": selected },
        className
      )}
      ref={ref as any}
      {...otherProps}
    >
      {children ? (
        <span className="font-['Montserrat'] text-[15px] font-[600] leading-[20px] text-brand-900">
          {children}
        </span>
      ) : null}
    </div>
  );
});

interface BoldNavbarMobileRootProps
  extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

const BoldNavbarMobileRoot = React.forwardRef<
  HTMLElement,
  BoldNavbarMobileRootProps
>(function BoldNavbarMobileRoot(
  { className, ...otherProps }: BoldNavbarMobileRootProps,
  ref
) {
  return (
    <div
      className={SubframeUtils.twClassNames(
        "flex w-full max-w-[1280px] flex-wrap items-center justify-between",
        className
      )}
      ref={ref as any}
      {...otherProps}
    >
      <div className="flex h-12 flex-col items-start justify-center gap-2 px-4">
        <img
          className="h-6 flex-none object-cover"
          src="https://res.cloudinary.com/subframe/image/upload/v1711417507/shared/y2rsnhq3mex4auk54aye.png"
        />
      </div>
      <div className="flex items-center gap-2 px-2">
        <Button>Sign up</Button>
        <SubframeCore.Popover.Root>
          <SubframeCore.Popover.Trigger asChild={true}>
            <IconButton icon={<FeatherMenu />} />
          </SubframeCore.Popover.Trigger>
          <SubframeCore.Popover.Portal>
            <SubframeCore.Popover.Content
              side="bottom"
              align="end"
              sideOffset={4}
              asChild={true}
            >
              <div className="flex min-w-[320px] flex-col items-start gap-2 rounded-md border border-solid border-neutral-border bg-default-background px-3 py-3 shadow-lg">
                <NavItem className="h-8 w-full flex-none">Product</NavItem>
                <NavItem className="h-8 w-full flex-none">Features</NavItem>
                <NavItem className="h-8 w-full flex-none">About</NavItem>
                <NavItem className="h-8 w-full flex-none">Pricing</NavItem>
                <NavItem className="h-8 w-full flex-none">Help</NavItem>
                <NavItem className="h-8 w-full flex-none">Login</NavItem>
              </div>
            </SubframeCore.Popover.Content>
          </SubframeCore.Popover.Portal>
        </SubframeCore.Popover.Root>
      </div>
    </div>
  );
});

export const BoldNavbarMobile = Object.assign(BoldNavbarMobileRoot, {
  NavItem,
});
