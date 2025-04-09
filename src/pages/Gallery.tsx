
import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent,
  DialogClose
} from "@/components/ui/dialog";
import { X } from 'lucide-react';

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  
  const categories = [
    { id: 'all', name: 'Toutes les photos' },
    { id: 'destinations', name: 'Destinations' },
    { id: 'tickets', name: 'Billets' },
    { id: 'clients', name: 'Clients' },
    { id: 'flights', name: 'Avions' }
  ];
  
  const [activeCategory, setActiveCategory] = useState('all');
  
  const galleryImages = [
    {
      id: 1,
      src: "https://images.unsplash.com/photo-1503220317375-aaad61436b1b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      alt: "Dubai Skyline",
      category: "destinations",
      title: "Dubai, Émirats Arabes Unis"
    },
    {
      id: 2,
      src: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2020&q=80",
      alt: "Paris Eiffel Tower",
      category: "destinations",
      title: "Paris, France"
    },
    {
      id: 3,
      src: "https://images.unsplash.com/photo-1533862451183-26edae805aff?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      alt: "Marrakech",
      category: "destinations",
      title: "Marrakech, Maroc"
    },
    {
      id: 4,
      src: "https://images.unsplash.com/photo-1588435338351-9ae55182a1f8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      alt: "Air ticket and passport",
      category: "tickets",
      title: "Billet d'avion et passeport"
    },
    {
      id: 5,
      src: "https://images.unsplash.com/photo-1627574080023-249f2fb1cc91?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80",
      alt: "Mobile boarding pass",
      category: "tickets",
      title: "Carte d'embarquement mobile"
    },
    {
      id: 6,
      src: "https://images.unsplash.com/photo-1628363068657-5d0fc1234fe0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      alt: "Happy tourists",
      category: "clients",
      title: "Clients satisfaits à Istanbul"
    },
    {
      id: 7,
      src: "https://images.unsplash.com/photo-1454659549371-87311c08d016?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      alt: "Family travel",
      category: "clients",
      title: "Voyage en famille"
    },
    {
      id: 8,
      src: "https://images.unsplash.com/photo-1569629743817-70d8db6c323b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80",
      alt: "Business traveler",
      category: "clients",
      title: "Voyageur d'affaires"
    },
    {
      id: 9,
      src: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80",
      alt: "Airplane wing view",
      category: "flights",
      title: "Vue depuis le hublot"
    },
    {
      id: 10,
      src: "https://images.unsplash.com/photo-1474302770737-173ee21bab63?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2232&q=80",
      alt: "Airplane on runway",
      category: "flights",
      title: "Avion sur la piste"
    },
    {
      id: 11,
      src: "https://images.unsplash.com/photo-1558409057-bbe679023136?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      alt: "Istanbul Turkey",
      category: "destinations",
      title: "Istanbul, Turquie"
    },
    {
      id: 12,
      src: "https://images.unsplash.com/photo-1572972520661-e2898956a237?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      alt: "Cairo Egypt",
      category: "destinations",
      title: "Le Caire, Égypte"
    }
  ];
  
  const filteredImages = activeCategory === 'all' 
    ? galleryImages 
    : galleryImages.filter(image => image.category === activeCategory);

  return (
    <main className="bg-nasser-light py-16">
      <div className="container-custom">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-6">
            Notre Galerie
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Découvrez des destinations de rêve et des moments inoubliables de nos clients
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex justify-center flex-wrap gap-3 mb-12">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-4 py-2 rounded-full transition-colors ${
                activeCategory === category.id 
                  ? 'bg-nasser-primary text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredImages.map((image) => (
            <div 
              key={image.id} 
              className="group relative overflow-hidden rounded-lg shadow-md cursor-pointer transition-transform hover:scale-105"
              onClick={() => setSelectedImage(image.src)}
            >
              <img 
                src={image.src} 
                alt={image.alt}
                className="w-full h-64 object-cover transition-transform group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end">
                <div className="p-4 w-full">
                  <h3 className="text-white font-medium">{image.title}</h3>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredImages.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">
              Aucune image trouvée dans cette catégorie.
            </p>
          </div>
        )}

        {/* Image Viewer Dialog */}
        <Dialog 
          open={selectedImage !== null} 
          onOpenChange={(open) => !open && setSelectedImage(null)}
        >
          <DialogContent className="max-w-5xl p-0 bg-transparent border-none">
            <div className="relative rounded-lg overflow-hidden">
              {selectedImage && (
                <img 
                  src={selectedImage} 
                  alt="Vue agrandie" 
                  className="w-full h-auto max-h-[80vh] object-contain bg-black"
                />
              )}
              <DialogClose className="absolute top-2 right-2 bg-black/50 rounded-full p-2 text-white hover:bg-black/70">
                <X className="h-6 w-6" />
              </DialogClose>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </main>
  );
};

export default Gallery;
