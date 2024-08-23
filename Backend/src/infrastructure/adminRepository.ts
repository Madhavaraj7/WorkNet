
import { Category, ICategory } from '../domain/category';
import { Worker } from '../domain/worker';

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