"use client";



import { useCallback, useEffect, useRef, useState } from "react";

import {

  closeStudyRoom,

  createStudyRoom,

  deleteStudyRoom,

  fetchAdminStudyRoomDetail,

  fetchAdminStudyRooms,

  openStudyRoom,

  removeStudyRoomParticipant,

  type StudyRoomParticipant,

  type StudyRoomRow,

} from "@/lib/study-room-api";

import {

  connectStudyRoomAdminSocket,

  STUDY_ROOM_SOCKET_EVENTS,

} from "@/lib/study-room-socket";



function patchRowCount(rows: StudyRoomRow[], roomId: string, count: number) {

  return rows.map((r) =>

    r.id === roomId ? { ...r, participantCount: count } : r

  );

}



export default function StudyRoomsAdminPage() {

  const [rows, setRows] = useState<StudyRoomRow[]>([]);

  const [overview, setOverview] = useState<Record<string, number>>({});

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState("");

  const [topic, setTopic] = useState("");

  const [maxParticipants, setMaxParticipants] = useState(10);

  const [scheduledStartAt, setScheduledStartAt] = useState("");

  const [scheduledEndAt, setScheduledEndAt] = useState("");

  const [detailId, setDetailId] = useState<string | null>(null);

  const [participants, setParticipants] = useState<StudyRoomParticipant[]>([]);

  const [detailRoom, setDetailRoom] = useState<StudyRoomRow | null>(null);

  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);



  const load = useCallback(async () => {

    setLoading(true);

    setError(null);

    try {

      const data = await fetchAdminStudyRooms();

      setRows(data.data);

      setOverview(data.overview);

    } catch (e) {

      setError(e instanceof Error ? e.message : "Failed to load");

    } finally {

      setLoading(false);

    }

  }, []);



  const loadDetail = useCallback(async (id: string) => {

    try {

      const data = await fetchAdminStudyRoomDetail(id);

      setDetailRoom(data.room);

      setParticipants(data.participants);

    } catch (e) {

      setError(e instanceof Error ? e.message : "Failed to load participants");

    }

  }, []);



  useEffect(() => {

    void load();

  }, [load]);



  useEffect(() => {

    if (!detailId) return;

    void loadDetail(detailId);

  }, [detailId, loadDetail]);



  useEffect(() => {

    const socket = connectStudyRoomAdminSocket();

    if (!socket) return;



    const onCapacity = (payload: {

      roomId: string;

      participantCount: number;

    }) => {

      setRows((prev) => patchRowCount(prev, payload.roomId, payload.participantCount));

      if (detailId === payload.roomId) {

        setDetailRoom((prev) =>

          prev ? { ...prev, participantCount: payload.participantCount } : prev

        );

        void loadDetail(payload.roomId);

      }

    };



    const refreshList = () => void load();



    socket.on(STUDY_ROOM_SOCKET_EVENTS.CAPACITY_UPDATED, onCapacity);

    socket.on(STUDY_ROOM_SOCKET_EVENTS.CREATED, refreshList);

    socket.on(STUDY_ROOM_SOCKET_EVENTS.UPDATED, refreshList);

    socket.on(STUDY_ROOM_SOCKET_EVENTS.OPENED, refreshList);

    socket.on(STUDY_ROOM_SOCKET_EVENTS.CLOSED, refreshList);

    socket.on(STUDY_ROOM_SOCKET_EVENTS.DELETED, refreshList);



    socket.on("connect", () => {

      if (pollRef.current) clearInterval(pollRef.current);

    });

    socket.on("disconnect", () => {

      if (pollRef.current) clearInterval(pollRef.current);

      pollRef.current = setInterval(() => void load(), 30_000);

    });



    return () => {

      socket.off(STUDY_ROOM_SOCKET_EVENTS.CAPACITY_UPDATED, onCapacity);

      socket.disconnect();

      if (pollRef.current) clearInterval(pollRef.current);

    };

  }, [load, loadDetail, detailId]);



  async function handleCreate(e: React.FormEvent) {

    e.preventDefault();

    if (maxParticipants < 1 || maxParticipants > 20) {

      setError("Maximum participants must be between 1 and 20");

      return;

    }

    try {

      await createStudyRoom({

        title,

        topic,

        maxParticipants,

        scheduledStartAt: scheduledStartAt || undefined,

        scheduledEndAt: scheduledEndAt || undefined,

      });

      setTitle("");

      setTopic("");

      setMaxParticipants(10);

      setScheduledStartAt("");

      setScheduledEndAt("");

      await load();

    } catch (err) {

      setError(err instanceof Error ? err.message : "Create failed");

    }

  }



  async function handleRemoveParticipant(userId: string) {

    if (!detailId || !confirm("Remove this participant from the room?")) return;

    try {

      await removeStudyRoomParticipant(detailId, userId);

      await loadDetail(detailId);

      await load();

    } catch (e) {

      setError(e instanceof Error ? e.message : "Remove failed");

    }

  }



  return (

    <div className="space-y-6 p-4 md:p-6">

      <div>

        <h1 className="text-2xl font-semibold text-gray-900">Study Rooms</h1>

        <p className="text-sm text-gray-600">

          Audio-first group study rooms with LiveKit (max 20 participants per room).

        </p>

      </div>



      {error ? (

        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>

      ) : null}



      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">

        {Object.entries(overview).map(([key, value]) => (

          <div key={key} className="rounded-lg border bg-white p-3 shadow-sm">

            <p className="text-xs uppercase text-gray-500">{key}</p>

            <p className="text-xl font-semibold">{value}</p>

          </div>

        ))}

      </div>



      <form

        onSubmit={handleCreate}

        className="grid gap-3 rounded-xl border bg-white p-4 shadow-sm md:grid-cols-2"

      >

        <h2 className="md:col-span-2 text-lg font-medium">Create room</h2>

        <input

          required

          placeholder="Room title"

          value={title}

          onChange={(e) => setTitle(e.target.value)}

          className="rounded border px-3 py-2"

        />

        <input

          placeholder="Topic"

          value={topic}

          onChange={(e) => setTopic(e.target.value)}

          className="rounded border px-3 py-2"

        />

        <label className="flex flex-col gap-1 text-sm">

          Max participants (1–20)

          <input

            type="number"

            min={1}

            max={20}

            value={maxParticipants}

            onChange={(e) => setMaxParticipants(Number(e.target.value))}

            className="rounded border px-3 py-2"

          />

        </label>

        <input

          type="datetime-local"

          value={scheduledStartAt}

          onChange={(e) => setScheduledStartAt(e.target.value)}

          className="rounded border px-3 py-2"

        />

        <input

          type="datetime-local"

          value={scheduledEndAt}

          onChange={(e) => setScheduledEndAt(e.target.value)}

          className="rounded border px-3 py-2"

        />

        <button

          type="submit"

          className="md:col-span-2 rounded bg-emerald-700 px-4 py-2 text-white hover:bg-emerald-800"

        >

          Create study room

        </button>

      </form>



      <div className="overflow-x-auto rounded-xl border bg-white shadow-sm">

        <table className="min-w-full text-left text-sm">

          <thead className="border-b bg-gray-50 text-xs uppercase text-gray-600">

            <tr>

              <th className="px-3 py-2">Title</th>

              <th className="px-3 py-2">Status</th>

              <th className="px-3 py-2">Capacity</th>

              <th className="px-3 py-2">Opens</th>

              <th className="px-3 py-2">Actions</th>

            </tr>

          </thead>

          <tbody>

            {loading ? (

              <tr>

                <td colSpan={5} className="px-3 py-4 text-gray-500">

                  Loading…

                </td>

              </tr>

            ) : (

              rows.map((room) => (

                <tr key={room.id} className="border-b">

                  <td className="px-3 py-2">

                    <div className="font-medium">{room.title}</div>

                    <div className="text-xs text-gray-500">{room.topic}</div>

                  </td>

                  <td className="px-3 py-2 capitalize">{room.status}</td>

                  <td className="px-3 py-2">

                    {room.participantCount} / {room.maxParticipants}

                  </td>

                  <td className="px-3 py-2 text-xs">

                    {room.scheduledStartAt

                      ? new Date(room.scheduledStartAt).toLocaleString()

                      : "—"}

                  </td>

                  <td className="px-3 py-2">

                    <div className="flex flex-wrap gap-2">

                      <button

                        type="button"

                        className="rounded border px-2 py-1 text-xs"

                        onClick={() => setDetailId(room.id)}

                      >

                        Participants

                      </button>

                      {room.status !== "active" ? (

                        <button

                          type="button"

                          className="rounded border px-2 py-1 text-xs"

                          onClick={() => openStudyRoom(room.id).then(load)}

                        >

                          Open

                        </button>

                      ) : (

                        <button

                          type="button"

                          className="rounded border px-2 py-1 text-xs"

                          onClick={() => {

                            if (confirm("Close this room and disconnect users?")) {

                              void closeStudyRoom(room.id).then(load);

                            }

                          }}

                        >

                          Close

                        </button>

                      )}

                      <button

                        type="button"

                        className="rounded border border-red-200 px-2 py-1 text-xs text-red-700"

                        onClick={() => {

                          if (confirm("Delete this study room?")) {

                            void deleteStudyRoom(room.id).then(load);

                          }

                        }}

                      >

                        Delete

                      </button>

                    </div>

                  </td>

                </tr>

              ))

            )}

          </tbody>

        </table>

      </div>



      {detailId && detailRoom ? (

        <aside className="fixed inset-y-0 right-0 z-40 w-full max-w-md border-l bg-white p-4 shadow-xl">

          <div className="flex items-start justify-between gap-2">

            <div>

              <h2 className="text-lg font-semibold">{detailRoom.title}</h2>

              <p className="text-sm text-gray-600">

                {detailRoom.participantCount} / {detailRoom.maxParticipants} in room

              </p>

            </div>

            <button

              type="button"

              className="rounded border px-2 py-1 text-sm"

              onClick={() => {

                setDetailId(null);

                setDetailRoom(null);

                setParticipants([]);

              }}

            >

              Close

            </button>

          </div>

          <ul className="mt-4 space-y-2">

            {participants.length === 0 ? (

              <li className="text-sm text-gray-500">No active participants.</li>

            ) : (

              participants.map((p) => (

                <li

                  key={p.userId}

                  className="flex items-center justify-between rounded border px-3 py-2 text-sm"

                >

                  <div>

                    <p className="font-medium">{p.userName ?? p.userId}</p>

                    <p className="text-xs capitalize text-gray-500">{p.state}</p>

                  </div>

                  <button

                    type="button"

                    className="text-xs text-red-700"

                    onClick={() => void handleRemoveParticipant(p.userId)}

                  >

                    Remove

                  </button>

                </li>

              ))

            )}

          </ul>

        </aside>

      ) : null}

    </div>

  );

}

