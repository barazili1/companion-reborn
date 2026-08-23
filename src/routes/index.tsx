import { createFileRoute, ClientOnly } from "@tanstack/react-router";
import { lazy, Suspense } from "react";

const App = lazy(() => import("../App"));

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "7arfoush vip - توقعات ذكية ومفاتيح تفعيل" },
      {
        name: "description",
        content:
          "DRAGON VIP: منصة توقعات احترافية مع نظام تفعيل بالمفاتيح، لوحة متصدرين، ولوحة تحكم للمشرفين.",
      },
      { property: "og:title", content: "DRAGON VIP - توقعات ذكية ومفاتيح تفعيل" },
      {
        property: "og:description",
        content:
          "منصة توقعات احترافية مع نظام تفعيل بالمفاتيح، لوحة متصدرين، ولوحة تحكم للمشرفين.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <ClientOnly fallback={<div className="min-h-screen bg-black" />}>
      <Suspense fallback={<div className="min-h-screen bg-black" />}>
        <App />
      </Suspense>
    </ClientOnly>
  );
}
