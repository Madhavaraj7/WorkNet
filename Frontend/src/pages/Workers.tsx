import React, { useEffect, useState } from "react";
import WorkerCard from "../components/WorkerCard";
import { getAllWorkersAPI, getCategoriesAPI } from "../Services/allAPI";
import { Worker } from "../components/WorkerCard";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { Alert, Pagination, Stack, Button } from "@mui/material";

const Workers: React.FC = () => {
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [filteredWorkers, setFilteredWorkers] = useState<Worker[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [categories, setCategories] = useState<{ name: string }[]>([]);
  const [page, setPage] = useState(1);
  const [workersPerPage] = useState(8);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch workers
        const workersData = await getAllWorkersAPI();
        setWorkers(workersData);
        setFilteredWorkers(workersData);

        // Fetch categories
        const categoriesData = await getCategoriesAPI();
        console.log(categoriesData);

        // Assuming categoriesData is an array of objects with a name property
        if (Array.isArray(categoriesData)) {
          setCategories(categoriesData);
        } else {
          setError("Invalid categories data format");
        }
      } catch (error) {
        setError("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      setFilteredWorkers(
        workers.filter(worker =>
          Array.isArray(worker.categories)
            ? worker.categories.some(category =>
                typeof category === "string"
                  ? category === selectedCategory
                  : category.name === selectedCategory
              )
            : false
        )
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
            <Button
              variant={!selectedCategory ? "contained" : "outlined"}
              color={!selectedCategory ? "primary" : "inherit"}
              onClick={() => setSelectedCategory(null)}
            >
              All Categories
            </Button>
            {categories.map((category) => (
              <Button
                key={category.name}
                variant={selectedCategory === category.name ? "contained" : "outlined"}
                color={selectedCategory === category.name ? "primary" : "inherit"}
                onClick={() => setSelectedCategory(category.name)}
              >
                {category.name}
              </Button>
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
          <div className="flex justify-center mt-8">
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
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default Workers;
