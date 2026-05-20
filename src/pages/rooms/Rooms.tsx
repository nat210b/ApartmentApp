import { useEffect, useState } from "react";
import RoomForm from "./RoomForm";
import {
    createRoom,
    getRooms,
    updateRoom,
    type CreateRoomInput,
    type UpdateRoomInput,
} from "../../services/rooms/RoomServices";
import type { Room } from "../../schemas/Room";
type RoomStatus = 'All' | 'Available' | 'Occupied' | 'Reserved' | 'Maintenance';

const roomStatusFilters: RoomStatus[] = ['All', 'Available', 'Occupied', 'Reserved', 'Maintenance'];

export default function Rooms() {
    const [rooms, setRooms] = useState<Room[]>([]);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');
    const [pageSize, setPageSize] = useState(3);
    const [currentPage, setCurrentPage] = useState(1);
    const [statusFilter, setStatusFilter] = useState<RoomStatus>('All');
    const [showAddRoomModal, setShowAddRoomModal] = useState(false);
    const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
    const [savingRoom, setSavingRoom] = useState(false);

    useEffect(() => {
        async function fetchRooms() {
            try {
                setLoading(true);
                setErrorMessage('');

                const data = await getRooms();
                setRooms(data);
            } catch (error) {
                console.error(error);
                setErrorMessage('Unable to load rooms.');
            } finally {
                setLoading(false);
            }
        }

        fetchRooms();
    }, []);

    const filteredRooms = statusFilter === 'All'
        ? rooms
        : rooms.filter((room) => room.Status === statusFilter);
    const totalPages = Math.ceil(filteredRooms.length / pageSize);
    const startIndex = (currentPage - 1) * pageSize;
    const visibleRooms = filteredRooms.slice(startIndex, startIndex + pageSize);

    function handlePageSizeChange(e: React.ChangeEvent<HTMLSelectElement>) {
        setPageSize(Number(e.target.value));
        setCurrentPage(1);
    }

    function handleStatusFilterChange(status: RoomStatus) {
        setStatusFilter(status);
        setCurrentPage(1);
    }

    function goToPage(page: number) {
        if (page < 1 || page > totalPages) return;
        setCurrentPage(page);
    }

    function openAddRoomModal() {
        setSelectedRoom(null);
        setShowAddRoomModal(true);
    }

    function openEditRoomModal(room: Room) {
        setSelectedRoom(room);
        setShowAddRoomModal(true);
    }

    function closeRoomModal() {
        setShowAddRoomModal(false);
        setSelectedRoom(null);
    }

    async function handleSaveRoom(roomInput: CreateRoomInput | UpdateRoomInput) {
        try {
            setSavingRoom(true);

            if (selectedRoom?.ID) {
                const updatedRoom = await updateRoom(selectedRoom.ID, roomInput);
                setRooms((currentRooms) =>
                    currentRooms.map((room) => room.ID === updatedRoom.ID ? updatedRoom : room),
                );
            } else {
                const createdRoom = await createRoom(roomInput as CreateRoomInput);
                setRooms((currentRooms) => [createdRoom, ...currentRooms]);
            }

            closeRoomModal();
        } catch (error) {
            console.error(error);
            setErrorMessage('Unable to save room.');
        } finally {
            setSavingRoom(false);
        }
    }

    return (
        <div className="container-fluid">
            <div className="mx-auto" style={{ maxWidth: "820px" }}>
                <div className="d-flex flex-row justify-content-between align-items-center mb-4">
                    <h1 className="pb-2 mb-0">Rooms</h1>
                    <button type="button" className="btn btn-primary" onClick={openAddRoomModal}>
                        Add Room
                    </button>
                </div>

                <div className="card">
                    <div className="d-flex justify-content-between align-items-center p-2">
                        <div className="d-flex flex-wrap" style={{ gap: "10px" }}>
                            {roomStatusFilters.map((status) => (
                                <button
                                    key={status}
                                    type="button"
                                    className={`btn ${statusFilter === status ? 'btn-primary' : 'btn-outline-secondary'}`}
                                    onClick={() => handleStatusFilterChange(status)}
                                >
                                    {status} ({status === 'All' ? rooms.length : rooms.filter((room) => room.Status === status).length})
                                </button>
                            ))}
                        </div>
                        <div className="d-flex p-2">
                            <div>
                                <button className="btn btn-outline-secondary">Export</button>
                            </div>
                        </div>
                    </div>

                </div>

                <div className="room-table-wrapper mt-3 overflow-hidden border rounded">
                    <table className="table mb-0">
                        <thead className="bg-secondary text-white">
                            <tr className="text-center">
                                <th>Room</th>
                                <th>Type</th>
                                <th>Price</th>
                                <th>Status</th>
                                <th className="w-25"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr className="text-center">
                                    <td colSpan={5} className="py-4 text-muted">
                                        Loading rooms...
                                    </td>
                                </tr>
                            ) : errorMessage ? (
                                <tr className="text-center">
                                    <td colSpan={5} className="py-4 text-danger">
                                        {errorMessage}
                                    </td>
                                </tr>
                            ) : visibleRooms.length > 0 ? (
                                visibleRooms.map((room) => (
                                    <tr className="text-center" key={room.ID ?? room.Number}>
                                        <td>{room.Number}</td>
                                        <td>{room.Type}</td>
                                        <td>{room.Rental_Fee}</td>
                                        <td>{room.Status}</td>
                                        <td>
                                            <div className="d-flex justify-content-end" style={{ gap: "4px" }}>
                                                <button className="btn btn-secondary" onClick={() => openEditRoomModal(room)}>Edit</button>
                                                <button className="btn btn-danger">Delete</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr className="text-center">
                                    <td colSpan={5} className="py-4 text-muted">
                                        No rooms found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="d-flex justify-content-between align-items-center mt-3" style={{ gap: "8px" }}>
                    <div className="d-flex align-items-center flex-grow-1">
                        <select name="pageSize" id="pageSize" value={pageSize} onChange={handlePageSizeChange} className="form-control">
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="5">5</option>
                        </select>
                    </div>

                    <div className="d-flex align-items-center" style={{ gap: "4px" }}>
                        <button className="btn btn-outline-secondary" disabled={currentPage === 1} onClick={() => goToPage(currentPage - 1)}>
                            Prev
                        </button>
                        {Array.from({ length: totalPages }, (_, index) => {
                            const page = index + 1;

                            return (
                                <button
                                    key={page}
                                    className={`btn ${page === currentPage ? 'btn-primary' : 'btn-outline-secondary'}`}
                                    onClick={() => goToPage(page)}
                                >
                                    {page}
                                </button>
                            );
                        })}
                        <button className="btn btn-outline-secondary" disabled={currentPage >= totalPages} onClick={() => goToPage(currentPage + 1)}>
                            Next
                        </button>
                    </div>
                </div>
            </div>

            {showAddRoomModal && (
                <>
                    <div className="modal fade show d-block" tabIndex={-1} role="dialog" aria-modal="true">
                        <div className="modal-dialog modal-dialog-centered">
                            <div className="modal-content">
                                <RoomForm
                                    room={selectedRoom}
                                    saving={savingRoom}
                                    onCancel={closeRoomModal}
                                    onSubmit={handleSaveRoom}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="modal-backdrop fade show" onClick={closeRoomModal} />
                </>
            )}
        </div>
    );
}
