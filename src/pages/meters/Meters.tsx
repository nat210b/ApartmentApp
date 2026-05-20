import { useState } from "react";

const meters = [
    { room: '101', type: 'Electric', previous: '1200', current: '1260', status: 'Recorded' },
    { room: '102', type: 'Water', previous: '540', current: '570', status: 'Recorded' },
    { room: '103', type: 'Electric', previous: '980', current: '1045', status: 'Pending' },
    { room: '104', type: 'Water', previous: '610', current: '635', status: 'Recorded' },
    { room: '105', type: 'Electric', previous: '1500', current: '1575', status: 'Pending' },
];

export default function Meters() {
    const [pageSize, setPageSize] = useState(3);
    const [currentPage, setCurrentPage] = useState(1);

    const totalPages = Math.ceil(meters.length / pageSize);
    const startIndex = (currentPage - 1) * pageSize;
    const visibleMeters = meters.slice(startIndex, startIndex + pageSize);

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
                <h1 className="pb-2">Meter Readings</h1>
                <button type="button" className="btn btn-primary">Add Reading</button>
            </div>

            <div className="room-table-wrapper">
                <table className="table mb-0">
                    <thead className="bg-secondary text-white">
                        <tr className="text-center">
                            <th>Room</th>
                            <th>Type</th>
                            <th>Previous</th>
                            <th>Current</th>
                            <th>Status</th>
                            <th className="w-25"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {visibleMeters.map((meter) => (
                            <tr className="text-center" key={`${meter.room}-${meter.type}`}>
                                <td>{meter.room}</td>
                                <td>{meter.type}</td>
                                <td>{meter.previous}</td>
                                <td>{meter.current}</td>
                                <td>{meter.status}</td>
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
