export default function MoveOutRequests() {
    return (
        <div className="container-fluid">
            <div className="mx-auto" style={{ maxWidth: "820px" }}>
            <div className="d-flex flex-row justify-content-between align-items-center mb-4">
                <h1 className="pb-2">Move-out Requests</h1>
                <button type="button" className="btn btn-primary">Add Request</button>
            </div>

            <div className="room-table-wrapper">
                <table className="table mb-0">
                    <thead className="bg-secondary text-white">
                        <tr className="text-center">
                            <th>Request ID</th>
                            <th>Tenant</th>
                            <th>Room</th>
                            <th>Move-out Date</th>
                            <th>Status</th>
                            <th className="w-25"></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="text-center">
                            <td>MO-001</td>
                            <td>John Smith</td>
                            <td>101</td>
                            <td>2026-06-30</td>
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
        </div>
    );
}
