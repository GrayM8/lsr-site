import Link from "next/link";

const adminPages = [
  {
    title: "Events",
    description: "Create, edit, and manage events.",
    href: "/admin/events",
  },
  {
    title: "Series",
    description: "Manage event series.",
    href: "/admin/series",
  },
  {
    title: "Venues",
    description: "Manage venues for events.",
    href: "/admin/venues",
  },
  {
    title: "Gallery",
    description: "Upload and manage photo gallery images.",
    href: "/admin/gallery",
  },
  {
    title: "News",
    description: "Create and manage news articles.",
    href: "/admin/news",
  },
  {
    title: "Misc. Tools",
    description: "Access miscellaneous administrative tools.",
    href: "/admin/tools",
  },
  {
    title: "Results",
    description: "Upload and manage race results.",
    href: "/admin/results",
  },
  {
    title: "Driver Mappings",
    description: "Map driver GUIDs to Users.",
    href: "/admin/drivers",
  },
];

export default function Page() {
  return (
    <main className="mx-auto max-w-6xl p-8">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {adminPages.map((page) => (
          <Link
            key={page.href}
            href={page.href}
            className="border rounded-lg p-6 hover:bg-gray-800 transition-colors"
          >
            <h2 className="text-xl font-bold mb-2">{page.title}</h2>
            <p className="text-gray-400">{page.description}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}
