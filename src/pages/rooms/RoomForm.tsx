import { useEffect, useState } from "react";
import type { Room } from "../../schemas/Room";
import type { CreateRoomInput, UpdateRoomInput } from "../../services/rooms/RoomServices";

type RoomFormValues = {
    Number: string;
    Floor: string;
    Building: string;
    Type: string;
    Rental_Fee: string;
    Quota: string;
    Description: string;
    Status: Room["Status"];
};

type RoomFormProps = {
    room?: Room | null;
    saving?: boolean;
    onCancel: () => void;
    onSubmit: (room: CreateRoomInput | UpdateRoomInput) => Promise<void>;
};

const initialValues: RoomFormValues = {
    Number: "",
    Floor: "",
    Building: "",
    Type: "",
    Rental_Fee: "",
    Quota: "",
    Description: "",
    Status: "Available",
};

export default function RoomForm({ room, saving = false, onCancel, onSubmit }: RoomFormProps) {
    const [formValues, setFormValues] = useState<RoomFormValues>(initialValues);
    const isEdit = Boolean(room?.ID);

    useEffect(() => {
        if (!room) {
            setFormValues(initialValues);
            return;
        }

        setFormValues({
            Number: room.Number,
            Floor: String(room.Floor ?? ""),
            Building: room.Building ?? "",
            Type: room.Type,
            Rental_Fee: room.Rental_Fee,
            Quota: String(room.Quota ?? ""),
            Description: room.Description ?? "",
            Status: room.Status,
        });
    }, [room]);

    function handleInputChange(
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
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
            Number: formValues.Number,
            Floor: Number(formValues.Floor),
            Building: formValues.Building || undefined,
            Type: formValues.Type,
            Rental_Fee: formValues.Rental_Fee,
            Quota: formValues.Quota ? Number(formValues.Quota) : undefined,
            Description: formValues.Description || undefined,
            Status: formValues.Status,
            Tenant_ID: room?.Tenant_ID,
        });
    }

    return (
        <form onSubmit={handleSubmit}>
            <div className="modal-header">
                <h5 className="modal-title">{isEdit ? "Edit Room" : "Add Room"}</h5>
                <button type="button" className="btn-close" aria-label="Close" onClick={onCancel} />
            </div>

            <div className="modal-body">
                <div className="row">
                    <div className="col-md-4 mb-3">
                        <label htmlFor="roomNumber" className="form-label">Number</label>
                        <input
                            id="roomNumber"
                            name="Number"
                            type="text"
                            className="form-control"
                            value={formValues.Number}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="col-md-4 mb-3">
                        <label htmlFor="roomFloor" className="form-label">Floor</label>
                        <input
                            id="roomFloor"
                            name="Floor"
                            type="number"
                            className="form-control"
                            value={formValues.Floor}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="col-md-4 mb-3">
                        <label htmlFor="roomBuilding" className="form-label">Building</label>
                        <input
                            id="roomBuilding"
                            name="Building"
                            type="text"
                            className="form-control"
                            value={formValues.Building}
                            onChange={handleInputChange}
                        />
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-4 mb-3">
                        <label htmlFor="roomType" className="form-label">Type</label>
                        <input
                            id="roomType"
                            name="Type"
                            type="text"
                            className="form-control"
                            value={formValues.Type}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="col-md-4 mb-3">
                        <label htmlFor="rentalFee" className="form-label">Rental Fee</label>
                        <input
                            id="rentalFee"
                            name="Rental_Fee"
                            type="text"
                            className="form-control"
                            value={formValues.Rental_Fee}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="col-md-4 mb-3">
                        <label htmlFor="roomQuota" className="form-label">Qouta</label>
                        <input
                            id="roomQuota"
                            name="Quota"
                            type="number"
                            className="form-control"
                            value={formValues.Quota}
                            onChange={handleInputChange}
                        />
                    </div>
                </div>

                <div>
                    <label htmlFor="roomDescription" className="form-label">Description</label>
                    <textarea
                        id="roomDescription"
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
                    {saving ? "Saving..." : "Save Room"}
                </button>
            </div>
        </form>
    );
}
