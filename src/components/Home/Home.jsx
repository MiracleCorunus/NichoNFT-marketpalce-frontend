import { useEffect, useState } from 'react';
import Introduction from 'components/Home/Introduction';
import RecommendedCollections from 'components/Home/RecommendedCollections';
import Guide from 'components/Home/Guide';
import { useMoralis } from 'react-moralis'

import './Home.scss';
import Partners from './Partners';
import Youtube from './Youtube';


function Home() {
  const { user, Moralis, isInitialized } = useMoralis();

  const [collections, setCollections] = useState();

  useEffect(() => {
    if (!isInitialized) return;
    const getCollections = async () => {
      try {
        const params = {
          recommended: true
        }
        const collections = await Moralis.Cloud.run("getCollections", params);
        if (collections) {
            setCollections(collections)
        }   
      } catch (err) {
        console.log(err);
      }
    }
    getCollections();
  }, [isInitialized]);

  return (
    <div className="page-content">
      <Introduction />
      <Youtube />
      <RecommendedCollections collections={collections}/>
      <Partners />
      <Guide />
    </div>
  );
}

export default Home;