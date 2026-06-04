// packages/contracts/src/navigation/index.ts

import { z } from 'zod';

export const NavigationLinkSchema = z.object({
  label: z.string(),
  href: z.string(),
});

export const NavigationGroupSchema = z.object({
  title: z.string(),
  links: z.array(NavigationLinkSchema),
});

export const MegaMenuSchema = z.array(NavigationGroupSchema);

export type NavigationLink = z.infer<typeof NavigationLinkSchema>;
export type NavigationGroup = z.infer<typeof NavigationGroupSchema>;
export type MegaMenu = z.infer<typeof MegaMenuSchema>;
