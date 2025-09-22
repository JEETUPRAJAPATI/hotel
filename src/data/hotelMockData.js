// Mock data for hotel management
export const mockHotels = [
  {
    id: 1,
    name: "Grand Palace Hotel",
    owner: "John Smith",
    address: {
      street: "123 Main Street",
      city: "New York",
      state: "NY",
      country: "USA",
      zip: "10001"
    },
    contact: {
      phone: "+1-555-0123",
      email: "contact@grandpalace.com"
    },
    rating: 5,
    rooms: 150,
    priceRange: "$200 - $500",
    amenities: ["WiFi", "Pool", "Spa", "Gym", "Restaurant", "Bar", "Parking"],
    status: "Active",
    createdAt: "2024-01-15",
    updatedAt: "2024-09-01"
  },
  {
    id: 2,
    name: "Ocean View Resort",
    owner: "Sarah Johnson",
    address: {
      street: "456 Beach Boulevard",
      city: "Miami",
      state: "FL",
      country: "USA",
      zip: "33101"
    },
    contact: {
      phone: "+1-555-0456",
      email: "info@oceanview.com"
    },
    rating: 4,
    rooms: 200,
    priceRange: "$150 - $400",
    amenities: ["WiFi", "Pool", "Beach Access", "Restaurant", "Bar", "Spa"],
    status: "Active",
    createdAt: "2024-02-20",
    updatedAt: "2024-08-15"
  },
  {
    id: 3,
    name: "Mountain Lodge",
    owner: "Michael Brown",
    address: {
      street: "789 Mountain Road",
      city: "Denver",
      state: "CO",
      country: "USA",
      zip: "80201"
    },
    contact: {
      phone: "+1-555-0789",
      email: "reservations@mountainlodge.com"
    },
    rating: 4,
    rooms: 75,
    priceRange: "$100 - $250",
    amenities: ["WiFi", "Fireplace", "Hiking Trails", "Restaurant", "Parking"],
    status: "Active",
    createdAt: "2024-03-10",
    updatedAt: "2024-07-20"
  },
  {
    id: 4,
    name: "City Center Hotel",
    owner: "Emma Davis",
    address: {
      street: "321 Downtown Avenue",
      city: "Chicago",
      state: "IL",
      country: "USA",
      zip: "60601"
    },
    contact: {
      phone: "+1-555-0321",
      email: "stay@citycenter.com"
    },
    rating: 3,
    rooms: 120,
    priceRange: "$80 - $180",
    amenities: ["WiFi", "Business Center", "Restaurant", "Parking"],
    status: "Inactive",
    createdAt: "2024-04-05",
    updatedAt: "2024-06-10"
  },
  {
    id: 5,
    name: "Luxury Suites",
    owner: "Robert Wilson",
    address: {
      street: "567 Elite Street",
      city: "Los Angeles",
      state: "CA",
      country: "USA",
      zip: "90210"
    },
    contact: {
      phone: "+1-555-0567",
      email: "concierge@luxurysuites.com"
    },
    rating: 5,
    rooms: 80,
    priceRange: "$300 - $800",
    amenities: ["WiFi", "Pool", "Spa", "Gym", "Concierge", "Valet", "Bar"],
    status: "Active",
    createdAt: "2024-05-12",
    updatedAt: "2024-09-05"
  },
  {
    id: 6,
    name: "Budget Inn",
    owner: "Lisa Anderson",
    address: {
      street: "890 Economy Lane",
      city: "Phoenix",
      state: "AZ",
      country: "USA",
      zip: "85001"
    },
    contact: {
      phone: "+1-555-0890",
      email: "info@budgetinn.com"
    },
    rating: 2,
    rooms: 60,
    priceRange: "$40 - $80",
    amenities: ["WiFi", "Parking"],
    status: "Active",
    createdAt: "2024-06-18",
    updatedAt: "2024-08-20"
  },
  {
    id: 7,
    name: "Historic Inn",
    owner: "David Miller",
    address: {
      street: "234 Heritage Street",
      city: "Boston",
      state: "MA",
      country: "USA",
      zip: "02101"
    },
    contact: {
      phone: "+1-555-0234",
      email: "stay@historicinn.com"
    },
    rating: 4,
    rooms: 45,
    priceRange: "$120 - $220",
    amenities: ["WiFi", "Historic Tours", "Restaurant", "Library"],
    status: "Active",
    createdAt: "2024-07-22",
    updatedAt: "2024-09-10"
  },
  {
    id: 8,
    name: "Beachside Hotel",
    owner: "Jennifer Taylor",
    address: {
      street: "678 Coastal Highway",
      city: "San Diego",
      state: "CA",
      country: "USA",
      zip: "92101"
    },
    contact: {
      phone: "+1-555-0678",
      email: "reservations@beachside.com"
    },
    rating: 4,
    rooms: 110,
    priceRange: "$180 - $350",
    amenities: ["WiFi", "Pool", "Beach Access", "Restaurant", "Bar", "Surfboard Rental"],
    status: "Active",
    createdAt: "2024-08-05",
    updatedAt: "2024-09-12"
  },
  {
    id: 9,
    name: "Airport Lodge",
    owner: "Thomas Garcia",
    address: {
      street: "901 Airport Road",
      city: "Seattle",
      state: "WA",
      country: "USA",
      zip: "98101"
    },
    contact: {
      phone: "+1-555-0901",
      email: "stay@airportlodge.com"
    },
    rating: 3,
    rooms: 95,
    priceRange: "$90 - $160",
    amenities: ["WiFi", "Shuttle Service", "Business Center", "Restaurant"],
    status: "Inactive",
    createdAt: "2024-08-20",
    updatedAt: "2024-09-08"
  },
  {
    id: 10,
    name: "Countryside Retreat",
    owner: "Maria Rodriguez",
    address: {
      street: "555 Rural Route",
      city: "Nashville",
      state: "TN",
      country: "USA",
      zip: "37201"
    },
    contact: {
      phone: "+1-555-0555",
      email: "info@countrysideretreat.com"
    },
    rating: 3,
    rooms: 35,
    priceRange: "$70 - $140",
    amenities: ["WiFi", "Horse Riding", "Nature Trails", "Restaurant", "Parking"],
    status: "Active",
    createdAt: "2024-09-01",
    updatedAt: "2024-09-15"
  }
];

// Helper functions
export const getUniqueValues = (key) => {
  if (key === 'city') {
    return [...new Set(mockHotels.map(hotel => hotel.address.city))];
  }
  if (key === 'status') {
    return [...new Set(mockHotels.map(hotel => hotel.status))];
  }
  if (key === 'rating') {
    return [...new Set(mockHotels.map(hotel => hotel.rating))].sort((a, b) => b - a);
  }
  if (key === 'owner') {
    return [...new Set(mockHotels.map(hotel => hotel.owner))];
  }
  return [];
};

export const filterHotels = (hotels, filters) => {
  return hotels.filter(hotel => {
    const matchesSearch = !filters.search || 
      hotel.name.toLowerCase().includes(filters.search.toLowerCase()) ||
      hotel.address.street.toLowerCase().includes(filters.search.toLowerCase()) ||
      hotel.address.city.toLowerCase().includes(filters.search.toLowerCase());
    
    const matchesCity = !filters.city || hotel.address.city === filters.city;
    const matchesStatus = !filters.status || hotel.status === filters.status;
    const matchesRating = !filters.rating || hotel.rating === parseInt(filters.rating);
    const matchesOwner = !filters.owner || hotel.owner === filters.owner;

    return matchesSearch && matchesCity && matchesStatus && matchesRating && matchesOwner;
  });
};