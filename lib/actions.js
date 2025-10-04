'use server';
import {addMeal} from './meals.js';
import {redirect} from 'next/navigation';
import {revalidatePath} from "next/cache";

export async function shareMeal(prevState , formData) {
    function isInvalidText(text) {
        return !text || text.trim().length === 0;
    }

    const meal = {
        title: formData.get('title'),
        summary: formData.get('summary'),
        instructions: formData.get('instructions'),
        creator: formData.get('name'),
        creator_email: formData.get('email'),
        image: formData.get('image'),
    };
    if (isInvalidText(meal.title) ||
        isInvalidText(meal.summary) ||
        isInvalidText(meal.instructions) ||
        isInvalidText(meal.creator) ||
        isInvalidText(meal.creator_email) ||
        !meal.creator_email.includes('@') ||
        !meal.image || meal.image.size === 0) {
        return{
            message: 'Invalid input - please check your data.',
        }
    }
    await addMeal(meal);
    revalidatePath('/meals');
    redirect('/meals');
}
