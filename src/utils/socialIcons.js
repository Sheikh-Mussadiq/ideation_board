export const getSocialIcon = (network) => {
  const icons = {
    facebook: "/fb_facebook_facebook logo_icon.svg",
    google_my_business: "/brand_business_google_logo_my_icon.svg",
    instagram_business: "/camera_instagram_instagram logo_icon.svg",
    linkedin: "/linkedin_network_linkedin logo_icon.svg",
    mastodon: "/mastodon_icon.svg",
    pinterest: "/inspiration_pin_pinned_pinterest_social network_icon.svg",
    threads: "/brand_chat_threads_logo_icon.svg",
    tiktok: "/tiktok_logo_brand_icon.svg",
    twitter: "/x_twitter_elon musk_twitter new logo_icon.svg",
    whatsapp: "/bubble_chat_mobile_whatsapp_whatsapp logo_icon.svg",
    wordpress: "/wordpress_wp icon_icon.svg",
    youtube: "/video_youtube_icon.svg",
  };

  return icons[network.toLowerCase()] || "/default-social.svg";
};
