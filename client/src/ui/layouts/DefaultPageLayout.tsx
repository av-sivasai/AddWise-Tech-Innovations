"use client";
/*
 * Documentation:
 * Default Page Layout — https://app.subframe.com/library?component=Default+Page+Layout_a57b1c43-310a-493f-b807-8cc88e2452cf
 * Sidebar with sections — https://app.subframe.com/library?component=Sidebar+with+sections_f4047c8b-cfb4-4761-b9cf-fbcae8a9b9b5
 * Avatar — https://app.subframe.com/library?component=Avatar_bec25ae6-5010-4485-b46b-cf79e3943ab2
 * Dropdown Menu — https://app.subframe.com/library?component=Dropdown+Menu_99951515-459b-4286-919e-a89e7549b43b
 * Icon Button — https://app.subframe.com/library?component=Icon+Button_af9405b1-8c54-4e01-9786-5aad308224f6
 */

import React from "react";
import * as SubframeUtils from "../utils";
import { SidebarWithSections } from "../components/SidebarWithSections";
import { FeatherHome } from "@subframe/core";
import { FeatherInbox } from "@subframe/core";
import { FeatherBarChart2 } from "@subframe/core";
import { FeatherGauge } from "@subframe/core";
import { FeatherRocket } from "@subframe/core";
import { FeatherTent } from "@subframe/core";
import { FeatherBuilding } from "@subframe/core";
import { FeatherDollarSign } from "@subframe/core";
import { FeatherWebhook } from "@subframe/core";
import { Avatar } from "../components/Avatar";
import { DropdownMenu } from "../components/DropdownMenu";
import { FeatherUser } from "@subframe/core";
import { FeatherSettings } from "@subframe/core";
import { FeatherLogOut } from "@subframe/core";
import * as SubframeCore from "@subframe/core";
import { IconButton } from "../components/IconButton";
import { FeatherMoreHorizontal } from "@subframe/core";

interface DefaultPageLayoutRootProps
  extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  className?: string;
}

const DefaultPageLayoutRoot = React.forwardRef<
  HTMLElement,
  DefaultPageLayoutRootProps
>(function DefaultPageLayoutRoot(
  { children, className, ...otherProps }: DefaultPageLayoutRootProps,
  ref
) {
  return (
    <div
      className={SubframeUtils.twClassNames(
        "flex h-screen w-full items-start",
        className
      )}
      ref={ref as any}
      {...otherProps}
    >
      <SidebarWithSections
        className="mobile:hidden"
        header={
          <img
            className="h-6 flex-none object-cover"
            src="https://res.cloudinary.com/subframe/image/upload/v1711417507/shared/y2rsnhq3mex4auk54aye.png"
          />
        }
        footer={
          <>
            <div className="flex grow shrink-0 basis-0 items-start gap-2">
              <Avatar image="https://res.cloudinary.com/subframe/image/upload/v1711417513/shared/kwut7rhuyivweg8tmyzl.jpg">
                A
              </Avatar>
              <div className="flex flex-col items-start">
                <span className="text-caption-bold font-caption-bold text-default-font">
                  Irvin
                </span>
                <span className="text-caption font-caption text-subtext-color">
                  Founder
                </span>
              </div>
            </div>
            <SubframeCore.DropdownMenu.Root>
              <SubframeCore.DropdownMenu.Trigger asChild={true}>
                <IconButton size="small" icon={<FeatherMoreHorizontal />} />
              </SubframeCore.DropdownMenu.Trigger>
              <SubframeCore.DropdownMenu.Portal>
                <SubframeCore.DropdownMenu.Content
                  side="bottom"
                  align="start"
                  sideOffset={4}
                  asChild={true}
                >
                  <DropdownMenu>
                    <DropdownMenu.DropdownItem icon={<FeatherUser />}>
                      Profile
                    </DropdownMenu.DropdownItem>
                    <DropdownMenu.DropdownItem icon={<FeatherSettings />}>
                      Settings
                    </DropdownMenu.DropdownItem>
                    <DropdownMenu.DropdownItem icon={<FeatherLogOut />}>
                      Log out
                    </DropdownMenu.DropdownItem>
                  </DropdownMenu>
                </SubframeCore.DropdownMenu.Content>
              </SubframeCore.DropdownMenu.Portal>
            </SubframeCore.DropdownMenu.Root>
          </>
        }
      >
        <SidebarWithSections.NavItem icon={<FeatherHome />} selected={true}>
          Home
        </SidebarWithSections.NavItem>
        <SidebarWithSections.NavItem icon={<FeatherInbox />}>
          Inbox
        </SidebarWithSections.NavItem>
        <SidebarWithSections.NavItem icon={<FeatherBarChart2 />}>
          Reports
        </SidebarWithSections.NavItem>
        <SidebarWithSections.NavSection label="Analytics">
          <SidebarWithSections.NavItem icon={<FeatherGauge />}>
            Dashboard
          </SidebarWithSections.NavItem>
          <SidebarWithSections.NavItem icon={<FeatherRocket />}>
            Trends
          </SidebarWithSections.NavItem>
          <SidebarWithSections.NavItem icon={<FeatherTent />}>
            Campaigns
          </SidebarWithSections.NavItem>
        </SidebarWithSections.NavSection>
        <SidebarWithSections.NavSection label="Settings">
          <SidebarWithSections.NavItem icon={<FeatherBuilding />}>
            Company
          </SidebarWithSections.NavItem>
          <SidebarWithSections.NavItem icon={<FeatherDollarSign />}>
            Payments
          </SidebarWithSections.NavItem>
          <SidebarWithSections.NavItem icon={<FeatherWebhook />}>
            Integrations
          </SidebarWithSections.NavItem>
        </SidebarWithSections.NavSection>
      </SidebarWithSections>
      {children ? (
        <div className="flex grow shrink-0 basis-0 flex-col items-start gap-4 self-stretch overflow-y-auto bg-default-background">
          {children}
        </div>
      ) : null}
    </div>
  );
});

export const DefaultPageLayout = DefaultPageLayoutRoot;
