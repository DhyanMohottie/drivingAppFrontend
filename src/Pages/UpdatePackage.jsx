import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FileInput, TextInput } from 'flowbite-react';
import { useSelector } from 'react-redux';

export default function UpdateLicensePkg() {
  const [formData, setFormData] = useState({
    packageName: '',
    description: '',
    price: '',
    image: null
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const { packageId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchPackage = async () => {
      try {
        const res = await fetch(`/api/auth/getLicense-packages?packageId=${packageId}`);
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message);
        }
        setFormData(data.packages[0]);
      } catch (error) {
        console.error(error);
        setError(error.message);
      }
    };

    fetchPackage();
  }, [packageId]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      image: e.target.files[0],
    });
    setSelectedImage(URL.createObjectURL(e.target.files[0]));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const formDataWithImage = new FormData();
      for (const key in formData) {
        formDataWithImage.append(key, formData[key]);
      }
      
      const res = await fetch(`/api/auth/update-package/${packageId}/${currentUser._id}`, {
        method: 'PUT',
        body: formDataWithImage,
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message);
      }
      setLoading(false);
      setError(null);
      navigate('/admin-dashboard?tab=add-licensepkg')
    } catch (error) {
      setLoading(false);
      setError(error.message);
    }
  };

  return (
    <div className='mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7'>Update License Package</h1>
      <div className='p-3 max-w-lg mx-auto'>
        <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
          <TextInput type="text" placeholder='Package Name' id='packageName' onChange={handleChange} value={formData.packageName} />
          <TextInput type="text" placeholder='Description' id='description' onChange={handleChange} value={formData.description} />
          <TextInput type="number" placeholder='Price' id='price' min="0" onChange={handleChange} value={formData.price} />
          <div className='flex gap-4 items-center justify-between border-4 border-gray-500 border-dotted p-3'>
            <label htmlFor="photoUpload" className='text-lg font-semibold'>Upload Image:</label>
            <FileInput type="file" id="photoUpload" accept="image/*" onChange={handleFileChange} />
          </div>
          {selectedImage || formData.image ? (
            <img src={selectedImage ? selectedImage : `/src/assets/LicensePkgs/${formData.image}`} alt="Selected" className="mx-auto mt-4 max-w-xs" />
          ) : null}
          {error && <p className='text-red-500 mt-5'>{error}</p>}
          <button disabled={loading} className='bg-blue-200 text-black p-3 rounded-lg uppercase hover:opacity-80'>
            {loading ? 'Loading...' : 'Update'}
          </button>
        </form>
      </div>
    </div>
  );
}
