import { NextResponse } from 'next/server';
import properties from '../../data/properties.json';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const minPrice = searchParams.get('minPrice');
  const maxPrice = searchParams.get('maxPrice');
  const minYield = searchParams.get('minYield');
  const location = searchParams.get('location');
  const country = searchParams.get('country');
  const sortBy = searchParams.get('sortBy');

  let filtered = [...properties];

  if (minPrice) filtered = filtered.filter(p => p.price >= parseFloat(minPrice));
  if (maxPrice) filtered = filtered.filter(p => p.price <= parseFloat(maxPrice));
  if (minYield) filtered = filtered.filter(p => p.yield >= parseFloat(minYield));
  if (location) {
    const loc = location.toLowerCase();
    filtered = filtered.filter(p => 
      p.location.toLowerCase().includes(loc) || 
      p.country.toLowerCase().includes(loc)
    );
  }
  if (country) {
    filtered = filtered.filter(p => p.country.toLowerCase() === country.toLowerCase());
  }

  if (sortBy) {
    if (sortBy === 'price-asc') filtered.sort((a, b) => a.price - b.price);
    else if (sortBy === 'price-desc') filtered.sort((a, b) => b.price - a.price);
    else if (sortBy === 'yield-desc') filtered.sort((a, b) => b.yield - a.yield);
    else if (sortBy === 'risk-asc') filtered.sort((a, b) => a.riskScore - b.riskScore);
  }

  return NextResponse.json({ properties: filtered, total: filtered.length });
}
