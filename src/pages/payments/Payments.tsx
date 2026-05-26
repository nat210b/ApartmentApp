import { useState } from "react";

const payments = [
    { id: 'PAY-001', tenant: 'John Smith', room: '101', amount: '$500', status: 'Paid' },
    { id: 'PAY-002', tenant: 'Mary Johnson', room: '102', amount: '$800', status: 'Pending' },
    { id: 'PAY-003', tenant: 'David Lee', room: '103', amount: '$1200', status: 'Paid' },
    { id: 'PAY-004', tenant: 'Anna Brown', room: '104', amount: '$500', status: 'Overdue' },
    { id: 'PAY-005', tenant: 'Peter Chen', room: '105', amount: '$800', status: 'Paid' },
];

export default function Payments() {
    const [pageSize, setPageSize] = useState(3);
    const [currentPage, setCurrentPage] = useState(1);

    const totalPages = Math.ceil(payments.length / pageSize);
    const startIndex = (currentPage - 1) * pageSize;
    const visiblePayments = payments.slice(startIndex, startIndex + pageSize);

    function handlePageSizeChange(e: React.ChangeEvent<HTMLSelectElement>) {
        setPageSize(Number(e.target.value));
        setCurrentPage(1);
    }

    function goToPage(page: number) {
        if (page < 1 || page > totalPages) return;
        setCurrentPage(page);
    }

    return (
        <div className="container-fluid">
            <div className="mx-auto" style={{ maxWidth: "820px" }}>
            <div className="d-flex flex-row justify-content-between align-items-center mb-4">
                <h1 className="pb-2">Payments</h1>
                <button type="button" className="btn btn-primary">Add Payment</button>
            </div>

            <div className="room-table-wrapper">
                <table className="table mb-0">
                    <thead className="bg-secondary text-white">
                        <tr className="text-center">
                            <th>Payment ID</th>
                            <th>Tenant</th>
                            <th>Room</th>
                            <th>Amount</th>
                            <th>Status</th>
                            <th className="w-25"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {visiblePayments.map((payment) => (
                            <tr className="text-center" key={payment.id}>
                                <td>{payment.id}</td>
                                <td>{payment.tenant}</td>
                                <td>{payment.room}</td>
                                <td>{payment.amount}</td>
                                <td>{payment.status}</td>
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
        </div>
    );
}
