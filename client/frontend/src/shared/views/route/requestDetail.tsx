"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser, useUpdateUser, useGetUserById } from "../../../hooks/useUser";
import { useRoles } from "../../../hooks/useRole";  // Hook to fetch available roles
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import ProfileSidebar from "../../components/pages/admin/ProfileSidebar";
import { useApproveRequestStatus, useGetAllRoute, useGetRequestById, useGetRoute, useRejectRequestStatus, useUpdateRoute } from "@/src/hooks/useRoute";
import toast from "react-hot-toast";

interface UpdateRequestProps {
    requestId: string;
}

export default function requestDetail({ requestId }: UpdateRequestProps) {
    const router = useRouter();
    const { loadingRequest, errorRequest, request } = useGetRequestById(requestId)
    const routeId = request?.routeId
    const userId = request?.userId

    const { loading, error, route } = useGetRoute(routeId); // Fetch routes here
    const { user, loading: loadingUser, error: errorUser } = useGetUserById(userId);

    const [message, setMessage] = useState("");
    const [submitError, setSubmitError] = useState("");
    const approveRequestStatus = useApproveRequestStatus();
    const rejectRequestStatus = useRejectRequestStatus();
    const {handleUpdateRoute} = useUpdateRoute()
    const handleApproveStatus = async (requestId: string, routeId:string ,status: string) => {
        try {
            const routeData = {
                startLocation: request.proposedChanges?.startLocation,
                endLocation: request.proposedChanges?.endLocation,
                distance: request.proposedChanges?.distance,
                price: request.proposedChanges?.price,
                status: request.proposedChanges?.status
            }
            await approveRequestStatus(requestId, status);
            await handleUpdateRoute(routeId, routeData)
            
            toast.success("Approve successfully");
            router.push(`/admin/pendingRequest`)
        } catch (err) {
            console.error('Error updating request:', err);
        }
    };

    const handleRejectStatus = async (id: string, status: string) => {
        try {
            await rejectRequestStatus(id, status);
            toast.success("Reject successfully");
            router.push(`/admin/pendingRequest`)
        } catch (err) {
            console.error('Error updating request:', err);
        }
    };


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // Submit the updated user details with the selected roleId
            //   await handleUpdateUser(userId, { ...form, roleId: form.roleId });
            setMessage("Profile updated successfully!");
            setSubmitError("");
            router.push(`/admin/userlist`);  // Redirect after successful update
        } catch (err) {
            setSubmitError("Failed to update profile.");
            setMessage("");
            console.error("Error updating profile:", err);
        }
    };

    if (loadingRequest || loading || loadingUser) return <p>Loading...</p>;  // Show loading state while fetching user and role data

    return (
        <div className="flex h-screen bg-gray-200">
          <ProfileSidebar />
          <div className="flex flex-col flex-1">
            <Header />
            <div className="flex-1 bg-gray-200 py-28 px-8">
              <div className="max-w-8xl mx-auto">
                <div className="flex flex-col md:flex-row items-center justify-between bg-blue-50 shadow-lg rounded-xl p-8">
                  <div className="flex flex-col items-center md:items-start space-y-4">                    
                    {/* User Info */}
                    <h1 className="text-3xl font-bold text-blue-900">Request From User: {user.name}</h1>
                  </div>
    
                  {/* Action Buttons */}
                  <div className="flex mt-6 md:mt-0 space-x-4">
                    <button
                      onClick={() => handleApproveStatus(request.id, route.id ,"approved")}
                      className="flex-1 px-6 py-2 text-white bg-blue-600 hover:bg-blue-700 font-semibold rounded-lg shadow-md transition-all duration-300 ease-in-out transform hover:scale-105"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleRejectStatus(request.id, "rejected")}
                      className="flex-1 px-6 py-2 text-white bg-blue-600 hover:bg-blue-700 font-semibold rounded-lg shadow-md transition-all duration-300 ease-in-out transform hover:scale-105"
                    >
                      Reject
                    </button>
                  </div>
                </div>
    
                {/* User Details */}
                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* User Info Cards */}

                  <div className="bg-white shadow-md rounded-xl p-6 border border-blue-100">
                    <h3 className="text-lg font-semibold text-blue-800">Request</h3>
                    <p className="mt-2 text-blue-600">{request.requestType}</p>
                  </div>
    
                  <div className="bg-white shadow-md rounded-xl p-6 border border-blue-100">
                    <h3 className="text-lg font-semibold text-blue-800">Status</h3>
                    <p className="mt-2 text-blue-600">{request.status}</p>
                  </div>

                  <div className="bg-white shadow-md rounded-xl p-6 border border-blue-100">
                    <h3 className="text-lg font-semibold text-blue-800">Old Route Request</h3>
                    <p className="mt-2 text-blue-600">Start Location:  {route.startLocation}</p>
                    <p className="mt-2 text-blue-600">End Location: {route.endLocation}</p>
                    <p className="mt-2 text-blue-600">Distance: {route.distance}</p>
                  </div>

                  <div className="bg-white shadow-md rounded-xl p-6 border border-blue-100">
                    <h3 className="text-lg font-semibold text-blue-800">New Route Update</h3>
                    <p className="mt-2 text-blue-600">Start Location:  {request.proposedChanges?.startLocation}</p>
                    <p className="mt-2 text-blue-600">End Location: {request.proposedChanges?.endLocation}</p>
                    <p className="mt-2 text-blue-600">Distance: {request.proposedChanges?.distance}</p>
                  </div>

                  <div className="bg-white shadow-md rounded-xl p-6 border border-blue-100">
                    <h3 className="text-lg font-semibold text-blue-800">Created At</h3>
                    <p className="mt-2 text-blue-600">{request.createdAt}</p>
                  </div>

                  <div className="bg-white shadow-md rounded-xl p-6 border border-blue-100">
                    <h3 className="text-lg font-semibold text-blue-800">Updated At</h3>
                    <p className="mt-2 text-blue-600">{request.updatedAt}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
}
