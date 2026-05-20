import { useState } from "react";

const reports = [
    { name: 'Monthly Revenue', type: 'Finance', period: 'May 2026', status: 'Ready' },
    { name: 'Occupancy Summary', type: 'Room', period: 'May 2026', status: 'Ready' },
    { name: 'Maintenance Summary', type: 'Maintenance', period: 'May 2026', status: 'Draft' },
    { name: 'Tenant List', type: 'Tenant', period: 'May 2026', status: 'Ready' },
    { name: 'Meter Usage', type: 'Utility', period: 'May 2026', status: 'Draft' },
];

export default function Reports() {
    const [pageSize, setPageSize] = useState(3);
    const [currentPage, setCurrentPage] = useState(1);

    const totalPages = Math.ceil(reports.length / pageSize);
    const startIndex = (currentPage - 1) * pageSize;
    const visibleReports = reports.slice(startIndex, startIndex + pageSize);

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
                <h1 className="pb-2">Reports</h1>
                <button type="button" className="btn btn-primary">Create Report</button>
            </div>

            <div className="room-table-wrapper">
                <table className="table mb-0">
                    <thead className="bg-secondary text-white">
                        <tr className="text-center">
                            <th>Report</th>
                            <th>Type</th>
                            <th>Period</th>
                            <th>Status</th>
                            <th className="w-25"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {visibleReports.map((report) => (
                            <tr className="text-center" key={report.name}>
                                <td>{report.name}</td>
                                <td>{report.type}</td>
                                <td>{report.period}</td>
                                <td>{report.status}</td>
                                <td className="d-flex justify-content-end">
                                    <button className="btn btn-secondary">View</button>
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
