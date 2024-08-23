'use client'

import { useState } from 'react';
import { useCreateRoute } from '../../../graphql/route/Action/createRoute.action';

const CreateRoutePage = () => {
  const { handleCreateRoute } = useCreateRoute(); // Use the custom hook

  const [routeData, setRouteData] = useState({
    name: "",
    start_location: "",
    end_location: "",
    distance: 0,
  });

  const handleCreate = async () => {
    try {
      const newRoute = await handleCreateRoute(routeData); // Use the GraphQL mutation
      console.log("Route created:", newRoute);

    } catch (error) {
      console.error("Failed to create route:", error);
    }
  };

  return (
    <div>
      <h1>Create New Route</h1>
      <div>
        <input
          type="text"
          placeholder="Route Name"
          value={routeData.name}
          onChange={(e) => setRouteData({ ...routeData, name: e.target.value })}
        />
        <input
          type="text"
          placeholder="Start Location"
          value={routeData.start_location}
          onChange={(e) => setRouteData({ ...routeData, start_location: e.target.value })}
        />
        <input
          type="text"
          placeholder="End Location"
          value={routeData.end_location}
          onChange={(e) => setRouteData({ ...routeData, end_location: e.target.value })}
        />
        <input
          type="number"
          placeholder="Distance"
          value={routeData.distance}
          onChange={(e) => setRouteData({ ...routeData, distance: Number(e.target.value) })}
        />
        <button onClick={handleCreate}>Create Route</button>
      </div>
    </div>
  );
};

export default CreateRoutePage;
