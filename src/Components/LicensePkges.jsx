import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Table, Button, Modal } from 'flowbite-react';
import { Link } from 'react-router-dom';
import { HiOutlineExclamation } from 'react-icons/hi';

export default function LicensePkges() {
  const { currentUser } = useSelector((state) => state.user);
  const [licensePackages, setLicensePackages] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [packageIdToDelete, setPackageIdToDelete] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const res = await fetch(`/api/auth/getLicense-packages?userId=${currentUser._id}`);
        if (res.ok) {
          const data = await res.json();
          setLicensePackages(data.packages);
          if (data.packages.length < 9) {
            setShowMore(false);
          }
        } else {
          throw new Error('Failed to fetch license packages');
        }
      } catch (error) {
        console.error(error.message);
      }
    };

    if (currentUser.isAdmin) {
      fetchPackages();
    }
  }, [currentUser._id, currentUser.isAdmin]);

  const handleShowMore = async () => {
    const startIndex = licensePackages.length;
    try {
      const res = await fetch(`/api/auth/getLicense-packages?userId=${currentUser._id}&startIndex=${startIndex}`);
      const data = await res.json();
      if (res.ok) {
        setLicensePackages((prev) => [...prev, ...data.packages]);
        if (data.packages.length < 9) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleDeletePackage = async () => {
    setShowModal(false);
    try {
      const res = await fetch(`/api/auth/delete-package/${packageIdToDelete}/${currentUser._id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        setLicensePackages((prev) => prev.filter((pkg) => pkg._id !== packageIdToDelete));
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const onChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredPackages = licensePackages.filter((pkg) =>
    pkg.packageName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pkg.price.toString().includes(searchTerm.toLowerCase()) ||
    new Date(pkg.updatedAt).toLocaleDateString().includes(searchTerm.toLowerCase())
  );

  return (
    <div className='table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 p-9'>
      {currentUser.isAdmin && licensePackages.length > 0 ? (
        <>
          <div className='p-3'>
            <input
              type='search'
              placeholder='Search...'
              className='bg-transparent focus:outline-none w-24 sm:w-64'
              value={searchTerm}
              onChange={onChange}
            />
          </div>
          <Table hoverable className='shadow-md'>
            <Table.Head>
              <Table.HeadCell>Date updated</Table.HeadCell>
              <Table.HeadCell>Image</Table.HeadCell>
              <Table.HeadCell>Title</Table.HeadCell>
              <Table.HeadCell>Description</Table.HeadCell>
              <Table.HeadCell>Price</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
              <Table.HeadCell>Edit</Table.HeadCell>
            </Table.Head>
            <Table.Body className='divide-y'>
              {filteredPackages.map((pkg) => (
                <Table.Row key={pkg._id} className='bg-white'>
                  <Table.Cell>{new Date(pkg.updatedAt).toLocaleDateString()}</Table.Cell>
                  <Table.Cell>
                    <img
                      src={`../src/assets/LicensePkgs/${pkg.image}`}
                      alt={pkg.title}
                      className='w-20 h-10 object-cover bg-gray-500'
                    />
                  </Table.Cell>
                  <Table.Cell className='font-medium text-gray-900'>{pkg.packageName}</Table.Cell>
                  <Table.Cell className='font-medium text-gray-900'>{pkg.description}</Table.Cell>
                  <Table.Cell className='font-medium text-gray-900'>Rs: {pkg.price}</Table.Cell>
                  <Table.Cell>
                    <span
                      onClick={() => {
                        setShowModal(true);
                        setPackageIdToDelete(pkg._id);
                      }}
                      className='font-medium text-red-500 hover:underline cursor-pointer'
                    >
                      Delete
                    </span>
                  </Table.Cell>
                  <Table.Cell>
                    <Link className='text-teal-500 hover:underline' to={`/update-licensePkg/${pkg._id}`}>
                      <span> Edit </span>
                    </Link>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
          {showMore && (
            <button onClick={handleShowMore} className='w-full text-teal-500 self-center text-sm py-7'>
              Show more
            </button>
          )}
        </>
      ) : (
        <p>You have not added any license packages yet!</p>
      )}

      <Modal show={showModal} onClose={() => setShowModal(false)} popup size='md'>
        <Modal.Header />
        <Modal.Body className='text-center'>
          <HiOutlineExclamation className='h-14 w-14 text-gray-400 mb-4 mx-auto dark:text-gray-200' />
          <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>
            Are you sure you want to delete this license package?
          </h3>
          <div className='flex justify-center gap-4'>
            <Button color='failure' onClick={handleDeletePackage}>
              Yes, I'm Sure
            </Button>
            <Button color='gray' onClick={() => setShowModal(false)}>
              No, Cancel
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
