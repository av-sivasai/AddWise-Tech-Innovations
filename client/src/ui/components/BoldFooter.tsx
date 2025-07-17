"use client";
/*
 * Documentation:
 * Bold footer — https://app.subframe.com/library?component=Bold+footer_e35cb674-a3fb-4906-9ea1-3241dc9704d3
 * Link Button — https://app.subframe.com/library?component=Link+Button_a4ee726a-774c-4091-8c49-55b659356024
 * Icon Button — https://app.subframe.com/library?component=Icon+Button_af9405b1-8c54-4e01-9786-5aad308224f6
 */

import React from "react";
import * as SubframeUtils from "../utils";
import { LinkButton } from "./LinkButton";
import { IconButton } from "./IconButton";
import { FeatherTwitter } from "@subframe/core";
import { FeatherGithub } from "@subframe/core";
import { FeatherSlack } from "@subframe/core";

interface BoldFooterRootProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

const BoldFooterRoot = React.forwardRef<HTMLElement, BoldFooterRootProps>(
  function BoldFooterRoot(
    { className, ...otherProps }: BoldFooterRootProps,
    ref
  ) {
    return (
      <div
        className={SubframeUtils.twClassNames(
          "flex w-full flex-col items-center justify-center gap-6 border-t border-solid border-neutral-100 px-6 py-24",
          className
        )}
        ref={ref as any}
        {...otherProps}
      >
        <div className="flex w-full max-w-[1280px] flex-col items-center gap-12">
          <div className="flex w-full flex-wrap items-start gap-6">
            <div className="flex min-w-[144px] grow shrink-0 basis-0 flex-col items-start gap-6">
              <span className="w-full font-['Montserrat'] text-[14px] font-[600] leading-[20px] text-default-font -tracking-[0.01em]">
                Product
              </span>
              <div className="flex flex-col items-start gap-4">
                <LinkButton>Accounts</LinkButton>
                <LinkButton>Business</LinkButton>
                <LinkButton>Platform</LinkButton>
                <LinkButton>Send &amp; receive</LinkButton>
              </div>
            </div>
            <div className="flex min-w-[144px] grow shrink-0 basis-0 flex-col items-start gap-6">
              <span className="w-full font-['Montserrat'] text-[14px] font-[600] leading-[20px] text-default-font -tracking-[0.01em]">
                Company
              </span>
              <div className="flex flex-col items-start gap-4">
                <LinkButton>Team</LinkButton>
                <LinkButton>Press</LinkButton>
                <LinkButton>Careers</LinkButton>
              </div>
            </div>
            <div className="flex min-w-[144px] grow shrink-0 basis-0 flex-col items-start gap-6">
              <span className="w-full font-['Montserrat'] text-[14px] font-[600] leading-[20px] text-default-font -tracking-[0.01em]">
                Resources
              </span>
              <div className="flex flex-col items-start gap-4">
                <LinkButton>News</LinkButton>
                <LinkButton>Blog</LinkButton>
                <LinkButton>Help Center</LinkButton>
              </div>
            </div>
            <div className="flex min-w-[144px] grow shrink-0 basis-0 flex-col items-start gap-4 self-stretch">
              <span className="w-full font-['Montserrat'] text-[14px] font-[600] leading-[20px] text-default-font -tracking-[0.01em]">
                Follow us
              </span>
              <div className="flex w-full items-center gap-2">
                <IconButton icon={<FeatherTwitter />} />
                <IconButton icon={<FeatherGithub />} />
                <IconButton icon={<FeatherSlack />} />
              </div>
            </div>
          </div>
          <div className="flex h-px w-full flex-none flex-col items-center gap-2 bg-neutral-200" />
          <div className="flex w-full flex-wrap items-start gap-6">
            <div className="flex min-w-[144px] grow shrink-0 basis-0 items-start gap-2">
              <img
                className="h-6 flex-none object-cover"
                src="https://res.cloudinary.com/subframe/image/upload/v1711417507/shared/y2rsnhq3mex4auk54aye.png"
              />
            </div>
            <div className="flex min-w-[144px] grow shrink-0 basis-0 flex-col items-start gap-4">
              <LinkButton>Legal</LinkButton>
              <LinkButton>Give Feedback</LinkButton>
            </div>
            <div className="flex min-w-[144px] grow shrink-0 basis-0 flex-col items-start gap-4">
              <LinkButton>Privacy Policy</LinkButton>
              <LinkButton>Terms of Service</LinkButton>
            </div>
            <div className="flex min-w-[144px] grow shrink-0 basis-0 flex-col items-start gap-4">
              <LinkButton>Cookie Policy</LinkButton>
              <LinkButton>Site Map</LinkButton>
            </div>
          </div>
          <div className="flex w-full max-w-[768px] flex-col items-center gap-4">
            <span className="font-['Montserrat'] text-[14px] font-[500] leading-[20px] text-subtext-color text-center">
              © Subframe 2024
            </span>
            <span className="font-['Montserrat'] text-[14px] font-[500] leading-[20px] text-subtext-color text-center">
              Subframe is an intergalactic financial services company registered
              with the Cosmic Union. It is authorized in most galaxies, subject
              to local laws and regulations.
            </span>
          </div>
        </div>
      </div>
    );
  }
);

export const BoldFooter = BoldFooterRoot;
