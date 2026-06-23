import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/index.jsx";
import { api } from "@/lib/api";
import { isLoggedIn } from "@/lib/auth";

export default function AdminPage() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("users"); // "users" | "pending" | "approved"
  const [manualEmail, setManualEmail] = useState("");

  useEffect(() => {
    if (!isLoggedIn()) { navigate("/", { replace: true }); return; }
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
      if (e.response?.status === 403 || e.response?.status === 400) navigate("/dashboard", { replace: true });
    } finally {
      setLoading(false);
    }
  }

  async function approveRequest(id) {
    try {
      await api.approveAccessRequest(id);
      fetchAdminData(); // refresh
    } catch (e) {
      alert("Approval failed");
    }
  }

  async function manualApprove() {
    if (!manualEmail.includes("@")) return;
    try {
      await api.manualApprove(manualEmail);
      setManualEmail("");
      fetchAdminData();
    } catch (e) {
      alert("Manual approve failed");
    }
  }

  const pendingRequests = requests.filter(r => !r.approvedAt);
  const approvedRequests = requests.filter(r => r.approvedAt);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 mx-auto w-full max-w-6xl px-6 py-10 space-y-8">
        <h1 className="text-3xl font-black">Admin Panel</h1>

        {/* Tab buttons */}
        <div className="flex gap-2">
          {["users", "pending", "approved"].map(t => (
            <Button key={t} variant={tab === t ? "secondary" : "ghost"} size="sm" onClick={() => setTab(t)}>
              {t === "users" ? "All Users" : t === "pending" ? "Pending Requests" : "Approved"}
            </Button>
          ))}
        </div>

        {/* All Users table */}
        {tab === "users" && (
          <Card>
            <CardHeader><CardTitle>All Users</CardTitle></CardHeader>
            <CardContent>
              {loading ? <Skeleton className="h-40 w-full rounded-lg" /> :
                users.length === 0 ? <p className="text-sm text-muted-foreground">No users found.</p> :
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border text-left">
                        <th className="py-2 px-3">ID</th><th className="py-2 px-3">Name</th><th className="py-2 px-3">Email</th>
                        <th className="py-2 px-3">Platforms</th><th className="py-2 px-3">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map(u => (
                        <tr key={u.id} className="border-b border-border/50">
                          <td className="py-2 px-3">{u.id}</td>
                          <td className="py-2 px-3">{u.name || "—"}</td>
                          <td className="py-2 px-3">{u.email}</td>
                          <td className="py-2 px-3">{u.enabledPlatforms?.join(", ") || "None"}</td>
                          <td className="py-2 px-3">
                            <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                              u.active ? "bg-green-500/15 text-green-400 border border-green-500/30" : "bg-yellow-500/15 text-yellow-400 border border-yellow-500/30"
                            }`}>{u.active ? "Active" : "Paused"}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              }
            </CardContent>
          </Card>
        )}

        {/* Pending requests */}
        {tab === "pending" && (
          <Card>
            <CardHeader><CardTitle>Pending Access Requests</CardTitle></CardHeader>
            <CardContent>
              {loading ? <Skeleton className="h-32 w-full rounded-lg" /> :
                pendingRequests.length === 0 ? <p className="text-sm text-muted-foreground">No pending requests.</p> :
                <div className="space-y-3">
                  {pendingRequests.map(r => (
                    <div key={r.id} className="flex items-center justify-between border-b border-border/50 pb-3">
                      <div>
                        <p className="font-medium">{r.email}</p>
                        <p className="text-xs text-muted-foreground">Requested {new Date(r.createdAt).toLocaleString()}</p>
                      </div>
                      <Button size="sm" onClick={() => approveRequest(r.id)}>Approve & Send Email</Button>
                    </div>
                  ))}
                </div>
              }
              {/* Manual approve */}
              <div className="mt-6 flex gap-2">
                <input
                  type="email" value={manualEmail} onChange={e => setManualEmail(e.target.value)}
                  placeholder="manually add email"
                  className="flex-1 h-9 rounded-lg border border-border bg-card px-3 text-sm"
                />
                <Button size="sm" onClick={manualApprove}>Add</Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Approved requests */}
        {tab === "approved" && (
          <Card>
            <CardHeader><CardTitle>Approved Users</CardTitle></CardHeader>
            <CardContent>
              {loading ? <Skeleton className="h-32 w-full rounded-lg" /> :
                approvedRequests.length === 0 ? <p className="text-sm text-muted-foreground">No approved requests yet.</p> :
                <div className="space-y-2">
                  {approvedRequests.map(r => (
                    <div key={r.id} className="text-sm">
                      <span className="font-medium">{r.email}</span> — approved {new Date(r.approvedAt).toLocaleString()}
                    </div>
                  ))}
                </div>
              }
            </CardContent>
          </Card>
        )}
      </main>
      <Footer />
    </div>
  );
}