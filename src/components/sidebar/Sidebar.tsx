import './Sidebar.css'
import { NavLink } from 'react-router-dom';

export function Sidebar() {
    const menu = [
        { name: 'Dashboard', link: '/' },

        { name: 'Rooms', link: '/rooms' },
        { name: 'Tenants', link: '/tenants' },
        { name: 'Vehicles', link: '/vehicles' },
        { name: 'Lease Agreements', link: '/leases' },

        { name: 'Meter Readings', link: '/meter' },
        { name: 'Invoices', link: '/invoices' },
        { name: 'Payments', link: '/payments' },

        { name: 'Maintenance', link: '/maintenance' },
        { name: 'Complaints', link: '/complaints' },
        { name: 'Move-out Requests', link: '/move-out-requests' },
        { name: 'Parcels', link: '/parcels' },

        { name: 'Employees', link: '/employees' },
        { name: 'Attendance', link: '/attendance' },
        { name: 'Payroll', link: '/payroll' },

        { name: 'Reports', link: '/reports' },
        { name: 'Documents', link: '/documents' },
        { name: 'Users & Roles', link: '/users' },
        { name: 'Settings', link: '/settings' },
    ];

    return (
        <div className="sidebar border border-r-2 border-gray-300" style={{ width: '250px', height: '100vh' }}>
            <div className="p-3 text-light">
                <h5>Room Management</h5>
            </div>
            {menu.map((item) => (
                <NavLink 
                    key={item.link}
                    className={({ isActive }) => `menuItem ${isActive ? 'active' : ''}`}
                    to={item.link}
                    end={item.link === '/'}
                >
                    {item.name}
                </NavLink>
            ))}
        </div>
    );
}

export default Sidebar;
