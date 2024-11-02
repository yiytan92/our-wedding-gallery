import React from 'react';
import { useEffect, useState } from 'react';
import LoadingBar from './LoadingBar';
import AdminPhotoGallery from './AdminPhotoGallery';

function Admin({ bootstrapUrl }) {
  const [bootstrap, setBootstrap] = useState(undefined);

  useEffect(() => {
    fetch(bootstrapUrl)
      .then(response => response.json())
      .then(bootstrap => setBootstrap(bootstrap));
  }, [bootstrapUrl]);

  if (!bootstrap) {
    return <LoadingBar />;
  }

  return (
    <div className="bg-lightcream pb-5 mb-5">
      {/* <div className="flex justify-center">
        {bootstrap?._links?.request && (
          <PhotoUpload
            url={bootstrap._links.request.href}
            maxPhotosPerRequest={bootstrap.maxPhotosPerRequest}
            onUpload={() => {
              window.location.reload();
            }}
          />
        )}
      </div> */}
      {bootstrap?._links?.list && <AdminPhotoGallery initialUrl={bootstrap._links.list.href} deleteUrl={bootstrap._links.delete.href} />}
    </div>
  );
}

export default Admin;
