import { useEffect, useState } from 'react';

const PendingUpload = () => (
  <svg
    className="my-1 mr-4 w-5 h-5 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600 inline"
    viewBox="0 0 100 101"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
      fill="currentColor"
    />
    <path
      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
      fill="currentFill"
    />
  </svg>
);

const toUploadClassName = status => {
  switch (status) {
    case 'uploading':
      return 'px-4 py-2 border-b border-gray-200 w-full font-medium truncate';
    case 'failed':
      return 'px-4 py-2 border-b border-gray-200 w-full line-through truncate';
    case 'uploaded':
      return 'px-4 py-2 border-b border-gray-200 w-full truncate';
    default:
      return 'px-4 py-2 border-b border-gray-200 w-full text-gray-300 truncate';
  }
};

const calcUploadProgress = uploads => {
  const processed = uploads.filter(
    ({ status }) => status === 'uploaded' || status === 'failed'
  ).length;

  return (processed / uploads.length) * 100;
};

const MAX_CAPTION_LENGTH = 200;

const BLOCKED_WORDS = [
  "ass",
  "bastard",
  "bitch",
  "bollocks",
  "crap",
  "cunt",
  "damn",
  "dick",
  "fag",
  "fuck",
  "fucking",
  "motherfucker",
  "nigga",
  "nigger",
  "piss",
  "prick",
  "shit",
  "shitty",
  "slut",
  "twat",
  "wanker"
];

const containsVulgarity = (text) => {
  const words = text.toLowerCase().split(/\s+/);
  return words.some(word =>
    BLOCKED_WORDS.some(blocked =>
      word.includes(blocked) ||
      // Check for common letter substitutions
      word.replace(/[1!i]/g, 'i')
        .replace(/[@a4]/g, 'a')
        .replace(/[0o]/g, 'o')
        .includes(blocked)
    )
  );
};

function PhotoUpload({ url, maxPhotosPerRequest, onUpload }) {
  const [isOpen, setOpen] = useState(false);
  const [uploads, setUploads] = useState([]);
  const [error, setError] = useState();
  const [caption, setCaption] = useState('');
  const [selectedFiles, setSelectedFiles] = useState(null);  // Add state for selected files

  useEffect(() => {
    if (!isOpen) return;

    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleFileSelect = (e) => {
    const files = [...e.target.files];

    if (files.length === 0) {
      return;
    }

    if (files.length > maxPhotosPerRequest) {
      setError(`Sorry, you can only upload ${maxPhotosPerRequest} photos at a time.`);
      return;
    }

    setSelectedFiles(e.target.files);
    setUploads(files.map(({ name }) => ({ name, status: 'pending' })));
    setError(null);

  };

  const handleUpload = async () => {
    if (!selectedFiles) return;

    try {
      const newUploads = [...uploads];
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          photos: JSON.stringify(newUploads.map(({ name }) => name)),
          caption: caption,
        }),
      }).then(response => response.json());

      console.log('Received presigned URLs:', response);

      for (let i = 0; i < newUploads.length; i++) {
        const request = response.urls[i];

        const formData = new FormData();
        // Important: Add fields in the exact order they were signed
        // First add all the presigned fields
        Object.keys(request.fields).sort().forEach(key => {
          formData.append(key, request.fields[key]);
          console.log(`Adding field: ${key}=${request.fields[key]}`);
        });
        formData.append('file', selectedFiles[i], 'file');

        setUploads(uploads => {
          const newUploads = [...uploads];
          newUploads[i] = { ...newUploads[i], status: 'uploading' };
          return newUploads;
        });

        await fetch(request.url, {
          method: 'POST',
          body: formData,
        }).then(response => {
          setUploads(uploads => {
            const newUploads = [...uploads];
            newUploads[i] = { ...newUploads[i], status: response.ok ? 'uploaded' : 'failed' };
            return newUploads;
          });
        });
      }

      await new Promise(r => setTimeout(r, 1000));
      setOpen(false);
      setUploads([]);
      setCaption('');
      setSelectedFiles(null);
      onUpload();
    } catch (error) {
      setError('An error occurred while uploading photos.');
    }
  };

  const handleCaptionChange = (e) => {
    const newCaption = e.target.value;
    if (newCaption.length <= MAX_CAPTION_LENGTH) {
      if (containsVulgarity(newCaption)) {
        setError('Please keep the caption family-friendly!');
        return;
      }
      setError(null);
      setCaption(newCaption);
    }
  };

  return (
    <>
      <button
        class="button"
        // className="block text-white bg-red-800 hover:bg-purple-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        type="button"
        onClick={() => setOpen(true)}
      >
        Upload photos
      </button>
      {isOpen && (
        <div className="fixed top-0 left-0 z-80 w-screen h-screen flex justify-center items-center bg-black/70 p-2 md:p-0">
          <div className="relative bg-white rounded-lg z-90 w-full h-full max-w-md md:h-auto overflow-auto">
            <button
              type="button"
              className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white"
              onClick={() => {
                if (uploads.length > 0) return;
                setOpen(false);
                setUploads([]);
              }}
            >
              <svg
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </button>
            <div className="py-6 px-6">
              {error && (
                <div class="mt-8 bg-red-100 rounded-lg py-2 px-5 text-base text-red-700 mb-3">
                  {error}
                </div>
              )}
              {uploads.length > 0 && !selectedFiles ? (
                <div className="mt-8">
                  <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                    <div
                      className="bg-blue-600 h-2.5 rounded-full"
                      style={{
                        width: `${calcUploadProgress(uploads)}%`,
                      }}
                    ></div>
                  </div>
                  <ul className="mt-4 bg-white rounded-lg border border-gray-200 text-gray-900">
                    {uploads.map(({ name, status }) => (
                      <li className={toUploadClassName(status)} key={name}>
                        {status === 'uploading' && <PendingUpload />}
                        {name}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <div className="space-y-4">
                  <input
                    type="file"
                    onChange={handleFileSelect}  // Changed from handleUpload to handleFileSelect
                    accept=".jpg, .jpeg, image/jpg, image/jpeg"
                    multiple
                  />
                  <div>
                    <label
                      htmlFor="caption"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Caption (optional)
                    </label>
                    <input
                      type="text"
                      id="caption"
                      value={caption}
                      onChange={handleCaptionChange}
                      maxLength={MAX_CAPTION_LENGTH}
                      className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      placeholder="Enter a caption for your photos"
                    />
                    <div className="mt-1 text-sm text-gray-500 flex justify-end">
                      {caption.length}/{MAX_CAPTION_LENGTH}
                    </div>
                  </div>
                  {selectedFiles && (  // Only show confirm button when files are selected
                    <button
                      onClick={handleUpload}
                      className="w-full px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      Confirm Upload
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default PhotoUpload;
