import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/index.jsx";
import { api } from "@/lib/api";
import { isLoggedIn } from "@/lib/auth";

export default function AdminPage() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoggedIn()) {
      navigate("/", { replace: true });
      return;
    }
    fetchAdminData();
  }, [navigate]);

  async function fetchAdminData() {
    setLoading(true);
    try {
      const [usersRes, requestsRes] = await Promise.all([
        api.getAdminUsers(),
        api.getAdminAccessRequests(),
      ]);
      setUsers(Array.isArray(usersRes) ? usersRes : []);
      setRequests(Array.isArray(requestsRes) ? requestsRes : []);
    } catch (e) {
      // If we got a 403 (forbidden) the backend will return a 403 status.
      // axios will treat this as an error, so we can redirect.
      if (e.response?.status === 403 || e.response?.status === 400) {
        navigate("/dashboard", { replace: true });
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 mx-auto w-full max-w-6xl px-6 py-10 space-y-8">
        <h1 className="text-3xl font-black">Admin Panel</h1>

        {/* Users table */}
        <Card>
          <CardHeader>
            <CardTitle>All Users</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-40 w-full rounded-lg" />
            ) : users.length === 0 ? (
              <p className="text-sm text-muted-foreground">No users found.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border text-left">
                      <th className="py-2 px-3">ID</th>
                      <th className="py-2 px-3">Name</th>
                      <th className="py-2 px-3">Email</th>
                      <th className="py-2 px-3">Platforms</th>
                      <th className="py-2 px-3">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u.id} className="border-b border-border/50">
                        <td className="py-2 px-3">{u.id}</td>
                        <td className="py-2 px-3">{u.name || "—"}</td>
                        <td className="py-2 px-3">{u.email}</td>
                        <td className="py-2 px-3">
                          {u.enabledPlatforms?.join(", ") || "None"}
                        </td>
                        <td className="py-2 px-3">
                          <span
                            className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                              u.active
                                ? "bg-green-500/15 text-green-400 border border-green-500/30"
                                : "bg-yellow-500/15 text-yellow-400 border border-yellow-500/30"
                            }`}
                          >
                            {u.active ? "Active" : "Paused"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Access Requests table */}
        <Card>
          <CardHeader>
            <CardTitle>Access Requests</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-32 w-full rounded-lg" />
            ) : requests.length === 0 ? (
              <p className="text-sm text-muted-foreground">No access requests yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border text-left">
                      <th className="py-2 px-3">ID</th>
                      <th className="py-2 px-3">Email</th>
                      <th className="py-2 px-3">Requested At</th>
                    </tr>
                  </thead>
                  <tbody>
                    {requests.map((r) => (
                      <tr key={r.id} className="border-b border-border/50">
                        <td className="py-2 px-3">{r.id}</td>
                        <td className="py-2 px-3">{r.email}</td>
                        <td className="py-2 px-3">
                          {new Date(r.createdAt).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}