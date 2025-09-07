"use client";

import { use } from "react";
import { render } from "@react-email/render";

export const RenderEmail = ({ children }: { children: React.ReactNode }) => {
  const element = <>{children}</>;
  const html = render(element);
  const htmlString = use(html);
  return <div dangerouslySetInnerHTML={{ __html: htmlString }} />;
};
