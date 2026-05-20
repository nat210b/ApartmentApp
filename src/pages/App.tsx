import { Route, Routes } from 'react-router-dom'
import Dashboard from './dashboard/Dashboard'
import Rooms from './rooms/Rooms'
import Tenants from './tenants/Tenants'
import Payments from './payments/Payments'
import Maintenances from './maintenances/Maintenances'
import Reports from './reports/Reports'
import Leases from './leases/Leases'
import Meters from './meters/Meters'
import Parcels from './percels/Percels'
import Vehicles from './vehicles/Vehicles'
import Invoices from './invoices/Invoices'
import Complaints from './complaints/Complaints'
import MoveOutRequests from './move-out-requests/MoveOutRequests'
import Employees from './employees/Employees'
import Attendance from './attendance/Attendance'
import Payroll from './payroll/Payroll'
import Documents from './documents/Documents'
import Users from './users/Users'
import Settings from './settings/Settings'

export default function App() {
  return (
    <div className='w-100 p-4 bg-light'>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/rooms" element={<Rooms />} />
        <Route path="/tenants" element={<Tenants />} />
        <Route path="/vehicles" element={<Vehicles />} />
        <Route path="/leases" element={<Leases />} />
        <Route path="/meter" element={<Meters />} />
        <Route path="/invoices" element={<Invoices />} />
        <Route path="/payments" element={<Payments />} />
        <Route path="/maintenance" element={<Maintenances />} />
        <Route path="/complaints" element={<Complaints />} />
        <Route path="/move-out-requests" element={<MoveOutRequests />} />
        <Route path="/parcels" element={<Parcels />} />
        <Route path="/employees" element={<Employees />} />
        <Route path="/attendance" element={<Attendance />} />
        <Route path="/payroll" element={<Payroll />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/documents" element={<Documents />} />
        <Route path="/users" element={<Users />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </div>
  )
}
