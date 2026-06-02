import {
    BrowserRouter,
    Routes,
    Route,
} from "react-router-dom";

import { Toaster } from "react-hot-toast";

import RepairsPage from "./pages/RepairsPage";
import CreateRepairPage from "./pages/CreateRepairPage";
import RepairDetailsPage from "./pages/RepairDetailsPage";
import CustomersPage from "./pages/CustomersPage";
import DashboardPage from "./pages/DashboardPage.jsx";
import TrackingPage from "./pages/TrackingPage.jsx";
import LoginPage from "./pages/LoginPage";
import CreateInvoicePage from "./pages/CreateInvoicePage";
import ProtectedRoute from "./components/ProtectedRoute";
import InvoicePage from "./pages/InvoicePage";
import CustomerDetailsPage from "./pages/CustomerDetailsPage.jsx";

export default function App() {

    return (
        <BrowserRouter>

            <Toaster
                position="top-center"
                toastOptions={{
                    duration: 4000,
                }}
            />

            <Routes>

                <Route
                    path="/track/:id"
                    element={<TrackingPage />}
                />

                <Route
                    path="/customers/:id"
                    element={
                        <ProtectedRoute>
                            <CustomerDetailsPage />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/repairs/:id/invoice"
                    element={
                        <ProtectedRoute>
                            <InvoicePage />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/login"
                    element={<LoginPage />}
                />

                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <DashboardPage />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/customers"
                    element={
                        <ProtectedRoute>
                            <CustomersPage />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/repairs/:id"
                    element={
                        <ProtectedRoute>
                            <RepairDetailsPage />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/"
                    element={
                        <ProtectedRoute>
                            <RepairsPage />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/create"
                    element={
                        <ProtectedRoute>
                            <CreateRepairPage />
                        </ProtectedRoute>
                    }
                />

            </Routes>

        </BrowserRouter>
    );
}