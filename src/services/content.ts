import { Content, Category } from '../types';
import { getDatabase } from './database';

export const contentService = {
  async getAll(): Promise<Content[]> {
    const db = getDatabase();
    const result = await db.getAllAsync<Content>('SELECT * FROM content ORDER BY createdAt DESC');
    return result;
  },

  async getById(id: string): Promise<Content | null> {
    const db = getDatabase();
    const result = await db.getFirstAsync<Content>('SELECT * FROM content WHERE id = ?', [id]);
    return result || null;
  },

  async create(content: Content): Promise<void> {
    const db = getDatabase();
    await db.runAsync(
      'INSERT INTO content (id, title, description, type, url, thumbnail, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [content.id, content.title, content.description || '', content.type, content.url, content.thumbnail || '', content.createdAt]
    );
  },

  async delete(id: string): Promise<void> {
    const db = getDatabase();
    await db.runAsync('DELETE FROM content WHERE id = ?', [id]);
  },
};

export const categoryService = {
  async getAll(): Promise<Category[]> {
    const db = getDatabase();
    const result = await db.getAllAsync<Category>('SELECT * FROM categories');
    return result;
  },

  async create(category: Category): Promise<void> {
    const db = getDatabase();
    await db.runAsync(
      'INSERT INTO categories (id, name, icon, color) VALUES (?, ?, ?, ?)',
      [category.id, category.name, category.icon || '', category.color || '']
    );
  },
};
