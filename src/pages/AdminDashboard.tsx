
import { Footer } from "../components/Footer";
import { Navbar } from "../components/Navbar";
import { AdminLayout } from "../dashboardDesign/AdminLayout";

export default function AdminDashboard() {
    return (
        <div className="h-screen">
            <Navbar />
            <AdminLayout />
            <Footer />
        </div>

    );
} 