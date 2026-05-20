import { useState } from "react";

const maintenances = [
    { ticket: 'MT-001', room: '101', issue: 'Air conditioner', priority: 'High', status: 'Open' },
    { ticket: 'MT-002', room: '102', issue: 'Water leak', priority: 'High', status: 'In Progress' },
    { ticket: 'MT-003', room: '103', issue: 'Light repair', priority: 'Low', status: 'Closed' },
    { ticket: 'MT-004', room: '104', issue: 'Door lock', priority: 'Medium', status: 'Open' },
    { ticket: 'MT-005', room: '105', issue: 'Window repair', priority: 'Low', status: 'Closed' },
];

export default function Maintenances() {
    const [pageSize, setPageSize] = useState(3);
    const [currentPage, setCurrentPage] = useState(1);

    const totalPages = Math.ceil(maintenances.length / pageSize);
    const startIndex = (currentPage - 1) * pageSize;
    const visibleMaintenances = maintenances.slice(startIndex, startIndex + pageSize);

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
                <h1 className="pb-2">Maintenances</h1>
                <button type="button" className="btn btn-primary">Add Ticket</button>
            </div>

            <div className="room-table-wrapper">
                <table className="table mb-0">
                    <thead className="bg-secondary text-white">
                        <tr className="text-center">
                            <th>Ticket</th>
                            <th>Room</th>
                            <th>Issue</th>
                            <th>Priority</th>
                            <th>Status</th>
                            <th className="w-25"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {visibleMaintenances.map((maintenance) => (
                            <tr className="text-center" key={maintenance.ticket}>
                                <td>{maintenance.ticket}</td>
                                <td>{maintenance.room}</td>
                                <td>{maintenance.issue}</td>
                                <td>{maintenance.priority}</td>
                                <td>{maintenance.status}</td>
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
