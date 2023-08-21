import { useState, useEffect, Fragment } from "react";
import { useMediaQuery } from "react-responsive";
import { Typography, Divider, Row, Col, Image, Space } from "antd";
import BnbDark from "assets/images/new/event/icons/bnbDark.png";
import BnbLight from "assets/images/new/event/icons/bnbLight.png";
// import AudcoinGoldIcon from "assets/images/new/event/icons/aud_coin.png";
import MarkIcon from "assets/images/new/event/icons/mark.png";
// import AudcoinIcon from "assets/images/new/event/icons/aud_coin2.png";
import Item0 from "assets/images/new/event/items/0.png";
import Item1 from "assets/images/new/event/items/1.png";
import Item2 from "assets/images/new/event/items/2.png";
import Item3 from "assets/images/new/event/items/3.png";
import Item4 from "assets/images/new/event/items/4.png";
import Item5 from "assets/images/new/event/items/5.png";
import Item6 from "assets/images/new/event/items/6.png";
import Item7 from "assets/images/new/event/items/7.png";
import Item8 from "assets/images/new/event/items/8.png";
import Item9 from "assets/images/new/event/items/9.png";
import Item10 from "assets/images/new/event/items/10.png";
// import Item11 from "assets/images/new/event/items/11.png";
import Item12 from "assets/images/new/event/items/12.png";
import Item13 from "assets/images/new/event/items/13.png";
import Item14 from "assets/images/new/event/items/14.png";
import Item15 from "assets/images/new/event/items/15.png";
import Item16 from "assets/images/new/event/items/16.png";
import Item17 from "assets/images/new/event/items/17.png";
import Item18 from "assets/images/new/event/items/18.png";
import Item19 from "assets/images/new/event/items/19.png";
import Item20 from "assets/images/new/event/items/20.png";
import Item21 from "assets/images/new/event/items/21.png";
import Item22 from "assets/images/new/event/items/22.png";
import Item23 from "assets/images/new/event/items/23.png";
import Item24 from "assets/images/new/event/items/24.png";
import Item25 from "assets/images/new/event/items/25.png";
import Item26 from "assets/images/new/event/items/26.png";
import Item27 from "assets/images/new/event/items/27.png";
import Item28 from "assets/images/new/event/items/28.png";
import Item29 from "assets/images/new/event/items/29.png";
import Item30 from "assets/images/new/event/items/30.png";
import Item31 from "assets/images/new/event/items/31.png";
// import Item32 from "assets/images/new/event/items/32.png";
import Item33 from "assets/images/new/event/items/33.png";
import Item34 from "assets/images/new/event/items/34.png";
// import Item35 from "assets/images/new/event/items/35.png";
import Item36 from "assets/images/new/event/items/36.png";
import "./EventPage.scss";
import { styles } from "./styles";
import { Link, useHistory } from "react-router-dom";

const { Title, Paragraph } = Typography;

const getDetailPageLink = (nftId) => `/nftDetail?id=${nftId}`;

const ArtCardBody = ({ data }) => {
  const isDesktopOrLaptop = useMediaQuery({
    query: "(min-width: 1224px)",
  });

  return (
    <Link to={getDetailPageLink(data.nftId)}>
      <div
        style={data.sold ? styles.cardBodySold : styles.cardBody}
        // onClick={() => {
        //   alert("clicked");
        // }}
      >
        <div
          className="eventpage-img-hover"
          style={
            data.cardType === "gold" ? styles.cardGoldBg : styles.cardGrayBg
          }
        >
          {/* <div style={styles.cardImage}> */}
          <Image
            preview={false}
            src={data.imagePath}
            style={styles.cardImage}
          />
          {/* </div> */}
          <div style={isDesktopOrLaptop ? styles.cardInfo : styles.cardInfo2}>
            <Paragraph strong> {data.title} </Paragraph>
            <Paragraph strong> {data.content} </Paragraph>
            <Space
              align="center"
              size={isDesktopOrLaptop ? 10 : 5}
              style={isDesktopOrLaptop ? styles.nameComp : { marginTop: "5px" }}
            >
              <Image
                preview={false}
                width={isDesktopOrLaptop ? 30 : 20}
                height={isDesktopOrLaptop ? 30 : 20}
                src={data.cardType === "gold" ? BnbDark : BnbLight}
              />
              <Title
                level={5}
                style={
                  data.cardType === "gold"
                    ? styles.cardGoldPrice
                    : styles.cardPrice
                }
                strong
              >
                {data.price}
              </Title>
            </Space>
          </div>
        </div>
      </div>
    </Link>
  );
};

