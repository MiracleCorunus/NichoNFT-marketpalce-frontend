import { Fragment, useState, useEffect } from "react";
import {
  Typography,
  Button,
  Input,
  Image,
  Modal,
  message,
  Upload,
  Select,
} from "antd";
import SubTitle from "components/common/SubTitle";
import { useMoralis } from "react-moralis";
import { useTranslation } from "react-i18next";
import "./UpdateUser.scss";
import Page404 from "components/Page404";
import UploadIcon from "assets/images/new/createNFT/upload.png";
import { useHistory } from "react-router-dom";
import topImg from "assets/images/new/UpdateUser/top_img.png";
import { allCountries } from "helpers/constants/countries";
import Notification from "components/common/Notification";

const { Title, Paragraph } = Typography;

const showSuccess = (msg) => {
  const secondsToGo = 3;
  const modal = Modal.success({
    title: "Success!",
    content: msg,
  });

  setTimeout(() => {
    modal.destroy();
  }, secondsToGo * 1000);
};
const showError = (msg) => {
  message.error(msg);
};

function UpdateUser() {
  const { user, Moralis } = useMoralis();
  const { t } = useTranslation();
  const [username, setUsername] = useState("");
  const [twitterLink, setTwitterLink] = useState("");
  const [country, setCountry] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [bannerFile, setBannerFile] = useState(null);
  const [BannerImageUrl, setBannerImageUrl] = useState(null);
  const [showNotification, setShowNotification] = useState(false);

  const [avatarImg, setAvatarImg] = useState("images/avatar.png");
  let history = useHistory();

  const [isUpdating, setIsUpdating] = useState(false);

  const navigateTo = (targetPath) => {
    history.push(`/${targetPath}`);
  };

  const update_profile = async () => {
    try {
      if (!user) return t("signInAgain");
      setIsUpdating(true);

      if (bannerFile) {
        const BannerIpfs = new Moralis.File("Banner", bannerFile);
        await BannerIpfs.saveIPFS();
        const BannerIpfsPath = BannerIpfs.url(); //BannerIpfs.ipfs();
        console.log("BannerURL:", BannerIpfsPath);
        user.set("banner", BannerIpfsPath);
      }
      if (email !== undefined && email !== "") user.set("email", email);
      if (username !== undefined && username !== "")
        user.set("username", username);
      if (twitterLink !== undefined && twitterLink !== "")
        user.set("website_link", twitterLink);
      if (bio !== undefined && bio !== "") user.set("bio", bio);
      if (country !== undefined && country !== "") user.set("country", country);

      await user.save();
      setIsUpdating(false);
      setShowNotification(true);
      // showSuccess("Profile has been updated");

      // navigateTo("myNfts");
    } catch (err) {
      console.log("Update profile:", err);
      // showError("Failed to update the profile");
      showError(err.message);
      setIsUpdating(false);
    }
  };

  const upgrade_avatar = async (file) => {
    try {
      if (!file) return;
      if (!user) return;
      const avatar = new Moralis.File("photo.jpg", file);
      await avatar.saveIPFS();
      console.log("Avatar:", avatar.url());

      user.set("avatar", avatar.url());

      getBase64(file).then((data) => {
        if (!data) return;
        setAvatarImg(data);
      });
    } catch (err) {
      console.log("Upgrade avatar:", err);
    }
  };

  const getBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  useEffect(() => {
    if (!user) return;
    setUsername(user.get("username"));
    setTwitterLink(user.get("website_link"));
    setEmail(user.get("email"));
    setBio(user.get("bio"));
    setCountry(user.get("country"));

    const avatar = user.get("avatar");
    if (avatar !== undefined) {
      setAvatarImg(avatar);
    }

    const banner = user.get("banner");
    if (banner !== undefined) {
      setBannerImageUrl(banner);
    }
  }, [user]);

  const upload_banner = (file, type) => {
    console.log("beforeUpload", type);
    if (!file) return;
    setBannerFile(file);

    getBase64(file).then((data) => {
      if (!data) return;
      setBannerImageUrl(data);
    });
  };

  const dummyRequest = ({ file, onSuccess }) => {
    console.log("");
  };

  return (
    <Fragment>
      {!user ? (
        <Page404 />
      ) : (
        <div className="update-user-new">
          <div className="update-user-header">
            <SubTitle title={t("editProfile")} />
          </div>
          <div className="update-user-content">
            <div className="theme-block">
              <Image
                rootClassName="theme-block-img"
                preview={false}
                width={295}
                height={127}
                src={topImg}
              />
            </div>

            <div className="upload-group">
              <Title level={4} type="secondary">
                {t("uploadAvatar")}
              </Title>
              <Paragraph type="secondary">
                {t("dragOrChoose")}
              </Paragraph>
              <div className="file-uploader" id="avatar-uploader">
                <Upload
                  name="avatar"
                  listType="picture-card"
                  className="avatar-uploader"
                  showUploadList={false}
                  beforeUpload={(file) => upgrade_avatar(file)}
                  action=""
                  customRequest={dummyRequest}
                >
                  {avatarImg ? (
                    <img src={avatarImg} alt="Nicho AI NFT" />
                  ) : (
                    <Image preview={false} src={UploadIcon} />
                  )}
                </Upload>
              </div>
            </div>

            <div className="form-group">
              <div className="form-item">
                <Title level={4} type="secondary">
                  {t("bannerImage")}
                </Title>
                <Paragraph type="secondary">
                  {t("topCollectionPage")}
                </Paragraph>
                <div className="file-uploader banner" id="banner-uploader">
                  <Upload
                    name="avatar"
                    listType="picture-card"
                    className="banner-uploader"
                    showUploadList={false}
                    beforeUpload={(file) => upload_banner(file, "banner")}
                    action=""
                    customRequest={dummyRequest}
                  >
                    {BannerImageUrl ? (
                      <img src={BannerImageUrl} alt="Nicho AI NFT" />
                    ) : (
                      <Image preview={false} src={UploadIcon} />
                    )}
                  </Upload>
                </div>
              </div>
              <div className="form-item">
                <Title level={4} className="white" type="secondary">
                  {t("name")}
                </Title>
                <Input
                  placeholder="Fasdhi3h431h4lkwhedj2hjk3ehwaldkjs"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div className="form-item">
                <Title level={4} className="white" type="secondary">
                  {t("email")}
                </Title>
                <Input
                  placeholder={t("enterYourEmail")}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="form-item">
                <Title level={4} className="white" type="secondary">
                  Twitter link
                </Title>
                <Input
                  placeholder={t("twitterLinkHere")}
                  value={twitterLink}
                  onChange={(e) => setTwitterLink(e.target.value)}
                />
              </div>
              <div className="form-item">
                <Title level={4} className="white" type="secondary">
                  {t("nationality")}
                </Title>
                <Select
                  style={{ width: "100%" }}
                  size={"large"}
                  placeholder="Select a Country"
                  value={country}
                  onChange={(val) => {
                    setCountry(val);
                  }}
                >
                  {allCountries.map((country, index) => {
                    const flag = country.abbr.toLowerCase();
                    return (
                      <Select.Option key={index} value={country.name}>
                        <img
                          style={{ marginRight: 5 }}
                          width={20}
                          height={14}
                          src={`https://flagcdn.com/w20/${flag}.png`}
                          loading={"lazy"}
                          alt="Nicho AI NFT"
                        />
                        {country.name}
                      </Select.Option>
                    );
                  })}
                </Select>
              </div>
              <div className="form-item">
                <Title level={4} className="white" type="secondary">
                  {t("bio")}
                </Title>
                <Input.TextArea
                  rows={4}
                  placeholder={t("yourBio")}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                />
              </div>
              <div className="form-action">
                <Button
                  type="primary"
                  onClick={update_profile}
                  loading={isUpdating}
                >
                  {isUpdating ? "Updating" : "Update"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
      {showNotification && (
        <Notification
          type="success"
          message={t("profileUpdated")}
          header={t("profileUpdatedHeader")}
          isVisible={true}
          action={() => {
            setShowNotification(false);
            // history.push(`/myNfts`);
          }}
        />
      )}
    </Fragment>
  );
}

export default UpdateUser;
