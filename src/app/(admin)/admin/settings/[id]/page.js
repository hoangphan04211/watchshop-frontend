"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { getSettingById } from "@/api/apiSetting";
import { toast } from "react-toastify";

export default function ShowSetting() {
    const params = useParams();
    const { id } = params;
    const [setting, setSetting] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                const data = await getSettingById(id);
                setSetting(data);
            } catch {
                toast.error("Không thể tải thông tin cài đặt");
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [id]);

    if (loading) return <p className="p-6">Đang tải dữ liệu...</p>;
    if (!setting)
        return <p className="p-6 text-red-500">Không tìm thấy cài đặt!</p>;

    return (
        <div className="p-6 bg-white rounded-xl shadow-md text-gray-800">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-semibold">Chi tiết Cài Đặt</h1>
                <div className="space-x-3">
                    <Link
                        href="/admin/settings"
                        className="px-5 py-3 bg-gray-200 rounded-lg shadow text-gray-700 font-medium hover:bg-gray-300 transition"
                    >
                        <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
                        Quay lại
                    </Link>
                    <Link
                        href={`/admin/settings/${id}/edit`}
                        className="px-5 py-3 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 transition"
                    >
                        <FontAwesomeIcon icon={faPenToSquare} className="mr-2" />
                        Sửa
                    </Link>
                </div>
            </div>

            {/* Nội dung */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                    <p className="font-semibold text-gray-600">Tên website:</p>
                    <p className="text-lg">{setting.site_name}</p>
                </div>

                <div>
                    <p className="font-semibold text-gray-600">Email:</p>
                    <p className="text-lg">{setting.email}</p>
                </div>

                <div>
                    <p className="font-semibold text-gray-600">Điện thoại:</p>
                    <p className="text-lg">{setting.phone}</p>
                </div>

                <div>
                    <p className="font-semibold text-gray-600">Hotline:</p>
                    <p className="text-lg">{setting.hotline}</p>
                </div>

                <div className="col-span-2">
                    <p className="font-semibold text-gray-600">Địa chỉ:</p>
                    <p className="text-lg">{setting.address}</p>
                </div>

                <div>
                    <p className="font-semibold text-gray-600">Trạng thái:</p>
                    <span
                        className={`px-3 py-1 rounded-lg text-sm font-medium ${setting.status === 1
                                ? "bg-green-100 text-green-600"
                                : "bg-gray-100 text-gray-500"
                            }`}
                    >
                        {setting.status === 1 ? "Hiển thị" : "Ẩn"}
                    </span>
                </div>
            </div>
        </div>
    );
}
