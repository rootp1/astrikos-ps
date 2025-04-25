import { useSession } from "next-auth/react";
import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion"; // You'll need to install framer-motion

const Profile = () => {
  const { data: session, status } = useSession();
  const [activeTab, setActiveTab] = useState("images");
  const [selectedItem, setSelectedItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadTitle, setUploadTitle] = useState("");
  const [uploadPreview, setUploadPreview] = useState(null);
  const fileInputRef = useRef(null);

  // Mock data - in a real app, you would fetch this from your backend
  const [userData, setUserData] = useState({
    images: [
      {
        id: 1,
        title: "Sunset",
        url: "/api/placeholder/600/400",
        date: "2025-03-12",
        type: "png",
      },
      {
        id: 2,
        title: "Mountains",
        url: "/api/placeholder/600/400",
        date: "2025-03-15",
        type: "svg",
      },
      {
        id: 3,
        title: "Beach",
        url: "/api/placeholder/600/400",
        date: "2025-03-18",
        type: "png",
      },
      {
        id: 4,
        title: "Forest",
        url: "/api/placeholder/600/400",
        date: "2025-03-20",
        type: "svg",
      },
      {
        id: 5,
        title: "City",
        url: "/api/placeholder/600/400",
        date: "2025-04-01",
        type: "png",
      },
      {
        id: 6,
        title: "Lake",
        url: "/api/placeholder/600/400",
        date: "2025-04-05",
        type: "svg",
      },
    ],
    models: [
      {
        id: 1,
        title: "Car Model",
        url: "/api/placeholder/600/400",
        date: "2025-03-10",
        type: "glb",
      },
      {
        id: 2,
        title: "House Model",
        url: "/api/placeholder/600/400",
        date: "2025-03-25",
        type: "gltf",
      },
      {
        id: 3,
        title: "Character",
        url: "/api/placeholder/600/400",
        date: "2025-04-02",
        type: "glb",
      },
    ],
    maps: [
      {
        id: 1,
        title: "Home Location",
        url: "/api/placeholder/600/400",
        date: "2025-03-05",
        type: "svg",
      },
      {
        id: 2,
        title: "Vacation Plan",
        url: "/api/placeholder/600/400",
        date: "2025-03-22",
        type: "png",
      },
    ],
  });

  const handleItemClick = (item) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
  };

  const handleDeleteItem = (id) => {
    setUserData({
      ...userData,
      [activeTab]: userData[activeTab].filter((item) => item.id !== id),
    });
    handleCloseModal();
  };

  const handleUpdateItem = (id, newTitle) => {
    setUserData({
      ...userData,
      [activeTab]: userData[activeTab].map((item) =>
        item.id === id ? { ...item, title: newTitle } : item
      ),
    });
  };

  const openUploadModal = () => {
    setIsUploadModalOpen(true);
  };

  const closeUploadModal = () => {
    setIsUploadModalOpen(false);
    setUploadFile(null);
    setUploadTitle("");
    setUploadPreview(null);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validImageTypes =
      activeTab === "images"
        ? ["image/svg+xml", "image/png"]
        : activeTab === "models"
        ? ["model/gltf-binary", "model/gltf+json"]
        : ["image/svg+xml", "image/png"];

    const fileType =
      file.type ||
      (file.name && file.name.endsWith(".glb")
        ? "model/gltf-binary"
        : file.name && file.name.endsWith(".gltf")
        ? "model/gltf+json"
        : "");

    if (
      !validImageTypes.includes(fileType) &&
      !(
        activeTab === "models" &&
        (file.name.endsWith(".glb") || file.name.endsWith(".gltf"))
      )
    ) {
      alert(
        `Please select a valid file: ${
          activeTab === "images"
            ? "SVG or PNG"
            : activeTab === "models"
            ? "GLTF or GLB"
            : "SVG or PNG"
        }`
      );
      return;
    }

    setUploadFile(file);
    setUploadTitle(file.name.split(".")[0]); // Default title from filename

    // Create preview for images
    if (activeTab !== "models") {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadPreview(e.target.result);
      };
      reader.readAsDataURL(file);
    } else {
      // For models, just show a placeholder
      setUploadPreview("/api/placeholder/600/400");
    }
  };

  const handleUpload = () => {
    // In a real app, you would upload to your backend here
    // For this demo, we'll just add it to our local state
    const newItem = {
      id: Math.max(...userData[activeTab].map((item) => item.id), 0) + 1,
      title: uploadTitle,
      url: uploadPreview || "/api/placeholder/600/400",
      date: new Date().toISOString().split("T")[0],
      type: uploadFile.name.split(".").pop().toLowerCase(), // Get file extension
    };

    setUserData({
      ...userData,
      [activeTab]: [...userData[activeTab], newItem],
    });

    closeUploadModal();
  };

  // Animation variants for framer-motion
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
  };

  const gradientColors = {
    images: "from-indigo-800 to-purple-900",
    models: "from-purple-800 to-pink-900",
    maps: "from-blue-800 to-cyan-900",
  };

  const accentColors = {
    images: {
      primary: "bg-indigo-600 hover:bg-indigo-700",
      secondary: "text-indigo-400",
      border: "border-indigo-500",
      highlight: "bg-indigo-900",
    },
    models: {
      primary: "bg-purple-600 hover:bg-purple-700",
      secondary: "text-purple-400",
      border: "border-purple-500",
      highlight: "bg-purple-900",
    },
    maps: {
      primary: "bg-blue-600 hover:bg-blue-700",
      secondary: "text-blue-400",
      border: "border-blue-500",
      highlight: "bg-blue-900",
    },
  };

  const currentColors = accentColors[activeTab];

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-6">
      {status === "loading" ? (
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      ) : session ? (
        <div className="max-w-6xl mx-auto">
          {/* User Profile Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={`flex flex-col md:flex-row items-center mb-10 bg-gradient-to-r ${gradientColors[activeTab]} p-6 rounded-lg shadow-lg border border-gray-700`}
          >
            <div className="relative">
              <img
                src={session.user.image || "/api/placeholder/100/100"}
                className={`w-24 h-24 rounded-full border-4 ${currentColors.border} shadow-lg mb-4 md:mb-0 md:mr-6`}
                alt="Profile"
              />
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-transparent to-black opacity-20"></div>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">
                Welcome,{" "}
                <span className={currentColors.secondary}>
                  {session.user.name}
                </span>
              </h1>
              <p className="text-gray-300">{session.user.email}</p>
            </div>
          </motion.div>

          {/* Gallery Navigation */}
          <div className="grid grid-cols-3 gap-6 mb-8">
            {["images", "models", "maps"].map((tab) => (
              <motion.div
                key={tab}
                whileHover={{ scale: activeTab !== tab ? 1.03 : 1 }}
                whileTap={{ scale: 0.97 }}
                className={`p-6 rounded-lg cursor-pointer transition-all duration-300 flex flex-col items-center justify-center 
                ${
                  activeTab === tab
                    ? `bg-gradient-to-br ${gradientColors[tab]} shadow-lg transform scale-105 border border-gray-700`
                    : "bg-gray-800 hover:bg-gray-750"
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab === "images" ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-10 w-10 mb-2 ${accentColors[tab].secondary}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                ) : tab === "models" ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-10 w-10 mb-2 ${accentColors[tab].secondary}`}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-10 w-10 mb-2 ${accentColors[tab].secondary}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                    />
                  </svg>
                )}
                <h2 className="text-xl font-semibold">
                  {tab === "images"
                    ? "2D Images"
                    : tab === "models"
                    ? "3D Models"
                    : "Maps"}
                </h2>
                <span className="text-sm text-gray-400">
                  {userData[tab].length} items
                </span>
              </motion.div>
            ))}
          </div>

          {/* Content Grid with Upload Button */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className={`bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-700`}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className={`text-2xl font-bold ${currentColors.secondary}`}>
                Your{" "}
                {activeTab === "images"
                  ? "2D Images"
                  : activeTab === "models"
                  ? "3D Models"
                  : "Maps"}
              </h2>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={openUploadModal}
                className={`${currentColors.primary} text-white font-bold py-2 px-4 rounded-full shadow-lg transition duration-300 flex items-center`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                    clipRule="evenodd"
                  />
                </svg>
                Upload New
              </motion.button>
            </div>

            {userData[activeTab].length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20"
              >
                <div className="mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-16 w-16 mx-auto ${currentColors.secondary} opacity-60`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                    />
                  </svg>
                </div>
                <p className="text-xl text-gray-500 mb-6">No items found</p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={openUploadModal}
                  className={`${currentColors.primary} text-white font-bold py-3 px-8 rounded-full shadow-lg transition duration-300`}
                >
                  Upload Your First{" "}
                  {activeTab === "images"
                    ? "Image"
                    : activeTab === "models"
                    ? "Model"
                    : "Map"}
                </motion.button>
              </motion.div>
            ) : (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {userData[activeTab].map((item) => (
                  <motion.div
                    key={item.id}
                    variants={itemVariants}
                    whileHover={{ scale: 1.03, y: -5 }}
                    className={`bg-gray-700 rounded-lg overflow-hidden shadow-lg cursor-pointer group`}
                    onClick={() => handleItemClick(item)}
                  >
                    <div className="relative pb-2/3">
                      <img
                        src={item.url}
                        alt={item.title}
                        className="absolute h-full w-full object-cover transition-all duration-500 transform group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-70 transition-opacity duration-300"></div>
                      <div className="absolute top-2 right-2">
                        <span
                          className={`text-xs font-bold px-2 py-1 rounded-full bg-opacity-70 ${currentColors.primary} uppercase`}
                        >
                          {item.type}
                        </span>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-lg mb-1 text-white group-hover:text-indigo-300 transition-colors duration-200">
                        {item.title}
                      </h3>
                      <p className="text-gray-400 text-sm">{item.date}</p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </motion.div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-screen">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <div className="mb-8">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-24 w-24 mx-auto text-gray-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <p className="text-2xl mb-6 text-gray-400">
              Sign in to view your profile
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transition duration-300"
            >
              Sign In
            </motion.button>
          </motion.div>
        </div>
      )}

      {/* Modal for viewing/editing/deleting items */}
      {isModalOpen && selectedItem && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="bg-gray-800 rounded-lg shadow-2xl max-w-4xl w-full max-h-full overflow-auto border border-gray-700"
          >
            <div className="flex justify-between items-center p-6 border-b border-gray-700">
              <input
                type="text"
                value={selectedItem.title}
                onChange={(e) =>
                  setSelectedItem({ ...selectedItem, title: e.target.value })
                }
                className={`bg-gray-700 text-white text-xl font-bold border-none focus:ring-2 focus:ring-${currentColors.secondary} rounded px-2 py-1`}
              />
              <button
                onClick={handleCloseModal}
                className="text-gray-400 cursor-pointer hover:text-white"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="p-6">
              <div className="mb-6 bg-gray-900 rounded-lg overflow-hidden border border-gray-700">
                <img
                  src={selectedItem.url}
                  alt={selectedItem.title}
                  className="w-full object-contain max-h-96"
                />
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-gray-400 mb-2 sm:mb-0">
                    Added on: {selectedItem.date}
                  </p>
                  <p className="text-gray-400 mb-4 sm:mb-0">
                    Format:{" "}
                    <span
                      className={`font-semibold ${currentColors.secondary}`}
                    >
                      {selectedItem.type.toUpperCase()}
                    </span>
                  </p>
                </div>

                <div className="flex space-x-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      handleUpdateItem(selectedItem.id, selectedItem.title);
                      handleCloseModal();
                    }}
                    className={`${currentColors.primary} cursor-pointer text-white px-4 py-2 rounded-lg flex items-center`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Save
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleDeleteItem(selectedItem.id)}
                    className="bg-red-600 cursor-pointer hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                    Delete
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Upload Modal */}
      {isUploadModalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="bg-gray-800 rounded-lg shadow-2xl max-w-xl w-full border border-gray-700"
          >
            <div className="flex justify-between items-center p-6 border-b border-gray-700">
              <h3 className={`text-xl font-bold ${currentColors.secondary}`}>
                Upload New{" "}
                {activeTab === "images"
                  ? "Image"
                  : activeTab === "models"
                  ? "3D Model"
                  : "Map"}
              </h3>
              <button
                onClick={closeUploadModal}
                className="text-gray-400 cursor-pointer hover:text-white"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="p-6">
              <div className="mb-6">
                <label className="block text-gray-300 mb-2">Title</label>
                <input
                  type="text"
                  value={uploadTitle}
                  onChange={(e) => setUploadTitle(e.target.value)}
                  className="w-full bg-gray-700 text-white border-none rounded-lg p-3 focus:ring-2 focus:ring-indigo-500"
                  placeholder={`Enter ${
                    activeTab === "images"
                      ? "image"
                      : activeTab === "models"
                      ? "model"
                      : "map"
                  } title`}
                />
              </div>

              <div className="mb-6">
                <label className="block text-gray-300 mb-2">
                  File{" "}
                  {activeTab === "images"
                    ? "(SVG, PNG)"
                    : activeTab === "models"
                    ? "(GLTF, GLB)"
                    : "(SVG, PNG)"}
                </label>
                <div
                  onClick={() => fileInputRef.current.click()}
                  className="w-full h-32 border-2 border-dashed border-gray-600 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-indigo-500 transition-colors duration-300"
                >
                  {uploadPreview ? (
                    <div className="relative w-full h-full">
                      <img
                        src={uploadPreview}
                        alt="Preview"
                        className="w-full h-full object-contain p-2"
                      />
                    </div>
                  ) : (
                    <>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-10 w-10 text-gray-400 mb-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                        />
                      </svg>
                      <p className="text-gray-400 text-sm">
                        Click to select a file or drag it here
                      </p>
                    </>
                  )}
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                  accept={
                    activeTab === "images"
                      ? ".svg,.png,image/svg+xml,image/png"
                      : activeTab === "models"
                      ? ".gltf,.glb,model/gltf-binary,model/gltf+json"
                      : ".svg,.png,image/svg+xml,image/png"
                  }
                />
              </div>

              <div className="flex justify-end">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={closeUploadModal}
                  className="bg-gray-600 cursor-pointer hover:bg-gray-700 text-white px-4 py-2 rounded-lg mr-3"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleUpload}
                  disabled={!uploadFile || !uploadTitle}
                  className={`${
                    !uploadFile || !uploadTitle
                      ? "bg-gray-500 cursor-not-allowed"
                      : currentColors.primary
                  } text-white px-4 py-2 rounded-lg`}
                >
                  Upload
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default Profile;