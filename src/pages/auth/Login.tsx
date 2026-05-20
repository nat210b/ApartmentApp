import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signIn } from "../../services/auth/AuthServices";

export default function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        try {
            setLoading(true);
            setErrorMessage("");

            await signIn({ email, password });
            navigate("/");
        } catch (error) {
            console.error(error);
            setErrorMessage("ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className=" shadow-lg d-flex justify-content-center align-items-center bg-light" style={{ minHeight: "100vh" }}>
            <div
                className="card border-0"
                style={{
                    width: "100%",
                    maxWidth: "360px",
                    borderRadius: "6px",
                    boxShadow: "0 18px 45px rgba(15, 23, 42, 0.16)",
                }}
            >
                <div className="card-body px-4 py-4">
                    <div className="text-center mb-4">
                        <div
                            className="d-inline-flex align-items-center justify-content-center mb-3"
                            style={{
                                width: "52px",
                                height: "52px",
                                borderRadius: "8px",
                                backgroundColor: "#dbeafe",
                                color: "#0d47a1",
                            }}
                        >
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                                <path d="M5 21V4.5C5 3.67 5.67 3 6.5 3H14v18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M14 9h3.5c.83 0 1.5.67 1.5 1.5V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M8 7h2M8 11h2M8 15h2M16 13h1M16 17h1M4 21h17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                        </div>
                        <h1 className="h5 fw-bold mb-1" style={{ color: "#0d47a1" }}>ระบบจัดการหอพัก</h1>
                        <p className="small text-muted mb-0">กรุณาเข้าสู่ระบบเพื่อจัดการข้อมูลของคุณ</p>
                    </div>

                    {errorMessage && (
                        <div className="alert alert-danger py-2 small" role="alert">
                            {errorMessage}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label small fw-semibold">ชื่อผู้ใช้ หรือ อีเมล</label>
                            <div className="input-group">
                                <span className="input-group-text bg-white">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </span>
                                <input
                                    id="email"
                                    type="email"
                                    className="form-control"
                                    placeholder="example@domain.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    autoComplete="email"
                                    required
                                />
                            </div>
                        </div>

                        <div className="mb-3">
                            <label htmlFor="password" className="form-label small fw-semibold">รหัสผ่าน</label>
                            <div className="input-group">
                                <span className="input-group-text bg-white">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                                        <rect x="5" y="11" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="2" />
                                        <path d="M8 11V7a4 4 0 0 1 8 0v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                    </svg>
                                </span>
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    className="form-control"
                                    placeholder="********"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    autoComplete="current-password"
                                    required
                                />
                                <button
                                    type="button"
                                    className="btn btn-outline-secondary"
                                    aria-label={showPassword ? "ซ่อนรหัสผ่าน" : "แสดงรหัสผ่าน"}
                                    onClick={() => setShowPassword((currentValue) => !currentValue)}
                                >
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                                        <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <div className="form-check">
                                <input id="rememberMe" className="form-check-input" type="checkbox" />
                                <label htmlFor="rememberMe" className="form-check-label small">จดจำการใช้งาน</label>
                            </div>
                            <button type="button" className="btn btn-link btn-sm p-0 fw-semibold text-decoration-none">
                                ลืมรหัสผ่าน?
                            </button>
                        </div>

                        <button
                            type="submit"
                            className="btn w-100 text-white fw-semibold"
                            style={{ backgroundColor: "#0d47a1", borderColor: "#0d47a1", height: "44px" }}
                            disabled={loading}
                        >
                            {loading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
                            {!loading && (
                                <svg className="ms-2" width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                                    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M10 17l5-5-5-5M15 12H3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
