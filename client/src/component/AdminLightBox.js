import { useCallback, useEffect, useState } from 'react';

function Photo({ src, onClick, onSwipeLeft, onSwipeRight, minSwipeDistance = 150, id, deleteUrl, sk }) {
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const handleTouchStart = useCallback(e => {
    setTouchStart(e.targetTouches[0].clientX);
  }, []);

  const handleTouchMove = useCallback(e => {
    setTouchEnd(e.targetTouches[0].clientX);
  }, []);

  const handleTouchEnd = useCallback(() => {
    if (touchEnd === 0) return;
    if (touchStart - touchEnd > minSwipeDistance) onSwipeLeft();
    if (touchStart - touchEnd < -minSwipeDistance) onSwipeRight();
    setTouchStart(0);
    setTouchEnd(0);
  }, [touchStart, touchEnd, minSwipeDistance, onSwipeLeft, onSwipeRight]);

  const handleDelete = async (id, sk) => {
    try {
      const pk = id.replace('image#', '');
      console.log('deleting', pk, 'sk', sk);
      const url = '/api/delete';

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ pk, sk })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Response:', errorText);
        throw new Error(`Delete failed with status: ${response.status}`);
      }

      const data = await response.json();
      console.log('delete response', data);
      alert('Photo deleted successfully');
      handleTouchEnd();
    } catch (error) {
      console.error('Delete failed:', error);
      alert('Failed to delete photo: ' + error.message);
    }
  };
  return (
    <div className="text-white">
      filename: {id}
      <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => handleDelete(id, sk)}>Delete</button>
      <img
        alt=""
        className="max-h-[90vh]"
        src={src}
        style={{ marginLeft: touchEnd !== 0 ? touchEnd - touchStart : 0 }}
        onClick={onClick}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      />
    </div>
  );
}

function AdminLightBox({ photo, onNext, onPrevious, onClose, deleteUrl }) {
  useEffect(() => {
    if (!photo) return;

    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [photo]);

  if (!photo) {
    return null;
  }

  return (
    <div
      className="fixed top-0 left-0 z-80 w-screen h-screen flex justify-center items-center bg-black/70"
      onClick={onClose}
    >
      <button
        className="fixed z-90 top-6 right-8 text-white text-5xl font-bold cursor-pointer"
        onClick={onClose}
      >
        &times;
      </button>
      <Photo
        src={photo.web}
        onClick={e => {
          e.stopPropagation();
          onNext();
        }}
        onSwipeLeft={onNext}
        onSwipeRight={onPrevious}
        id={photo.id}
        sk={photo.sk}
        deleteUrl={deleteUrl}
      />
    </div>
  );
}

export default AdminLightBox;
