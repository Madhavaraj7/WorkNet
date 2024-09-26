import { Category, ICategory } from "../domain/category";
import { Worker } from "../domain/worker";
import { Review, IReview } from "../domain/review";
import { Booking } from "../domain/booking";
import { UserModel } from "./userRepository";


// Fetch all workers from the database, sorted by creation date.
export const getAllWorkersFromDB = async () => {
  return Worker.find()
    .sort({ createdAt: -1 })
    .populate("categories", "name description");
};


// Delete a worker by their ID from the database.
export const deleteWorkerById = async (_id: string) => {
  return Worker.findByIdAndDelete(_id);
};


// Create a new category in the database.
export const createCategory = async (categoryData: Partial<ICategory>) => {
  const category = new Category(categoryData);
  return await category.save();
};


// Fetch all categories from the database, sorted by name.
export const getAllCategories = async (): Promise<ICategory[]> => {
  try {
    return await Category.find().sort({ name: 1 });
  } catch (error: any) {
    throw new Error("Error fetching categories: " + error.message);
  }
};


// Delete a review by its ID by marking it as deleted.
export const deleteReviewById = async (
  _id: string
): Promise<IReview | null> => {

  if (!_id) {
    throw new Error("Invalid review ID.");
  }

  try {
    const updatedReview = await Review.findByIdAndUpdate(
      _id,
      { isDeleted: true },
      { new: true }
    );


    if (!updatedReview) {
      throw new Error("Review not found.");
    }

    return updatedReview;
  } catch (error: any) {
    throw new Error("Error updating review status: " + error.message);
  }
};


// Get the total count of users in the database.
export const getUsersCount = async (): Promise<number> => {
  return await UserModel.countDocuments();
};

// Get the total count of workers in the database.
export const getWorkersCount = async (): Promise<number> => {
  return await Worker.countDocuments();
};

// Get the total count of bookings in the database.
export const getBookingsCount = async (): Promise<number> => {
  return await Booking.countDocuments();
};

// Get the total count of reviews in the database.
export const getReviewCount = async (): Promise<number> => {
  return await Review.countDocuments();
};

// Fetch all confirmed bookings with details of users and workers.
export const getAllBookingsWithDetails = async () => {
  return Booking.find({ status: "Confirmed" })
    .populate("userId", "username")
    .populate("slotId", "date")
    .populate("workerId", "name")
    .select("amount status")
    .exec();
};
