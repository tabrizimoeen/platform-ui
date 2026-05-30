import { useNavigate } from "react-router-dom";
import LanguageSwitcher from "./LanguageSwitcher";
import LogoutButton from "./LogoutButton";

export default function PageHeader({
                                       title,
                                       description,
                                       showBack = false,
                                       children
                                   }) {

    const navigate = useNavigate();

    return (
        <div className="flex justify-between items-start mb-6">

            <div>

                <div className="flex items-center gap-3">

                    {showBack && (
                        <button
                            onClick={() => navigate(-1)}
                            className="
                                w-10
                                h-10
                                rounded-xl
                                border
                                bg-white
                                hover:bg-gray-50
                            "
                        >
                            ←
                        </button>
                    )}

                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">
                            {title}
                        </h1>

                        {description && (
                            <p className="text-sm text-gray-500 mt-1">
                                {description}
                            </p>
                        )}
                    </div>

                </div>

            </div>

            <div className="flex items-center gap-2">

                {children}

                <LanguageSwitcher />

                <LogoutButton />

            </div>

        </div>
    );
}