const FeatureCard = ({ data }) => {
  const isDesktopOrLaptop = useMediaQuery({
    query: "(min-width: 1224px)",
  });
  return (
    <Link to={getDetailPageLink(data.nftId)}>
      <div
        className="eventpage-img-hover"
        style={styles.cardBody}
        // onClick={() => {
        //   useHistory.push("/nftDetail?id=8nnX4b5n0zjBGjGuge3jlmug");
        //   // alert("click");
        // }}
      >
        <div
          style={{
            width: "100%",
            height: "99.25%",
            border: "4px solid #384159",
            borderRadius: "10px",
          }}
        >
          <div className="feature-card">
            <Image
              preview={false}
              src={data.imagePath}
              style={styles.featureCardImage}
            />
          </div>
          <div style={styles.cardInfo}>
            <Title level={4} strong style={styles.blackFont}>
              {" "}
              {data.title}{" "}
            </Title>
            <Title level={4} strong style={styles.blackFont}>
              {" "}
              {data.content}{" "}
            </Title>
            <Space align="center" size={10} style={styles.featureTitle}>
              <Image preview={false} width={30} height={30} src={BnbDark} />
              <Title level={5} style={styles.cardPrice} strong>
                {data.price}
              </Title>
            </Space>
          </div>
          <div
            style={isDesktopOrLaptop ? styles.featureMark : styles.featureMark2}
          >
            {isDesktopOrLaptop ? (
              <Image
                preview={false}
                src={MarkIcon}
                style={styles.featureCardImage}
              />
            ) : (
              <Image
                preview={false}
                src={MarkIcon}
                width={70}
                height={70}
                style={styles.featureCardImage}
              />
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

const ArtCardComponent1 = ({ data }) => {
  return (
    <Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12}>
      <ArtCardBody data={data} />
    </Col>
  );
};

const ArtCardComponent2 = ({ data }) => {
  return (
    <Col xs={12} sm={12} md={12} lg={6} xl={6} xxl={6}>
      <ArtCardBody data={data} />
    </Col>
  );
};
const items0 = {
  key: "0",
  cardType: "normal",
  title: "Osphranter Rufus",
  content: "--Red Kangaroo--",
  price: "UNLIST",
  imagePath: Item0,
  nftId: "MW1DxleqZow2IJTjh5EQ5acc",
};

const items1Raw = [
  {
    key: "0",
    cardType: "normal",
    title: "Rhincodon Typus",
    content: "--Whale Shark--",
    price: "UNLIST",
    imagePath: Item1,
    nftId: "C6nkkdyvzTyIERKa2ElqxGIn",
  },
  {
    key: "1",
    cardType: "normal",
    title: "Carcharodon Carcharias",
    content: "--Great White Shark--",
    price: "UNLIST",
    imagePath: Item2,
    nftId: "BT6gLTqwZ0xV5uruXBsZGzlC",
  },
  {
    key: "2",
    cardType: "normal",
    title: "Dugong Dugon",
    content: "--Dugong--",
    price: "UNLIST",
    imagePath: Item3,
    nftId: "Eh6lEI1HgtOTjsoF0EzIDjL1",
  },
  {
    key: "3",
    cardType: "normal",
    title: "Sepioteuthis Australis",
    content: "--Southern Calamari--",
    price: "UNLIST",
    imagePath: Item4,
    nftId: "IX3jpMED588h6Ez5LDmUNoE0",
  },
];
const itemsRaw = [
  {
    key: "4",
    cardType: "normal",
    title: "Octopus Tetricus",
    contnet: "--Sydney Octopus--",
    price: "UNLIST",
    imagePath: Item5,
    nftId: "Vi6KXroHX35yBvbQXX0X6kE6",
  },
  {
    key: "5",
    cardType: "normal",
    title: "Portunus Pelagicus",
    content: "--Blue Swimmer Crab--",
    price: "UNLIST",
    imagePath: Item6,
    nftId: "uxVodYD5DUqIFyFnhxz6zieK",
  },
  {
    key: "6",
    cardType: "normal",
    title: "Casuarius Casuarius",
    content: "--Cassowary--",
    price: "UNLIST",
    imagePath: Item7,
    nftId: "eVlreGBV3E4EheQmbFDMHrlJ",
  },
  {
    key: "7",
    cardType: "normal",
    title: "Aquila Audax",
    content: "--Wedge Tail Eagle--",
    price: "UNLIST",
    imagePath: Item8,
    nftId: "R1HNGdTUK4kgqbTlFB0sElii",
  },
  {
    key: "8",
    cardType: "normal",
    title: "Menura Menuridae",
    content: "--Lyrebird--",
    price: "UNLIST",
    imagePath: Item9,
    nftId: "R41WfarUsfJKld9yzwyZ8F6a",
  },
  {
    key: "9",
    cardType: "normal",
    title: "Zaglossus Attenboroughi",
    content: "--Long Beaked Echidna--",
    price: "UNLIST",
    imagePath: Item10,
    nftId: "0Bkyec3GB1yeDzASQk5EsQAx",
  },
  // {
  //   key: "10",
  //   cardType: "normal",
  //   title: "Artwork title",
  //   price: "UNLIST",
  //   imagePath: Item11,
  // },
  {
    key: "11",
    cardType: "normal",
    title: "Dromaius Novaehollandiae",
    content: "--Emu--",
    price: "UNLIST",
    imagePath: Item12,
    nftId: "IH0mBQfQpSCaaOc3N1wamBzl",
  },

  {
    key: "13",
    cardType: "normal",
    title: "Dacelo Novaeguineae",
    content: "--Kookaburra--",
    price: "UNLIST",
    imagePath: Item13,
    nftId: "yk7iDgM0BVs4oAPcNzV9D43M",
  },
  {
    key: "14",
    cardType: "normal",
    title: "Canis Lupus",
    content: "--Dingo--",
    price: "UNLIST",
    imagePath: Item14,
    nftId: "Zr3viMorkqxk4piDQTrFzOyD",
  },
  {
    key: "15",
    cardType: "normal",
    title: "Varanus Gouldii",
    content: "--Goanna--",
    price: "UNLIST",
    imagePath: Item15,
    nftId: "MEKRuUsy12irbQTx6c4pbAMQ",
  },
  {
    key: "16",
    cardType: "normal",
    title: "Cygnus Atratus",
    content: "--Black Swan--",
    price: "UNLIST",
    imagePath: Item16,
    nftId: "Vkc4ohpuyXBuaES8RIeYnrBy",
  },
  {
    key: "17",
    cardType: "normal",
    title: "Lasiorhinus Krefftii",
    content: "--Hairy Nosed Wombat--",
    price: "UNLIST",
    imagePath: Item17,
    nftId: "p2P8f9WGNcLixGOOoC7I6yOB",
  },
  {
    key: "18",
    cardType: "normal",
    title: "Macrotis Lagotis",
    content: "--Bilby--",
    price: "UNLIST",
    imagePath: Item18,
    nftId: "BMlIL0Cm7G31K4a2CDOrHFCU",
  },
  {
    key: "19",
    cardType: "normal",
    title: "Myrmecobius Fasciatus",
    content: "--Numbat--",
    price: "UNLIST",
    imagePath: Item19,
    nftId: "QEWZqVGFG3Z5BirNHDAhOmyf",
  },
  {
    key: "20",
    cardType: "normal",
    title: "Moloch Horridus",
    content: "--Thorny Devil--",
    price: "UNLIST",
    imagePath: Item20,
    nftId: "CU9FFK3hkjJAEB1KqIH1LDso",
  },
  {
    key: "21",
    cardType: "normal",
    title: "Trichoglossus Moluccanus",
    content: "--Rainbow Lorikeet--",
    price: "UNLIST",
    imagePath: Item21,
    nftId: "fbT0IESJWu228XsZw6vJZKU4",
  },
  {
    key: "22",
    cardType: "normal",
    title: "Pseudechis Porphyriacus",
    content: "--Red Belly Black Snake--",
    price: "UNLIST",
    imagePath: Item22,
    nftId: "faiT2dNzpHm7YJCsoNKjOBLw",
  },
  {
    key: "23",
    cardType: "normal",
    title: "Setonix Brachyurus",
    content: "--Quokka--",
    price: "Sold - 4.6 BNB",
    imagePath: Item23,
    sold: true,
    nftId: "Ok8qCI6EVYUyoj2qBgvO3JKH",
  },
  {
    key: "24",
    cardType: "normal",
    title: "Atrax Robustus",
    content: "--Sydney Funnel-Web Spider--",
    price: "UNLIST",
    imagePath: Item24,
    nftId: "fw1J1P7AP3FHN2AKxnxHHVsa",
  },
  {
    key: "25",
    cardType: "normal",
    title: "Phascolarctos Cinereus",
    content: "--Koala--",
    price: "UNLIST",
    imagePath: Item25,
    nftId: "jL9YJpYMgm87sWDz9NNsCSQM",
  },
  {
    key: "26",
    cardType: "normal",
    title: "Pica Pica",
    content: "--Magpie--",
    price: "UNLIST",
    imagePath: Item26,
    nftId: "bHv9LBVH7U7o0vP7J41m2kM1",
  },
  {
    key: "27",
    cardType: "normal",
    title: "Ornithorhynchus Anatinus",
    content: "--Platypus--",
    price: "UNLIST",
    imagePath: Item27,
    nftId: "d4BZKlQl4vpvI1pcJebEInn6",
  },
  {
    key: "28",
    cardType: "normal",
    title: "Cercophonius Squama",
    content: "--Australian Scorpion--",
    price: "UNLIST",
    imagePath: Item28,
    nftId: "TOuZDfFtN1xoco3TysrpD444",
  },
  {
    key: "29",
    cardType: "normal",
    title: "Balaenoptera Musculus",
    content: "--Blue Whale--",
    price: "UNLIST",
    imagePath: Item29,
    nftId: "gwXDA1pqGpMlaeFzpUK3WR6M",
  },
  {
    key: "30",
    cardType: "normal",
    title: "Crocodylus Porosus",
    content: "-- Crocodile--",
    price: "UNLIST",
    imagePath: Item30,
    nftId: "CKBHcXsKmyyKqQkoYVu9CmnV",
  },
  {
    key: "31",
    cardType: "normal",
    title: "Trichosurus Vulpecula",
    content: "--Australian Possum--",
    price: "UNLIST",
    imagePath: Item31,
    nftId: "T7Bf6naCedJx5Eqk8tfqfeKH",
  },
  // {
  //     key: '32',
  //     cardType: 'normal',
  //     title: 'Artwork title',
  //     price: 'UNLIST',
  //     imagePath: Item32
  // },
  {
    key: "33",
    cardType: "normal",
    title: "Camelus Dromedarius",
    content: "--Camel--",
    price: "UNLIST",
    imagePath: Item33,
    nftId: "fpZW0l3TbkCl3CbzkauIF0fq",
  },
  {
    key: "34",
    cardType: "normal",
    title: "Tursiops Truncatus",
    content: "--Bottle Nose Dolphin--",
    price: "UNLIST",
    imagePath: Item34,
    nftId: "rEfcpSl6VeHrfWJuzRov0eFC",
  },
  // {
  //   key: "35",
  //   cardType: "normal",
  //   title: "Artwork title",
  //   price: "UNLIST",
  //   imagePath: Item35,
  // },
  {
    key: "36",
    cardType: "normal",
    title: "Macropus Giganteus",
    content: "--Grey Kangaroo--",
    price: "Sold - 9.6 BNB",
    imagePath: Item36,
    sold: true,
    nftId: "r5LDEsBQw7vaC0TFcwOjBfzt",
  },
];

const GutterConstant = { xs: 24, sm: 30, md: 60, lg: 60, xl: 80 };
const ArtContentStyle = {
  style1: {
    marginTop: "50px",
  },
  style2: {
    marginTop: "50px",
    padding: "0 50px",
  },
  style3: {
    marginTop: "5px",
  },
  style4: {
    marginTop: "5px",
    padding: "0 50px",
  },
};

const Artwork = () => {
  const [items, setItems] = useState();
  const [items1, setItems1] = useState();

  //sort the picture
  useEffect(() => {
    itemsRaw.sort(() => 0.5 - Math.random());
    items1Raw.sort(() => 0.5 - Math.random());
    setItems(itemsRaw);
    setItems1(items1Raw);
  }, []);

  const isDesktopOrLaptop = useMediaQuery({
    query: "(min-width: 1224px)",
  });

  return (
    <div className="page-content">
      <Divider style={styles.divider}> Artworks </Divider>

      <Fragment>
        <Row
          gutter={GutterConstant}
          style={
            isDesktopOrLaptop ? ArtContentStyle.style1 : ArtContentStyle.style2
          }
        >
          <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
            <FeatureCard data={items0} />
          </Col>
          <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
            <div>
              <Row gutter={GutterConstant}>
                {items1 &&
                  items1.map((item) => {
                    return <ArtCardComponent1 data={item} key={item.key} />;
                  })}
              </Row>
            </div>
          </Col>
        </Row>
      </Fragment>

      <Fragment>
        <Row
          gutter={GutterConstant}
          style={
            isDesktopOrLaptop ? ArtContentStyle.style3 : ArtContentStyle.style4
          }
        >
          {items &&
            items.map((item) => {
              return <ArtCardComponent2 data={item} key={item.key} />;
            })}
        </Row>
      </Fragment>
    </div>
  );
};

export default Artwork;
