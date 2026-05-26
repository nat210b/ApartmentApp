import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { Stepper } from "../../components/stepper/Stepper";
import type { Tenant } from "../../schemas/Tenant";
import type {
    CreateTenantInput,
    UpdateTenantInput,
} from "../../services/tenants/TenantServices";

type ThaiSubDistrict = {
    id: number;
    zip_code: number;
    name_th: string;
    name_en: string;
    district_id: number;
};

type ThaiDistrict = {
    id: number;
    name_th: string;
    name_en: string;
    province_id: number;
    sub_districts: ThaiSubDistrict[];
};

type ThaiProvince = {
    id: number;
    name_th: string;
    name_en: string;
    districts: ThaiDistrict[];
};

type PhoneCode = {
    name: string;
    code: string;
    callingCode: string;
};

type TenantFormValues = {
    Firstname: string;
    Lastname: string;
    DOB: string;
    ID_card: string;
    AddressLine: string;
    ProvinceId: string;
    DistrictId: string;
    SubDistrictId: string;
    Postcode: string;
    Email: string;
    PhonePrefix: string;
    Phone: string;
};

type TenantFormProps = {
    tenant?: Tenant | null;
    saving?: boolean;
    onCancel: () => void;
    onSubmit: (tenant: CreateTenantInput | UpdateTenantInput) => Promise<void>;
};

const initialValues: TenantFormValues = {
    Firstname: "",
    Lastname: "",
    DOB: "",
    ID_card: "",
    AddressLine: "",
    ProvinceId: "",
    DistrictId: "",
    SubDistrictId: "",
    Postcode: "",
    Email: "",
    PhonePrefix: "+66",
    Phone: "",
};

const thaiProvinceApiUrl =
    "https://raw.githubusercontent.com/kongvut/thai-province-data/master/api/latest/province_with_district_and_sub_district.json";
const phoneCodeApiUrl = "https://apihut.in/api/country/phone-codes";
const fallbackPhoneCodes: PhoneCode[] = [
    { name: "Thailand", code: "th", callingCode: "+66" },
    { name: "United States", code: "us", callingCode: "+1" },
    { name: "India", code: "in", callingCode: "+91" },
    { name: "China", code: "cn", callingCode: "+86" },
    { name: "Japan", code: "jp", callingCode: "+81" },
];
const tenantFormSteps = [
    { id: 1, title: "Personal Details" },
    { id: 2, title: "Address" },
];

function splitPhoneNumber(phone: number | undefined, phoneCodeOptions: PhoneCode[]) {
    const phoneValue = String(phone ?? "");
    const sortedPhoneCodes = [...phoneCodeOptions].sort(
        (firstCode, secondCode) =>
            secondCode.callingCode.replace(/\D/g, "").length -
            firstCode.callingCode.replace(/\D/g, "").length,
    );
    const matchedPhoneCode = sortedPhoneCodes.find((phoneCode) =>
        phoneValue.startsWith(phoneCode.callingCode.replace(/\D/g, "")),
    );

    if (!matchedPhoneCode) {
        return {
            prefix: "+66",
            number: phoneValue,
        };
    }

    return {
        prefix: matchedPhoneCode.callingCode,
        number: phoneValue.slice(matchedPhoneCode.callingCode.replace(/\D/g, "").length),
    };
}

