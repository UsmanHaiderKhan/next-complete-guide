import fs from 'node:fs';
import sql from 'better-sqlite3';
import slugify from 'slugify';
import xss from 'xss';
const db = sql('meals.db');

export async function getAllMeals() {
  await new Promise((resolve) => setTimeout(resolve, 5000)); // Simulate a 1 second delay
  const stmt = db.prepare('SELECT * FROM meals ORDER BY id DESC');
  return stmt.all();
}
export function getMeal(slug) {
  //await new Promise(resolve => setTimeout(resolve, 5000));
  return db.prepare('SELECT * FROM meals WHERE slug = ?').get(slug);
}
export async function addMeal(meal) {
  meal.slug = slugify(meal.title, { lower: true, strict: true }); // strict removes special characters
  meal.instructions = xss(meal.instructions);

  const extension = meal.image.name.split('.').pop();
  const filename = `${meal.slug}.${extension}`;
  const filepath = `public/images/meals/${filename}`;

  // Ensure the directory exists
  const dir = 'public/images/meals';
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const stream = fs.createWriteStream(filepath);
  const bufferedImage = await meal.image.arrayBuffer();

  return new Promise((resolve, reject) => {
    stream.write(Buffer.from(bufferedImage), (err) => {
      if (err) {
        reject(new Error('Image upload failed, FileStream error'));
        return;
      }
      stream.end();

      // Update the image path to include the meals subdirectory
      meal.image = `/images/meals/${filename}`;

      // Fix the database insert with proper parameter order matching the schema
      try {
        db.prepare(
          'INSERT INTO meals (slug, title, image, summary, instructions, creator, creator_email) VALUES (?, ?, ?, ?, ?, ?, ?)'
        ).run(
          meal.slug,
          meal.title,
          meal.image,
          meal.summary,
          meal.instructions,
          meal.creator,
          meal.creator_email
        );
        resolve();
      } catch (dbError) {
        reject(new Error('Database insert failed: ' + dbError.message));
      }
    });
  });
}
