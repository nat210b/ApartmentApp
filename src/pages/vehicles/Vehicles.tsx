import { useEffect, useState } from "react";
import type { Room } from "../../schemas/Room";
import type { Tenant } from "../../schemas/Tenant";
import type { Vehicle } from "../../schemas/Vehicle";
import { getRooms } from "../../services/rooms/RoomServices";
import { getTenants } from "../../services/tenants/TenantServices";
import {
    createVehicle,
    deleteVehicle,
    getVehicles,
    updateVehicle,
    type CreateVehicleInput,
    type UpdateVehicleInput,
} from "../../services/vehicles/VehicleServices";
import VehicleForm from "./VehicleForm";

export default function Vehicles() {
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [rooms, setRooms] = useState<Room[]>([]);
    const [tenants, setTenants] = useState<Tenant[]>([]);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");
    const [pageSize, setPageSize] = useState(3);
    const [currentPage, setCurrentPage] = useState(1);
    const [showVehicleModal, setShowVehicleModal] = useState(false);
    const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
    const [savingVehicle, setSavingVehicle] = useState(false);
    const [deletingVehicleId, setDeletingVehicleId] = useState<number | null>(null);

    useEffect(() => {
        async function fetchVehiclesPageData() {
            try {
                setLoading(true);
                setErrorMessage("");

                const [vehicleData, roomData, tenantData] = await Promise.all([
                    getVehicles(),
                    getRooms(),
                    getTenants(),
                ]);

                setVehicles(vehicleData);
                setRooms(roomData);
                setTenants(tenantData);
            } catch (error) {
                console.error(error);
                setErrorMessage("Unable to load vehicles.");
            } finally {
                setLoading(false);
            }
        }

        fetchVehiclesPageData();
    }, []);

    const totalPages = Math.ceil(vehicles.length / pageSize);
    const startIndex = (currentPage - 1) * pageSize;
    const visibleVehicles = vehicles.slice(startIndex, startIndex + pageSize);

    function handlePageSizeChange(e: React.ChangeEvent<HTMLSelectElement>) {
        setPageSize(Number(e.target.value));
        setCurrentPage(1);
    }

    function goToPage(page: number) {
        if (page < 1 || page > totalPages) return;
        setCurrentPage(page);
    }

    function openAddVehicleModal() {
        setSelectedVehicle(null);
        setShowVehicleModal(true);
    }

    function openEditVehicleModal(vehicle: Vehicle) {
        setSelectedVehicle(vehicle);
        setShowVehicleModal(true);
    }

    function closeVehicleModal() {
        setShowVehicleModal(false);
        setSelectedVehicle(null);
    }

    async function handleSaveVehicle(vehicleInput: CreateVehicleInput | UpdateVehicleInput) {
        try {
            setSavingVehicle(true);
            setErrorMessage("");

            if (selectedVehicle?.ID) {
                const updatedVehicle = await updateVehicle(selectedVehicle.ID, vehicleInput);
                setVehicles((currentVehicles) =>
                    currentVehicles.map((vehicle) => vehicle.ID === updatedVehicle.ID ? updatedVehicle : vehicle),
                );
            } else {
                const createdVehicle = await createVehicle(vehicleInput as CreateVehicleInput);
                setVehicles((currentVehicles) => [createdVehicle, ...currentVehicles]);
                setCurrentPage(1);
            }

            closeVehicleModal();
        } catch (error) {
            console.error(error);
            setErrorMessage("Unable to save vehicle.");
        } finally {
            setSavingVehicle(false);
        }
    }

    async function handleDeleteVehicle(vehicle: Vehicle) {
        if (!vehicle.ID) return;

        const vehicleName = `${vehicle.Brand} ${vehicle.Model}`.trim();
        if (!window.confirm(`Delete ${vehicleName || "this vehicle"}?`)) return;

        try {
            setDeletingVehicleId(vehicle.ID);
            setErrorMessage("");

            await deleteVehicle(vehicle.ID);
            setVehicles((currentVehicles) =>
                currentVehicles.filter((currentVehicle) => currentVehicle.ID !== vehicle.ID),
            );

            if (visibleVehicles.length === 1 && currentPage > 1) {
                setCurrentPage((page) => page - 1);
            }
        } catch (error) {
            console.error(error);
            setErrorMessage("Unable to delete vehicle.");
        } finally {
            setDeletingVehicleId(null);
        }
    }

    return (
        <div className="container-fluid">
            <div className="mx-auto" style={{ maxWidth: "820px" }}>
                <div className="d-flex flex-row justify-content-between align-items-center mb-4">
                    <h1 className="pb-2 mb-0">Vehicles</h1>
                    <button type="button" className="btn btn-primary" onClick={openAddVehicleModal}>
                        Add Vehicle
                    </button>
                </div>

                <div className="room-table-wrapper mt-3 overflow-hidden border rounded">
                    <table className="table mb-0">
                        <thead className="bg-secondary text-white">
                            <tr className="text-center">
                                <th>Plate</th>
                                <th>Brand</th>
                                <th>Model</th>
                                <th>Year</th>
                                <th>Tenant</th>
                                <th>Room</th>
                                <th className="w-25"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr className="text-center">
                                    <td colSpan={7} className="py-4 text-muted">
                                        Loading vehicles...
                                    </td>
                                </tr>
                            ) : errorMessage ? (
                                <tr className="text-center">
                                    <td colSpan={7} className="py-4 text-danger">
                                        {errorMessage}
                                    </td>
                                </tr>
                            ) : visibleVehicles.length > 0 ? (
                                visibleVehicles.map((vehicle) => (
                                    <tr className="text-center" key={vehicle.ID}>
                                        <td>{vehicle.Plate}</td>
                                        <td>{vehicle.Brand}</td>
                                        <td>{vehicle.Model}</td>
                                        <td>{vehicle.Year}</td>
                                        <td>
                                            {vehicle.Owner
                                                ? `${vehicle.Owner.Firstname} ${vehicle.Owner.Lastname}`
                                                : vehicle.Owner_ID}
                                        </td>
                                        <td>{vehicle.Room?.Number ?? vehicle.Room_ID}</td>
                                        <td>
                                            <div className="d-flex justify-content-end" style={{ gap: "4px" }}>
                                                <button
                                                    type="button"
                                                    className="btn btn-secondary"
                                                    onClick={() => openEditVehicleModal(vehicle)}
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    type="button"
                                                    className="btn btn-danger"
                                                    onClick={() => handleDeleteVehicle(vehicle)}
                                                    disabled={deletingVehicleId === vehicle.ID}
                                                >
                                                    {deletingVehicleId === vehicle.ID ? "Deleting..." : "Delete"}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr className="text-center">
                                    <td colSpan={7} className="py-4 text-muted">
                                        No vehicles found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="d-flex justify-content-between align-items-center mt-3" style={{ gap: "8px" }}>
                    <select value={pageSize} onChange={handlePageSizeChange} className="form-control w-auto">
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="5">5</option>
                    </select>

                    <div className="d-flex align-items-center" style={{ gap: "4px" }}>
                        <button
                            type="button"
                            className="btn btn-outline-secondary"
                            disabled={currentPage === 1}
                            onClick={() => goToPage(currentPage - 1)}
                        >
                            Prev
                        </button>
                        {Array.from({ length: totalPages }, (_, index) => {
                            const page = index + 1;

                            return (
                                <button
                                    key={page}
                                    type="button"
                                    className={`btn ${page === currentPage ? "btn-primary" : "btn-outline-secondary"}`}
                                    onClick={() => goToPage(page)}
                                >
                                    {page}
                                </button>
                            );
                        })}
                        <button
                            type="button"
                            className="btn btn-outline-secondary"
                            disabled={currentPage >= totalPages}
                            onClick={() => goToPage(currentPage + 1)}
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>

            {showVehicleModal && (
                <>
                    <div className="modal fade show d-block" tabIndex={-1} role="dialog" aria-modal="true">
                        <div className="modal-dialog modal-dialog-centered">
                            <div className="modal-content">
                                <VehicleForm
                                    vehicle={selectedVehicle}
                                    rooms={rooms}
                                    tenants={tenants}
                                    saving={savingVehicle}
                                    onCancel={closeVehicleModal}
                                    onSubmit={handleSaveVehicle}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="modal-backdrop fade show" onClick={closeVehicleModal} />
                </>
            )}
        </div>
    );
}
