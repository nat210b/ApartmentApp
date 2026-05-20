export default function Dashboard() {
    return (
        <div className="container">
            <div className="d-flex flex-row justify-content-between align-items-center mb-4">
                <h1 className="pb-2">Dashboard</h1>
            </div>

            <div className="room-table-wrapper p-4">
                <h5 className="mb-2">Apartment Overview</h5>
                <p className="mb-0">Select a menu item from the sidebar to manage apartment data.</p>
            </div>
        </div>
    );
}
