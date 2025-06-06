// src/pages/user/AccountManagementPage/AccountPage.jsx
import { useMemo, useState, useEffect } from "react";
import { useLocation, useNavigate, Outlet } from "react-router-dom";
import { User, Shield, Package, ChevronRight } from "lucide-react";
import HeaderBreadcrumb from "@u_components/shared/HeaderBreadcrumb.jsx";
import { useOrderStats } from "@u_hooks/useOrderStats.js";

export default function AccountPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const {
        data: statsData,
        isLoading: statsLoading,
        isError: statsError,
    } = useOrderStats();
    const inProgressCount = statsData?.totalInProgress ?? 0;

    const tabs = [
        {
            id: "personal",
            label: "Personal Information",
            path: "/me",
            icon: User,
            description: "Manage your profile and personal details",
            badge: null,
        },
        {
            id: "security",
            label: "Security",
            path: "/me/security",
            icon: Shield,
            description: "Password and security settings",
            badge: null,
        },
        {
            id: "orders",
            label: "My Orders",
            path: "/me/orders",
            icon: Package,
            description: "View your order history and tracking",
            badge: inProgressCount,
        },
    ];

    const getActiveTab = () => {
        const sub = location.pathname.replace(/^\/me\/?/, "");
        if (sub.startsWith("security")) return "security";
        if (sub.startsWith("orders")) return "orders";
        return "personal";
    };

    const [activeTab, setActiveTab] = useState(getActiveTab());

    useEffect(() => {
        setActiveTab(getActiveTab());
    }, [location.pathname]);

    const handleTabChange = (tab) => {
        if (activeTab === tab.id) return;

        setIsLoading(true);
        setActiveTab(tab.id);

        setTimeout(() => {
            navigate(tab.path);
            setIsLoading(false);
        }, 150);
    };

    const handleKeyDown = (event, tab) => {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            handleTabChange(tab);
        }
    };

    const MemoHeader = useMemo(
        () => (
            <HeaderBreadcrumb
                title="My Account"
                crumbs={[
                    { name: "Home", path: "/" },
                    { name: "Account Information", path: `/me` },
                ]}
            />
        ),
        []
    );

    const activeTabData = tabs.find((tab) => tab.id === activeTab);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            {MemoHeader}
            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Tab Header */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                    {/* Tab Navigation */}
                    <div className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-200">
                        <div className="px-6 py-4">
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900">
                                        Account Settings
                                    </h1>
                                    <p className="text-gray-600 text-sm mt-1">
                                        Manage your account preferences and settings
                                    </p>
                                </div>
                                {activeTabData && (
                                    <div className="hidden md:flex items-center text-sm text-gray-500">
                                        <span>Current:</span>
                                        <ChevronRight size={16} className="mx-2" />
                                        <span className="font-medium text-[#1C387F]">
                                          {activeTabData.label}
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Tab Navigation */}
                            <nav className="flex space-x-6" role="tablist">
                                {tabs.map((tab) => {
                                    const Icon = tab.icon;
                                    const isActive = activeTab === tab.id;

                                    return (
                                        <button
                                            key={tab.id}
                                            onClick={() => handleTabChange(tab)}
                                            onKeyDown={(e) => handleKeyDown(e, tab)}
                                            role="tab"
                                            aria-selected={isActive}
                                            aria-controls={`panel-${tab.id}`}
                                            className={`group relative flex items-center space-x-3 px-6 py-4 rounded-xl font-medium text-sm transition-all duration-300 ease-in-out transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-[#1C387F] focus:ring-offset-2 ${
                                                isActive
                                                    ? "bg-[#1C387F] text-white shadow-lg shadow-[#1C387F]/25"
                                                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                                            }`}
                                        >
                                            <div className="relative">
                                                <Icon
                                                    size={20}
                                                    className={`transition-transform duration-300 ${
                                                        isActive ? "scale-110" : "group-hover:scale-105"
                                                    }`}
                                                />
                                                {tab.badge && (
                                                    <span
                                                        className="absolute -top-2 -right-2 bg-red-500 text-white text-[9px] rounded-full h-4 w-4 flex items-center justify-center font-bold"
                                                    >
                                                        {tab.badge}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex flex-col items-start">
                                                <span className="font-semibold">{tab.label}</span>
                                                <span
                                                    className={`text-xs mt-0.5 transition-colors duration-300 ${
                                                        isActive
                                                            ? "text-blue-100"
                                                            : "text-gray-500 group-hover:text-gray-600"
                                                    }`}
                                                >
                                                  {tab.description}
                                                </span>
                                            </div>

                                            {/* Active indicator */}
                                            {isActive && (
                                                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#1C387F] to-[#2563eb] opacity-90 -z-10" />
                                            )}
                                        </button>
                                    );
                                })}
                            </nav>
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="relative">
                        {isLoading && (
                            <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex items-center justify-center">
                                <div className="flex items-center space-x-3">
                                    <div className="animate-spin rounded-full h-6 w-6 border-2 border-[#1C387F] border-t-transparent"></div>
                                    <span className="text-gray-600 font-medium">Loading...</span>
                                </div>
                            </div>
                        )}

                        <div
                            className={`p-8 transition-opacity duration-300 ${
                                isLoading ? "opacity-50" : "opacity-100"
                            }`}
                            role="tabpanel"
                            id={`panel-${activeTab}`}
                            aria-labelledby={`tab-${activeTab}`}
                        >
                            <Outlet context={{ statsData }} />
                        </div>
                    </div>
                </div>

                {/* Quick Actions Card */}
                <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Quick Actions
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <button
                            onClick={() => handleTabChange(tabs[0])}
                            onKeyDown={(e) => handleKeyDown(e, tabs[0])}
                            className="flex items-center space-x-3 p-4 rounded-lg border border-gray-200 hover:border-[#1C387F] hover:bg-[#1C387F]/5 transition-all duration-200 group"
                        >
                            <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-[#1C387F] group-hover:text-white transition-colors duration-200">
                                <User size={20} />
                            </div>
                            <div className="text-left">
                                <p className="font-medium text-gray-900">Update Profile</p>
                                <p className="text-sm text-gray-500">
                                    Edit your personal information
                                </p>
                            </div>
                        </button>

                        <button
                            onClick={() => handleTabChange(tabs[1])}
                            onKeyDown={(e) => handleKeyDown(e, tabs[1])}
                            className="flex items-center space-x-3 p-4 rounded-lg border border-gray-200 hover:border-[#1C387F] hover:bg-[#1C387F]/5 transition-all duration-200 group"
                        >
                            <div className="p-2 bg-green-100 rounded-lg group-hover:bg-[#1C387F] group-hover:text-white transition-colors duration-200">
                                <Shield size={20} />
                            </div>
                            <div className="text-left">
                                <p className="font-medium text-gray-900">Change Password</p>
                                <p className="text-sm text-gray-500">
                                    Update your security settings
                                </p>
                            </div>
                        </button>

                        <button
                            onClick={() => handleTabChange(tabs[2])}
                            onKeyDown={(e) => handleKeyDown(e, tabs[2])}
                            className="flex items-center space-x-3 p-4 rounded-lg border border-gray-200 hover:border-[#1C387F] hover:bg-[#1C387F]/5 transition-all duration-200 group"
                        >
                            <div className="p-2 bg-purple-100 rounded-lg group-hover:bg-[#1C387F] group-hover:text-white transition-colors duration-200">
                                <Package size={20} />
                            </div>
                            <div className="text-left">
                                <p className="font-medium text-gray-900">View Orders</p>
                                <p className="text-sm text-gray-500">
                                    Check your order history
                                </p>
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
