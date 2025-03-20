import Facebook from "../assets/fb_facebook_facebook_logo_icon.png";
import Instagram from "../assets/camera_instagram_instagram_logo_icon.png";
import Whatsapp from "../assets/bubble_chat_mobile_whatsapp_whatsapp_logo_icon.png";
import Twitter from "../assets/x_twitter_elon_musk_twitter_new_logo_icon.png";
import GoogleBusiness from "../assets/brand_business_google_logo_my_icon.png";
import Linkedin from "../assets/linkedin_network_linkedin_logo_icon.png";
import Mastodon from "../assets/mastodon_icon.png";
import Pinterest from "../assets/inspiration_pin_pinned_pinterest_social_network_icon.png";
// import Threads from "../assets/brand_chat_threads_logo_icon.png";
import Tiktok from "../assets/tiktok_logo_brand_icon.png";
import WordPress from "../assets/wordpress_wp_icon_icon.png";
import Youtube from "../assets/video_youtube_icon.png";

export const getSocialIcon = (network) => {
  const icons = {
    facebook: Facebook,
    google_my_business: GoogleBusiness,
    instagram_business: Instagram,
    linkedin: Linkedin,
    mastodon: Mastodon,
    pinterest: Pinterest,
    // threads: Threads,
    tiktok: Tiktok,
    twitter: Twitter,
    whatsapp: Whatsapp,
    wordpress: WordPress,
    youtube: Youtube,
  };

  return icons[network.toLowerCase()] || "../assets/SocialHub.png";
};
