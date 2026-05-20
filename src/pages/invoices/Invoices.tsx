export default function Invoices() {
    return (
        <div className="container">
            <div className="d-flex flex-row justify-content-between align-items-center mb-4">
                <h1 className="pb-2">Invoices</h1>
                <button type="button" className="btn btn-primary">Create Invoice</button>
            </div>

            <div className="room-table-wrapper">
                <table className="table mb-0">
                    <thead className="bg-secondary text-white">
                        <tr className="text-center">
                            <th>Invoice No.</th>
                            <th>Tenant</th>
                            <th>Room</th>
                            <th>Amount</th>
                            <th>Status</th>
                            <th className="w-25"></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="text-center">
                            <td>INV-001</td>
                            <td>John Smith</td>
                            <td>101</td>
                            <td>$500</td>
                            <td>Unpaid</td>
                            <td className="d-flex justify-content-end">
                                <button className="btn btn-secondary">Edit</button>
                                <button className="btn btn-danger">Delete</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}
