import './Youtube.scss';
import { Col, Row, Typography, Image } from 'antd';
import LiteYouTubeEmbed from 'react-lite-youtube-embed';
import 'react-lite-youtube-embed/dist/LiteYouTubeEmbed.css'
const { Title } = Typography

function Youtube() {
  return (
    <div className="Partners">
      <Row gutter={[29, 29]} className="partners-list" justify="center">
        <Col lg={18} md={18} sm={24}>
          <div>
            <LiteYouTubeEmbed
              id="sYveB9lzDSE" // Default none, id of the video or playlist
              adNetwork={true} // Default true, to preconnect or not to doubleclick addresses called by YouTube iframe (the adnetwork from Google)
              params="https://youtu.be/sYveB9lzDSE" // any params you want to pass to the URL, assume we already had '&' and pass your parameters string
              playlist={false} // Use  true when your ID be from a playlist
              playlistCoverId="sYveB9lzDSE" // The ids for playlists did not bring the cover in a pattern to render so you'll need pick up a video from the playlist (or in fact, whatever id) and use to render the cover. There's a programmatic way to get the cover from YouTube API v3 but the aim of this component is do not make any another call and reduce requests and bandwidth usage as much as possibe
              poster="hqdefault" // Defines the image size to call on first render as poster image. Possible values are "default","mqdefault",  "hqdefault", "sddefault" and "maxresdefault". Default value for this prop is "hqdefault". Please be aware that "sddefault" and "maxresdefault", high resolution images are not always avaialble for every video. See: https://stackoverflow.com/questions/2068344/how-do-i-get-a-youtube-video-thumbnail-from-the-youtube-api
              title="YouTube Embed" // a11y, always provide a title for iFrames: https://dequeuniversity.com/tips/provide-iframe-titles Help the web be accessible ;)
              noCookie={true} //Default false, connect to YouTube via the Privacy-Enhanced Mode using https://www.youtube-nocookie.com
            />
          </div>
        </Col>
      </Row>
    </div>
  );
}

export default Youtube;