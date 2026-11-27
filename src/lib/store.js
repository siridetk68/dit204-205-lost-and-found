import { INITIAL_ITEMS } from '../data/initialItems';

// In-memory global store to hold items during application lifetime
let itemsData = [...INITIAL_ITEMS];

export function getItems() {
  return itemsData;
}

export function getItemById(id) {
  return itemsData.find((item) => item.id === id);
}

export function addItem(newItem) {
  const item = {
    id: `item-${Date.now()}`,
    date: new Date().toISOString().split('T')[0],
    time: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }),
    status: newItem.type === 'LOST' ? 'LOOKING_FOR_OWNER' : 'FOUND_ITEM',
    claimStatus: 'none',
    ...newItem,
  };
  itemsData = [item, ...itemsData];
  return item;
}

export function updateItem(id, updates) {
  const index = itemsData.findIndex((item) => item.id === id);
  if (index !== -1) {
    itemsData[index] = { ...itemsData[index], ...updates };
    return itemsData[index];
  }
  return null;
}

export function deleteItem(id) {
  const index = itemsData.findIndex((item) => item.id === id);
  if (index !== -1) {
    const deleted = itemsData[index];
    itemsData = itemsData.filter((item) => item.id !== id);
    return deleted;
  }
  return null;
}

