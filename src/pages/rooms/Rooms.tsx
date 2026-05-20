import { useEffect, useState } from "react";
import { getRooms } from "../../services/rooms/RoomServices";
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

    return (
        <div className="container-fluid">
            <div className="d-flex flex-row justify-content-between align-items-center mb-4 ">
                <h1 className="pb-2">Rooms</h1>
                <button type="button" className="btn btn-primary">Add Room</button>
            </div>
            <div className="card">
                <div className="d-flex justify-content-between align-items-center p-2">
                    <div className="d-flex" style={{ gap: "10px" }}>
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

            <div className="room-table-wrapper mt-3">
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
                                    <td className="d-flex justify-content-end">
                                        <button className="btn btn-secondary">Edit</button>
                                        <button className="btn btn-danger">Delete</button>
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

            <div className="d-flex justify-content-between align-items-center mt-3">
                <div className="d-flex align-items-center">
                    <select name="pageSize" id="pageSize" value={pageSize} onChange={handlePageSizeChange} className="form-control w-auto">
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="5">5</option>
                    </select>
                </div>

                <div className="d-flex align-items-center">
                    <button className="btn btn-outline-secondary mr-2" disabled={currentPage === 1} onClick={() => goToPage(currentPage - 1)}>
                        Prev
                    </button>
                    {Array.from({ length: totalPages }, (_, index) => {
                        const page = index + 1;

                        return (
                            <button
                                key={page}
                                className={`btn mr-2 ${page === currentPage ? 'btn-primary' : 'btn-outline-secondary'}`}
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
    );
}
