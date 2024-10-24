import { useEffect, useState } from 'react';
import LoadingBar from './component/LoadingBar';
import PhotoUpload from './component/PhotoUpload';
import PhotoGallery from './component/PhotoGallery';
import logo from './images/surnames.jpg';
import invitationCard from './images/invitation-card.jpg';


function App({ bootstrapUrl }) {
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
    <>
      <div className="flex justify-center">
        <img src={logo} alt="" width="100%" />
      </div>
      <div className="flex justify-center">
        <img src={invitationCard} alt="" width="100%" />
      </div>
      <div className="flex justify-center">
        {bootstrap?._links?.request && (
          <PhotoUpload
            url={bootstrap._links.request.href}
            maxPhotosPerRequest={bootstrap.maxPhotosPerRequest}
            onUpload={() => {
              window.location.reload();
            }}
          />
        )}
      </div>
      {bootstrap?._links?.list && <PhotoGallery initialUrl={bootstrap._links.list.href} />}
    </>
  );
}

export default App;
