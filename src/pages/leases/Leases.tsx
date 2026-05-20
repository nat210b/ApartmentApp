import { useState } from "react";

const leases = [
    { id: 'LS-001', tenant: 'John Smith', room: '101', endDate: '2026-12-31', status: 'Active' },
    { id: 'LS-002', tenant: 'Mary Johnson', room: '102', endDate: '2026-10-31', status: 'Active' },
    { id: 'LS-003', tenant: 'David Lee', room: '103', endDate: '2026-08-31', status: 'Expiring' },
    { id: 'LS-004', tenant: 'Anna Brown', room: '104', endDate: '2026-07-31', status: 'Expired' },
    { id: 'LS-005', tenant: 'Peter Chen', room: '105', endDate: '2027-01-31', status: 'Active' },
];

export default function Leases() {
    const [pageSize, setPageSize] = useState(3);
    const [currentPage, setCurrentPage] = useState(1);

    const totalPages = Math.ceil(leases.length / pageSize);
    const startIndex = (currentPage - 1) * pageSize;
    const visibleLeases = leases.slice(startIndex, startIndex + pageSize);

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
                <h1 className="pb-2">Lease Agreements</h1>
                <button type="button" className="btn btn-primary">Add Lease</button>
            </div>

            <div className="room-table-wrapper">
                <table className="table mb-0">
                    <thead className="bg-secondary text-white">
                        <tr className="text-center">
                            <th>Lease ID</th>
                            <th>Tenant</th>
                            <th>Room</th>
                            <th>End Date</th>
                            <th>Status</th>
                            <th className="w-25"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {visibleLeases.map((lease) => (
                            <tr className="text-center" key={lease.id}>
                                <td>{lease.id}</td>
                                <td>{lease.tenant}</td>
                                <td>{lease.room}</td>
                                <td>{lease.endDate}</td>
                                <td>{lease.status}</td>
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
