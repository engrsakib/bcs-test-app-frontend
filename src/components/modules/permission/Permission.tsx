"use client";
import Swal from 'sweetalert2'
import React, { useState, useEffect } from 'react';
import { Check, Minus } from 'lucide-react';


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

// --- Custom Checkbox Component ---
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

 
//   const handleSave = () => {
//     console.log('Selected Permissions:', selectedPermissions);
//     // alert("Permission Selected done please check console");

//     Swal.fire({
//   title: "Are you sure?",
//   text: "You won't be able to revert this!",
//   icon: "warning",
//   showCancelButton: true,
//   confirmButtonColor: "#3085d6",
//   cancelButtonColor: "#d33",
//   confirmButtonText: "Yes, delete it!"
// }).then((result) => {
//   if (result.isConfirmed) {
//     Swal.fire({
//       title: "Deleted!",
//       text: "Your file has been deleted.",
//       icon: "success"
//     });
//   }
// });




//   };
  
    // সেভ বাটনে ক্লিক করলে কনসোলে আউটপুট দেখাবে
  const handleSave = () => {
    // প্রথমে পারমিশনগুলো কনসোলে লগ করি
    console.log('Selected Permissions:', selectedPermissions);

    Swal.fire({
      title: "Save Changes?",
      text: "Are you sure you want to save these new permissions?",
      icon: "question", // "warning" এর বদলে "question" বা "info" ব্যবহার করতে পারেন
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


  return (
    <div className="bg-gray-100 min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-lg p-6 sm:p-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">Manage Permissions</h1>
        
        {/* Permissions Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Object.entries(permissionsConfig).map(([groupTitle, permissions]) => {
            const allGroupPermissionsSelected = permissions.every(p => selectedPermissions.includes(p));
            const someGroupPermissionsSelected = permissions.some(p => selectedPermissions.includes(p));
            const isIndeterminate = someGroupPermissionsSelected && !allGroupPermissionsSelected;

            return (
              <div key={groupTitle} className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                {/* Group Header with Toggle */}
                <div className="flex items-center pb-3 border-b border-gray-200 mb-3">
                    <CustomCheckbox
                        id={`group-${groupTitle}`}
                        checked={allGroupPermissionsSelected}
                        isIndeterminate={isIndeterminate}
                        onChange={() => handleGroupToggle(permissions)}
                    />
                  <label htmlFor={`group-${groupTitle}`} className="ml-3 font-semibold text-gray-700 cursor-pointer">{groupTitle}</label>
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
              </div>
            );
          })}
        </div>

  
        <div className="mt-8 flex justify-end">
          <button
            onClick={handleSave}
            className="px-8 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-75 transition duration-300"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default ManagePermission;