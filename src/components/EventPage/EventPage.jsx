import { styles } from './styles';
import BannerContent from './BannerContent';
import Introduce from './Introduce';
import Info from './Info';
import Artwork from './Artwork';
import Partner from './Partner';

const EventPage = () => {

    return <div style={styles.eventContent}>
        <BannerContent />
        <Introduce />
        <Info />
        <Artwork />
        <Partner />
    </div>
}

export default EventPage;