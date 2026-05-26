import { useEffect, useState } from "react";
import type { Room } from "../../schemas/Room";
import type { Tenant } from "../../schemas/Tenant";
import type { Vehicle } from "../../schemas/Vehicle";
import type { CreateVehicleInput, UpdateVehicleInput } from "../../services/vehicles/VehicleServices";
import { getVehicleModelsByBrand, vehicleBrandCategories, vehicleBrands } from "../../data/vehicleBrands";

type VehicleFormValues = {
    Brand: string;
    Model: string;
    Year: string;
    Owner_ID: string;
    Room_ID: string;
};

type VehicleFormProps = {
    vehicle?: Vehicle | null;
    rooms: Room[];
    tenants: Tenant[];
    saving?: boolean;
    onCancel: () => void;
    onSubmit: (vehicle: CreateVehicleInput | UpdateVehicleInput) => Promise<void>;
};

const initialValues: VehicleFormValues = {
    Brand: "",
    Model: "",
    Year: "",
    Owner_ID: "",
    Room_ID: "",
};

export default function VehicleForm({
    vehicle,
    rooms,
    tenants,
    saving = false,
    onCancel,
    onSubmit,
}: VehicleFormProps) {
    const [formValues, setFormValues] = useState<VehicleFormValues>(initialValues);
    const isEdit = Boolean(vehicle?.ID);
    const modelOptions = getVehicleModelsByBrand(formValues.Brand);

    useEffect(() => {
        if (!vehicle) {
            setFormValues(initialValues);
            return;
        }

        setFormValues({
            Brand: vehicle.Brand,
            Model: vehicle.Model,
            Year: String(vehicle.Year ?? ""),
            Owner_ID: String(vehicle.Owner_ID ?? ""),
            Room_ID: String(vehicle.Room_ID ?? ""),
        });
    }, [vehicle]);

    function handleInputChange(
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    ) {
        const { name, value } = e.target;
        setFormValues((currentValues) => ({
            ...currentValues,
            [name]: value,
            ...(name === "Brand" ? { Model: "" } : {}),
        }));
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        await onSubmit({
            Brand: formValues.Brand.trim(),
            Model: formValues.Model.trim(),
            Year: Number(formValues.Year),
            Owner_ID: Number(formValues.Owner_ID),
            Room_ID: Number(formValues.Room_ID),
            Created_by: vehicle?.Created_by,
        });
    }

    return (
        <form onSubmit={handleSubmit}>
            <div className="modal-header">
                <h5 className="modal-title">{isEdit ? "Edit Vehicle" : "Add Vehicle"}</h5>
                <button type="button" className="btn-close" aria-label="Close" onClick={onCancel} />
            </div>

            <div className="modal-body">
                <div className="row">
                    <div className="col-md-6 mb-3">
                        <label htmlFor="vehicleBrand" className="form-label">Brand</label>
                        <select
                            id="vehicleBrand"
                            name="Brand"
                            className="form-control"
                            value={formValues.Brand}
                            onChange={handleInputChange}
                            required
                        >
                            <option value="">Select brand</option>
                            {vehicleBrandCategories.map((category) => (
                                <optgroup key={category} label={category}>
                                    {vehicleBrands
                                        .filter((brand) => brand.category === category)
                                        .map((brand) => (
                                            <option key={brand.name} value={brand.name}>
                                                {brand.label}
                                            </option>
                                        ))}
                                </optgroup>
                            ))}
                        </select>
                    </div>
                    <div className="col-md-6 mb-3">
                        <label htmlFor="vehicleModel" className="form-label">Model</label>
                        {modelOptions.length > 0 ? (
                            <select
                                id="vehicleModel"
                                name="Model"
                                className="form-control"
                                value={formValues.Model}
                                onChange={handleInputChange}
                                required
                            >
                                <option value="">Select model</option>
                                {modelOptions.map((model) => (
                                    <option key={model} value={model}>
                                        {model}
                                    </option>
                                ))}
                            </select>
                        ) : (
                            <input
                                id="vehicleModel"
                                name="Model"
                                type="text"
                                className="form-control"
                                value={formValues.Model}
                                onChange={handleInputChange}
                                required
                            />
                        )}
                    </div>
                </div>

                <div className="mb-3">
                    <label htmlFor="vehicleYear" className="form-label">Year</label>
                    <input
                        id="vehicleYear"
                        name="Year"
                        type="number"
                        className="form-control"
                        value={formValues.Year}
                        onChange={handleInputChange}
                        min="1900"
                        max="2100"
                        required
                    />
                </div>

                <div className="row">
                    <div className="col-md-6 mb-3">
                        <label htmlFor="vehicleOwner" className="form-label">Tenant</label>
                        <select
                            id="vehicleOwner"
                            name="Owner_ID"
                            className="form-control"
                            value={formValues.Owner_ID}
                            onChange={handleInputChange}
                            required
                        >
                            <option value="">Select tenant</option>
                            {tenants.map((tenant) => (
                                <option key={tenant.ID} value={tenant.ID}>
                                    {tenant.Firstname} {tenant.Lastname}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="col-md-6 mb-3">
                        <label htmlFor="vehicleRoom" className="form-label">Room</label>
                        <select
                            id="vehicleRoom"
                            name="Room_ID"
                            className="form-control"
                            value={formValues.Room_ID}
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
                </div>
            </div>

            <div className="modal-footer">
                <button type="button" className="btn btn-outline-secondary" onClick={onCancel} disabled={saving}>
                    Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                    {saving ? "Saving..." : "Save Vehicle"}
                </button>
            </div>
        </form>
    );
}
