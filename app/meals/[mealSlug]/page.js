import Image from 'next/image';
import { notFound } from 'next/navigation';

import { getMeal } from '../../../lib/meals';
import classes from './page.module.css';

export async function generateMetadata({ params }) {
    const meal = getMeal(params.mealSlug);
    if (!meal) {
        notFound();
    }
    return {
        title: meal.title,
        description: meal.summary,
    }
}

export default async function MealDetailsPage({ params }) {
  const { mealSlug } = await params;
  const meal = getMeal(mealSlug);
  if (!meal) {
    notFound();
  }

  // Create a processed version for display without mutating the original
  const processedInstructions = meal.instructions.replace(/\n/g, '<br/>');

  return (
    <>
      <header className={classes.header}>
        <div className={classes.image}>
          <Image src={meal.image} fill alt={meal.title} />
        </div>
        <div className={classes.headerText}>
          <h1>{meal.title}</h1>
          <p className={classes.creator}>
            by <a href={`mailto:${meal.creator_email}`}>{meal.creator}</a>
          </p>
          <p className={classes.summary}>{meal.summary}</p>
        </div>
      </header>
      <main>
        <p
          className={classes.instructions}
          dangerouslySetInnerHTML={{ __html: processedInstructions }}
        ></p>
      </main>
      {/*<MealDetailsPage params={params} />*/}
      {/*<h1>Meal Detail Page</h1>*/}
      {/*<p>Details for meal</p>*/}
    </>
  );
}
