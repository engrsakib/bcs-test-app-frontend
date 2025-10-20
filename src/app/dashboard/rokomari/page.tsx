// src/app/dashboard/rokomari/page.tsx
export default function RokomariPage() {
  const books = [
    { title: "Finance Fundamentals", link: "https://www.rokomari.com/book/finance" },
    { title: "Accounting Essentials", link: "https://www.rokomari.com/book/accounting" },
  ];
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Rokomari Resources</h2>
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {books.map((b, i) => (
          <a
            key={i}
            href={b.link}
            target="_blank"
            className="bg-white border p-4 rounded-xl shadow-sm hover:shadow-md transition"
          >
            <h3 className="font-semibold">{b.title}</h3>
            <p className="text-sm text-blue-600 mt-1">Visit Rokomari →</p>
          </a>
        ))}
      </div>
    </div>
  );
}
