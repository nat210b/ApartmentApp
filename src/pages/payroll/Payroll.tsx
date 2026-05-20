export default function Payroll() {
    return (
        <div className="container">
            <div className="d-flex flex-row justify-content-between align-items-center mb-4">
                <h1 className="pb-2">Payroll</h1>
                <button type="button" className="btn btn-primary">Add Payroll</button>
            </div>

            <div className="room-table-wrapper">
                <table className="table mb-0">
                    <thead className="bg-secondary text-white">
                        <tr className="text-center">
                            <th>Payroll ID</th>
                            <th>Employee</th>
                            <th>Period</th>
                            <th>Amount</th>
                            <th>Status</th>
                            <th className="w-25"></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="text-center">
                            <td>PR-001</td>
                            <td>Jane Cooper</td>
                            <td>May 2026</td>
                            <td>$1,500</td>
                            <td>Pending</td>
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
