// src/Components/Workers.tsx
import React, { useEffect, useState } from "react";
import WorkerCard from "../components/WorkerCard";
import { getAllWorkersAPI } from "../Services/allAPI";
import { Worker } from "../components/WorkerCard";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { Alert, Pagination, Stack } from "@mui/material";

const categories = [
  "Plumbing",
  "Electrical",
  "Carpentry",
  "Painting",
  "Welding",
  "TileWork",
  "Centring",
  "Construction",
  "Fabrication",
];

const Workers: React.FC = () => {
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [filteredWorkers, setFilteredWorkers] = useState<Worker[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [workersPerPage] = useState(8);

  useEffect(() => {
    const fetchWorkers = async () => {
      try {
        // const token = localStorage.getItem("token");
        // if (!token) {
        //   throw new Error("No token found");
        // }
        const data = await getAllWorkersAPI();
        setWorkers(data);
        setFilteredWorkers(data);
      } catch (error) {
        setError("Failed to fetch workers");
      } finally {
        setLoading(false);
      }
    };

    fetchWorkers();
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      setFilteredWorkers(
        workers.filter((worker) => worker.categories.includes(selectedCategory))
      );
    } else {
      setFilteredWorkers(workers);
    }
  }, [selectedCategory, workers]);

  // Pagination logic
  const indexOfLastWorker = page * workersPerPage;
  const indexOfFirstWorker = indexOfLastWorker - workersPerPage;
  const currentWorkers = filteredWorkers.slice(
    indexOfFirstWorker,
    indexOfLastWorker
  );
  const totalPages = Math.ceil(filteredWorkers.length / workersPerPage);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen text-xl text-blue-600">
        Loading...
      </div>
    );
  if (error)
    return (
      <div className="flex justify-center items-center h-screen text-xl text-red-600">
        {error}
      </div>
    );

  return (
    <>
      <Header />
      <br />
      <br />
      <main className="min-h-screen bg-gray-50 py-10">
        <section className="container mx-auto px-4 md:px-6 lg:px-8">
          <h1 className="text-4xl font-extrabold text-center mb-8 text-blue-800">
            Discover Our Skilled Workers
          </h1>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <button
              className={`px-6 py-3 rounded-full text-lg font-semibold ${
                !selectedCategory
                  ? "bg-blue-700 text-white"
                  : "bg-gray-300 text-gray-700"
              }`}
              onClick={() => setSelectedCategory(null)}
            >
              All Categories
            </button>
            {categories.map((category) => (
              <button
                key={category}
                className={`px-6 py-3 rounded-full text-lg font-semibold ${
                  selectedCategory === category
                    ? "bg-blue-700 text-white"
                    : "bg-gray-300 text-gray-700"
                }`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Workers List */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {currentWorkers.length > 0 ? (
              currentWorkers.map((worker) => (
                <WorkerCard key={worker._id} worker={worker} />
              ))
            ) : (
                <div className="flex justify-center items-center col-span-full">
                <Alert variant="outlined" severity="info" className="w-full max-w-md text-center">
                  No workers available for the selected category. Please try another category.
                </Alert>
              </div>
            )}
          </div>

          {/* Pagination */}
          {/* <div className="flex justify-center mt-8">
            <Stack spacing={2}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={(_event, value) => setPage(value)}
                color="primary"
                siblingCount={1}
                boundaryCount={1}
              />
            </Stack>
          </div> */}
        </section>
      </main>
      <Footer />
    </>
  );
};

export default Workers;
