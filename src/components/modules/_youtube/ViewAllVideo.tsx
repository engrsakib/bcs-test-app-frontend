"use client";
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Video,
  Search,
  Globe,
  Lock,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  Edit,
  Trash2,
} from "lucide-react";
import Swal from "sweetalert2";
import Link from "next/link";

// Demo data
const videosData = [
  {
    id: 1,
    thumbnailLink: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
    title: "System Configuration Class 2",
    description: "Complete system configuration tutorial",
    videoLink: "https://youtube.com/watch?v=dQw4w9WgXcQ",
    duration: "29:28",
    visibility: "Unlisted",
    restrictions: "None",
    date: "Nov 16, 2025",
    status: "Uploaded",
    views: 1,
    comments: 0,
    likes: 0,
    isPublished: false,
  },
  {
    id: 2,
    thumbnailLink: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
    title: "System Configuration Class 2",
    description: "Complete system configuration tutorial",
    videoLink: "https://youtube.com/watch?v=dQw4w9WgXcQ",
    duration: "29:28",
    visibility: "Unlisted",
    restrictions: "None",
    date: "Nov 16, 2025",
    status: "Uploaded",
    views: 1,
    comments: 0,
    likes: 0,
    isPublished: false,
  },
  {
    id: 3,
    thumbnailLink: "https://img.youtube.com/vi/abc123/maxresdefault.jpg",
    title: "Numerical Analysis Class 1",
    description: "Base Analysis - Fazle Rabbi Lecturer DIU",
    videoLink: "https://youtube.com/watch?v=abc123",
    duration: "50:43",
    visibility: "Unlisted",
    restrictions: "None",
    date: "Oct 8, 2025",
    status: "Uploaded",
    views: 7,
    comments: 0,
    likes: 0,
    isPublished: false,
  },
];

export default function ViewAllVideos() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"date" | "views" | "title">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Filter + Sort
  const filteredAndSortedVideos = useMemo(() => {
    let filtered = videosData.filter(
      (video) =>
        video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        video.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    filtered.sort((a, b) => {
      let comparison = 0;
      if (sortBy === "date") {
        comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
      } else if (sortBy === "views") {
        comparison = a.views - b.views;
      } else if (sortBy === "title") {
        comparison = a.title.localeCompare(b.title);
      }
      return sortOrder === "asc" ? comparison : -comparison;
    });

    return filtered;
  }, [searchQuery, sortBy, sortOrder]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedVideos.length / itemsPerPage);
  const paginatedVideos = filteredAndSortedVideos.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSort = (column: "date" | "views" | "title") => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("desc");
    }
  };

  const handleDelete = (id: number, title: string) => {
    Swal.fire({
      title: "Delete Video?",
      text: `Are you sure you want to delete "${title}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#166534",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it!",
    });
  };

  const handleEdit = (id: number) => {
    router.push(`/dashboard/youtube/edit-video/${id}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow p-6 border border-gray-200 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-800 rounded-xl flex justify-center items-center shadow-lg">
                <Video className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
               All Uploaded Videos
                </h1>
                <p className="text-sm text-gray-600">
                  {filteredAndSortedVideos.length} videos found
                </p>
              </div>
            </div>






            {/* Search */}
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search videos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-800"
              />
            
            </div>


            
<Link href={"/dashboard/youtube/create-video"}>

                            <button
  className="
    flex justify-end items-center gap-2 mt-2.5
    bg-green-800 hover:bg-green-700 
    text-white font-semibold 
    px-5 py-3 rounded-lg 
    shadow-md hover:shadow-lg 
    transition-all
  "
>
  <Video className="w-5 h-5" />
  Create Video
</button>

</Link>


          </div>



        </div>

        {/* Create Button */}







        {/* Table */}
        <div className="bg-white rounded-xl shadow border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100 border-b border-gray-200">
                <tr>
                  <th className="text-left px-6 py-4">
                    <input type="checkbox" className="w-4 h-4" />
                  </th>

                  <th className="text-left px-6 py-4">
                    <button
                      onClick={() => handleSort("title")}
                      className="flex items-center gap-2 font-semibold text-gray-700 hover:text-green-800"
                    >
                      Video <ArrowUpDown className="w-4 h-4" />
                    </button>
                  </th>

                  <th className="text-left px-6 py-4">Visibility</th>
                  <th className="text-left px-6 py-4">Restrictions</th>

                  <th className="text-left px-6 py-4">
                    <button
                      onClick={() => handleSort("date")}
                      className="flex items-center gap-2 font-semibold text-gray-700 hover:text-green-800"
                    >
                      Date <ArrowUpDown className="w-4 h-4" />
                    </button>
                  </th>

                  <th className="text-left px-6 py-4">
                    <button
                      onClick={() => handleSort("views")}
                      className="flex items-center gap-2 font-semibold text-gray-700 hover:text-green-800"
                    >
                      Views <ArrowUpDown className="w-4 h-4" />
                    </button>
                  </th>

                  <th className="text-left px-6 py-4">Comments</th>
                  <th className="text-left px-6 py-4">Likes</th>
                  <th className="text-left px-6 py-4">Actions</th>
                </tr>
              </thead>

              <tbody>
                {paginatedVideos.map((video) => (
                  <tr key={video.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <input type="checkbox" className="w-4 h-4" />
                    </td>

                    {/* Video Info */}
                    <td className="px-6 py-4">
                      <div className="flex gap-3">
                        <div className="relative">
                          <img
                            src={video.thumbnailLink}
                            className="w-32 h-20 rounded-lg border border-gray-300 object-cover"
                          />
                          <span className="absolute bottom-1 right-1 bg-black/70 text-white text-xs px-1 rounded">
                            {video.duration}
                          </span>
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 text-sm mb-1">
                            {video.title}
                          </h3>
                          <p className="text-xs text-gray-600 line-clamp-1">
                            {video.description}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Visibility */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {video.visibility === "Public" ? (
                          <>
                            <Globe className="w-4 h-4 text-green-700" />
                            <span>Public</span>
                          </>
                        ) : (
                          <>
                            <Lock className="w-4 h-4 text-gray-600" />
                            <span>Unlisted</span>
                          </>
                        )}
                      </div>
                    </td>

                    <td className="px-6 py-4">{video.restrictions}</td>

                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium">{video.date}</p>
                        <p className="text-xs text-gray-500">{video.status}</p>
                      </div>
                    </td>

                    <td className="px-6 py-4">{video.views}</td>
                    <td className="px-6 py-4">{video.comments}</td>
                    <td className="px-6 py-4">{video.likes || "–"}</td>

                    {/* Actions */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(video.id)}
                          className="p-2 hover:bg-gray-100 rounded-lg"
                        >
                          <Edit className="w-4 h-4 text-blue-600" />
                        </button>
                        <button
                          onClick={() => handleDelete(video.id, video.title)}
                          className="p-2 hover:bg-gray-100 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4 text-green-800" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
            <p className="text-sm text-gray-700">
              Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
              {Math.min(currentPage * itemsPerPage, filteredAndSortedVideos.length)}{" "}
              of {filteredAndSortedVideos.length} videos
            </p>

            <div className="flex items-center gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-4 py-2 rounded-lg ${
                    currentPage === page
                      ? "bg-green-800 text-white"
                      : "border border-gray-300 hover:bg-gray-100"
                  }`}
                >
                  {page}
                </button>
              ))}

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
