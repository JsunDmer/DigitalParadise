import AsyncStorage from '@react-native-async-storage/async-storage';
import { Child, ChildCreateInput, ChildUpdateInput } from '../types';

const CHILDREN_KEY = 'digitalparadise_children';

function generateId(): string {
  return `child_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

async function getChildren(): Promise<Child[]> {
  const data = await AsyncStorage.getItem(CHILDREN_KEY);
  return data ? JSON.parse(data) : [];
}

async function saveChildren(children: Child[]): Promise<void> {
  await AsyncStorage.setItem(CHILDREN_KEY, JSON.stringify(children));
}

export const childService = {
  async create(input: ChildCreateInput): Promise<Child> {
    const now = new Date().toISOString();
    const id = generateId();
    
    const child: Child = {
      id,
      ...input,
      createdAt: now,
      updatedAt: now,
    };
    
    const children = await getChildren();
    children.push(child);
    await saveChildren(children);
    
    return child;
  },

  async getById(id: string): Promise<Child | null> {
    const children = await getChildren();
    return children.find(c => c.id === id) || null;
  },

  async getByParentId(parentId: string): Promise<Child[]> {
    const children = await getChildren();
    return children.filter(c => c.parentId === parentId).sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  },

  async getAll(): Promise<Child[]> {
    return getChildren();
  },

  async update(id: string, input: ChildUpdateInput): Promise<Child | null> {
    const children = await getChildren();
    const index = children.findIndex(c => c.id === id);
    
    if (index === -1) return null;
    
    const now = new Date().toISOString();
    children[index] = {
      ...children[index],
      ...input,
      updatedAt: now,
    };
    
    await saveChildren(children);
    return children[index];
  },

  async delete(id: string): Promise<boolean> {
    const children = await getChildren();
    const filtered = children.filter(c => c.id !== id);
    
    if (filtered.length === children.length) return false;
    
    await saveChildren(filtered);
    return true;
  },

  async deleteAll(): Promise<number> {
    const children = await getChildren();
    const count = children.length;
    await AsyncStorage.removeItem(CHILDREN_KEY);
    return count;
  },

  async exists(id: string): Promise<boolean> {
    const children = await getChildren();
    return children.some(c => c.id === id);
  },
};
