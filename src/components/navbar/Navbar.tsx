import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { useNavigate } from "react-router-dom";
import { getCurrentUser, onAuthStateChange, signOut } from "../../services/auth/AuthServices";

export default function Navbar() {
    const navigate = useNavigate();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadUser() {
            try {
                const currentUser = await getCurrentUser();
                setUser(currentUser);
            } catch (error) {
                console.error(error);
                setUser(null);
            } finally {
                setLoading(false);
            }
        }

        loadUser();

        const { data } = onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
            setLoading(false);
        });

        return () => {
            data.subscription.unsubscribe();
        };
    }, []);

    async function handleSignOut() {
        try {
            await signOut();
            setUser(null);
        } catch (error) {
            console.error(error);
        }
    }

    const displayName = user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email;

    return (
        <nav className="navbar bg-white border-bottom px-4 py-2">
            <div className="container-fluid px-0">
                <span className="navbar-brand mb-0 h6">Apartment App</span>

                <div className="d-flex align-items-center ms-auto" style={{ gap: "12px" }}>
                    {loading ? (
                        <span className="text-muted small">Loading...</span>
                    ) : user ? (
                        <>
                            <div className="text-end">
                                <div className="fw-semibold">{displayName}</div>
                                <div className="text-muted small">{user.email}</div>
                            </div>
                            <button type="button" className="btn btn-sm btn-outline-secondary" onClick={handleSignOut}>
                                Logout
                            </button>
                        </>
                    ) : (
                        <button type="button" className="btn btn-sm btn-primary" onClick={() => navigate("/login")}>
                            Login
                        </button>
                    )}
                </div>
            </div>
        </nav>
    );
}
