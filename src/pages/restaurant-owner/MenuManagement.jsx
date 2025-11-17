import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Search, Filter, Edit, Trash2, Eye, ImageIcon, Star,
  Clock, DollarSign, Tag, Grid, List, ChevronDown, X, Upload
} from 'lucide-react';

const MenuManagement = () => {
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showCategoryModal, setShowCategoryModal] = useState(false);

  const [categories, setCategories] = useState([
    { id: 'all', name: 'All Items', count: 14 },
    { id: 'appetizers', name: 'Appetizers', count: 3 },
    { id: 'mains', name: 'Main Course', count: 5 },
    { id: 'desserts', name: 'Desserts', count: 2 },
    { id: 'beverages', name: 'Beverages', count: 4 }
  ]);

  const [menuItems, setMenuItems] = useState([
    {
      id: 1,
      name: 'Margherita Pizza',
      category: 'mains',
      price: 14.99,
      description: 'Fresh tomatoes, mozzarella, basil',
      image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=300',
      ingredients: ['Tomatoes', 'Mozzarella', 'Basil', 'Olive Oil'],
      allergens: ['Gluten', 'Dairy'],
      prep_time: 15,
      calories: 280,
      is_available: true,
      is_vegetarian: true,
      is_spicy: false,
      rating: 4.5,
      orders_count: 45
    },
    {
      id: 2,
      name: 'Chicken Caesar Salad',
      category: 'appetizers',
      price: 12.99,
      description: 'Grilled chicken, romaine lettuce, parmesan, croutons',
      image: 'https://images.unsplash.com/photo-1551248429-40975aa4de74?w=300',
      ingredients: ['Chicken Breast', 'Romaine Lettuce', 'Parmesan', 'Croutons'],
      allergens: ['Gluten', 'Dairy'],
      prep_time: 10,
      calories: 320,
      is_available: true,
      is_vegetarian: false,
      is_spicy: false,
      rating: 4.2,
      orders_count: 32
    },
    {
      id: 3,
      name: 'Chocolate Lava Cake',
      category: 'desserts',
      price: 8.99,
      description: 'Warm chocolate cake with molten center',
      image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=300',
      ingredients: ['Chocolate', 'Butter', 'Eggs', 'Flour'],
      allergens: ['Gluten', 'Dairy', 'Eggs'],
      prep_time: 20,
      calories: 450,
      is_available: true,
      is_vegetarian: true,
      is_spicy: false,
      rating: 4.8,
      orders_count: 28
    }
  ]);

  const [newItem, setNewItem] = useState({
    name: '',
    category: '',
    price: '',
    description: '',
    ingredients: [],
    allergens: [],
    prep_time: '',
    calories: '',
    is_vegetarian: false,
    is_spicy: false,
    is_available: true
  });

  const filteredItems = menuItems.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleCreateItem = () => {
    const newId = Math.max(...menuItems.map(item => item.id)) + 1;
    const itemToAdd = {
      ...newItem,
      id: newId,
      price: parseFloat(newItem.price),
      prep_time: parseInt(newItem.prep_time),
      calories: parseInt(newItem.calories),
      rating: 0,
      orders_count: 0,
      image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=300'
    };
    setMenuItems([...menuItems, itemToAdd]);
    setNewItem({
      name: '',
      category: '',
      price: '',
      description: '',
      ingredients: [],
      allergens: [],
      prep_time: '',
      calories: '',
      is_vegetarian: false,
      is_spicy: false,
      is_available: true
    });
    setShowCreateModal(false);
  };

  const handleEditItem = () => {
    setMenuItems(menuItems.map(item => 
      item.id === selectedItem.id ? { ...selectedItem } : item
    ));
    setShowEditModal(false);
    setSelectedItem(null);
  };

  const handleDeleteItem = () => {
    setMenuItems(menuItems.filter(item => item.id !== selectedItem.id));
    setShowDeleteModal(false);
    setSelectedItem(null);
  };

  const MenuItemCard = ({ item }) => (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300"
    >
      <div className="relative">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-3 right-3 flex gap-2">
          {item.is_vegetarian && (
            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
              Veg
            </span>
          )}
          {item.is_spicy && (
            <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
              Spicy
            </span>
          )}
          {!item.is_available && (
            <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">
              Out of Stock
            </span>
          )}
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-gray-900 text-lg">{item.name}</h3>
          <span className="font-bold text-green-600 text-lg">${item.price}</span>
        </div>
        
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{item.description}</p>
        
        <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            {item.prep_time} min
          </div>
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-yellow-400" />
            {item.rating}
          </div>
          <div className="text-gray-400">
            {item.orders_count} orders
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex gap-2">
            <button
              onClick={() => {
                setSelectedItem(item);
                setShowEditModal(true);
              }}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="Edit Item"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                setSelectedItem(item);
                setShowDeleteModal(true);
              }}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Delete Item"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            item.is_available 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {item.is_available ? 'Available' : 'Out of Stock'}
          </span>
        </div>
      </div>
    </motion.div>
  );

  const CreateEditModal = ({ isEdit = false, onClose, onSave, item = newItem, setItem }) => (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        >
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">
                {isEdit ? 'Edit Menu Item' : 'Add New Menu Item'}
              </h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>

          <div className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Item Name
                </label>
                <input
                  type="text"
                  value={item.name}
                  onChange={(e) => setItem({ ...item, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="Enter item name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={item.category}
                  onChange={(e) => setItem({ ...item, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                >
                  <option value="">Select Category</option>
                  <option value="appetizers">Appetizers</option>
                  <option value="mains">Main Course</option>
                  <option value="desserts">Desserts</option>
                  <option value="beverages">Beverages</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={item.description}
                onChange={(e) => setItem({ ...item, description: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                placeholder="Enter item description"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price ($)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={item.price}
                  onChange={(e) => setItem({ ...item, price: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prep Time (min)
                </label>
                <input
                  type="number"
                  value={item.prep_time}
                  onChange={(e) => setItem({ ...item, prep_time: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="15"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Calories
                </label>
                <input
                  type="number"
                  value={item.calories}
                  onChange={(e) => setItem({ ...item, calories: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="280"
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={item.is_vegetarian}
                  onChange={(e) => setItem({ ...item, is_vegetarian: e.target.checked })}
                  className="mr-2 text-orange-600 focus:ring-orange-500"
                />
                Vegetarian
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={item.is_spicy}
                  onChange={(e) => setItem({ ...item, is_spicy: e.target.checked })}
                  className="mr-2 text-orange-600 focus:ring-orange-500"
                />
                Spicy
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={item.is_available}
                  onChange={(e) => setItem({ ...item, is_available: e.target.checked })}
                  className="mr-2 text-orange-600 focus:ring-orange-500"
                />
                Available
              </label>
            </div>
          </div>

          <div className="p-6 border-t border-gray-200 flex gap-3 justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onSave}
              className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium transition-colors"
            >
              {isEdit ? 'Update Item' : 'Add Item'}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Menu Management</h1>
          <p className="text-gray-600">Manage your restaurant's menu items and categories</p>
        </div>
          <div className="mt-4 md:mt-0 flex gap-3">
            <button
              onClick={() => setShowCategoryModal(true)}
              className="px-4 py-2 text-orange-600 bg-orange-50 hover:bg-orange-100 rounded-lg font-medium transition-colors"
            >
              Manage Categories
            </button>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Menu Item
            </button>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search menu items..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              >
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name} ({category.count})
                  </option>
                ))}
              </select>
              <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${viewMode === 'grid' ? 'bg-orange-600 text-white' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${viewMode === 'list' ? 'bg-orange-600 text-white' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Menu Items Grid */}
        <motion.div
          layout
          className={`grid ${
            viewMode === 'grid' 
              ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
              : 'grid-cols-1'
          } gap-6`}
        >
          <AnimatePresence>
            {filteredItems.map((item) => (
              <MenuItemCard key={item.id} item={item} />
            ))}
          </AnimatePresence>
        </motion.div>

        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <ImageIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No menu items found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || selectedCategory !== 'all' 
                ? 'Try adjusting your search or filter criteria'
                : 'Start by adding your first menu item'
              }
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium transition-colors"
            >
              Add Menu Item
            </button>
          </div>
        )}

        {/* Create Modal */}
        {showCreateModal && (
          <CreateEditModal
            onClose={() => setShowCreateModal(false)}
            onSave={handleCreateItem}
            item={newItem}
            setItem={setNewItem}
          />
        )}

        {/* Edit Modal */}
        {showEditModal && selectedItem && (
          <CreateEditModal
            isEdit={true}
            onClose={() => {
              setShowEditModal(false);
              setSelectedItem(null);
            }}
            onSave={handleEditItem}
            item={selectedItem}
            setItem={setSelectedItem}
          />
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && selectedItem && (
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-xl shadow-2xl max-w-md w-full"
              >
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Menu Item</h3>
                  <p className="text-gray-600 mb-4">
                    Are you sure you want to delete "{selectedItem.name}"? This action cannot be undone.
                  </p>
                  <div className="flex gap-3 justify-end">
                    <button
                      onClick={() => {
                        setShowDeleteModal(false);
                        setSelectedItem(null);
                      }}
                      className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleDeleteItem}
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        )}
      </div>
  );
};

export default MenuManagement;