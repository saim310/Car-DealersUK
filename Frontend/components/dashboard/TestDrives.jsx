"use client";

import { useMemo, useState } from "react";
import useFetch from "@/hooks/useFetch";
import { toast } from "react-toastify";
import useSubmit from "@/hooks/useSubmit";

export default function TestDrives() {
  const { data, loading } = useFetch("/test-drives");
  const testDrives = useMemo(() => (Array.isArray(data) ? data : []), [data]);
  const { submit } = useSubmit();
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredTestDrives = useMemo(() => {
    if (statusFilter === "all") {
      return testDrives;
    }
    return testDrives.filter((drive) => drive.status === statusFilter);
  }, [testDrives, statusFilter]);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await submit(`/test-drives/${id}/status`, { status: newStatus }, { method: "PUT" });
      toast.success("Status updated successfully");
      window.location.reload();
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this test drive request?")) {
      try {
        await submit(`/test-drives/${id}`, {}, { method: "DELETE" });
        toast.success("Test drive deleted successfully");
        window.location.reload();
      } catch (error) {
        toast.error("Failed to delete test drive");
      }
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "pending":
        return "status-pending";
      case "confirmed":
        return "status-confirmed";
      case "completed":
        return "status-completed";
      case "cancelled":
        return "status-cancelled";
      default:
        return "status-pending";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "#FFA500";
      case "confirmed":
        return "#4CAF50";
      case "completed":
        return "#2196F3";
      case "cancelled":
        return "#F44336";
      default:
        return "#FFA500";
    }
  };

  const pendingCount = testDrives.filter((d) => d.status === "pending").length;
  const confirmedCount = testDrives.filter((d) => d.status === "confirmed").length;
  const completedCount = testDrives.filter((d) => d.status === "completed").length;

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-12">
          <div className="content-area">
            <main id="main" className="main-content">
              <div className="tfcl-dashboard my-listing-enhanced">
                <div className="my-listing-hero mb-3">
                  <div>
                    <h1 className="admin-title mb-1">Test Drive Requests</h1>
                    <p className="my-listing-subtitle mb-0">
                      View and manage all customer test drive requests from one place.
                    </p>
                  </div>
                </div>

                <div className="my-listing-stats-grid mb-3">
                  <div className="my-listing-stat-card">
                    <span className="label">Total Requests</span>
                    <strong>{testDrives.length}</strong>
                  </div>
                  <div className="my-listing-stat-card">
                    <span className="label">Pending</span>
                    <strong style={{ color: "#FFA500" }}>{pendingCount}</strong>
                  </div>
                  <div className="my-listing-stat-card">
                    <span className="label">Confirmed</span>
                    <strong style={{ color: "#4CAF50" }}>{confirmedCount}</strong>
                  </div>
                  <div className="my-listing-stat-card">
                    <span className="label">Completed</span>
                    <strong style={{ color: "#2196F3" }}>{completedCount}</strong>
                  </div>
                </div>

                <div className="filter-section mb-3">
                  <label htmlFor="statusFilter" className="filter-label">
                    Filter by Status:
                  </label>
                  <select
                    id="statusFilter"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="filter-select"
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                <div className="tfcl-dashboard-middle mt-2">
                  <div className="row">
                    <div className="tfcl-dashboard-middle-left col-md-12">
                      <div className="tfcl-dashboard-listing">
                        <div className="tfcl-table-listing">
                          <div className="table-responsive">
                            <table className="table" style={{ width: "100%" }}>
                              <thead>
                                <tr>
                                  <th>Name</th>
                                  <th>Phone</th>
                                  <th>Email</th>
                                  <th>Car</th>
                                  <th>Date</th>
                                  <th>Time</th>
                                  <th>Address</th>
                                  <th>License #</th>
                                  <th>Status</th>
                                  <th>Action</th>
                                </tr>
                              </thead>
                              <tbody className="tfcl-table-content">
                                {loading ? (
                                  <tr>
                                    <td colSpan={10} className="text-center">
                                      Loading test drives...
                                    </td>
                                  </tr>
                                ) : !filteredTestDrives.length ? (
                                  <tr>
                                    <td colSpan={10} className="text-center">
                                      No test drive requests found.
                                    </td>
                                  </tr>
                                ) : (
                                  filteredTestDrives.map((testDrive) => (
                                    <tr key={testDrive.id}>
                                      <td>
                                        <strong>{testDrive.name}</strong>
                                      </td>
                                      <td>{testDrive.phone}</td>
                                      <td>{testDrive.email}</td>
                                      <td>
                                        <span className="car-title">
                                          {testDrive.car_title}
                                        </span>
                                      </td>
                                      <td>{testDrive.preferred_date}</td>
                                      <td>{testDrive.preferred_time}</td>
                                      <td>
                                        <small>
                                          {testDrive.address}, {testDrive.city},{" "}
                                          {testDrive.state} {testDrive.postcode}
                                        </small>
                                      </td>
                                      <td>{testDrive.driver_license_number}</td>
                                      <td>
                                        <select
                                          value={testDrive.status}
                                          onChange={(e) =>
                                            handleStatusChange(
                                              testDrive.id,
                                              e.target.value
                                            )
                                          }
                                          className="status-select"
                                          style={{
                                            borderColor: getStatusColor(
                                              testDrive.status
                                            ),
                                            color: getStatusColor(
                                              testDrive.status
                                            ),
                                          }}
                                        >
                                          <option value="pending">
                                            Pending
                                          </option>
                                          <option value="confirmed">
                                            Confirmed
                                          </option>
                                          <option value="completed">
                                            Completed
                                          </option>
                                          <option value="cancelled">
                                            Cancelled
                                          </option>
                                        </select>
                                      </td>
                                      <td>
                                        <button
                                          onClick={() =>
                                            handleDelete(testDrive.id)
                                          }
                                          className="btn-delete-small"
                                        >
                                          Delete
                                        </button>
                                      </td>
                                    </tr>
                                  ))
                                )}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>

      <style jsx>{`
        .filter-section {
          display: flex;
          align-items: center;
          gap: 15px;
          padding: 15px;
          background: #f5f5f5;
          border-radius: 8px;
        }

        .filter-label {
          font-weight: 600;
          font-size: 14px;
        }

        .filter-select {
          padding: 8px 12px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 14px;
          cursor: pointer;
        }

        .status-select {
          padding: 6px 10px;
          border: 2px solid;
          border-radius: 4px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          background: white;
        }

        .status-select:focus {
          outline: none;
        }

        .car-title {
          display: block;
          max-width: 150px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .btn-delete-small {
          padding: 6px 12px;
          background-color: #f44336;
          color: white;
          border: none;
          border-radius: 4px;
          font-size: 12px;
          cursor: pointer;
          transition: background-color 0.3s;
        }

        .btn-delete-small:hover {
          background-color: #da190b;
        }

        .my-listing-stat-card {
          padding: 20px;
          background: white;
          border-radius: 8px;
          text-align: center;
          border-left: 4px solid #007bff;
        }

        .my-listing-stat-card .label {
          display: block;
          font-size: 13px;
          color: #666;
          margin-bottom: 8px;
        }

        .my-listing-stat-card strong {
          font-size: 28px;
          color: #333;
        }

        @media (max-width: 768px) {
          .table {
            font-size: 12px;
          }

          .filter-section {
            flex-direction: column;
            align-items: flex-start;
          }

          .car-title {
            max-width: 100px;
          }

          td {
            padding: 10px 5px !important;
          }
        }
      `}</style>
    </div>
  );
}
