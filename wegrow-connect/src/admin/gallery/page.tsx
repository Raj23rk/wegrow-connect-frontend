import React, { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar";
import DashboardProfileMenu from "../../components/DashboardProfileMenu";
import {
  Image,
  Plus,
  Trash2,
  Upload,
  Search,
  CheckCircle2,
  X,
  Eye,
  Tag,
  Sparkles
} from "lucide-react";
import { getCombinedGalleryItems, DEFAULT_GALLERY_ITEMS } from "../../components/GalleryPage";

export default function AdminGalleryPage() {
  const [photos, setPhotos] = useState<any[]>([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedPhotoModal, setSelectedPhotoModal] = useState<any>(null);

  // Form State
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [category, setCategory] = useState("workshop");
  const [imageUrl, setImageUrl] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");

  useEffect(() => {
    loadPhotos();
  }, []);

  const loadPhotos = () => {
    setPhotos(getCombinedGalleryItems());
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddPhoto = (e: React.FormEvent) => {
    e.preventDefault();

    const finalImage = previewUrl || imageUrl;
    if (!finalImage || !title) {
      alert("Please provide a photo title and image (file or URL).");
      return;
    }

    const badgeName = 
      category === "workshop" ? "Workshop" :
      category === "activity" ? "Activity" :
      category === "student" ? "Student" : "Business";

    const newPhoto = {
      id: Date.now(),
      category,
      title: title.trim(),
      subtitle: subtitle.trim() || 'Campus Moment & Achievement',
      image: finalImage,
      badge: badgeName,
      date: new Date().toISOString().split('T')[0],
      isCustom: true
    };

    try {
      const existingSaved = localStorage.getItem('wegrow_custom_gallery_photos');
      const customList = existingSaved ? JSON.parse(existingSaved) : [];
      const updatedList = [newPhoto, ...customList];
      localStorage.setItem('wegrow_custom_gallery_photos', JSON.stringify(updatedList));
      
      loadPhotos();
      setShowModal(false);
      
      // Reset Form
      setTitle("");
      setSubtitle("");
      setCategory("workshop");
      setImageUrl("");
      setImageFile(null);
      setPreviewUrl("");
    } catch (err) {
      console.error("Failed to save photo:", err);
      alert("Failed to upload photo. File size might be too large.");
    }
  };

  const handleDeletePhoto = (id: number, isCustom?: boolean) => {
    if (!window.confirm("Are you sure you want to delete this gallery photo?")) return;

    try {
      const existingSaved = localStorage.getItem('wegrow_custom_gallery_photos');
      if (existingSaved) {
        const customList = JSON.parse(existingSaved);
        const filtered = customList.filter((p: any) => p.id !== id);
        localStorage.setItem('wegrow_custom_gallery_photos', JSON.stringify(filtered));
      }
      loadPhotos();
    } catch (err) {
      console.error("Error deleting photo:", err);
    }
  };

  const filteredPhotos = photos.filter(p => {
    const matchesCat = activeCategory === "all" || p.category === activeCategory;
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.subtitle?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="flex h-screen bg-slate-100 font-sans overflow-hidden">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* TOP BAR */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-30 shadow-xs">
          <div>
            <h1 className="text-xl font-black text-slate-800 flex items-center gap-2">
              <Image className="w-5 h-5 text-[#147A87]" />
              Gallery Management
            </h1>
            <p className="text-xs text-slate-500 font-semibold">
              Upload photos to show in website home gallery and dedicated media page.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowModal(true)}
              className="bg-[#147A87] hover:bg-[#0f606a] text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-md cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Upload New Photo
            </button>
            <DashboardProfileMenu />
          </div>
        </header>

        {/* MAIN BODY */}
        <main className="p-6 space-y-6">
          
          {/* STATS & SEARCH HEADER */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
            
            <div className="flex items-center gap-3 w-full md:w-auto">
              <button
                onClick={() => setActiveCategory("all")}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeCategory === "all"
                    ? "bg-[#147A87] text-white shadow-sm"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                All Photos ({photos.length})
              </button>
              <button
                onClick={() => setActiveCategory("workshop")}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeCategory === "workshop"
                    ? "bg-blue-600 text-white shadow-sm"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                Workshops
              </button>
              <button
                onClick={() => setActiveCategory("activity")}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeCategory === "activity"
                    ? "bg-amber-500 text-white shadow-sm"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                Activities
              </button>
              <button
                onClick={() => setActiveCategory("student")}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeCategory === "student"
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                Student
              </button>
              <button
                onClick={() => setActiveCategory("business")}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeCategory === "business"
                    ? "bg-purple-600 text-white shadow-sm"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                Business
              </button>
            </div>

            {/* SEARCH */}
            <div className="relative w-full md:w-64">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search photos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#147A87]"
              />
            </div>

          </div>

          {/* GALLERY GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {filteredPhotos.map((photo) => (
              <div
                key={photo.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between group hover:shadow-md transition-all"
              >
                <div>
                  <div className="relative h-44 bg-slate-900 overflow-hidden">
                    <img
                      src={photo.image}
                      alt={photo.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e: any) => {
                        e.target.onerror = null;
                        e.target.src = 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800';
                      }}
                    />
                    <span className="absolute top-2 left-2 text-[10px] font-black uppercase tracking-wider bg-black/60 backdrop-blur-xs text-white px-2.5 py-1 rounded-full">
                      {photo.badge || photo.category}
                    </span>

                    {photo.isCustom && (
                      <span className="absolute top-2 right-2 text-[9px] font-black uppercase tracking-wider bg-emerald-500 text-white px-2 py-0.5 rounded-md">
                        Admin Uploaded
                      </span>
                    )}
                  </div>

                  <div className="p-4">
                    <h3 className="font-extrabold text-sm text-slate-800 line-clamp-1">
                      {photo.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                      {photo.subtitle}
                    </p>
                  </div>
                </div>

                <div className="px-4 pb-4 pt-2 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => setSelectedPhotoModal(photo)}
                    className="text-xs text-[#147A87] font-bold flex items-center gap-1 hover:underline cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" /> Preview
                  </button>

                  <button
                    onClick={() => handleDeletePhoto(photo.id, photo.isCustom)}
                    className="text-xs text-red-600 font-bold flex items-center gap-1 hover:bg-red-50 p-1.5 rounded-lg transition-colors cursor-pointer"
                    title="Delete photo"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

        </main>
      </div>

      {/* UPLOAD MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
              <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
                <Upload className="w-5 h-5 text-[#147A87]" />
                Upload New Gallery Photo
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-600 text-xl font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddPhoto} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Photo Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. AI Masterclass Bootcamp 2026"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:border-[#147A87]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Subtitle / Description
                </label>
                <input
                  type="text"
                  placeholder="e.g. Students demonstrating web architecture projects"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:border-[#147A87]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Category *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:border-[#147A87] bg-white"
                >
                  <option value="workshop">Workshop</option>
                  <option value="activity">Activity</option>
                  <option value="student">Student</option>
                  <option value="business">Business</option>
                </select>
              </div>

              {/* IMAGE UPLOAD OPTIONS */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Upload Photo File
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-teal-50 file:text-[#147A87] hover:file:bg-teal-100 border border-dashed border-slate-300 rounded-xl p-1 cursor-pointer"
                />
              </div>

              <div className="text-center text-xs font-bold text-slate-400">OR</div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Image Web URL
                </label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/photo-..."
                  value={imageUrl}
                  onChange={(e) => {
                    setImageUrl(e.target.value);
                    if (e.target.value) setPreviewUrl(e.target.value);
                  }}
                  className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:border-[#147A87]"
                />
              </div>

              {/* PREVIEW */}
              {previewUrl && (
                <div className="mt-2">
                  <span className="block text-[11px] font-bold text-slate-500 mb-1">Image Preview:</span>
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-full h-32 object-cover rounded-xl border border-slate-200"
                  />
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold bg-[#147A87] hover:bg-[#0f606a] text-white rounded-xl shadow-md cursor-pointer"
                >
                  Save Photo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PREVIEW LIGHTBOX */}
      {selectedPhotoModal && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          onClick={() => setSelectedPhotoModal(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-2xl w-full p-4 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative h-72 bg-black rounded-2xl overflow-hidden mb-3">
              <img
                src={selectedPhotoModal.image}
                alt={selectedPhotoModal.title}
                className="w-full h-full object-contain"
              />
            </div>
            <h3 className="text-lg font-black text-slate-900">{selectedPhotoModal.title}</h3>
            <p className="text-xs text-slate-500 mt-1">{selectedPhotoModal.subtitle}</p>
            <button
              onClick={() => setSelectedPhotoModal(null)}
              className="mt-4 w-full py-2 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
