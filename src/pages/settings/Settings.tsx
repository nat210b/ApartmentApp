export default function Settings() {
    return (
        <div className="container-fluid">
            <div className="mx-auto" style={{ maxWidth: "820px" }}>
            <div className="d-flex flex-row justify-content-between align-items-center mb-4">
                <h1 className="pb-2">Settings</h1>
                <button type="button" className="btn btn-primary">Save Settings</button>
            </div>

            <div className="room-table-wrapper p-4">
                <div className="form-group">
                    <label htmlFor="apartmentName">Apartment Name</label>
                    <input id="apartmentName" className="form-control" defaultValue="Room Management" />
                </div>
                <div className="form-group mb-0">
                    <label htmlFor="currency">Currency</label>
                    <select id="currency" className="form-control">
                        <option>USD</option>
                        <option>THB</option>
                    </select>
                </div>
            </div>
            </div>
        </div>
    );
}
