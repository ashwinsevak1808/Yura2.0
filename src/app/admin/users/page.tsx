import { getUsers } from "@/app/actions/admin-users";
import { Mail, Calendar, Clock, Shield } from "lucide-react";
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Users | YURAA Admin',
};

export const dynamic = 'force-dynamic';

export default async function AdminUsersPage() {
    const users = await getUsers();

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const formatDateTime = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-serif font-medium text-black">Users</h1>
                    <p className="text-gray-500 mt-1 font-light">Manage your registered customers and administrators.</p>
                </div>
                <div className="bg-white px-4 py-2 rounded-full border border-gray-200 text-xs font-bold uppercase tracking-wider shadow-sm">
                    Total Users: {users.length}
                </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100 text-[10px] uppercase tracking-widest font-bold text-gray-500">
                                <th className="px-6 py-4">User Details</th>
                                <th className="px-6 py-4">Role</th>
                                <th className="px-6 py-4">Joined</th>
                                <th className="px-6 py-4">Last Active</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {users.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-50/50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 group-hover:bg-black group-hover:text-white transition-colors font-serif font-bold text-xs">
                                                {user.email.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <div className="font-medium text-gray-900 flex items-center gap-2">
                                                    {user.email}
                                                </div>
                                                <div className="text-[10px] text-gray-400 font-mono mt-0.5">{user.id}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <Shield className="w-3 h-3 text-gray-400" />
                                            <span className={`inline-flex items-center px-2 py-1 rounded-md text-[10px] uppercase font-bold tracking-wider ${user.email === 'ashwinsevak2091@gmail.com' || user.user_metadata?.role === 'admin'
                                                ? 'bg-black text-white'
                                                : 'bg-gray-100 text-gray-600'
                                                }`}>
                                                {user.email === 'ashwinsevak2091@gmail.com' ? 'Super Admin' : user.role}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 text-gray-500">
                                            <Calendar className="w-3 h-3" />
                                            <span>{formatDate(user.created_at)}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 text-gray-500">
                                            <Clock className="w-3 h-3" />
                                            <span>
                                                {user.last_sign_in_at
                                                    ? formatDateTime(user.last_sign_in_at)
                                                    : 'Never'}
                                            </span>
                                        </div>
                                    </td>
                                </tr>
                            ))}

                            {users.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-gray-400">
                                        <Mail className="w-8 h-8 mx-auto mb-3 opacity-20" />
                                        <p>No users found in the system.</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
