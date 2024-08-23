// src/domain/category.ts

import mongoose, { Schema, Document } from 'mongoose';

// Updated interface with _id included
export interface ICategory extends Document {
  _id: mongoose.Types.ObjectId; 
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

const CategorySchema: Schema = new Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Ensure the model is typed correctly with ICategory
export const Category = mongoose.model<ICategory>('Category', CategorySchema);
