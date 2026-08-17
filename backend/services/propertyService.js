import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataPath = path.join(__dirname, '../data/properties.json');

export class PropertyService {
  constructor() {
    this.properties = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
  }

  getProperties(filters = {}) {
    let result = this.properties;
    
    if (filters.minPrice) result = result.filter(p => p.price >= Number(filters.minPrice));
    if (filters.maxPrice) result = result.filter(p => p.price <= Number(filters.maxPrice));
    if (filters.minYield) result = result.filter(p => p.yield >= Number(filters.minYield));
    if (filters.location) result = result.filter(p => p.location.toLowerCase().includes(filters.location.toLowerCase()));
    
    if (filters.sortBy) {
      if (filters.sortBy === 'price') result.sort((a, b) => a.price - b.price);
      if (filters.sortBy === 'yield') result.sort((a, b) => b.yield - a.yield);
      if (filters.sortBy === 'riskScore') result.sort((a, b) => a.riskScore - b.riskScore);
    }
    
    return result;
  }

  getPropertyById(id) {
    return this.properties.find(p => p.id === id);
  }
}

export const propertyService = new PropertyService();
