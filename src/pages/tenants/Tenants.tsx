import { useState } from "react";

const tenants = [
    { name: 'John Smith', room: '101', phone: '555-0101', status: 'Active' },
    { name: 'Mary Johnson', room: '102', phone: '555-0102', status: 'Active' },
    { name: 'David Lee', room: '103', phone: '555-0103', status: 'Pending' },
    { name: 'Anna Brown', room: '104', phone: '555-0104', status: 'Inactive' },
    { name: 'Peter Chen', room: '105', phone: '555-0105', status: 'Active' },
];

export default function Tenants() {
    const [pageSize, setPageSize] = useState(3);
    const [currentPage, setCurrentPage] = useState(1);

    const totalPages = Math.ceil(tenants.length / pageSize);
    const startIndex = (currentPage - 1) * pageSize;
    const visibleTenants = tenants.slice(startIndex, startIndex + pageSize);

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
                <h1 className="pb-2">Tenants</h1>
                <button type="button" className="btn btn-primary">Add Tenant</button>
            </div>

            <div className="room-table-wrapper">
                <table className="table mb-0">
                    <thead className="bg-secondary text-white">
                        <tr className="text-center">
                            <th>Name</th>
                            <th>Room</th>
                            <th>Phone</th>
                            <th>Status</th>
                            <th className="w-25"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {visibleTenants.map((tenant) => (
                            <tr className="text-center" key={tenant.phone}>
                                <td>{tenant.name}</td>
                                <td>{tenant.room}</td>
                                <td>{tenant.phone}</td>
                                <td>{tenant.status}</td>
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
