import { useEffect, useMemo, useState } from "react";
import type { Maintenance } from "../../schemas/Maintenance";
import type { Room } from "../../schemas/Room";
import { getRooms } from "../../services/rooms/RoomServices";
import {
    createMaintenance,
    deleteMaintenance,
    getMaintenances,
    updateMaintenance,
    type CreateMaintenanceInput,
    type UpdateMaintenanceInput,
} from "../../services/maintenances/MaintenanceServices";
import MaintenanceForm from "./MaintenanceForm";

export default function Maintenances() {
    const [maintenances, setMaintenances] = useState<Maintenance[]>([]);
    const [rooms, setRooms] = useState<Room[]>([]);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");
    const [pageSize, setPageSize] = useState(3);
    const [currentPage, setCurrentPage] = useState(1);
    const [showMaintenanceModal, setShowMaintenanceModal] = useState(false);
    const [selectedMaintenance, setSelectedMaintenance] = useState<Maintenance | null>(null);
    const [savingMaintenance, setSavingMaintenance] = useState(false);
    const [deletingMaintenanceId, setDeletingMaintenanceId] = useState<number | null>(null);

    useEffect(() => {
        async function fetchMaintenancePageData() {
            try {
                setLoading(true);
                setErrorMessage("");

                const [maintenanceData, roomData] = await Promise.all([
                    getMaintenances(),
                    getRooms(),
                ]);

                setMaintenances(maintenanceData);
                setRooms(roomData);
            } catch (error) {
                console.error(error);
                setErrorMessage("Unable to load maintenances.");
            } finally {
                setLoading(false);
            }
        }

        fetchMaintenancePageData();
    }, []);

    const roomById = useMemo(
        () => new Map(rooms.map((room) => [room.ID, room])),
        [rooms],
    );
    const totalPages = Math.ceil(maintenances.length / pageSize);
    const startIndex = (currentPage - 1) * pageSize;
    const visibleMaintenances = maintenances.slice(startIndex, startIndex + pageSize);

    function handlePageSizeChange(e: React.ChangeEvent<HTMLSelectElement>) {
        setPageSize(Number(e.target.value));
        setCurrentPage(1);
    }

    function goToPage(page: number) {
        if (page < 1 || page > totalPages) return;
        setCurrentPage(page);
    }

    function openAddMaintenanceModal() {
        setSelectedMaintenance(null);
        setShowMaintenanceModal(true);
    }

    function openEditMaintenanceModal(maintenance: Maintenance) {
        setSelectedMaintenance(maintenance);
        setShowMaintenanceModal(true);
    }

    function closeMaintenanceModal() {
        setShowMaintenanceModal(false);
        setSelectedMaintenance(null);
    }

    async function handleSaveMaintenance(
        maintenanceInput: CreateMaintenanceInput | UpdateMaintenanceInput,
    ) {
        try {
            setSavingMaintenance(true);
            setErrorMessage("");

            if (selectedMaintenance?.ID) {
                const updatedMaintenance = await updateMaintenance(
                    selectedMaintenance.ID,
                    maintenanceInput,
                );
                setMaintenances((currentMaintenances) =>
                    currentMaintenances.map((maintenance) =>
                        maintenance.ID === updatedMaintenance.ID ? updatedMaintenance : maintenance,
                    ),
                );
            } else {
                const createdMaintenance = await createMaintenance(
                    maintenanceInput as CreateMaintenanceInput,
                );
                setMaintenances((currentMaintenances) => [createdMaintenance, ...currentMaintenances]);
                setCurrentPage(1);
            }

            closeMaintenanceModal();
        } catch (error) {
            console.error(error);
            setErrorMessage("Unable to save maintenance.");
        } finally {
            setSavingMaintenance(false);
        }
    }

    async function handleDeleteMaintenance(maintenance: Maintenance) {
        if (!maintenance.ID) return;

        if (!window.confirm(`Delete ${maintenance.Issue || "this maintenance"}?`)) return;

        try {
            setDeletingMaintenanceId(maintenance.ID);
            setErrorMessage("");

            await deleteMaintenance(maintenance.ID);
            setMaintenances((currentMaintenances) =>
                currentMaintenances.filter((currentMaintenance) => currentMaintenance.ID !== maintenance.ID),
            );

            if (visibleMaintenances.length === 1 && currentPage > 1) {
                setCurrentPage((page) => page - 1);
            }
        } catch (error) {
            console.error(error);
            setErrorMessage("Unable to delete maintenance.");
        } finally {
            setDeletingMaintenanceId(null);
        }
    }

    return (
        <div className="container-fluid">
            <div className="mx-auto" style={{ maxWidth: "820px" }}>
                <div className="d-flex flex-row justify-content-between align-items-center mb-4">
                    <h1 className="pb-2 mb-0">Maintenances</h1>
                    <button type="button" className="btn btn-primary" onClick={openAddMaintenanceModal}>
                        Add Maintenance
                    </button>
                </div>

                <div className="room-table-wrapper mt-3 overflow-hidden border rounded">
                    <table className="table mb-0">
                        <thead className="bg-secondary text-white">
                            <tr className="text-center">
                                <th>Room</th>
                                <th>Issue</th>
                                <th>Priority</th>
                                <th>Status</th>
                                <th>Fixed Date</th>
                                <th className="w-25"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr className="text-center">
                                    <td colSpan={6} className="py-4 text-muted">
                                        Loading maintenances...
                                    </td>
                                </tr>
                            ) : errorMessage ? (
                                <tr className="text-center">
                                    <td colSpan={6} className="py-4 text-danger">
                                        {errorMessage}
                                    </td>
                                </tr>
                            ) : visibleMaintenances.length > 0 ? (
                                visibleMaintenances.map((maintenance) => (
                                    <tr className="text-center" key={maintenance.ID ?? `${maintenance.Room}-${maintenance.Issue}`}>
                                        <td>{roomById.get(maintenance.Room)?.Number ?? maintenance.Room}</td>
                                        <td>{maintenance.Issue}</td>
                                        <td>{maintenance.Priority}</td>
                                        <td>{maintenance.Status}</td>
                                        <td>{maintenance.Fixed_Date ? maintenance.Fixed_Date.slice(0, 10) : "-"}</td>
                                        <td>
                                            <div className="d-flex justify-content-end" style={{ gap: "4px" }}>
                                                <button
                                                    type="button"
                                                    className="btn btn-secondary"
                                                    onClick={() => openEditMaintenanceModal(maintenance)}
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    type="button"
                                                    className="btn btn-danger"
                                                    onClick={() => handleDeleteMaintenance(maintenance)}
                                                    disabled={deletingMaintenanceId === maintenance.ID}
                                                >
                                                    {deletingMaintenanceId === maintenance.ID ? "Deleting..." : "Delete"}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr className="text-center">
                                    <td colSpan={6} className="py-4 text-muted">
                                        No maintenances found.
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

            {showMaintenanceModal && (
                <>
                    <div className="modal fade show d-block" tabIndex={-1} role="dialog" aria-modal="true">
                        <div className="modal-dialog modal-dialog-centered">
                            <div className="modal-content">
                                <MaintenanceForm
                                    maintenance={selectedMaintenance}
                                    rooms={rooms}
                                    saving={savingMaintenance}
                                    onCancel={closeMaintenanceModal}
                                    onSubmit={handleSaveMaintenance}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="modal-backdrop fade show" onClick={closeMaintenanceModal} />
                </>
            )}
        </div>
    );
}
