


"use client";
import Swal from 'sweetalert2'
import React, { useState, useEffect } from 'react';
// Framer Motion import করুন
import { motion } from 'framer-motion'; 

// প্রয়োজনীয় আইকনগুলো lucide-react থেকে import করুন
import {
  Check, Minus, ShoppingCart, Box, Truck, ShoppingBag,
  Warehouse, Factory, FileText, Users, ShieldCheck
} from 'lucide-react';


const permissionsConfig = {
  Order: ['order.create', 'order.delete', 'order.update', 'order.view'],
  Product: ['product.create', 'product.delete', 'product.update', 'product.view'],
  Courier: ['courier.create', 'courier.update', 'courier.delete', 'courier.view'],
  Purchase: ['purchase.create', 'purchase.update', 'purchase.delete', 'purchase.view'],
  Stock: ['stock.create', 'stock.update', 'stock.delete', 'stock.view', 'stock.transfer'],
  Supplier: ['supplier.create', 'supplier.update', 'supplier.delete', 'supplier.view'],
  Cms: ['cms.create', 'cms.update', 'cms.delete', 'cms.view'],
  User: ['user.create', 'user.update', 'user.delete', 'user.view'],
  'Manage Permissions': ['manage-permissions'],
};

// --- প্রতিটি গ্রুপের জন্য আইকন ম্যাপিং ---
const groupIcons: { [key: string]: React.ElementType } = {
  Order: ShoppingCart,
  Product: Box,
  Courier: Truck,
  Purchase: ShoppingBag,
  Stock: Warehouse,
  Supplier: Factory,
  Cms: FileText,
  User: Users,
  'Manage Permissions': ShieldCheck,
};

// --- Custom Checkbox Component (কোনো পরিবর্তন নেই) ---
const CustomCheckbox = ({ checked, onChange, isIndeterminate = false, id }: { checked: boolean; onChange: () => void; isIndeterminate?: boolean; id: string }) => {
  const checkboxRef = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (checkboxRef.current) {
      checkboxRef.current.indeterminate = isIndeterminate;
    }
  }, [isIndeterminate]);

  return (
    <div className="relative flex items-center">
      <input
        type="checkbox"
        ref={checkboxRef}
        id={id}
        checked={checked && !isIndeterminate}
        onChange={onChange}
        className="appearance-none h-5 w-5 border-2 border-gray-400 rounded-md checked:bg-blue-600 checked:border-transparent focus:outline-none cursor-pointer"
      />
      {checked && !isIndeterminate && (
         <Check className="absolute left-0.5 top-0.5 h-4 w-4 text-white pointer-events-none" />
      )}
      {isIndeterminate && (
         <Minus className="absolute left-0.5 top-0.5 h-4 w-4 text-blue-600 pointer-events-none" />
      )}
    </div>
  );
};


// --- Main Component ---
const ManagePermission = () => {
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

  const handlePermissionChange = (permission:any) => {
    setSelectedPermissions((prev) =>
      prev.includes(permission)
        ? prev.filter((p) => p !== permission)
        : [...prev, permission]
    );
  };

  const handleGroupToggle = (groupPermissions:any) => {
    const allSelected = groupPermissions.every((p:any) => selectedPermissions.includes(p));
    
    if (allSelected) {
      setSelectedPermissions((prev) =>
        prev.filter((p) => !groupPermissions.includes(p))
      );
    } else {
      setSelectedPermissions((prev) => [
        ...new Set([...prev, ...groupPermissions]),
      ]);
    }
  };
 
  const handleSave = () => {
    console.log('Selected Permissions:', selectedPermissions);

    Swal.fire({
      title: "Save Changes?",
      text: "Are you sure you want to save these new permissions?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, save it!"
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Saved!",
          text: "The permissions have been updated.",
          icon: "success",
          timer: 2000, 
          showConfirmButton: false
        });
      }
    });
  };

  // --- অ্যানিমেশনের জন্য ভ্যারিয়েন্ট ---
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05, // প্রতিটি আইটেম একের পর এক আসবে
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring" as const,
        stiffness: 100,
      },
    },
  };


  return (
    <div className="bg-gray-100 min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-lg p-6 sm:p-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">Manage Permissions</h1>
        
        {/* Permissions Grid */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {Object.entries(permissionsConfig).map(([groupTitle, permissions]) => {
            const allGroupPermissionsSelected = permissions.every(p => selectedPermissions.includes(p));
            const someGroupPermissionsSelected = permissions.some(p => selectedPermissions.includes(p));
            const isIndeterminate = someGroupPermissionsSelected && !allGroupPermissionsSelected;
            const Icon = groupIcons[groupTitle]; // ডায়নামিকভাবে আইকন লোড করা

            return (
              <motion.div 
                key={groupTitle} 
                className="bg-white rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow duration-300"
                variants={itemVariants}
              >
                {/* Group Header with Toggle */}
                <div className="flex items-center pb-3 border-b border-gray-200 mb-3">
                  <CustomCheckbox
                      id={`group-${groupTitle}`}
                      checked={allGroupPermissionsSelected}
                      isIndeterminate={isIndeterminate}
                      onChange={() => handleGroupToggle(permissions)}
                  />
                  {/* আইকন যুক্ত করা হয়েছে */}
                  {Icon && <Icon className="h-5 w-5 text-gray-500 ml-3 mr-2" />}
                  <label htmlFor={`group-${groupTitle}`} className="font-semibold text-gray-700 cursor-pointer">{groupTitle}</label>
                </div>

                <div className="space-y-3">
                  {permissions.map((permission) => (
                    <div key={permission} className="flex items-center">
                       <CustomCheckbox
                            id={permission}
                            checked={selectedPermissions.includes(permission)}
                            onChange={() => handlePermissionChange(permission)}
                        />
                      <label htmlFor={permission} className="ml-3 text-sm text-gray-600 cursor-pointer">{permission}</label>
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        <div className="mt-8 flex justify-end">
          {/* গ্র্যাডিয়েন্ট বাটন */}
          <button
            onClick={handleSave}
            className="px-8 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-lg shadow-md hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-75 transition-all duration-300 transform hover:scale-105"
          >
            Save Permissions
          </button>
        </div>
      </div>
    </div>
  );
};

export default ManagePermission;