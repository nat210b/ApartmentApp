import { useState } from "react";

const parcels = [
    { tracking: 'PKG-001', tenant: 'John Smith', room: '101', receivedDate: '2026-05-01', status: 'Received' },
    { tracking: 'PKG-002', tenant: 'Mary Johnson', room: '102', receivedDate: '2026-05-03', status: 'Picked Up' },
    { tracking: 'PKG-003', tenant: 'David Lee', room: '103', receivedDate: '2026-05-05', status: 'Received' },
    { tracking: 'PKG-004', tenant: 'Anna Brown', room: '104', receivedDate: '2026-05-08', status: 'Picked Up' },
    { tracking: 'PKG-005', tenant: 'Peter Chen', room: '105', receivedDate: '2026-05-10', status: 'Received' },
];

export default function Parcels() {
    const [pageSize, setPageSize] = useState(3);
    const [currentPage, setCurrentPage] = useState(1);

    const totalPages = Math.ceil(parcels.length / pageSize);
    const startIndex = (currentPage - 1) * pageSize;
    const visibleParcels = parcels.slice(startIndex, startIndex + pageSize);

    function handlePageSizeChange(e: React.ChangeEvent<HTMLSelectElement>) {
        setPageSize(Number(e.target.value));
        setCurrentPage(1);
    }

    function goToPage(page: number) {
        if (page < 1 || page > totalPages) return;
        setCurrentPage(page);
    }

    return (
        <div className="container">
            <div className="d-flex flex-row justify-content-between align-items-center mb-4">
                <h1 className="pb-2">Parcels</h1>
                <button type="button" className="btn btn-primary">Add Parcel</button>
            </div>

            <div className="room-table-wrapper">
                <table className="table mb-0">
                    <thead className="bg-secondary text-white">
                        <tr className="text-center">
                            <th>Tracking</th>
                            <th>Tenant</th>
                            <th>Room</th>
                            <th>Received Date</th>
                            <th>Status</th>
                            <th className="w-25"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {visibleParcels.map((parcel) => (
                            <tr className="text-center" key={parcel.tracking}>
                                <td>{parcel.tracking}</td>
                                <td>{parcel.tenant}</td>
                                <td>{parcel.room}</td>
                                <td>{parcel.receivedDate}</td>
                                <td>{parcel.status}</td>
                                <td className="d-flex justify-content-end">
                                    <button className="btn btn-secondary">Edit</button>
                                    <button className="btn btn-danger">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="d-flex justify-content-between align-items-center mt-3">
                <select value={pageSize} onChange={handlePageSizeChange} className="form-control w-auto">
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="5">5</option>
                </select>

                <div className="d-flex align-items-center">
                    <button className="btn btn-outline-secondary mr-2" disabled={currentPage === 1} onClick={() => goToPage(currentPage - 1)}>Prev</button>
                    {Array.from({ length: totalPages }, (_, index) => {
                        const page = index + 1;
                        return <button key={page} className={`btn mr-2 ${page === currentPage ? 'btn-primary' : 'btn-outline-secondary'}`} onClick={() => goToPage(page)}>{page}</button>;
                    })}
                    <button className="btn btn-outline-secondary" disabled={currentPage === totalPages} onClick={() => goToPage(currentPage + 1)}>Next</button>
                </div>
            </div>
        </div>
    );
}