export function TenantForm({
    tenant,
    saving = false,
    onCancel,
    onSubmit,
}: TenantFormProps) {
    const [formValues, setFormValues] = useState<TenantFormValues>(initialValues);
    const [currentStep, setCurrentStep] = useState(1);
    const [provinces, setProvinces] = useState<ThaiProvince[]>([]);
    const [phoneCodes, setPhoneCodes] = useState<PhoneCode[]>(fallbackPhoneCodes);
    const [loadingProvinces, setLoadingProvinces] = useState(false);
    const [provinceError, setProvinceError] = useState("");
    const isEdit = Boolean(tenant?.ID);

    const selectedProvince = provinces.find(
        (province) => String(province.id) === formValues.ProvinceId,
    );
    const districts = selectedProvince?.districts ?? [];
    const selectedDistrict = districts.find(
        (district) => String(district.id) === formValues.DistrictId,
    );
    const subDistricts = selectedDistrict?.sub_districts ?? [];
    const selectedSubDistrict = subDistricts.find(
        (subDistrict) => String(subDistrict.id) === formValues.SubDistrictId,
    );

    useEffect(() => {
        const controller = new AbortController();

        async function fetchProvinces() {
            try {
                setLoadingProvinces(true);
                setProvinceError("");

                const response = await fetch(thaiProvinceApiUrl, {
                    signal: controller.signal,
                });

                if (!response.ok) {
                    throw new Error("Unable to load province data.");
                }

                const data = await response.json() as ThaiProvince[];
                setProvinces(data);
            } catch (error) {
                if (controller.signal.aborted) return;

                console.error(error);
                setProvinceError("Unable to load province options.");
            } finally {
                if (!controller.signal.aborted) {
                    setLoadingProvinces(false);
                }
            }
        }

        fetchProvinces();

        return () => controller.abort();
    }, []);

    useEffect(() => {
        const controller = new AbortController();
        const apiKey = import.meta.env.VITE_APIHUT_KEY as string | undefined;

        if (!apiKey) return;
        const avatarKey = apiKey;

        async function fetchPhoneCodes() {
            try {
                const headers = new Headers();
                headers.set("x-avatar-key", avatarKey);

                const response = await fetch(phoneCodeApiUrl, {
                    headers,
                    signal: controller.signal,
                });

                if (!response.ok) {
                    throw new Error("Unable to load phone codes.");
                }

                const result = await response.json() as { data?: PhoneCode[] };

                if (result.data?.length) {
                    setPhoneCodes(result.data);
                }
            } catch (error) {
                if (controller.signal.aborted) return;

                console.error(error);
            }
        }

        fetchPhoneCodes();

        return () => controller.abort();
    }, []);

    useEffect(() => {
        if (!tenant) {
            setFormValues(initialValues);
            setCurrentStep(1);
            return;
        }

        const phoneParts = splitPhoneNumber(tenant.Phone, phoneCodes);

        setFormValues({
            Firstname: tenant.Firstname,
            Lastname: tenant.Lastname,
            DOB: tenant.DOB,
            ID_card: String(tenant.ID_card ?? ""),
            AddressLine: tenant.Address,
            ProvinceId: "",
            DistrictId: "",
            SubDistrictId: "",
            Postcode: "",
            Email: tenant.Email,
            PhonePrefix: phoneParts.prefix,
            Phone: phoneParts.number,
        });
        setCurrentStep(1);
    }, [phoneCodes, tenant]);

    function handleInputChange(
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) {
        const { name, value } = e.target;
        setFormValues((currentValues) => ({
            ...currentValues,
            [name]: value,
        }));
    }

    function handleIdCardChange(e: ChangeEvent<HTMLInputElement>) {
        const idCardValue = e.target.value.replace(/\D/g, "").slice(0, 13);

        setFormValues((currentValues) => ({
            ...currentValues,
            ID_card: idCardValue,
        }));
    }

    function handleProvinceChange(e: ChangeEvent<HTMLSelectElement>) {
        setFormValues((currentValues) => ({
            ...currentValues,
            ProvinceId: e.target.value,
            DistrictId: "",
            SubDistrictId: "",
            Postcode: "",
        }));
    }

    function handleDistrictChange(e: ChangeEvent<HTMLSelectElement>) {
        setFormValues((currentValues) => ({
            ...currentValues,
            DistrictId: e.target.value,
            SubDistrictId: "",
            Postcode: "",
        }));
    }

    function handleSubDistrictChange(e: ChangeEvent<HTMLSelectElement>) {
        const subDistrict = subDistricts.find(
            (currentSubDistrict) => String(currentSubDistrict.id) === e.target.value,
        );

        setFormValues((currentValues) => ({
            ...currentValues,
            SubDistrictId: e.target.value,
            Postcode: subDistrict ? String(subDistrict.zip_code) : "",
        }));
    }

    function getFullAddress() {
        const addressParts = [
            formValues.AddressLine.trim(),
            selectedSubDistrict?.name_th,
            selectedDistrict?.name_th,
            selectedProvince?.name_th,
            formValues.Postcode,
        ];

        return addressParts.filter(Boolean).join(", ");
    }

    function getPhoneNumber() {
        const prefix = formValues.PhonePrefix.replace(/\D/g, "");
        const phone = formValues.Phone.replace(/\D/g, "").replace(/^0+/, "");

        return Number(`${prefix}${phone}`);
    }

    function goToAddressStep(e: React.MouseEvent<HTMLButtonElement>) {
        const form = e.currentTarget.form;
        validatePersonalStep(form);
    }

    function validatePersonalStep(form: HTMLFormElement | null) {
        const personalFields = [
            "Firstname",
            "Lastname",
            "DOB",
            "ID_card",
            "Phone",
            "Email",
        ];
        const isPersonalStepValid = personalFields.every((fieldName) => {
            const field = form?.elements.namedItem(fieldName);

            return field instanceof HTMLInputElement && field.checkValidity();
        });

        if (!isPersonalStepValid) {
            form?.reportValidity();
            return false;
        }

        setCurrentStep(2);
        return true;
    }

    function handleStepClick(stepId: number) {
        if (stepId === 1) {
            setCurrentStep(1);
            return;
        }

        if (stepId === 2) {
            const form = document.querySelector("form.modal-content");
            validatePersonalStep(form instanceof HTMLFormElement ? form : null);
        }
    }

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();

        await onSubmit({
            Firstname: formValues.Firstname.trim(),
            Lastname: formValues.Lastname.trim(),
            DOB: formValues.DOB,
            ID_card: Number(formValues.ID_card),
            Address: getFullAddress(),
            Email: formValues.Email.trim(),
            Phone: getPhoneNumber(),
        });
    }

    return (
        <form className="modal-content" onSubmit={handleSubmit}>
            <div className="modal-header">
                <h5 className="modal-title">{isEdit ? "Edit Tenant" : "Add Tenant"}</h5>
                <button type="button" className="btn-close" aria-label="Close" onClick={onCancel} />
            </div>

            <div className="modal-body">
                <div className="mb-4">
                    <Stepper
                        steps={tenantFormSteps}
                        currentStep={currentStep}
                        onStepClick={handleStepClick}
                    />
                </div>

                {currentStep === 1 ? (
                    <>
                        <h6 className="mb-3">Personal Details</h6>
                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label htmlFor="tenantFirstname" className="form-label">First Name</label>
                                <input
                                    id="tenantFirstname"
                                    name="Firstname"
                                    type="text"
                                    className="form-control"
                                    value={formValues.Firstname}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="col-md-6 mb-3">
                                <label htmlFor="tenantLastname" className="form-label">Last Name</label>
                                <input
                                    id="tenantLastname"
                                    name="Lastname"
                                    type="text"
                                    className="form-control"
                                    value={formValues.Lastname}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-md-4 mb-3">
                                <label htmlFor="tenantDOB" className="form-label">Date of Birth</label>
                                <input
                                    id="tenantDOB"
                                    name="DOB"
                                    type="date"
                                    className="form-control"
                                    value={formValues.DOB}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="col-md-4 mb-3">
                                <label htmlFor="tenantIdCard" className="form-label">ID Card</label>
                                <input
                                    id="tenantIdCard"
                                    name="ID_card"
                                    type="text"
                                    inputMode="numeric"
                                    pattern="\d{13}"
                                    className="form-control"
                                    value={formValues.ID_card}
                                    onChange={handleIdCardChange}
                                    required
                                    minLength={13}
                                    maxLength={13}
                                />
                            </div>
                            <div className="col-md-4 mb-3">
                                <label htmlFor="tenantPhone" className="form-label">Phone</label>
                                <div className="input-group">
                                    <select
                                        id="tenantPhonePrefix"
                                        name="PhonePrefix"
                                        className="form-control"
                                        style={{ maxWidth: "60px" }}
                                        value={formValues.PhonePrefix}
                                        onChange={(e) =>
                                            setFormValues((currentValues) => ({
                                                ...currentValues,
                                                PhonePrefix: e.target.value,
                                            }))
                                        }
                                        required
                                    >
                                        {phoneCodes.map((phoneCode) => (
                                            <option key={`${phoneCode.code}-${phoneCode.callingCode}`} value={phoneCode.callingCode}>
                                                {phoneCode.callingCode}
                                            </option>
                                        ))}
                                    </select>
                                    <input
                                        id="tenantPhone"
                                        name="Phone"
                                        type="tel"
                                        className="form-control"
                                        value={formValues.Phone}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="mb-3">
                            <label htmlFor="tenantEmail" className="form-label">Email</label>
                            <input
                                id="tenantEmail"
                                name="Email"
                                type="email"
                                className="form-control"
                                value={formValues.Email}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                    </>
                ) : (
                    <>
                        <h6 className="mb-3">Address</h6>

                        <div>
                            <label htmlFor="tenantAddress" className="form-label">House number / Street</label>
                            <input type="text"
                                id="tenantAddress"
                                name="AddressLine"
                                className="form-control"
                                value={formValues.AddressLine}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        <div className="row mt-3">
                            <div className="col-md-6 mb-3">
                                <label htmlFor="tenantProvince" className="form-label">Province</label>
                                <select
                                    id="tenantProvince"
                                    name="ProvinceId"
                                    className="form-control"
                                    value={formValues.ProvinceId}
                                    onChange={handleProvinceChange}
                                    disabled={loadingProvinces || Boolean(provinceError)}
                                    required
                                >
                                    <option value="">{loadingProvinces ? "Loading provinces..." : "Select province"}</option>
                                    {provinces.map((province) => (
                                        <option key={province.id} value={province.id}>
                                            {province.name_th} ({province.name_en})
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="col-md-6 mb-3">
                                <label htmlFor="tenantDistrict" className="form-label">City / District</label>
                                <select
                                    id="tenantDistrict"
                                    name="DistrictId"
                                    className="form-control"
                                    value={formValues.DistrictId}
                                    onChange={handleDistrictChange}
                                    disabled={!selectedProvince}
                                    required
                                >
                                    <option value="">Select city / district</option>
                                    {districts.map((district) => (
                                        <option key={district.id} value={district.id}>
                                            {district.name_th} ({district.name_en})
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label htmlFor="tenantSubDistrict" className="form-label">Sub-district</label>
                                <select
                                    id="tenantSubDistrict"
                                    name="SubDistrictId"
                                    className="form-control"
                                    value={formValues.SubDistrictId}
                                    onChange={handleSubDistrictChange}
                                    disabled={!selectedDistrict}
                                    required
                                >
                                    <option value="">Select sub-district</option>
                                    {subDistricts.map((subDistrict) => (
                                        <option key={subDistrict.id} value={subDistrict.id}>
                                            {subDistrict.name_th} ({subDistrict.name_en})
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="col-md-6 mb-3">
                                <label htmlFor="tenantPostcode" className="form-label">Postcode</label>
                                <input
                                    id="tenantPostcode"
                                    name="Postcode"
                                    type="text"
                                    className="form-control"
                                    value={formValues.Postcode}
                                    required
                                />
                            </div>
                        </div>

                        {provinceError && (
                            <div className="alert alert-danger py-2 mb-0" role="alert">
                                {provinceError}
                            </div>
                        )}
                    </>
                )}
            </div>

            <div className="modal-footer">
                <button type="button" className="btn btn-outline-secondary" onClick={onCancel} disabled={saving}>
                    Cancel
                </button>
                {currentStep === 2 && (
                    <button type="button" className="btn btn-outline-secondary" onClick={() => setCurrentStep(1)} disabled={saving}>
                        Back
                    </button>
                )}
                {currentStep === 1 ? (
                    <button type="button" className="btn btn-primary" onClick={goToAddressStep} disabled={saving}>
                        Next
                    </button>
                ) : (
                    <button type="submit" className="btn btn-primary" disabled={saving}>
                        {saving ? "Saving..." : "Save Tenant"}
                    </button>
                )}
            </div>
        </form>
    );
}

export default TenantForm;
