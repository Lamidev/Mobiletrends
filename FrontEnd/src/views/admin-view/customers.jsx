'use client';

import { useState, useEffect } from "react";
import axios from "axios";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Users, Search, Mail, Calendar, ShieldCheck, CheckCircle2, XCircle } from "lucide-react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8050/api";

function AdminCustomersView() {
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchCustomers() {
      try {
        setIsLoading(true);
        const res = await axios.get(`${API_BASE_URL}/admin/verified-users/all`);
        if (res.data?.success) {
          setCustomers(res.data.data || []);
        }
      } catch (err) {
        console.error("Error loading customers:", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchCustomers();
  }, []);

  const filtered = customers.filter((c) => {
    const term = searchTerm.toLowerCase();
    const name = (c.userName || c.fullName || "").toLowerCase();
    const email = (c.email || "").toLowerCase();
    return name.includes(term) || email.includes(term);
  });

  return (
    <div className="font-manrope space-y-6 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-gray-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111344] tracking-tight flex items-center gap-2.5">
            <Users className="w-7 h-7 text-[#111344]" />
            <span>Customers Directory</span>
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1 font-medium">
            Overview of all registered users and account verification statuses.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 h-9 sm:h-10 text-xs bg-white rounded-xl border-gray-200"
            />
          </div>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="rounded-2xl border border-gray-200 bg-white p-4">
          <CardContent className="p-1 space-y-1">
            <span className="text-[11px] font-bold text-gray-500 uppercase">
              Total Customers
            </span>
            <p className="text-2xl font-black text-[#111344]">
              {customers.length}
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border border-gray-200 bg-white p-4">
          <CardContent className="p-1 space-y-1">
            <span className="text-[11px] font-bold text-emerald-600 uppercase">
              Verified Accounts
            </span>
            <p className="text-2xl font-black text-emerald-700">
              {customers.filter((c) => c.isVerified).length}
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border border-gray-200 bg-white p-4">
          <CardContent className="p-1 space-y-1">
            <span className="text-[11px] font-bold text-amber-600 uppercase">
              Pending Verification
            </span>
            <p className="text-2xl font-black text-amber-700">
              {customers.filter((c) => !c.isVerified).length}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
        {isLoading ? (
          <div className="p-12 text-center text-xs text-gray-400 font-semibold animate-pulse">
            Loading customers directory...
          </div>
        ) : filtered.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 text-gray-500 uppercase font-bold text-[10px] tracking-wider border-b border-gray-100">
                <tr>
                  <th className="py-3.5 px-4">Customer</th>
                  <th className="py-3.5 px-4">Email</th>
                  <th className="py-3.5 px-4">Role</th>
                  <th className="py-3.5 px-4">Verification</th>
                  <th className="py-3.5 px-4 text-right">Registered</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium text-gray-700">
                {filtered.map((customer) => {
                  const initial = (customer.userName || customer.email || "U")[0].toUpperCase();
                  const isVerified = Boolean(customer.isVerified);
                  const isMasterAdmin = customer.role === "admin";

                  return (
                    <tr
                      key={customer._id}
                      className="hover:bg-gray-50/80 transition-colors"
                    >
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-[#111344]/10 text-[#111344] font-bold flex items-center justify-center text-xs shrink-0">
                            {initial}
                          </div>
                          <span className="font-bold text-gray-900">
                            {customer.userName || "Unnamed User"}
                          </span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-gray-600">
                        <span className="inline-flex items-center gap-1.5">
                          <Mail size={13} className="text-gray-400" />
                          <span>{customer.email}</span>
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            isMasterAdmin
                              ? "bg-purple-50 text-purple-700 border border-purple-200"
                              : "bg-gray-100 text-gray-700 border border-gray-200"
                          }`}
                        >
                          {customer.role || "user"}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        {isVerified ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <CheckCircle2 size={11} />
                            Verified
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                            <XCircle size={11} />
                            Pending
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right text-gray-500 font-mono text-[11px]">
                        {customer.createdAt
                          ? new Date(customer.createdAt).toLocaleDateString("en-NG", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })
                          : "—"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center text-xs text-gray-400 font-medium">
            No customers found matching &quot;{searchTerm}&quot;.
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminCustomersView;

