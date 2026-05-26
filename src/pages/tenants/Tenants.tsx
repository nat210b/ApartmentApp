import { useEffect, useState } from "react";
import type { Tenant } from "../../schemas/Tenant";
import {
    createTenant,
    deleteTenant,
    getTenants,
    updateTenant,
    type CreateTenantInput,
    type UpdateTenantInput,
} from "../../services/tenants/TenantServices";
import { TenantForm } from "./TenantForm";

export default function Tenants() {
    const [tenants, setTenants] = useState<Tenant[]>([]);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");
    const [pageSize, setPageSize] = useState(3);
    const [currentPage, setCurrentPage] = useState(1);
    const [showTenantModal, setShowTenantModal] = useState(false);
    const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);
    const [savingTenant, setSavingTenant] = useState(false);
    const [deletingTenantId, setDeletingTenantId] = useState<number | null>(null);

    useEffect(() => {
        async function fetchTenants() {
            try {
                setLoading(true);
                setErrorMessage("");

                const data = await getTenants();
                setTenants(data);
            } catch (error) {
                console.error(error);
                setErrorMessage("Unable to load tenants.");
            } finally {
                setLoading(false);
            }
        }

        fetchTenants();
    }, []);

    const totalPages = Math.ceil(tenants.length / pageSize);
    const startIndex = (currentPage - 1) * pageSize;
    const visibleTenants = tenants.slice(startIndex, startIndex + pageSize);

    function handlePageSizeChange(e: React.ChangeEvent<HTMLSelectElement>) {
        setPageSize(Number(e.target.value));
        setCurrentPage(1);
    }

    function goToPage(page: number) {
        if (page < 1 || page > totalPages) return;
        setCurrentPage(page);
    }

    function openAddTenantModal() {
        setSelectedTenant(null);
        setShowTenantModal(true);
    }

    function openEditTenantModal(tenant: Tenant) {
        setSelectedTenant(tenant);
        setShowTenantModal(true);
    }

    function closeTenantModal() {
        setShowTenantModal(false);
        setSelectedTenant(null);
    }

    async function handleSaveTenant(tenantInput: CreateTenantInput | UpdateTenantInput) {
        try {
            setSavingTenant(true);
            setErrorMessage("");

            if (selectedTenant?.ID) {
                const updatedTenant = await updateTenant(selectedTenant.ID, tenantInput);
                setTenants((currentTenants) =>
                    currentTenants.map((tenant) =>
                        tenant.ID === updatedTenant.ID ? updatedTenant : tenant,
                    ),
                );
            } else {
                const createdTenant = await createTenant(tenantInput as CreateTenantInput);
                setTenants((currentTenants) => [createdTenant, ...currentTenants]);
                setCurrentPage(1);
            }

            closeTenantModal();
        } catch (error) {
            console.error(error);
            setErrorMessage("Unable to save tenant.");
        } finally {
            setSavingTenant(false);
        }
    }

    async function handleDeleteTenant(tenant: Tenant) {
        if (!tenant.ID) return;

        const tenantName = `${tenant.Firstname} ${tenant.Lastname}`.trim();
        if (!window.confirm(`Delete ${tenantName || "this tenant"}?`)) return;

        try {
            setDeletingTenantId(tenant.ID);
            setErrorMessage("");

            await deleteTenant(tenant.ID);
            setTenants((currentTenants) =>
                currentTenants.filter((currentTenant) => currentTenant.ID !== tenant.ID),
            );

            if (visibleTenants.length === 1 && currentPage > 1) {
                setCurrentPage((page) => page - 1);
            }
        } catch (error) {
            console.error(error);
            setErrorMessage("Unable to delete tenant.");
        } finally {
            setDeletingTenantId(null);
        }
    }

    return (
        <div className="container-fluid">
            <div className="mx-auto" style={{ maxWidth: "820px" }}>
                <div className="d-flex flex-row justify-content-between align-items-center mb-4">
                    <h1 className="pb-2 mb-0">Tenants</h1>
                    <button type="button" className="btn btn-primary" onClick={openAddTenantModal}>
                        Add Tenant
                    </button>
                </div>

                <div className="room-table-wrapper mt-3 overflow-hidden border rounded">
                    <table className="table mb-0">
                        <thead className="bg-secondary text-white">
                            <tr className="text-center">
                                <th>Name</th>
                                <th>DOB</th>
                                <th>ID Card</th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th className="w-25"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr className="text-center">
                                    <td colSpan={6} className="py-4 text-muted">
                                        Loading tenants...
                                    </td>
                                </tr>
                            ) : errorMessage ? (
                                <tr className="text-center">
                                    <td colSpan={6} className="py-4 text-danger">
                                        {errorMessage}
                                    </td>
                                </tr>
                            ) : visibleTenants.length > 0 ? (
                                visibleTenants.map((tenant) => (
                                    <tr className="text-center" key={tenant.ID ?? tenant.Email}>
                                        <td>{tenant.Firstname} {tenant.Lastname}</td>
                                        <td>{tenant.DOB}</td>
                                        <td>{tenant.ID_card}</td>
                                        <td>{tenant.Email}</td>
                                        <td>{tenant.Phone}</td>
                                        <td>
                                            <div className="d-flex justify-content-end" style={{ gap: "4px" }}>
                                                <button
                                                    type="button"
                                                    className="btn btn-secondary"
                                                    onClick={() => openEditTenantModal(tenant)}
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    type="button"
                                                    className="btn btn-danger"
                                                    onClick={() => handleDeleteTenant(tenant)}
                                                    disabled={deletingTenantId === tenant.ID}
                                                >
                                                    {deletingTenantId === tenant.ID ? "Deleting..." : "Delete"}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr className="text-center">
                                    <td colSpan={6} className="py-4 text-muted">
                                        No tenants found.
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
                        <button className="btn btn-outline-secondary" disabled={currentPage === 1} onClick={() => goToPage(currentPage - 1)}>Prev</button>
                        {Array.from({ length: totalPages }, (_, index) => {
                            const page = index + 1;
                            return <button key={page} className={`btn ${page === currentPage ? 'btn-primary' : 'btn-outline-secondary'}`} onClick={() => goToPage(page)}>{page}</button>;
                        })}
                        <button className="btn btn-outline-secondary" disabled={currentPage >= totalPages} onClick={() => goToPage(currentPage + 1)}>Next</button>
                    </div>
                </div>
            </div>

            {showTenantModal && (
                <>
                    <div className="modal fade show d-block" tabIndex={-1} role="dialog" aria-modal="true">
                        <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg">
                            <TenantForm
                                tenant={selectedTenant}
                                saving={savingTenant}
                                onCancel={closeTenantModal}
                                onSubmit={handleSaveTenant}
                            />
                        </div>
                    </div>
                    <div className="modal-backdrop fade show" onClick={closeTenantModal} />
                </>
            )}
        </div>
    );
}
