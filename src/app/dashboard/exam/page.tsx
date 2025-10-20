// src/app/dashboard/exam/page.tsx
export default function ExamPage() {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Exam Section</h2>
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((n) => (
          <div key={n} className="bg-white p-4 border rounded-xl shadow-sm">
            <h3 className="font-semibold text-lg">Exam {n}</h3>
            <p className="text-sm text-gray-500 mt-1">Duration: 30 min</p>
            <button className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Start Exam
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
