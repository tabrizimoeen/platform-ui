import { LogOut } from "lucide-react";

export default function LogoutButton() {

    function logout() {

        localStorage.removeItem("token");

        window.location.href = "/login";
    }

    return (
        <button
            onClick={logout}
            className="
                flex
                items-center
                gap-2
                px-3
                py-2
                rounded-xl
                bg-red-50
                text-red-600
                hover:bg-red-100
                transition
            "
        >
            <LogOut size={18} />
        </button>
    );
}