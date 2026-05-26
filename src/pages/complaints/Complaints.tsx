export default function Complaints() {
    return (
        <div className="container-fluid">
            <div className="mx-auto" style={{ maxWidth: "820px" }}>
            <div className="d-flex flex-row justify-content-between align-items-center mb-4">
                <h1 className="pb-2">Complaints</h1>
                <button type="button" className="btn btn-primary">Add Complaint</button>
            </div>

            <div className="room-table-wrapper">
                <table className="table mb-0">
                    <thead className="bg-secondary text-white">
                        <tr className="text-center">
                            <th>Ticket</th>
                            <th>Room</th>
                            <th>Subject</th>
                            <th>Priority</th>
                            <th>Status</th>
                            <th className="w-25"></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="text-center">
                            <td>CP-001</td>
                            <td>101</td>
                            <td>Noise complaint</td>
                            <td>Medium</td>
                            <td>Open</td>
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
