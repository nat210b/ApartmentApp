import { useEffect, useState } from "react";
import type { Maintenance, MaintenancePriority, MaintenanceStatus } from "../../schemas/Maintenance";
import type { Room } from "../../schemas/Room";
import type {
    CreateMaintenanceInput,
    UpdateMaintenanceInput,
} from "../../services/maintenances/MaintenanceServices";
import { maintenanceIssues } from "../../data/maintenanceIssues";

type MaintenanceFormValues = {
    Room: string;
    Issue: string;
    Priority: MaintenancePriority;
    Status: MaintenanceStatus;
    Description: string;
    Fixer_By: string;
    Fixed_Date: string;
};

type MaintenanceFormProps = {
    maintenance?: Maintenance | null;
    rooms: Room[];
    saving?: boolean;
    onCancel: () => void;
    onSubmit: (maintenance: CreateMaintenanceInput | UpdateMaintenanceInput) => Promise<void>;
};

const initialValues: MaintenanceFormValues = {
    Room: "",
    Issue: "",
    Priority: "Medium",
    Status: "Open",
    Description: "",
    Fixer_By: "",
    Fixed_Date: "",
};

export default function MaintenanceForm({
    maintenance,
    rooms,
    saving = false,
    onCancel,
    onSubmit,
}: MaintenanceFormProps) {
    const [formValues, setFormValues] = useState<MaintenanceFormValues>(initialValues);
    const isEdit = Boolean(maintenance?.ID);

    useEffect(() => {
        if (!maintenance) {
            setFormValues(initialValues);
            return;
        }

        setFormValues({
            Room: String(maintenance.Room ?? ""),
            Issue: maintenance.Issue,
            Priority: maintenance.Priority,
            Status: maintenance.Status,
            Description: maintenance.Description ?? "",
            Fixer_By: maintenance.Fixer_By ?? "",
            Fixed_Date: maintenance.Fixed_Date ? maintenance.Fixed_Date.slice(0, 10) : "",
        });
    }, [maintenance]);

    function handleInputChange(
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
    ) {
        const { name, value } = e.target;
        setFormValues((currentValues) => ({
            ...currentValues,
            [name]: value,
        }));
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        await onSubmit({
            Room: Number(formValues.Room),
            Issue: formValues.Issue.trim(),
            Priority: formValues.Priority,
            Status: formValues.Status,
            Description: formValues.Description.trim() || undefined,
            Fixer_By: formValues.Fixer_By.trim() || undefined,
            Fixed_Date: formValues.Fixed_Date || undefined,
        });
    }

    return (
        <form onSubmit={handleSubmit}>
            <div className="modal-header">
                <h5 className="modal-title">{isEdit ? "Edit Maintenance" : "Add Maintenance"}</h5>
                <button type="button" className="btn-close" aria-label="Close" onClick={onCancel} />
            </div>

            <div className="modal-body">
                <div className="mb-3">
                    <label htmlFor="maintenanceRoom" className="form-label">Room</label>
                    <select
                        id="maintenanceRoom"
                        name="Room"
                        className="form-control"
                        value={formValues.Room}
                        onChange={handleInputChange}
                        required
                    >
                        <option value="">Select room</option>
                        {rooms.map((room) => (
                            <option key={room.ID} value={room.ID}>
                                {room.Number}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="mb-3">
                    <label htmlFor="maintenanceIssue" className="form-label">Issue</label>
                    <select
                        id="maintenanceIssue"
                        name="Issue"
                        className="form-control"
                        value={formValues.Issue}
                        onChange={handleInputChange}
                        required
                    >
                        <option value="">Select issue</option>
                        {maintenanceIssues.map((issue) => (
                            <option key={issue} value={issue}>
                                {issue}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="row">
                    <div className="col-md-6 mb-3">
                        <label htmlFor="maintenancePriority" className="form-label">Priority</label>
                        <select
                            id="maintenancePriority"
                            name="Priority"
                            className="form-control"
                            value={formValues.Priority}
                            onChange={handleInputChange}
                            required
                        >
                            <option value="Low">Low</option>
                            <option value="Medium">Medium</option>
                            <option value="High">High</option>
                        </select>
                    </div>
                    <div className="col-md-6 mb-3">
                        <label htmlFor="maintenanceStatus" className="form-label">Status</label>
                        <select
                            id="maintenanceStatus"
                            name="Status"
                            className="form-control"
                            value={formValues.Status}
                            onChange={handleInputChange}
                            required
                        >
                            <option value="Open">Open</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Closed">Closed</option>
                        </select>
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-6 mb-3">
                        <label htmlFor="maintenanceFixerBy" className="form-label">Fixer By</label>
                        <input
                            id="maintenanceFixerBy"
                            name="Fixer_By"
                            type="text"
                            className="form-control"
                            value={formValues.Fixer_By}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="col-md-6 mb-3">
                        <label htmlFor="maintenanceFixedDate" className="form-label">Fixed Date</label>
                        <input
                            id="maintenanceFixedDate"
                            name="Fixed_Date"
                            type="date"
                            className="form-control"
                            value={formValues.Fixed_Date}
                            onChange={handleInputChange}
                        />
                    </div>
                </div>

                <div>
                    <label htmlFor="maintenanceDescription" className="form-label">Description</label>
                    <textarea
                        id="maintenanceDescription"
                        name="Description"
                        className="form-control"
                        rows={3}
                        value={formValues.Description}
                        onChange={handleInputChange}
                    />
                </div>
            </div>

            <div className="modal-footer">
                <button type="button" className="btn btn-outline-secondary" onClick={onCancel} disabled={saving}>
                    Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                    {saving ? "Saving..." : "Save Maintenance"}
                </button>
            </div>
        </form>
    );
}
