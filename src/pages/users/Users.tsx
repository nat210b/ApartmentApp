export default function Users() {
    return (
        <div className="container">
            <div className="d-flex flex-row justify-content-between align-items-center mb-4">
                <h1 className="pb-2">Users & Roles</h1>
                <button type="button" className="btn btn-primary">Add User</button>
            </div>

            <div className="room-table-wrapper">
                <table className="table mb-0">
                    <thead className="bg-secondary text-white">
                        <tr className="text-center">
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Status</th>
                            <th className="w-25"></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="text-center">
                            <td>Admin User</td>
                            <td>admin@example.com</td>
                            <td>Admin</td>
                            <td>Active</td>
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
