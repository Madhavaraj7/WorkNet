
import { Category, ICategory } from '../domain/category';
import { Worker } from '../domain/worker';
import {Review,IReview }  from "../domain/review";

export const getAllWorkersFromDB = async () => {
  return Worker.find().sort({ createdAt: -1 }).populate('categories', 'name description');
};


export const deleteWorkerById = async (_id: string) => {
  return Worker.findByIdAndDelete(_id);
};


export const createCategory = async (categoryData: Partial<ICategory>) => {
  const category = new Category(categoryData);
  return await category.save();
};


// Fetch all categories
export const getAllCategories = async (): Promise<ICategory[]> => {
  try {
    return await Category.find().sort({ name: 1 });
  } catch (error:any) {
    throw new Error('Error fetching categories: ' + error.message);
  }
};



export const deleteReviewById = async (_id: string): Promise<IReview | null> => {
  console.log("Marking review as deleted with ID:", _id);

  if (!_id) {
    throw new Error("Invalid review ID.");
  }

  try {
    const updatedReview = await Review.findByIdAndUpdate(
      _id,
      { isDeleted: true }, 
      { new: true } 
    );

    console.log("Updated review:", updatedReview);

    if (!updatedReview) {
      throw new Error("Review not found.");
    }

    return updatedReview;
  } catch (error: any) {
    throw new Error("Error updating review status: " + error.message);
  }
};
