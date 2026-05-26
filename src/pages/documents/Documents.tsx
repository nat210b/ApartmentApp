export default function Documents() {
    return (
        <div className="container-fluid">
            <div className="mx-auto" style={{ maxWidth: "820px" }}>
            <div className="d-flex flex-row justify-content-between align-items-center mb-4">
                <h1 className="pb-2">Documents</h1>
                <button type="button" className="btn btn-primary">Add Document</button>
            </div>

            <div className="room-table-wrapper">
                <table className="table mb-0">
                    <thead className="bg-secondary text-white">
                        <tr className="text-center">
                            <th>Document</th>
                            <th>Type</th>
                            <th>Owner</th>
                            <th>Status</th>
                            <th className="w-25"></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="text-center">
                            <td>Lease 101</td>
                            <td>Lease Agreement</td>
                            <td>John Smith</td>
                            <td>Active</td>
                            <td className="d-flex justify-content-end">
                                <button className="btn btn-secondary">View</button>
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
