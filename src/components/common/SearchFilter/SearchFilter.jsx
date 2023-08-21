import "./SearchFilter.scss";
import { Image } from "antd";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import FilterIcon from "assets/images/new/filter_icon.png";

function SearchFilter(props) {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);

  const filterList = [
    { label: t("recentlyCreated"), value: "created_desc_v2" },
    { label: t("priceLowToHigh"), value: "price_desc_v2" },
    { label: t("priceHighToLow"), value: "price_asc_v2" },
    { label: t("mostFavorited"), value: "favorite_desc_v2" },
    { label: t("oldest"), value: "created_asc_v2" },
  ];

  const list = props.filterList || filterList;

  const toggleVisible = (e) => {
    setVisible(!visible);
    e.stopPropagation();
    return false;
  };

  const hideFilter = () => {
    if (visible) {
      setVisible(false);
    }
  };

  useEffect(() => {
    window.addEventListener("click", hideFilter, false);
    return () => {
      window.removeEventListener("click", hideFilter, false);
    };
  }, []);

  return (
    <div className="com-filter-icon-wrap" onClick={toggleVisible}>
      <Image preview={false} width={22} height={22} src={FilterIcon} />
      <div
        style={{ display: visible ? "block" : "none" }}
        className="com-filter-list"
      >
        {list &&
          list.map((item, index) => (
            <div
              className={`filter-item ${
                props.sort===item.value ? "active" : ""
              }`}
              onClick={() => props.changeSort(item.value)}
              key={item.value}
            >
              {item.label}
            </div>
            // <div className={{ 'filter-item' : true, 'active' : props.sort==='item.value' }} onClick={() => props.changeSort(item.value)} key={item.value}>{ item.label }</div>
            // <div className="filter-item" onClick={this.props.changeSort} key={index}>{ item.label }</div>
          ))}
      </div>
    </div>
  );
}

export default SearchFilter;
