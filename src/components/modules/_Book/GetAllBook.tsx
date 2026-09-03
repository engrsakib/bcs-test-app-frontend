"use client";

import React, { useEffect, useState } from "react";
import {
  Search,
  Trash2,
  Edit,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  XCircle,
  GripVertical,
  Loader2,
  Filter,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { notify } from "@/lib/toast";
import { bookProxy } from "@/lib/book-api";
import { CachedDataBadge } from "@/components/offline/CachedDataBadge";
import { confirmAction } from "@/components/ui/confirm-dialog";

type BookItem = {
  _id: string;
  book_number: number;
  title: string;
  description?: string;
  is_published: boolean;
  position?: number;
  thumbnail_url: string;
  price: number;
  sold_platform: string;
  buy_url: string;
};

type BookApiResponse = {
  statusCode: number;
  success: boolean;
  message: string;
  data: {
    meta: {
      page: number;
      limit: number;
      total: number;
      totalPage: number;
    };
    data: BookItem[];
  };
};

export default function ViewAllBooks() {
  const router = useRouter();

  const [books, setBooks] = useState<BookItem[]>([]);
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);
  const [reorderingId, setReorderingId] = useState<string | null>(null);
  const [draggedBookNumber, setDraggedBookNumber] = useState<number | null>(
    null,
  );
  const [meta, setMeta] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPage: 1,
  });
  const [listCacheMeta, setListCacheMeta] = useState({
    fromCache: false,
    isStale: false,
    fetchedAt: 0,
  });

  const getPlatformBadge = (platform: string) => {
    switch (platform) {
      case "rokomari":
        return (
          <span className="px-3 py-1 rounded-full text-white text-sm bg-gradient-to-r from-teal-500 to-emerald-500">
            Rokomari
          </span>
        );
      case "wafi_life":
        return (
          <span className="px-3 py-1 rounded-full text-white text-sm bg-gradient-to-r from-purple-500 to-indigo-500">
            Wafi Life
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 rounded-full text-white text-sm bg-gradient-to-r from-gray-500 to-gray-700">
            Others
          </span>
        );
    }
  };

  const fetchBooks = async () => {
    try {
      setLoading(true);

      const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
        searchTerm,
      });

      const { ok, data: result, fromCache, isStale, fetchedAt } =
        await bookProxy<BookApiResponse>(`?${params.toString()}`, {
          method: "GET",
        });

      if (!ok) {
        throw new Error(result.message || "Failed to fetch books");
      }

      setBooks(result.data.data);
      setMeta(result.data.meta);
      setListCacheMeta({
        fromCache: Boolean(fromCache),
        isStale: Boolean(isStale),
        fetchedAt: fetchedAt ?? 0,
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Something went wrong";
      console.error("Fetch books error:", message);
      setBooks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, [page, limit, searchTerm]);

  const buildReorderPayload = (items: BookItem[]) => {
    const pageOffset = (page - 1) * limit;

    return items.map((item, index) => ({
      id: item.book_number,
      position: pageOffset + index,
    }));
  };

  const saveBookOrder = async (updatedBooks: BookItem[], activeItemId: string) => {
    const previousBooks = books;

    setBooks(updatedBooks);
    setReorderingId(activeItemId);

    try {
      const { ok, data: result } = await bookProxy<{ message?: string }>(
        "/reorder",
        {
          method: "PATCH",
          body: JSON.stringify({
            items: buildReorderPayload(updatedBooks),
          }),
        },
      );

      if (!ok) {
        throw new Error(result?.message || "Failed to update order");
      }

      notify.success(
        "Order updated successfully",
        result?.message || "Book sequence saved",
      );

      fetchBooks();
    } catch (error: unknown) {
      setBooks(previousBooks);
      const message =
        error instanceof Error ? error.message : "Something went wrong";
      notify.error("Order Update Failed", message);
    } finally {
      setReorderingId(null);
      setDraggedBookNumber(null);
    }
  };

  const moveBook = (fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex || fromIndex < 0 || toIndex < 0) return;

    const updatedBooks = [...books];
    const [movedItem] = updatedBooks.splice(fromIndex, 1);
    updatedBooks.splice(toIndex, 0, movedItem);

    saveBookOrder(updatedBooks, movedItem._id);
  };

  const handlePositionChange = (item: BookItem, nextIndex: number) => {
    const currentIndex = books.findIndex((book) => book._id === item._id);
    moveBook(currentIndex, nextIndex);
  };

  const handleDrop = (targetItem: BookItem) => {
    const currentIndex = books.findIndex(
      (book) => book.book_number === draggedBookNumber,
    );
    const nextIndex = books.findIndex((book) => book._id === targetItem._id);

    moveBook(currentIndex, nextIndex);
  };

  const handleDelete = async (book_number: number) => {
    const confirmed = await confirmAction({
      title: "Are you sure?",
      description: "This book will be deleted permanently!",
      variant: "destructive",
      confirmText: "Delete",
    });

    if (!confirmed) return;

    try {
      const { ok, data: result } = await bookProxy<{ message?: string }>(
        `/${book_number}`,
        { method: "DELETE" },
      );

      if (!ok) {
        throw new Error(result?.message || "Failed to delete book");
      }

      notify.success("Deleted!", result?.message || "Book deleted successfully!");
      fetchBooks();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Something went wrong";
      notify.error("Error", message);
    }
  };

  const handleToggle = async (book_number: number) => {
    const id = notify.loading("Updating...");

    try {
      const { ok, data: result } = await bookProxy<{ message?: string }>(
        `/${book_number}`,
        { method: "PATCH" },
      );

      if (!ok) {
        throw new Error(result?.message || "Failed to update publish status");
      }

      notify.dismiss(id);
      notify.success("Updated!", result?.message || "Publish status changed.");
      fetchBooks();
    } catch (err: unknown) {
      notify.dismiss(id);
      const message = err instanceof Error ? err.message : "Something went wrong";
      notify.error("Error", message);
    }
  };

  const handleSearch = () => {
    setPage(1);
    setSearchTerm(searchInput);
  };

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-teal-50 to-emerald-50">
      <div className="bg-teal-600 text-white p-6 rounded-2xl shadow-lg mb-6">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold">Browse and Manage Books</h1>
          <CachedDataBadge {...listCacheMeta} />
        </div>
        <p className="text-teal-100">Drag rows or use the order dropdown to set display sequence</p>
      </div>

      <div className="bg-white rounded-xl shadow-md p-5 flex flex-col gap-4">
        <div className="grid md:grid-cols-4 gap-4">
          <div className="flex items-center gap-2 border rounded-xl px-3 md:col-span-2">
            <Search size={18} className="text-gray-500" />
            <input
              type="text"
              placeholder="Search books..."
              className="py-3 outline-none w-full"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </div>

          <button
            className="bg-teal-600 text-white rounded-xl py-3 font-semibold hover:bg-teal-700"
            onClick={handleSearch}
          >
            Search
          </button>

          <button
            className="border rounded-xl py-3 font-medium hover:bg-gray-100 transition flex items-center justify-center gap-2"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter size={18} />
            Pagination
            {showFilters ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
        </div>

        <div className="flex justify-end">
          <button
            className="bg-teal-600 text-white rounded-xl px-6 py-3 font-semibold hover:bg-teal-700"
            onClick={() => router.push("/dashboard/my-book/create-book")}
          >
            + Add New Book
          </button>
        </div>

        {showFilters && (
          <div className="border rounded-xl p-4 bg-gray-50 grid md:grid-cols-3 gap-4">
            <div>
              <label className="text-gray-700 font-semibold">Page</label>
              <input
                type="number"
                className="w-full px-3 py-2 border rounded-lg mt-1"
                value={page}
                min={1}
                onChange={(e) => setPage(Number(e.target.value))}
              />
            </div>

            <div>
              <label className="text-gray-700 font-semibold">Items Per Page</label>
              <select
                className="w-full px-3 py-2 border rounded-lg mt-1"
                value={limit}
                onChange={(e) => {
                  setPage(1);
                  setLimit(Number(e.target.value));
                }}
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600"
                onClick={() => {
                  setPage(1);
                  setLimit(10);
                  setSearchInput("");
                  setSearchTerm("");
                }}
              >
                Reset Filters
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden mt-6">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px]">
            <thead className="bg-teal-600 text-white">
              <tr>
                <th className="py-3 px-4 text-center">Order</th>
                <th className="py-3 px-4 text-center">ID</th>
                <th className="py-3 px-4 text-center">Thumbnail</th>
                <th className="py-3 px-4 text-left">Title</th>
                <th className="py-3 px-4 text-left">Description</th>
                <th className="py-3 px-4 text-left">Sold Platform</th>
                <th className="py-3 px-4 text-center">Price</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={9} className="text-center py-10">
                    <div className="flex items-center justify-center gap-2 text-teal-600">
                      <Loader2 className="animate-spin" size={20} />
                      Loading books...
                    </div>
                  </td>
                </tr>
              ) : books.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-6 text-gray-500">
                    No books found
                  </td>
                </tr>
              ) : (
                books.map((book, index) => (
                  <tr
                    key={book._id}
                    draggable={!reorderingId}
                    onDragStart={() => setDraggedBookNumber(book.book_number)}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={() => handleDrop(book)}
                    onDragEnd={() => setDraggedBookNumber(null)}
                    className={`border-b transition-colors ${
                      draggedBookNumber === book.book_number
                        ? "bg-teal-50"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    <td className="px-4 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <GripVertical size={16} className="text-gray-400" />
                        <select
                          value={index}
                          disabled={!!reorderingId}
                          onChange={(e) =>
                            handlePositionChange(book, Number(e.target.value))
                          }
                          className="rounded-lg border border-gray-200 bg-white px-2 py-1 text-sm font-semibold text-gray-700 outline-none transition focus:border-teal-500 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {books.map((item, optionIndex) => (
                            <option key={item._id} value={optionIndex}>
                              {(page - 1) * limit + optionIndex + 1}
                            </option>
                          ))}
                        </select>
                        {reorderingId === book._id && (
                          <Loader2
                            className="animate-spin text-teal-600"
                            size={16}
                          />
                        )}
                      </div>
                    </td>

                    <td className="text-center py-4 font-semibold">
                      {book.book_number}
                    </td>

                    <td className="text-center py-4">
                      {book.thumbnail_url?.trim() ? (
                        <img
                          src={book.thumbnail_url}
                          alt={book.title || "Book thumbnail"}
                          className="w-16 h-16 rounded-lg object-cover shadow mx-auto"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-lg bg-gray-100 text-gray-400 text-xs flex items-center justify-center mx-auto">
                          No image
                        </div>
                      )}
                    </td>

                    <td className="py-4 font-medium">
                      {book.title
                        ? book.title.split(" ").slice(0, 3).join(" ") +
                          (book.title.split(" ").length > 3 ? "..." : "")
                        : ""}
                    </td>

                    <td className="py-4 text-gray-600 max-w-[260px]">
                      <div
                        dangerouslySetInnerHTML={{
                          __html: book.description
                            ? book.description.split(" ").slice(0, 3).join(" ") +
                              (book.description.split(" ").length > 3
                                ? "..."
                                : "")
                            : "",
                        }}
                      />
                    </td>

                    <td className="py-4">{getPlatformBadge(book.sold_platform)}</td>

                    <td className="text-center">৳ {book.price}</td>

                    <td className="text-center">
                      {book.is_published ? (
                        <span className="px-3 py-1 bg-green-100 text-green-600 rounded-full text-sm">
                          Published
                        </span>
                      ) : (
                        <span className="px-3 py-1 bg-red-100 text-red-600 rounded-full text-sm">
                          Unpublished
                        </span>
                      )}
                    </td>

                    <td className="text-center">
                      <div className="flex gap-2 justify-center">
                        <button
                          className="p-2 bg-blue-100 text-blue-600 rounded-lg"
                          onClick={() =>
                            router.push(
                              `/dashboard/my-book/update-book/${book.book_number}`,
                            )
                          }
                        >
                          <Edit size={18} />
                        </button>

                        <button
                          className="p-2 bg-teal-100 text-teal-600 rounded-lg"
                          onClick={() => handleToggle(book.book_number)}
                        >
                          {book.is_published ? (
                            <XCircle size={18} />
                          ) : (
                            <CheckCircle size={18} />
                          )}
                        </button>

                        <button
                          className="p-2 bg-red-100 text-red-600 rounded-lg"
                          onClick={() => handleDelete(book.book_number)}
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {books.length > 0 && (
          <div className="flex justify-between items-center p-4 border-t">
            <div>
              Showing {(page - 1) * limit + 1} –{" "}
              {Math.min(page * limit, meta.total)} of {meta.total}
            </div>

            <div className="flex gap-2">
              <button
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
                className="p-2 border rounded-lg disabled:opacity-40"
              >
                <ChevronLeft />
              </button>

              <span className="rounded-lg bg-teal-600 px-4 py-2 text-white">
                {meta.page}
              </span>

              <button
                disabled={page >= meta.totalPage}
                onClick={() => setPage(page + 1)}
                className="p-2 border rounded-lg disabled:opacity-40"
              >
                <ChevronRight />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
